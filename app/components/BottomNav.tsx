"use client";

type NavTab = "dashboard" | "tools" | "add" | "community" | "me";

interface BottomNavProps {
    activeTab: NavTab;
    onTabChange: (tab: NavTab) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-safe-bottom z-50">
            <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
                {/* Dashboard */}
                <button
                    onClick={() => onTabChange("dashboard")}
                    className={`flex flex-col items-center gap-1 min-w-[64px] ${activeTab === "dashboard" ? "text-emerald-500" : "text-gray-400 hover:text-gray-600"
                        }`}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span className="text-[10px] font-medium">Dashboard</span>
                </button>

                {/* Add Button (Center) */}
                <button
                    onClick={() => onTabChange("add")}
                    className="flex flex-col items-center -mt-6"
                >
                    <div className="w-14 h-14 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30 flex items-center justify-center text-white transform active:scale-95 transition-transform">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                </button>

                {/* Me */}
                <button
                    onClick={() => onTabChange("me")}
                    className={`flex flex-col items-center gap-1 min-w-[64px] ${activeTab === "me" ? "text-emerald-500" : "text-gray-400 hover:text-gray-600"
                        }`}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-[10px] font-medium">Me</span>
                </button>
            </div>
        </nav>
    );
}
