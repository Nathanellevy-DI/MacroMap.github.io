module.exports = {
    darkMode: "class",
    content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./app/**/*.tsx"],
    theme: {
        extend: {
            colors: {
                primary: "#0ea5e9",
                secondary: "#64748b",
                background: "var(--bg-primary)",
                card: "var(--bg-card)",
            },
            backdropBlur: { xs: "4px" },
        },
    },
    plugins: [],
};
