import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base (dark)
        'bg-main': '#0A0A0F',
        'bg-alt': '#0D0B14',
        'surface-1': '#141022',
        'surface-2': '#1B1430',
        'border': '#2A2142',
        
        // Text
        'text-primary': '#F3F1FF',
        'text-secondary': '#B9B1D6',
        'text-muted': '#7E769C',
        
        // Neon purples
        'neon-violet': '#8B5CF6',
        'neon-violet-strong': '#7C3AED',
        'neon-magenta': '#A855F7',
        'neon-highlight': '#C084FC',
        
        // Accents
        'cyan-tech': '#22D3EE',
        'pink-neon': '#FB7185',
        'lime-neon': '#A3E635',
        'amber': '#FBBF24',
        'error': '#EF4444',
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 45%, #C084FC 100%)',
        'gradient-tech': 'linear-gradient(135deg, #8B5CF6 0%, #22D3EE 100%)',
        'glow-bg': 'radial-gradient(600px circle at 30% 20%, rgba(139,92,246,.22), transparent 55%), radial-gradient(700px circle at 70% 60%, rgba(34,211,238,.14), transparent 60%)',
      },
      boxShadow: {
        'glow-primary': '0 0 24px rgba(139,92,246,.35)',
        'glow-magenta': '0 0 24px rgba(168,85,247,.30)',
        'glow-cyan': '0 0 18px rgba(34,211,238,.25)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 24px rgba(139,92,246,.35)' },
          '50%': { boxShadow: '0 0 32px rgba(139,92,246,.55)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
