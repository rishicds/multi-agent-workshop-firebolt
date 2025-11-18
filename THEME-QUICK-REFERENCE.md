# Quick Theme Reference Guide

## Color Variables (Use These!)

### Backgrounds
```css
/* Sidebar */
background: #2b2d31

/* Sidebar hover/active */
background: #3a3d42

/* Input fields (dark) */
background: #1e1f22

/* Main content */
background: #f9f9f9

/* Cards/White areas */
background: #ffffff

/* Firebolt logo background */
background: #f44336

/* Primary button (mint green) */
background: #7AD2A2
hover: #69c190
```

### Text Colors
```css
/* White (headings) */
color: #ffffff

/* Light gray (main text) */
color: #d9d9d9

/* Medium gray (subtitles) */
color: #b5b5b5

/* Muted gray (placeholders) */
color: #7a7a7a

/* Black (light theme text) */
color: #000000

/* Gray (light theme secondary) */
color: #6b7280 or use Tailwind text-gray-600
```

## Typography

### Font Families
```css
/* Primary font (use everywhere) */
font-family: 'Coolvetica, sans-serif'

/* Alternative fonts (if needed) */
font-family: 'Segoe-Print, cursive'
font-family: 'Satoshi, sans-serif'
```

### Font Sizes (Blog Content)
```css
h1: 2.5rem (40px), font-weight: 400
h2: 2rem (32px), font-weight: 400
h3: 1.5rem (24px), font-weight: 400
p: 1.2rem (19.2px), font-weight: 400
```

### Font Sizes (UI)
```css
text-3xl: 30px
text-2xl: 24px
text-xl: 20px
text-lg: 18px
text-base: 16px
text-sm: 14px
text-xs: 12px
```

## Spacing

### Common Padding/Margin
```css
p-4: 1rem (16px)
p-6: 1.5rem (24px)
p-8: 2rem (32px)

mb-2: 0.5rem (8px)
mb-3: 0.75rem (12px)
mb-4: 1rem (16px)
mb-6: 1.5rem (24px)
mb-8: 2rem (32px)
```

### Gaps
```css
gap-2: 0.5rem (8px)
gap-3: 0.75rem (12px)
gap-4: 1rem (16px)
gap-6: 1.5rem (24px)
```

## Component Patterns

### Buttons (Primary - Mint Green)
```tsx
<button className="px-6 py-3 bg-[#7AD2A2] hover:bg-[#69c190] text-[#1e1f22] rounded-lg font-medium transition-colors">
  Button Text
</button>
```

### Buttons (Secondary - Gray)
```tsx
<button className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-black rounded-lg font-medium transition-colors">
  Button Text
</button>
```

### Links (In Dark Sidebar)
```tsx
<Link 
  href="/path"
  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#d9d9d9] hover:bg-[#3a3d42] transition-colors"
>
  Link Text
</Link>
```

### Search Input (Dark)
```tsx
<input
  type="text"
  placeholder="Search..."
  className="w-full bg-[#1e1f22] text-[#d9d9d9] placeholder-[#7a7a7a] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#7AD2A2]"
/>
```

### Section Headers (Mint Green)
```tsx
<div className="text-xs font-semibold text-[#7AD2A2] uppercase tracking-wider mb-2 px-3">
  Section Name
</div>
```

## Icon Sizes

```css
Small icons: h-4 w-4
Medium icons: h-5 w-5
Large icons: h-8 w-8
Logo: h-10 w-10
```

## Border Radius

```css
Buttons: rounded-lg (0.5rem / 8px)
Inputs: rounded-md (0.375rem / 6px)
Cards: rounded-lg (0.5rem / 8px)
Avatar/Logo: rounded-md (0.375rem / 6px)
Circular: rounded-full
```

## Transitions

```css
/* Standard transition */
transition-colors

/* With duration */
transition: all 0.2s ease-in-out
```

## Sidebar Width

```css
width: 16rem (256px)
className="w-64"
```

## Max Widths (Content)

```css
Small content: max-w-3xl (48rem / 768px)
Large content: max-w-7xl (80rem / 1280px)
```

## Quick Copy-Paste Classes

### Dark Sidebar Container
```tsx
className="flex h-full w-64 flex-col bg-[#2b2d31] text-[#d9d9d9]"
```

### Main Content Container
```tsx
className="p-8" style={{ fontFamily: 'Coolvetica, sans-serif' }}
```

### Heading (Light Theme)
```tsx
className="text-4xl font-normal mb-3" style={{ fontFamily: 'Coolvetica, sans-serif' }}
```

### Paragraph (Light Theme)
```tsx
className="text-lg text-gray-600"
```

## CSS Classes Available

### Custom Scrollbar
- Automatically applied to all scrollable elements
- Mint green (#7AD2A2) thumb
- Light gray (#f1f1f1) track

### Blog Styles
- `.blog` - For link styling with underlines
- `.blog-content` - Main content wrapper with Coolvetica font
- `.blog-content h1, h2, h3, p` - Pre-styled headings and paragraphs

### Hide Scrollbar
```tsx
className="scrollbar-hide"
```

## DevRel Squad Branding

When referencing DevRel Squad:
- Primary green: #00ff62 (for slick carousel, accents)
- Use mint green: #7AD2A2 (for buttons, primary actions)

## Testing Checklist

- [ ] Fonts load correctly (check Network tab)
- [ ] Sidebar is dark (#2b2d31)
- [ ] Main content has light background (#f9f9f9)
- [ ] Buttons use mint green (#7AD2A2)
- [ ] Scrollbars are mint green
- [ ] Text uses Coolvetica font
- [ ] Hover states work on all interactive elements
- [ ] Search input styling is correct
