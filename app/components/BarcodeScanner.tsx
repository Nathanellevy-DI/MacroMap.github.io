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
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-handle" />

                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-title">Scan Barcode</h2>
                    <button onClick={onClose} className="icon-btn">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Camera View */}
                {cameraActive ? (
                    <div className="relative aspect-[4/3] bg-black rounded-2xl overflow-hidden mb-4">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-64 h-32 border-2 border-white/50 rounded-lg" />
                        </div>
                        <button
                            onClick={stopCamera}
                            className="absolute bottom-4 right-4 icon-btn bg-red-500/80 border-0"
                        >
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={startCamera}
                        className="w-full aspect-[4/3] bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex flex-col items-center justify-center gap-4 mb-4 border-2 border-dashed border-gray-700"
                    >
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center">
                            <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <div className="text-center">
                            <p className="font-semibold text-white">Tap to Open Camera</p>
                            <p className="text-sm text-gray-500">Point at barcode to scan</p>
                        </div>
                    </button>
                )}

                {/* Divider */}
                <div className="flex items-center gap-4 my-6">
                    <div className="flex-1 h-px bg-gray-700" />
                    <span className="text-sm text-gray-500">or enter manually</span>
                    <div className="flex-1 h-px bg-gray-700" />
                </div>

                {/* Manual Entry */}
                <div className="flex gap-3 mb-4">
                    <input
                        type="text"
                        value={barcode}
                        onChange={(e) => setBarcode(e.target.value)}
                        placeholder="Enter barcode number..."
                        className="flex-1"
                        onKeyDown={(e) => e.key === "Enter" && handleManualSearch()}
                    />
                    <button
                        onClick={handleManualSearch}
                        disabled={!barcode.trim() || isScanning}
                        className="btn btn-primary !w-auto !px-6"
                    >
                        {isScanning ? (
                            <div className="spinner !w-5 !h-5 !border-2" />
                        ) : (
                            "Search"
                        )}
                    </button>
                </div>

                {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {/* Tips */}
                <div className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <h4 className="font-semibold text-emerald-400 mb-2">💡 Tip</h4>
                    <p className="text-sm text-gray-400">
                        Look for the barcode on food packaging. It&apos;s usually near the nutrition facts or on the bottom.
                    </p>
                </div>
            </div>
        </div>
    );
}
