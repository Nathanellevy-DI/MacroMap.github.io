export interface WeightLog {
    date: string;
    weight: number;
    unit: 'lbs' | 'kg';
}

const STORAGE_KEY_LOGS = 'weight_logs';
const STORAGE_KEY_START = 'weight_start';

// Helper to get today's date string YYYY-MM-DD
const getToday = () => new Date().toISOString().split('T')[0];

export const setStartingWeight = (weight: number, unit: 'lbs' | 'kg' = 'lbs') => {
    // Only set if not already set (immutable start weight rule)
    if (!getInitialWeight()) {
        const entry = { weight, unit, date: getToday() };
        localStorage.setItem(STORAGE_KEY_START, JSON.stringify(entry));
        // Also add to logs as first entry
        addWeightLog(weight, unit);
    }
};

export const getInitialWeight = (): { weight: number, unit: 'lbs' | 'kg' } | null => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(STORAGE_KEY_START);
    return stored ? JSON.parse(stored) : null;
};

export const addWeightLog = (weight: number, unit: 'lbs' | 'kg') => {
    const logs = getWeightLogs();
    const today = getToday();

    // Check if entry for today exists and update it, otherwise push new
    const existingIndex = logs.findIndex(l => l.date === today);
    if (existingIndex >= 0) {
        logs[existingIndex] = { date: today, weight, unit };
    } else {
        logs.push({ date: today, weight, unit });
    }

    // Sort logs by date just in case
    logs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
};

export const getWeightLogs = (): WeightLog[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEY_LOGS);
    return stored ? JSON.parse(stored) : [];
};

export const getCurrentWeight = (): { weight: number, unit: 'lbs' | 'kg' } | null => {
    const logs = getWeightLogs();
    if (logs.length === 0) {
        const start = getInitialWeight();
        return start ? start : null;
    }
    return logs[logs.length - 1]; // Return last log
};

export const getWeightProgress = () => {
    const start = getInitialWeight();
    const current = getCurrentWeight();

    if (!start || !current) return null;

    // Normalize units if needed (simple assumption: users sticks to one, but for robustness could convert)
    // For now assuming unit matches or just displaying raw numbers
    return {
        initial: start.weight,
        current: current.weight,
        change: parseFloat((current.weight - start.weight).toFixed(1)),
        unit: current.unit,
        isLoss: current.weight < start.weight
    };
};

// Legacy support wrapper if needed, or aliases
export const logWeight = addWeightLog; 
