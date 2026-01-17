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
        <div className="flex flex-col items-center gap-6">
            <div className="camera-container">
                {preview ? (
                    <img
                        src={preview}
                        alt="Captured label"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-6 text-center">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center">
                            <svg
                                className="w-10 h-10 text-emerald-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                        </div>
                        <p className="text-gray-400 text-sm">
                            Tap to scan an ingredient label
                        </p>
                    </div>
                )}

                {isLoading && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-4">
                        <div className="spinner"></div>
                        <p className="text-emerald-400 font-medium">Analyzing ingredients...</p>
                        <div className="absolute left-0 right-0 h-1 bg-emerald-500/50 scan-line"></div>
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
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                    Scan Label
                </button>
            ) : (
                <button
                    onClick={handleReset}
                    disabled={isLoading}
                    className="btn-primary"
                    style={{ background: "linear-gradient(135deg, #374151, #1f2937)" }}
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
