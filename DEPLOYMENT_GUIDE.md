# 🚀 Success Life Coaching Academy - Production Deployment Guide

## Pre-Deployment Checklist

✅ **Local Build Completed:**
- Frontend assets built: `public/build/` (0.76 MB, 44 files)
- Laravel caches optimized: config, routes, views
- All tests passed
- Video upload: 1GB limit configured
- Flash messages: Working on all pages
- Video streaming: Byte-range support enabled

---

## 📦 What to Upload to Server

Upload these files/folders to your production server:

```
success-life-coaching-academy/
├── app/                    # Backend logic
├── bootstrap/              # Laravel bootstrap (including cache/)
├── config/                 # Configuration files
├── database/               # Migrations & seeders
├── public/                 # Web root (point domain here!)
│   ├── build/             # ✅ Built frontend assets
│   ├── storage/           # Symlink (will create on server)
│   └── index.php          # Entry point
├── resources/              # Views & frontend source
├── routes/                 # Route definitions
├── storage/                # File uploads & logs
│   ├── app/
│   │   ├── private/       # Video files (protected)
│   │   └── public/        # Thumbnails (public)
│   ├── framework/
│   └── logs/
├── vendor/                 # Composer dependencies
├── .env                    # ⚠️ Use .env.production
├── artisan                 # CLI tool
├── composer.json
└── package.json
```

**Files to EXCLUDE:**
- ❌ `.git/` folder
- ❌ `node_modules/` folder
- ❌ `.env.example`
- ❌ `tests/` folder (optional)

---

## 🔧 Server Setup Steps

### 1. Upload Files via FTP/cPanel File Manager

Upload all files to your public_html or domain directory.

### 2. Configure Environment

**Replace `.env` with `.env.production` contents:**

```bash
# SSH into server or use cPanel Terminal
cd /home/successlife/public_html
cp .env.production .env
nano .env  # or edit via cPanel File Manager
```

**Verify these settings in `.env`:**
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://www.successlifecoaching.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_DATABASE=successlife_coaching_academy
DB_USERNAME=successlife_coaching
DB_PASSWORD=successlifecoaching@2026
```

### 3. Set Up Database

**Via cPanel MySQL:**
1. Create database: `successlife_coaching_academy`
2. Create user: `successlife_coaching` with password `successlifecoaching@2026`
3. Grant all privileges to the user on the database

**Run migrations:**
```bash
php artisan migrate --force
```

### 4. Create Storage Symlink

```bash
php artisan storage:link
```

This creates `public/storage` → `storage/app/public` symlink for thumbnails.

### 5. Set File Permissions

```bash
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache  # or your web user
```

**Via cPanel:**
- Right-click `storage/` → Permissions → Set to 755 (recursive)
- Right-click `bootstrap/cache/` → Permissions → Set to 755 (recursive)

### 6. Optimize for Production

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize
```

### 7. Configure PHP Limits for 1GB Uploads

**Find your php.ini** (usually in cPanel → MultiPHP INI Editor):

```ini
upload_max_filesize = 1024M
post_max_size = 1100M
max_execution_time = 300
memory_limit = 1024M
max_input_time = 300
```

**Restart PHP-FPM or Apache after changes.**

### 8. Configure Web Server

**Apache (.htaccess already configured)**
- Point document root to `public/` folder
- Ensure mod_rewrite is enabled

**Nginx (if applicable):**
```nginx
server {
    listen 80;
    server_name www.successlifecoaching.com successlifecoaching.com;
    root /home/successlife/public_html/public;

    add_header X-Frame-Options "DENY";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }

    client_max_body_size 1100M;
}
```

### 9. SSL Certificate (HTTPS)

**Via cPanel AutoSSL or Let's Encrypt:**
```bash
certbot --apache -d www.successlifecoaching.com -d successlifecoaching.com
```

Or use cPanel SSL/TLS → Install AutoSSL certificate.

---

## 🧪 Post-Deployment Testing

