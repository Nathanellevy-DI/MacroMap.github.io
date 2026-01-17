"use client";

import { useRef, useState, useCallback } from "react";

interface ScannerProps {
    onCapture: (imageData: string) => void;
    isLoading: boolean;
}

export default function Scanner({ onCapture, isLoading }: ScannerProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result as string;
            setPreview(base64);
            onCapture(base64);
        };
        reader.readAsDataURL(file);
    }, [onCapture]);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleReset = () => {
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="flex flex-col items-center gap-8">
            <div className="camera-container gradient-border">
                {preview ? (
                    <img
                        src={preview}
                        alt="Captured label"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-8 text-center">
                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-indigo-500/20 flex items-center justify-center float">
                            <svg
                                className="w-12 h-12 text-emerald-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                        </div>
                        <div>
                            <p className="text-gray-300 font-medium mb-1">
                                Tap to scan a label
                            </p>
                            <p className="text-gray-500 text-sm">
                                Point at the ingredient list
                            </p>
                        </div>
                    </div>
                )}

                {isLoading && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                        <div className="spinner"></div>
                        <div className="text-center">
                            <p className="text-emerald-400 font-semibold">Analyzing...</p>
                            <p className="text-gray-500 text-sm">Checking for banned ingredients</p>
                        </div>
                        <div className="scan-line"></div>
                    </div>
                )}

                <div className="camera-overlay"></div>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
            />

            {!preview ? (
                <button
                    onClick={handleClick}
                    disabled={isLoading}
                    className="btn-primary pulse-glow"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                    Scan Ingredients
                </button>
            ) : (
                <button
                    onClick={handleReset}
                    disabled={isLoading}
                    className="btn-secondary"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                    </svg>
                    Scan Another
                </button>
            )}
        </div>
    );
}
