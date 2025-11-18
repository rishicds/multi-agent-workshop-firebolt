# Font Setup Instructions

The new theme requires three custom fonts to be installed. Please add the following font files to their respective directories:

## Required Fonts

### 1. Coolvetica
- **File**: `Coolvetica RgCond.otf`
- **Location**: `src/app/assets/fonts/coolvetica/Coolvetica\`RgCond.otf`
- **Used for**: Main body text and blog content

### 2. Segoe Print
- **File**: `segoepr.ttf`
- **Location**: `src/app/assets/fonts/segoe-print/segoepr.ttf`
- **Used for**: Decorative text elements

### 3. Satoshi
- **File**: `Satoshi-Regular.otf`
- **Location**: `src/app/assets/fonts/Satoshi_Complete/Satoshi_Complete/Fonts/OTF/Satoshi-Regular.otf`
- **Used for**: Alternative body text

## Installation Steps

1. Download or obtain the font files from your design assets
2. Place each font file in its respective directory as listed above
3. The directories have already been created for you
4. Restart the development server if it's running

## Font Sources

- **Coolvetica**: Search for "Coolvetica font download" or obtain from your licensed font provider
- **Segoe Print**: Usually comes with Windows, or can be obtained from Microsoft
- **Satoshi**: Download from [fontshare.com](https://www.fontshare.com/fonts/satoshi) or your licensed provider

## Fallback Fonts

If the custom fonts are not loaded, the application will fallback to system sans-serif fonts. The theme will still work but with default system fonts.

## Verification

After adding the fonts, you can verify they're loaded by:
1. Opening the browser DevTools
2. Going to the Network tab
3. Filtering by "Font"
4. Refreshing the page
5. You should see the font files being loaded

The fonts are referenced in `src/app/globals.css` with `@font-face` declarations.
