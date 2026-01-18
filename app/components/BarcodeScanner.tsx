"use client";

import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

interface BarcodeScannerProps {
    onScan: (decodedText: string) => void;
    onError?: (error: any) => void;
}

export default function BarcodeScanner({ onScan, onError }: BarcodeScannerProps) {
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);
    const [scanResult, setScanResult] = useState<string | null>(null);

    useEffect(() => {
        // Initialize scanner
        // We use a timeout to ensure element exists
        const timer = setTimeout(() => {
            if (!scannerRef.current) {
                const scanner = new Html5QrcodeScanner(
                    "reader",
                    { fps: 10, qrbox: { width: 250, height: 250 } },
                    /* verbose= */ false
                );

                scanner.render(
                    (decodedText) => {
                        setScanResult(decodedText);
                        onScan(decodedText);
                        // Optional: Clear scanner after success
                        // scanner.clear();
                    },
                    (errorMessage) => {
                        if (onError) onError(errorMessage);
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
    }, [onScan, onError]);

    return (
        <div className="w-full flex flex-col items-center">
            <div id="reader" className="w-full max-w-sm overflow-hidden rounded-xl border-2 border-slate-200 dark:border-slate-700"></div>
            {scanResult && (
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg">
                    Scanned: <span className="font-mono font-bold">{scanResult}</span>
                </div>
            )}
        </div>
    );
}