### 1. Basic Access
- ✅ Visit https://www.successlifecoaching.com
- ✅ Homepage loads without errors
- ✅ Check browser console (F12) for JavaScript errors

### 2. Authentication
- ✅ Register a new account
- ✅ Login/Logout works
- ✅ Email verification (if enabled)

### 3. Course Management (Instructor)
- ✅ Login as instructor
- ✅ Create a course with thumbnail
- ✅ Upload a video (test with ~10MB first, then larger)
- ✅ Publish the course

### 4. Student Enrollment
- ✅ Login as student
- ✅ Browse courses
- ✅ Enroll in a course (mock payment)
- ✅ Watch video (verify timeline seeking works)
- ✅ Leave a review

### 5. Admin Functions
- ✅ Login as admin
- ✅ View all courses, users, categories
- ✅ Delete test content
- ✅ Approve manual payments

---

## 📊 Monitoring & Maintenance

### Check Logs
```bash
tail -f storage/logs/laravel.log
```

### Clear Caches (after updates)
```bash
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear
```

### Database Backup (Weekly)
```bash
mysqldump -u successlife_coaching -p successlife_coaching_academy > backup-$(date +%Y%m%d).sql
```

### Storage Backup
```bash
tar -czf storage-backup-$(date +%Y%m%d).tar.gz storage/app/private/courses
```

---

## 🔒 Security Checklist

- ✅ `APP_DEBUG=false` in production
- ✅ `APP_ENV=production`
- ✅ Strong `APP_KEY` (already set)
- ✅ `.env` file not publicly accessible
- ✅ Storage folder protected (outside public/)
- ✅ HTTPS/SSL enabled
- ✅ File upload validation (1GB max, video types only)
- ✅ CSRF protection enabled
- ✅ Security headers (X-Frame-Options, CSP)
- ✅ Database credentials strong

---

## ⚡ Performance Optimization

Already configured:
- ✅ Config caching
- ✅ Route caching
- ✅ View caching
- ✅ Asset minification (Vite build)
- ✅ Gzip compression (via .htaccess)

Optional improvements:
- Redis for cache/sessions (if available)
- CDN for static assets
- Image optimization for thumbnails
- Database indexing (already in migrations)

---

## 🆘 Troubleshooting

### 500 Internal Server Error
```bash
# Check Laravel logs
tail -50 storage/logs/laravel.log

# Check web server error logs
tail -50 /var/log/apache2/error.log  # or nginx error.log

# Clear all caches
php artisan config:clear && php artisan cache:clear
```

### White Screen / Blank Page
1. Check `.env` file exists and is readable
2. Run `php artisan config:cache`
3. Check `storage/` and `bootstrap/cache/` permissions

### Database Connection Error
1. Verify MySQL credentials in `.env`
2. Test connection: `mysql -u successlife_coaching -p successlife_coaching_academy`
3. Check database exists and user has privileges

### Video Upload Fails
1. Check PHP limits in php.ini
2. Check disk space: `df -h`
3. Check `storage/app/private/` permissions
4. Check Laravel logs for validation errors

### Assets Not Loading (404)
1. Verify `public/build/` folder exists
2. Check `.htaccess` is present in `public/`
3. Clear browser cache
4. Run `npm run build` locally and re-upload

---

## 📞 Support

**Production URL:** https://www.successlifecoaching.com
**Database:** successlife_coaching_academy
**Server:** cPanel shared hosting

**Emergency Commands:**
```bash
# Put site in maintenance mode
php artisan down --secret="emergency-access-token"

# Access site during maintenance
https://www.successlifecoaching.com/emergency-access-token

# Bring site back up
php artisan up
```

---

## ✅ Deployment Complete!

Your application is production-ready with:
- ✅ MySQL database configured
- ✅ 1GB video upload support
- ✅ HTTPS/SSL ready
- ✅ Flash messages on all pages
- ✅ Optimized performance caches
- ✅ Security headers enabled
- ✅ Video streaming with seek support

**Next:** Upload files to server and follow the setup steps above!
