interface MeSectionProps {
    budget: number;
    setBudget: (budget: number) => void;
    trackingMode: "budget" | "tracking";
    setTrackingMode: (mode: "budget" | "tracking") => void;
}

export default function MeSection({ budget, setBudget, trackingMode, setTrackingMode }: MeSectionProps) {
    const handleGoalClick = () => {
        const newGoal = prompt("Enter your daily calorie goal:", budget.toString());
        if (newGoal && !isNaN(Number(newGoal))) {
            setBudget(Number(newGoal));
        }
    };

    return (
        <div className="pb-24 animate-in fade-in duration-500">
            {/* Header */}
            <div className="bg-white pt-safe-top pb-6 px-4 shadow-sm mb-6 sticky top-0 z-10">
                <h1 className="text-xl font-bold text-gray-800">My Profile</h1>
            </div>

            <div className="px-4 space-y-6">
                {/* Stats Card */}
                <div className="bg-emerald-500 rounded-3xl p-6 text-white shadow-lg shadow-emerald-500/20">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold border-2 border-white/30">
                            ME
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">New User</h2>
                            <p className="text-emerald-100 text-sm">Level 1 • Beginner</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="bg-white/10 rounded-2xl p-3">
                            <p className="text-2xl font-bold">0</p>
                            <p className="text-xs text-emerald-100">Streak</p>
                        </div>
                        <div className="bg-white/10 rounded-2xl p-3">
                            <p className="text-2xl font-bold">0</p>
                            <p className="text-xs text-emerald-100">Meals</p>
                        </div>
                        <div className="bg-white/10 rounded-2xl p-3">
                            <p className="text-2xl font-bold">0</p>
                            <p className="text-xs text-emerald-100">lbs lost</p>
                        </div>
                    </div>
                </div>

                {/* Settings List */}
                <div className="space-y-3">
                    <h3 className="font-semibold text-gray-700 ml-1">Settings</h3>

                    {/* Goal Setting */}
                    <button onClick={handleGoalClick} className="w-full bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm hover:bg-gray-50 transition-colors">
                        <span className="text-xl">🎯</span>
                        <span className="flex-1 text-left font-medium text-gray-800">My Daily Goal</span>
                        <span className="text-emerald-500 font-bold">{budget} kcal</span>
                        <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>

                    {/* Mode Toggle */}
                    <button
                        onClick={() => setTrackingMode(trackingMode === "budget" ? "tracking" : "budget")}
                        className="w-full bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm hover:bg-gray-50 transition-colors"
                    >
                        <span className="text-xl">📊</span>
                        <div className="flex-1 text-left">
                            <span className="block font-medium text-gray-800">Tracking Mode</span>
                            <span className="text-xs text-gray-400">{trackingMode === "budget" ? "Strict Budget Limit" : "Count Only (No Limit)"}</span>
                        </div>
                        <div className={`w-12 h-6 rounded-full p-1 transition-colors ${trackingMode === "tracking" ? "bg-emerald-500" : "bg-gray-200"}`}>
                            <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${trackingMode === "tracking" ? "translate-x-6" : ""}`} />
                        </div>
                    </button>

                    {[
                        { icon: "🍎", label: "Diet Preferences", val: "None" },
                        { icon: "🔔", label: "Notifications", val: "On" },
                        { icon: "🔒", label: "Privacy", val: "" },
                        { icon: "❓", label: "Help & Support", val: "" },
                    ].map((item, i) => (
                        <button key={i} className="w-full bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm hover:bg-gray-50 transition-colors">
                            <span className="text-xl">{item.icon}</span>
                            <span className="flex-1 text-left font-medium text-gray-800">{item.label}</span>
                            <span className="text-sm text-gray-400">{item.val}</span>
                            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    ))}
                </div>

                <button className="w-full py-4 text-red-500 font-medium text-sm hover:bg-red-50 rounded-2xl transition-colors">
                    Log Out
                </button>
            </div>
        </div>
    );
}
