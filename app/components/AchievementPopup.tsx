"use client";

import { useEffect, useState } from "react";
import { Achievement } from "../lib/achievements";

interface AchievementPopupProps {
    achievement: Achievement | null;
    onClose: () => void;
}

export default function AchievementPopup({ achievement, onClose }: AchievementPopupProps) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (achievement) {
            setShow(true);
            const timer = setTimeout(() => {
                setShow(false);
                setTimeout(onClose, 300);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [achievement, onClose]);

    if (!achievement) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'}`}>
            {/* Confetti background */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute animate-confetti"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `-20px`,
                            animationDelay: `${Math.random() * 0.5}s`,
                            animationDuration: `${2 + Math.random()}s`
                        }}
                    >
                        {['🎉', '⭐', '🌟', '✨', '💫'][Math.floor(Math.random() * 5)]}
                    </div>
                ))}
            </div>

            {/* Achievement card */}
            <div className={`bg-white rounded-3xl p-8 shadow-2xl max-w-sm mx-4 pointer-events-auto transform transition-all duration-300 ${show ? 'scale-100' : 'scale-75'}`}>
                <div className="text-center">
                    <div className="text-6xl mb-4 animate-bounce">{achievement.icon}</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Achievement Unlocked!</h3>
                    <p className="text-xl font-semibold text-gray-700 mb-1">{achievement.name}</p>
                    <p className="text-sm text-gray-500 mb-4">{achievement.description}</p>
                    <div className="inline-block bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-2 rounded-full font-bold">
                        +{achievement.xpReward} XP
                    </div>
                </div>
            </div>
        </div>
    );
}
