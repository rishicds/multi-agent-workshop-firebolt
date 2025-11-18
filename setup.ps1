# Multi-Agent Workshop - Quick Setup Script for Windows
# This script automates the initial setup process

Write-Host "🚀 Multi-Agent Workshop - Quick Setup" -ForegroundColor Cyan
Write-Host "=" * 50
Write-Host ""

# Check Node.js installation
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js $nodeVersion detected" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found!" -ForegroundColor Red
    Write-Host "   Please install Node.js 18+ from: https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ package.json not found!" -ForegroundColor Red
    Write-Host "   Please run this script from the project root directory" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Step 1: Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ npm install failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Dependencies installed" -ForegroundColor Green

Write-Host ""
Write-Host "Step 2: Setting up environment variables..." -ForegroundColor Yellow

# Check if .env.local already exists
if (Test-Path ".env.local") {
    Write-Host "⚠️  .env.local already exists" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite it? (y/N)"
    if ($overwrite -ne "y") {
        Write-Host "Skipping .env.local setup" -ForegroundColor Yellow
    } else {
        Copy-Item ".env.local.example" ".env.local" -Force
        Write-Host "✓ Created .env.local from template" -ForegroundColor Green
    }
} else {
    Copy-Item ".env.local.example" ".env.local"
    Write-Host "✓ Created .env.local from template" -ForegroundColor Green
}

Write-Host ""
Write-Host "Step 3: Configure your Gemini API key" -ForegroundColor Yellow
Write-Host ""
Write-Host "To get your Gemini API key:" -ForegroundColor Cyan
Write-Host "  1. Visit: https://aistudio.google.com" -ForegroundColor White
Write-Host "  2. Click 'API keys' in left sidebar" -ForegroundColor White
Write-Host "  3. Click 'Create API Key'" -ForegroundColor White
Write-Host "  4. Copy the generated key" -ForegroundColor White
Write-Host ""

$apiKey = Read-Host "Enter your Gemini API key (or press Enter to skip)"

if ($apiKey -and $apiKey -ne "") {
    # Update .env.local with the API key
    $envContent = Get-Content ".env.local" -Raw
    $envContent = $envContent -replace "GEMINI_API_KEY=your_gemini_api_key_here", "GEMINI_API_KEY=$apiKey"
    Set-Content ".env.local" $envContent -NoNewline
    Write-Host "✓ API key saved to .env.local" -ForegroundColor Green
} else {
    Write-Host "⚠️  Skipped API key setup" -ForegroundColor Yellow
    Write-Host "   Remember to add your key to .env.local before running the app" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Step 4: Verifying setup..." -ForegroundColor Yellow
npm run verify-setup

Write-Host ""
Write-Host "=" * 50
Write-Host "🎉 Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Run: npm run dev" -ForegroundColor White
Write-Host "  2. Open: http://localhost:3000" -ForegroundColor White
Write-Host "  3. Try the workshop at: http://localhost:3000/workshop" -ForegroundColor White
Write-Host ""
Write-Host "For detailed setup instructions, see:" -ForegroundColor Cyan
Write-Host "  GEMINI-FIREBOLT-SETUP.md" -ForegroundColor White
Write-Host ""
Write-Host "=" * 50
Write-Host ""

# Ask if user wants to start dev server
$startDev = Read-Host "Start development server now? (Y/n)"
if ($startDev -ne "n") {
    Write-Host ""
    Write-Host "Starting development server..." -ForegroundColor Green
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
    Write-Host ""
    npm run dev
}
