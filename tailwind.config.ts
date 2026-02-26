import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'
import animate from 'tailwindcss-animate'

const config: Config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
  	extend: {
  		colors: {
  			brand: {
  				'50': '#EEF4FB',
  				'100': '#D5E5F5',
  				'200': '#ABCBEB',
  				'300': '#81B1E1',
  				'400': '#4F8FD0',
  				'500': '#1E6DBF',
  				'600': '#1E3A5F',
  				'700': '#17304F',
  				'800': '#10253F',
  				'900': '#0A1A2F'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			status: {
  				active: '#16A34A',
  				pending: '#D97706',
  				sold: '#DC2626',
  				rented: '#2563EB',
  				archived: '#6B7280'
  			},
  			listing: {
  				sale: '#1E3A5F',
  				rent: '#0891B2',
  				shortterm: '#7C3AED',
  				lease: '#059669',
  				auction: '#DC2626'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			sans: [
  				'Inter',
  				'system-ui',
  				'-apple-system',
  				'sans-serif'
  			],
  			mono: [
  				'JetBrains Mono',
  				'Menlo',
  				'monospace'
  			]
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		spacing: {
  			'safe-top': 'env(safe-area-inset-top)',
  			'safe-bottom': 'env(safe-area-inset-bottom)',
  			'safe-left': 'env(safe-area-inset-left)',
  			'safe-right': 'env(safe-area-inset-right)',
  			'nav-height': '4rem',
  			'bottom-nav': '4.5rem'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			'fade-in': {
  				from: {
  					opacity: '0'
  				},
  				to: {
  					opacity: '1'
  				}
  			},
  			'fade-out': {
  				from: {
  					opacity: '1'
  				},
  				to: {
  					opacity: '0'
  				}
  			},
  			'slide-up': {
  				from: {
  					transform: 'translateY(100%)'
  				},
  				to: {
  					transform: 'translateY(0)'
  				}
  			},
  			'slide-down': {
  				from: {
  					transform: 'translateY(0)'
  				},
  				to: {
  					transform: 'translateY(100%)'
  				}
  			},
  			'slide-in-right': {
  				from: {
  					transform: 'translateX(100%)'
  				},
  				to: {
  					transform: 'translateX(0)'
  				}
  			},
  			'splash-scale': {
  				'0%': {
  					transform: 'scale(0.85)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'scale(1)',
  					opacity: '1'
  				}
  			},
  			'skeleton-pulse': {
  				'0%,100%': {
  					opacity: '1'
  				},
  				'50%': {
  					opacity: '0.4'
  				}
  			},
  			'bounce-in': {
  				'0%': {
  					transform: 'scale(0)',
  					opacity: '0'
  				},
  				'60%': {
  					transform: 'scale(1.15)'
  				},
  				'100%': {
  					transform: 'scale(1)',
  					opacity: '1'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'fade-in': 'fade-in 0.3s ease-out',
  			'fade-out': 'fade-out 0.3s ease-out',
  			'slide-up': 'slide-up 0.35s cubic-bezier(0.32,0.72,0,1)',
  			'slide-down': 'slide-down 0.35s cubic-bezier(0.32,0.72,0,1)',
  			'slide-in-right': 'slide-in-right 0.3s ease-out',
  			'splash-scale': 'splash-scale 0.6s cubic-bezier(0.34,1.56,0.64,1)',
  			skeleton: 'skeleton-pulse 1.5s ease-in-out infinite',
  			'bounce-in': 'bounce-in 0.4s cubic-bezier(0.34,1.56,0.64,1)'
  		},
  		screens: {
  			xs: '375px',
  			sm: '640px',
  			md: '768px',
  			lg: '1024px',
  			xl: '1280px',
  			'2xl': '1536px'
  		},
  		boxShadow: {
  			card: '0 8px 30px rgba(0, 0, 0, 0.04)',
  			'card-hover': '0 20px 40px rgba(0, 0, 0, 0.08)',
  			'premium': '0 30px 60px rgba(0, 0, 0, 0.12)',
  			'bottom-nav': '0 -4px 20px rgba(0, 0, 0, 0.04)',
  			header: '0 4px 20px rgba(0, 0, 0, 0.04)'
  		},
  		letterSpacing: {
  			tighter: '-0.05em',
  			tight: '-0.025em',
  			premium: '0.05em',
  			widest: '0.2em'
  		}
  	}
  },
  plugins: [forms, typography, animate, require("tailwindcss-animate")],
}

export default config
