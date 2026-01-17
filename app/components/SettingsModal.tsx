"use client";

import { useState, useEffect } from "react";
import { getApiKey, setApiKey, removeApiKey } from "../lib/api";

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const [key, setKey] = useState("");
    const [hasKey, setHasKey] = useState(false);
    const [showKey, setShowKey] = useState(false);

    useEffect(() => {
        const storedKey = getApiKey();
        if (storedKey) {
            setKey(storedKey);
            setHasKey(true);
        }
    }, [isOpen]);

    const handleSave = () => {
        if (key.trim()) {
            setApiKey(key.trim());
            setHasKey(true);
            onClose();
        }
    };

    const handleRemove = () => {
        removeApiKey();
        setKey("");
        setHasKey(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="glass-card w-full max-w-md p-6 space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Settings</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-400">
                        OpenAI API Key
                    </label>
                    <div className="relative">
                        <input
                            type={showKey ? "text" : "password"}
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            placeholder="sk-..."
                            className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-emerald-500 focus:outline-none text-white placeholder-gray-500"
                        />
                        <button
                            type="button"
                            onClick={() => setShowKey(!showKey)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                        >
                            {showKey ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                    <p className="text-xs text-gray-500">
                        Your API key is stored locally and never sent to our servers.
                    </p>
                </div>

                {hasKey && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                        <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-emerald-400">API key configured</span>
                    </div>
                )}

                <div className="flex gap-3 pt-2">
                    {hasKey && (
                        <button
                            onClick={handleRemove}
                            className="flex-1 py-3 rounded-xl bg-red-500/20 text-red-400 font-medium hover:bg-red-500/30 transition-colors"
                        >
                            Remove Key
                        </button>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={!key.trim()}
                        className="flex-1 btn-primary justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Save
                    </button>
                </div>

                <div className="pt-4 border-t border-gray-800">
                    <p className="text-xs text-gray-500 text-center">
                        Get your API key at{" "}
                        <a
                            href="https://platform.openai.com/api-keys"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-400 hover:underline"
                        >
                            platform.openai.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
