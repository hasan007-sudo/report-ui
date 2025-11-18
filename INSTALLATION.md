# Installation Guide

## Prerequisites

Before installing `@sewai/cefr-report-ui`, ensure you have:

- React 18+ or React 19+
- Node.js 18+
- Tailwind CSS 4.0+

## Step 1: Install the Library

```bash
npm install @sewai/cefr-report-ui
# or
yarn add @sewai/cefr-report-ui
# or
pnpm add @sewai/cefr-report-ui
# or
bun add @sewai/cefr-report-ui
```

## Step 2: Install Peer Dependencies

```bash
npm install zod recharts lucide-react class-variance-authority clsx tailwind-merge
```

## Step 3: Install Radix UI Components

The report UI uses several Radix UI primitives. Install them as peer dependencies:

```bash
npm install @radix-ui/react-tabs @radix-ui/react-scroll-area @radix-ui/react-slider @radix-ui/react-checkbox @radix-ui/react-label @radix-ui/react-tooltip @radix-ui/react-slot
```

## Step 4: Setup Tailwind CSS

### 4.1 Install Tailwind CSS (if not already installed)

```bash
npm install -D tailwindcss@^4.0.0 postcss autoprefixer tailwindcss-animate
```

### 4.2 Configure Tailwind

Update your `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    // Add the library's components to the content paths
    './node_modules/@sewai/cefr-report-ui/dist/**/*.{js,mjs}',
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
```

### 4.3 Add CSS Variables

Add these CSS variables to your main CSS file (e.g., `src/index.css` or `src/app/globals.css`):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

## Step 5: Install shadcn/ui Components

The library requires specific shadcn/ui components. You have two options:

### Option A: Install via shadcn CLI (Recommended)

If you're using shadcn/ui in your project:

```bash
npx shadcn@latest add tabs scroll-area button card badge slider skeleton checkbox label tooltip
```

### Option B: Manual Installation

Create a `src/components/ui` directory and add the required components from [shadcn/ui](https://ui.shadcn.com/). You'll need:

1. **Tabs** - https://ui.shadcn.com/docs/components/tabs
2. **Scroll Area** - https://ui.shadcn.com/docs/components/scroll-area
3. **Button** - https://ui.shadcn.com/docs/components/button
4. **Card** - https://ui.shadcn.com/docs/components/card
5. **Badge** - https://ui.shadcn.com/docs/components/badge
6. **Slider** - https://ui.shadcn.com/docs/components/slider
7. **Skeleton** - https://ui.shadcn.com/docs/components/skeleton
8. **Checkbox** - https://ui.shadcn.com/docs/components/checkbox
9. **Label** - https://ui.shadcn.com/docs/components/label
10. **Tooltip** - https://ui.shadcn.com/docs/components/tooltip

**Note:** Make sure your `cn` utility function in `src/lib/utils.ts` matches the one used by shadcn:

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## Step 6: Import the Library Styles

In your main entry file (e.g., `src/main.tsx` or `src/index.tsx`), import the library styles:

```typescript
import '@sewai/cefr-report-ui/styles.css';
```

## Verification

To verify the installation, try importing the main component:

```typescript
import { CEFRReport, AudioPlayerProvider } from '@sewai/cefr-report-ui';
import type { ReportDataV2 } from '@sewai/cefr-report-ui';
```

## Troubleshooting

### Issue: Components not styled correctly

**Solution:** Ensure that:
1. Tailwind CSS is properly configured
2. CSS variables are added to your stylesheet
3. The library's styles are imported
4. The library path is included in Tailwind's content array

### Issue: Missing Radix UI components error

**Solution:** Install all peer dependencies listed in Step 3.

### Issue: Type errors with Zod

**Solution:** Ensure you have Zod 4.1+ installed:
```bash
npm install zod@^4.1.11
```

## Next Steps

See [README.md](./README.md) for usage examples and API documentation.
