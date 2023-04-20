/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx}",
        "./src/components/**/*.{js,ts,jsx,tsx}",
        "./src/app/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            }, // set orange-400 to be #f9a330
            colors: {
                orange: {
                    50: "#FFF8F1",
                    100: "#FFECDF",
                    200: "#FED7B5",
                    300: "#FDBE8B",
                    400: "#FCA563",
                    500: "#F6A037",
                    600: "#F59520",
                    700: "#EF880B",
                    800: "#E57A00",
                    900: "#D96C00",
                },
            },
        },
    },
    plugins: [
        // ...
        require("@tailwindcss/forms"),
    ],
};
