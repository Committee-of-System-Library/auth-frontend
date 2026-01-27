// tailwind.config.ts
import type { Config } from "tailwindcss"

export default {
    content: [
        "./index.html",
        "./src/**/*.{ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#615FFF',
                'left-bg': '#F8FAFF',
                'button-gray': '#DADADA',
            },
        },
    },
} satisfies Config