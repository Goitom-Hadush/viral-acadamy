# How to Increase PHP Upload Limit to 1GB

## Current Settings
- `upload_max_filesize` = 40M
- `post_max_size` = 40M
- PHP.ini location: `C:\xampp\php\php.ini`

## Required Changes

### Step 1: Edit php.ini
1. Open XAMPP Control Panel as Administrator
2. Click "Config" next to Apache → Select "PHP (php.ini)"
3. Or directly open: `C:\xampp\php\php.ini` in a text editor (as Administrator)

### Step 2: Find and Update These Lines

Search for these settings and change them:

```ini
; Maximum allowed size for uploaded files.
upload_max_filesize = 1024M

; Must be greater than or equal to upload_max_filesize
post_max_size = 1100M

; Maximum execution time of each script, in seconds
; 0 = unlimited (already set correctly)
max_execution_time = 300

; Maximum amount of memory a script may consume
memory_limit = 1024M
```

**Important:** Make sure to remove the semicolon (`;`) at the beginning of each line if it exists!

### Step 3: Restart Apache
1. Open XAMPP Control Panel
2. Click "Stop" next to Apache
3. Wait 2 seconds
4. Click "Start" next to Apache

### Step 4: Verify Changes
Run this command in PowerShell:

```powershell
cd "C:\Users\HP\Documents\success-life-coaching-academy"
php -r "echo 'upload_max_filesize: ' . ini_get('upload_max_filesize') . PHP_EOL; echo 'post_max_size: ' . ini_get('post_max_size') . PHP_EOL;"
```

You should see:
```
upload_max_filesize: 1024M
post_max_size: 1100M
```

## What I Already Updated

✅ **Laravel Validator** - Changed from `max:40960` (40MB) to `max:1048576` (1GB)
- File: `app/Http/Controllers/Instructor/VideoController.php`

✅ **Frontend Display** - Changed text from "max 500 MB" to "max 1 GB"
- File: `resources/js/Pages/Instructor/Courses/Videos.jsx`

✅ **Video Streaming** - Already supports any file size with byte-range streaming
- File: `app/Http/Controllers/VideoStreamController.php`

## After PHP Changes

Once you've updated php.ini and restarted Apache, run:

```powershell
cd "C:\Users\HP\Documents\success-life-coaching-academy"
npm run build
php artisan config:clear
php artisan cache:clear
```

Then test uploading a video up to 1GB!

## Troubleshooting

If upload still fails:

1. **Check .htaccess** - Make sure there's no PHP limits set there
2. **Check Apache config** - `C:\xampp\apache\conf\httpd.conf` for `LimitRequestBody`
3. **Browser timeout** - Large uploads may take time, be patient
4. **Disk space** - Ensure you have enough space in `storage/app/private/courses`

## Production Deployment Note

When deploying to a production server:
- Update the server's php.ini (location varies: `/etc/php/8.x/fpm/php.ini` on Linux)
- Restart PHP-FPM or Apache
- Update Nginx/Apache config if using reverse proxy
- Consider using chunked upload for files > 1GB for better reliability
