import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        roseLove: "#FF6B81",
        roseSoft: "#FF8FA3",
        violetLove: "#B388EB",
        indigoLove: "#6C63FF"
      }
    }
  },
  plugins: []
};

export default config;
