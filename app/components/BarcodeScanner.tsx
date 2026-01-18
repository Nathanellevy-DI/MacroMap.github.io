"use client";

import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode";

interface BarcodeScannerProps {
    onScan: (decodedText: string, productInfo?: ProductInfo) => void;
    onError?: (error: any) => void;
}

interface ProductInfo {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    servingSize: string;
}

export default function BarcodeScanner({ onScan, onError }: BarcodeScannerProps) {
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
    const [loading, setLoading] = useState(false);
    const [manualCode, setManualCode] = useState("");
    const [error, setError] = useState<string | null>(null);

    // Lookup product info from Open Food Facts API
    const lookupProduct = async (barcode: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
            const data = await response.json();

            if (data.status === 1 && data.product) {
                const product = data.product;
                const nutriments = product.nutriments || {};

                const info: ProductInfo = {
                    name: product.product_name || product.generic_name || "Unknown Product",
                    calories: Math.round(nutriments["energy-kcal_100g"] || nutriments["energy-kcal"] || 0),
                    protein: Math.round(nutriments.proteins_100g || nutriments.proteins || 0),
                    carbs: Math.round(nutriments.carbohydrates_100g || nutriments.carbohydrates || 0),
                    fat: Math.round(nutriments.fat_100g || nutriments.fat || 0),
                    servingSize: product.serving_size || product.quantity || "100g"
                };

                setProductInfo(info);
                onScan(barcode, info);
                return info;
            } else {
                setError("Product not found in database");
                onScan(barcode);
                return null;
            }
        } catch (err) {
            setError("Failed to lookup product");
            onScan(barcode);
            return null;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!scannerRef.current) {
                const scanner = new Html5QrcodeScanner(
                    "reader",
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 150 },
                        formatsToSupport: [
                            0, // QR_CODE
                            1, // AZTEC
                            2, // CODABAR
                            3, // CODE_39
                            4, // CODE_93
                            5, // CODE_128
                            6, // DATA_MATRIX
                            7, // MAXICODE
                            8, // ITF
                            9, // EAN_13
                            10, // EAN_8
                            11, // PDF_417
                            12, // RSS_14
                            13, // RSS_EXPANDED
                            14, // UPC_A
                            15, // UPC_E
                            16, // UPC_EAN_EXTENSION
                        ],
                        experimentalFeatures: {
                            useBarCodeDetectorIfSupported: true
                        }
                    },
                    false
                );

                scanner.render(
                    async (decodedText) => {
                        setScanResult(decodedText);
                        await lookupProduct(decodedText);
                    },
                    (errorMessage) => {
                        // Silently ignore scan errors (normal during scanning)
                    }
                );
                scannerRef.current = scanner;
            }
        }, 100);

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(console.error);
                scannerRef.current = null;
            }
        };
    }, []);

    const handleManualSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (manualCode.trim()) {
            setScanResult(manualCode.trim());
            await lookupProduct(manualCode.trim());
        }
    };

    return (
        <div className="w-full flex flex-col items-center space-y-4">
            <div id="reader" className="w-full max-w-sm overflow-hidden rounded-xl border-2 border-slate-200 dark:border-slate-700"></div>

            {/* Manual Entry Option */}
            <div className="w-full max-w-sm">
                <form onSubmit={handleManualSubmit} className="flex gap-2">
                    <input
                        type="text"
                        value={manualCode}
                        onChange={(e) => setManualCode(e.target.value)}
                        placeholder="Enter barcode manually"
                        className="flex-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm"
                    />
                    <button
                        type="submit"
                        disabled={!manualCode.trim() || loading}
                        className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-semibold text-sm disabled:opacity-50"
                    >
                        {loading ? "..." : "Lookup"}
                    </button>
                </form>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex items-center gap-2 text-slate-500">
                    <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Looking up product...</span>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-lg text-sm">
                    ⚠️ {error}
                </div>
            )}

            {/* Scan Result */}
            {scanResult && (
                <div className="w-full max-w-sm p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg">
                    <div className="font-mono text-sm mb-2">Barcode: {scanResult}</div>

                    {productInfo && (
                        <div className="mt-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-green-200 dark:border-green-800">
                            <h4 className="font-bold text-gray-800 dark:text-white mb-2">{productInfo.name}</h4>
                            <div className="grid grid-cols-4 gap-2 text-center text-xs">
                                <div>
                                    <div className="text-lg font-bold text-orange-500">{productInfo.calories}</div>
                                    <div className="text-gray-500">kcal</div>
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-emerald-500">{productInfo.protein}g</div>
                                    <div className="text-gray-500">Protein</div>
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-blue-500">{productInfo.carbs}g</div>
                                    <div className="text-gray-500">Carbs</div>
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-yellow-500">{productInfo.fat}g</div>
                                    <div className="text-gray-500">Fat</div>
                                </div>
                            </div>
                            <div className="text-xs text-gray-400 mt-2 text-center">Per {productInfo.servingSize}</div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
