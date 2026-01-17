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

                {/* Diet Tools (Apple) */}
                <button
                    onClick={() => onTabChange("tools")}
                    className={`flex flex-col items-center gap-1 min-w-[64px] ${activeTab === "tools" ? "text-emerald-500" : "text-gray-400 hover:text-gray-600"
                        }`}
                >
                    {/* Apple Icon */}
                    <div className="relative">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                    </div>
                    <span className="text-[10px] font-medium">Diet Tools</span>
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
