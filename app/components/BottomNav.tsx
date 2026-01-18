"use client";

type NavTab = "dashboard" | "progress" | "add" | "achievements" | "me";

interface BottomNavProps {
    activeTab: NavTab;
    onTabChange: (tab: NavTab) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 pb-safe-bottom z-50">
            <div className="flex items-center justify-around h-16 max-w-2xl mx-auto px-1">
                {/* Dashboard */}
                <button
                    onClick={() => onTabChange("dashboard")}
                    className={`flex flex-col items-center gap-0.5 min-w-[56px] py-1 ${activeTab === "dashboard" ? "text-emerald-500" : "text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300"
                        }`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="text-[10px] font-medium">Home</span>
                </button>

                {/* Progress */}
                <button
                    onClick={() => onTabChange("progress")}
                    className={`flex flex-col items-center gap-0.5 min-w-[56px] py-1 ${activeTab === "progress" ? "text-emerald-500" : "text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300"
                        }`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span className="text-[10px] font-medium">Progress</span>
                </button>

                {/* Add Button (Center) */}
                <button
                    onClick={() => onTabChange("add")}
                    className="flex flex-col items-center -mt-5"
                >
                    <div className="w-12 h-12 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30 flex items-center justify-center text-white transform active:scale-95 transition-transform">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                </button>

                {/* Achievements */}
                <button
                    onClick={() => onTabChange("achievements")}
                    className={`flex flex-col items-center gap-0.5 min-w-[56px] py-1 ${activeTab === "achievements" ? "text-emerald-500" : "text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300"
                        }`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    <span className="text-[10px] font-medium">Rewards</span>
                </button>

                {/* Me */}
                <button
                    onClick={() => onTabChange("me")}
                    className={`flex flex-col items-center gap-0.5 min-w-[56px] py-1 ${activeTab === "me" ? "text-emerald-500" : "text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300"
                        }`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-[10px] font-medium">Me</span>
                </button>
            </div>
        </nav>
    );
}
