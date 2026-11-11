# PowerShell script to update PHP limits for 1GB uploads
# Run as Administrator

$phpIniPath = "C:\xampp\php\php.ini"

Write-Host "=== PHP Upload Limit Updater ===" -ForegroundColor Cyan
Write-Host ""

# Check if php.ini exists
if (-not (Test-Path $phpIniPath)) {
    Write-Host "ERROR: php.ini not found at: $phpIniPath" -ForegroundColor Red
    Write-Host "Please update `$phpIniPath with your actual php.ini location" -ForegroundColor Yellow
    exit 1
}

# Create backup
$backupPath = "$phpIniPath.backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
Write-Host "Creating backup: $backupPath" -ForegroundColor Green
Copy-Item $phpIniPath $backupPath

# Read php.ini
$content = Get-Content $phpIniPath -Raw

# Update settings
Write-Host "Updating PHP settings..." -ForegroundColor Green

$updates = @{
    'upload_max_filesize\s*=\s*\d+[MG]' = 'upload_max_filesize = 1024M'
    'post_max_size\s*=\s*\d+[MG]' = 'post_max_size = 1100M'
    'max_execution_time\s*=\s*\d+' = 'max_execution_time = 300'
    'memory_limit\s*=\s*\d+[MG]' = 'memory_limit = 1024M'
}

foreach ($pattern in $updates.Keys) {
    $replacement = $updates[$pattern]
    if ($content -match $pattern) {
        $content = $content -replace $pattern, $replacement
        Write-Host "  ✓ Updated: $replacement" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ Pattern not found: $pattern" -ForegroundColor Yellow
    }
}

# Save updated php.ini
Set-Content -Path $phpIniPath -Value $content -NoNewline

Write-Host ""
Write-Host "PHP settings updated successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Cyan
Write-Host "1. Restart Apache in XAMPP Control Panel" -ForegroundColor Yellow
Write-Host "2. Verify changes with: php -r `"echo ini_get('upload_max_filesize');`"" -ForegroundColor Yellow
Write-Host ""
Write-Host "Backup saved at: $backupPath" -ForegroundColor Gray
