"use client";

import { useState, useRef, useEffect } from "react";
import { getProductByBarcode, NutritionData } from "../lib/food-api";

interface BarcodeScannerProps {
    onScan: (product: NutritionData) => void;
    onClose: () => void;
}

export default function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
    const [barcode, setBarcode] = useState("");
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [cameraActive, setCameraActive] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const startCamera = async () => {
        try {
            setError(null);
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" },
            });
            setStream(mediaStream);
            setCameraActive(true);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            setError("Camera access denied. Please enter barcode manually.");
            console.error(err);
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(null);
        }
        setCameraActive(false);
    };

    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [stream]);

    const handleManualSearch = async () => {
        if (!barcode.trim()) return;

        setIsScanning(true);
        setError(null);

        try {
            const product = await getProductByBarcode(barcode.trim());
            if (product) {
                onScan(product);
            } else {
                setError("Product not found. Try a different barcode.");
            }
        } catch (err) {
            setError("Failed to fetch product. Please try again.");
            console.error(err);
        } finally {
            setIsScanning(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content flex flex-col max-h-[90vh] bg-white text-gray-800" onClick={(e) => e.stopPropagation()}>
                <div className="modal-handle mb-6 bg-gray-200" />

                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-title font-bold text-gray-800">Scan Barcode</h2>
                        <p className="text-sm text-gray-500">Point camera at package code</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Camera View - Flexible Height */}
                <div className="flex-1 relative min-h-[300px] mb-6">
                    {cameraActive ? (
                        <div className="relative w-full h-full bg-black rounded-3xl overflow-hidden shadow-2xl scanner-active">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="w-full h-full object-cover opacity-80"
                            />

                            {/* Scanner Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-64 h-40 relative">
                                    <div className="scanner-corner tl" />
                                    <div className="scanner-corner tr" />
                                    <div className="scanner-corner bl" />
                                    <div className="scanner-corner br" />
                                    <div className="scanner-line" />
                                </div>
                            </div>

                            <button
                                onClick={stopCamera}
                                className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-red-500/20 backdrop-blur-md border border-red-500/50 flex items-center justify-center text-red-500 hover:bg-red-500/30"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={startCamera}
                            className="w-full h-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center gap-4 relative overflow-hidden group hover:bg-gray-100 transition-colors"
                        >
                            <div className="w-20 h-20 rounded-2xl bg-emerald-100 flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div className="text-center relative z-10">
                                <p className="font-semibold text-gray-800 text-lg">Tap to Scan</p>
                                <p className="text-sm text-gray-400">Camera access needed</p>
                            </div>
                        </button>
                    )}
                </div>

                {/* Manual Entry Section - Bottom heavy */}
                <div className="mt-auto">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Manual Entry</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    <div className="relative">
                        <input
                            type="number"
                            value={barcode}
                            onChange={(e) => setBarcode(e.target.value)}
                            placeholder="Type barcode number..."
                            className="w-full h-14 pl-5 pr-24 bg-gray-50 border border-gray-200 rounded-2xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-lg text-gray-800 placeholder-gray-400 transition-all shadow-sm"
                            onKeyDown={(e) => e.key === "Enter" && handleManualSearch()}
                        />
                        <button
                            onClick={handleManualSearch}
                            disabled={!barcode.trim() || isScanning}
                            className="absolute right-2 top-2 bottom-2 aspect-square bg-emerald-500 hover:bg-emerald-600 rounded-xl flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                        >
                            {isScanning ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            )}
                        </button>
                    </div>

                    {error && (
                        <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                            <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-sm text-red-400 font-medium">{error}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
