"use client";

import { useState, useEffect } from "react";
import { RESTAURANTS, Restaurant, MenuItem } from "../lib/restaurants";

interface NearbyRestaurantsProps {
    onSelectRestaurant: (restaurant: Restaurant) => void;
}

// Major cities with their region codes
const CITIES = [
    // US Cities
    { name: "New York, NY", region: "us_northeast" },
    { name: "Los Angeles, CA", region: "us_west" },
    { name: "Chicago, IL", region: "us_midwest" },
    { name: "Houston, TX", region: "us_south" },
    { name: "Miami, FL", region: "us_south" },
    { name: "San Francisco, CA", region: "us_west" },
    { name: "Seattle, WA", region: "us_west" },
    { name: "Boston, MA", region: "us_northeast" },
    { name: "Atlanta, GA", region: "us_south" },
    { name: "Dallas, TX", region: "us_south" },
    { name: "Las Vegas, NV", region: "us_west" },

    // International Cities
    { name: "London, UK", region: "uk" },
    { name: "Toronto, Canada", region: "canada" },
    { name: "Sydney, Australia", region: "australia" },
    { name: "Dubai, UAE", region: "global" },
    { name: "Paris, France", region: "europe" },
    { name: "Berlin, Germany", region: "europe" },
    { name: "Tokyo, Japan", region: "asia" },
    { name: "Singapore", region: "asia" },
    { name: "Other", region: "all" },
];

/**
 * Regional Availability Rules:
 * - If a key is missing, it's assumed available everywhere (global/all).
 * - If a key exists, the restaurant is ONLY available in those regions.
 * - "us_all" matches all US regions.
 * - "global" matches international + US.
 */
const REGIONAL_AVAILABILITY: Record<string, string[]> = {
    // US-Specific Chains
    "In-N-Out": ["us_west"],
    "Chick-fil-A": ["us_all", "canada"],
    "Dunkin'": ["us_northeast", "us_midwest", "us_south", "global"], // Less common in West
    "Waffle House": ["us_south", "us_midwest"],
    "Whataburger": ["us_south"],
    "Culver's": ["us_midwest"],
    "Tim Hortons": ["canada", "us_northeast", "us_midwest"],
    "Pret A Manger": ["uk", "us_northeast", "global"],
    "Nando's": ["uk", "australia", "asia", "us_northeast", "global"], // Specific US locations
    "Greggs": ["uk"],

    // Explicitly Global (available in most listed regions)
    "McDonald's": ["all"],
    "Burger King": ["all"],
    "KFC": ["all"],
    "Subway": ["all"],
    "Starbucks": ["all"],
    "Domino's": ["all"],
    "Pizza Hut": ["all"],
    "Popeyes": ["us_all", "canada", "uk", "asia"],
    "Chipotle": ["us_all", "canada", "uk", "europe"],
    "Five Guys": ["us_all", "uk", "canada", "europe", "gulf"],
    "Shake Shack": ["us_all", "uk", "asia", "gulf"],
    "Taco Bell": ["us_all", "uk", "australia", "asia"],
    "Wendy's": ["us_all", "canada", "uk", "global"],
};

