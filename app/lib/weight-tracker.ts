"use client";

// Weight Tracker Library - Manages initial weight vs current weight history

interface WeightEntry {
    date: string;
    weight: number;
    unit: 'lbs' | 'kg';
}

interface WeightData {
    initialWeight: number | null;
    initialDate: string | null;
    initialUnit: 'lbs' | 'kg';
    entries: WeightEntry[];
}

const STORAGE_KEY = 'macromap_weight_data';

function getWeightData(): WeightData {
    if (typeof window === 'undefined') {
        return { initialWeight: null, initialDate: null, initialUnit: 'lbs', entries: [] };
    }
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        return JSON.parse(data);
    }
    return { initialWeight: null, initialDate: null, initialUnit: 'lbs', entries: [] };
}

function saveWeightData(data: WeightData): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function logWeight(weight: number, unit: 'lbs' | 'kg'): void {
    const data = getWeightData();
    const today = new Date().toISOString().split('T')[0];

    // If no initial weight set, this becomes the initial weight
    if (data.initialWeight === null) {
        data.initialWeight = weight;
        data.initialDate = today;
        data.initialUnit = unit;
    }

    // Add to entries (or update today's entry)
    const existingIndex = data.entries.findIndex(e => e.date === today);
    if (existingIndex >= 0) {
        data.entries[existingIndex] = { date: today, weight, unit };
    } else {
        data.entries.push({ date: today, weight, unit });
    }

    // Sort entries by date
    data.entries.sort((a, b) => a.date.localeCompare(b.date));

    saveWeightData(data);
}

export function getInitialWeight(): { weight: number | null; date: string | null; unit: 'lbs' | 'kg' } {
    const data = getWeightData();
    return {
        weight: data.initialWeight,
        date: data.initialDate,
        unit: data.initialUnit
    };
}

export function getCurrentWeight(): { weight: number | null; date: string | null; unit: 'lbs' | 'kg' } {
    const data = getWeightData();
    if (data.entries.length === 0) {
        return { weight: data.initialWeight, date: data.initialDate, unit: data.initialUnit };
    }
    const latest = data.entries[data.entries.length - 1];
    return { weight: latest.weight, date: latest.date, unit: latest.unit };
}

export function getWeightProgress(): {
    initial: number | null;
    current: number | null;
    change: number;
    unit: 'lbs' | 'kg';
    isLoss: boolean;
} {
    const data = getWeightData();
    const initial = data.initialWeight;
    const current = data.entries.length > 0
        ? data.entries[data.entries.length - 1].weight
        : data.initialWeight;

    const change = initial && current ? Math.round((initial - current) * 10) / 10 : 0;

    return {
        initial,
        current,
        change: Math.abs(change),
        unit: data.initialUnit,
        isLoss: change > 0
    };
}

export function getWeightHistory(): WeightEntry[] {
    const data = getWeightData();
    return data.entries;
}
