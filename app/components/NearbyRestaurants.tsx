"use client";

import { useState, useEffect } from "react";
import { RESTAURANTS, Restaurant, MenuItem } from "../lib/restaurants";

interface NearbyRestaurantsProps {
    onSelectRestaurant: (restaurant: Restaurant) => void;
}

// Common US cities with their typical fast food prevalence
const CITIES = [
    { name: "New York, NY", region: "northeast" },
    { name: "Los Angeles, CA", region: "west" },
    { name: "Chicago, IL", region: "midwest" },
    { name: "Houston, TX", region: "south" },
    { name: "Phoenix, AZ", region: "west" },
    { name: "Philadelphia, PA", region: "northeast" },
    { name: "San Antonio, TX", region: "south" },
    { name: "San Diego, CA", region: "west" },
    { name: "Dallas, TX", region: "south" },
    { name: "Austin, TX", region: "south" },
    { name: "Miami, FL", region: "south" },
    { name: "Atlanta, GA", region: "south" },
    { name: "Boston, MA", region: "northeast" },
    { name: "Seattle, WA", region: "west" },
    { name: "Denver, CO", region: "west" },
    { name: "Nashville, TN", region: "south" },
    { name: "Las Vegas, NV", region: "west" },
    { name: "Orlando, FL", region: "south" },
    { name: "Portland, OR", region: "west" },
    { name: "Other", region: "all" },
];

// Restaurant availability by region (simplified)
const REGIONAL_AVAILABILITY: Record<string, string[]> = {
    "In-N-Out": ["west"],
    "Wingstop": ["south", "west", "midwest"],
    "Shake Shack": ["northeast", "south", "west"],
    "Five Guys": ["all"],
    "Qdoba": ["all"],
};

export default function NearbyRestaurants({ onSelectRestaurant }: NearbyRestaurantsProps) {
    const [selectedCity, setSelectedCity] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [showLocationPrompt, setShowLocationPrompt] = useState(true);
    const [sortedRestaurants, setSortedRestaurants] = useState<Restaurant[]>(RESTAURANTS);

    // Get region from zip code (simplified US regions)
    const getRegionFromZip = (zip: string): string => {
        const firstDigit = parseInt(zip.charAt(0));
        if ([0, 1, 2].includes(firstDigit)) return "northeast";
        if ([3, 4].includes(firstDigit)) return "south";
        if ([5, 6].includes(firstDigit)) return "midwest";
        if ([7, 8, 9].includes(firstDigit)) return "west";
        return "all";
    };

    // Sort restaurants by regional availability
    const sortRestaurantsByRegion = (region: string) => {
        const sorted = [...RESTAURANTS].sort((a, b) => {
            const aAvail = REGIONAL_AVAILABILITY[a.name];
            const bAvail = REGIONAL_AVAILABILITY[b.name];

            // If availability data exists, prioritize regionally available ones
            const aInRegion = !aAvail || aAvail.includes("all") || aAvail.includes(region);
            const bInRegion = !bAvail || bAvail.includes("all") || bAvail.includes(region);

            if (aInRegion && !bInRegion) return -1;
            if (!aInRegion && bInRegion) return 1;
            return 0;
        });
        setSortedRestaurants(sorted);
    };

    const handleCitySelect = (city: string) => {
        setSelectedCity(city);
        const cityData = CITIES.find(c => c.name === city);
        if (cityData) {
            sortRestaurantsByRegion(cityData.region);
        }
        setShowLocationPrompt(false);
    };

    const handleZipSubmit = () => {
        if (zipCode.length >= 3) {
            const region = getRegionFromZip(zipCode);
            sortRestaurantsByRegion(region);
            setShowLocationPrompt(false);
        }
    };

    const openInMaps = (restaurantName: string) => {
        const query = encodeURIComponent(`${restaurantName} near me`);
        // Use Google Maps on web, Apple Maps on iOS
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <h3 className="font-semibold mb-1">Find Restaurants Near You</h3>
                    <p className="text-sm text-gray-400 mb-4">Select your city or enter zip code</p>
                </div>

                <div className="glass-card p-4">
                    <label className="text-sm font-medium text-gray-400 mb-2 block">Select City</label>
                    <select
                        value={selectedCity}
                        onChange={(e) => handleCitySelect(e.target.value)}
                        className="w-full"
                    >
                        <option value="">Choose your city...</option>
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
                    <label className="text-sm font-medium text-gray-400 mb-2 block">Enter Zip Code</label>
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
                            disabled={zipCode.length < 3}
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
                <div className="text-sm text-gray-400">
                    {selectedCity || (zipCode ? `Zip: ${zipCode}` : "All restaurants")}
                </div>
                <button
                    onClick={() => setShowLocationPrompt(true)}
                    className="text-xs text-emerald-400 hover:text-emerald-300"
                >
                    Change location
                </button>
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {sortedRestaurants.map((restaurant, i) => (
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
                ))}
            </div>
        </div>
    );
}