export default function NearbyRestaurants({ onSelectRestaurant }: NearbyRestaurantsProps) {
    const [selectedCity, setSelectedCity] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [showLocationPrompt, setShowLocationPrompt] = useState(true);
    const [availableRestaurants, setAvailableRestaurants] = useState<Restaurant[]>(RESTAURANTS);

    // Get region from zip code (simplified US regions)
    const getRegionFromZip = (zip: string): string => {
        if (!zip.match(/^\d{5}$/)) return "all";
        const firstDigit = parseInt(zip.charAt(0));
        if ([0, 1, 2].includes(firstDigit)) return "us_northeast";
        if ([3, 4].includes(firstDigit)) return "us_south";
        if ([5, 6].includes(firstDigit)) return "us_midwest";
        if ([7, 8, 9].includes(firstDigit)) return "us_west";
        return "all";
    };

    const checkAvailability = (restaurantName: string, region: string): boolean => {
        if (region === "all") return true;

        // Check if we have specific data for this restaurant
        const regions = REGIONAL_AVAILABILITY[restaurantName];

        // If no data, assume it's widespread/global
        if (!regions) return true;

        if (regions.includes("all")) return true;
        if (regions.includes(region)) return true;

        // Handle "us_all" wildcard for US regions
        if (region.startsWith("us_") && regions.includes("us_all")) return true;

        return false;
    };

    const updateList = (region: string) => {
        const filtered = RESTAURANTS.filter(r => checkAvailability(r.name, region));

        // Sort logic: Global chains are always good, but maybe prioritize matching region
        // specific ones? For now, just filtering is enough to fix the "In-N-Out in NY" issue.
        // We can keep the original order or sort alphabetically.
        setAvailableRestaurants(filtered);
    };

    const handleCitySelect = (city: string) => {
        setSelectedCity(city);
        // Reset zip if city selected
        setZipCode("");

        const cityData = CITIES.find(c => c.name === city);
        if (cityData) {
            updateList(cityData.region);
        }
        setShowLocationPrompt(false);
    };

    const handleZipSubmit = () => {
        if (zipCode.length >= 3) {
            setSelectedCity(""); // Reset city if zip used
            const region = getRegionFromZip(zipCode);
            updateList(region);
            setShowLocationPrompt(false);
        }
    };

    const openInMaps = (restaurantName: string) => {
        // If a city is selected, append it to the query for better accuracy
        const locationSuffix = selectedCity ? ` in ${selectedCity.split(",")[0]}` : " near me";
        const query = encodeURIComponent(`${restaurantName}${locationSuffix}`);

        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const url = isIOS
            ? `maps://maps.apple.com/?q=${query}`
            : `https://www.google.com/maps/search/${query}`;
        window.open(url, "_blank");
    };

    if (showLocationPrompt) {
        return (
            <div className="space-y-4">
                <div className="glass-card p-5 text-center">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                        <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="font-semibold mb-1">Find Anywhere</h3>
                    <p className="text-sm text-gray-400 mb-4">Supports 20+ Global Cities</p>
                </div>

                <div className="glass-card p-4">
                    <label className="text-sm font-medium text-gray-400 mb-2 block">Select City</label>
                    <select
                        value={selectedCity}
                        onChange={(e) => handleCitySelect(e.target.value)}
                        className="w-full"
                    >
                        <option value="">Choose a city...</option>
                        {CITIES.map(city => (
                            <option key={city.name} value={city.name}>{city.name}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-gray-700" />
                    <span className="text-sm text-gray-500">or</span>
                    <div className="flex-1 h-px bg-gray-700" />
                </div>

                <div className="glass-card p-4">
                    <label className="text-sm font-medium text-gray-400 mb-2 block">US Zip Code</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value.replace(/\D/g, "").slice(0, 5))}
                            placeholder="e.g., 90210"
                            className="flex-1"
                            maxLength={5}
                        />
                        <button
                            onClick={handleZipSubmit}
                            disabled={zipCode.length < 5} // Stricter zip check
                            className="btn btn-primary !w-auto !px-6"
                        >
                            Go
                        </button>
                    </div>
                </div>

                <button
                    onClick={() => setShowLocationPrompt(false)}
                    className="w-full text-center text-sm text-gray-500 hover:text-gray-300 py-2"
                >
                    Skip for now →
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400 truncate max-w-[200px]">
                    {selectedCity || (zipCode ? `Zip: ${zipCode}` : "All locations")}
                </div>
                <button
                    onClick={() => setShowLocationPrompt(true)}
                    className="text-xs text-emerald-400 hover:text-emerald-300 shrink-0"
                >
                    Change
                </button>
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {availableRestaurants.length > 0 ? (
                    availableRestaurants.map((restaurant, i) => (
                        <div key={i} className="glass-card p-4" style={{ borderLeftColor: restaurant.color, borderLeftWidth: 3 }}>
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-2xl">{restaurant.logo}</span>
                                <div className="flex-1">
                                    <p className="font-semibold">{restaurant.name}</p>
                                    <p className="text-xs text-gray-500">{restaurant.items.length} items</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => onSelectRestaurant(restaurant)}
                                    className="flex-1 btn btn-secondary !py-2 !min-h-0 text-sm"
                                >
                                    View Menu
                                </button>
                                <button
                                    onClick={() => openInMaps(restaurant.name)}
                                    className="btn btn-primary !py-2 !min-h-0 text-sm !w-auto !px-4"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Find
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-gray-500">
                        <p>No supported chains found in this region.</p>
                        <button onClick={() => updateList("all")} className="text-emerald-400 text-sm mt-2">Show all anyway</button>
                    </div>
                )}
            </div>
        </div>
    );
}
