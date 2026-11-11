<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'avatar',
        'social_media',
        'status',
        'referral_code',
    ];

    /**
     * The attributes that should be hidden.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Attribute casting
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'social_media' => 'array',
        ];
    }
    // Tell Laravel: "One User (Instructor) HAS MANY Courses"
public function courses()
{
    return $this->hasMany(Course::class, 'instructor_id');
}
// Get all courses this student has successfully purchased
public function purchasedCourses()
{
    return $this->belongsToMany(Course::class, 'purchases')
                ->withPivot('amount', 'status', 'expires_at') // Include pivot data with 6-month expiration
                ->wherePivot('status', 'paid') // ONLY return paid courses
                ->withTimestamps();
}

public function activePurchasedCourses()
{
    return $this->purchasedCourses()
                ->where(function ($q) {
                    $q->whereNull('purchases.expires_at')
                      ->orWhere('purchases.expires_at', '>', now());
                });
}

public function reviews() { return $this->hasMany(Review::class); }
public function wishlists() { return $this->hasMany(Wishlist::class); }
public function videoProgress() { return $this->hasMany(VideoProgress::class); }

public function referralEarnings()
{
    return $this->hasMany(ReferralEarning::class, 'referrer_id');
}

public function referredPurchases()
{
    return $this->hasMany(ReferralEarning::class, 'referred_user_id');
}

public function cashOutRequests()
{
    return $this->hasMany(CashOutRequest::class);
}

public function totalReferralIncome(): float
{
    return (float) $this->referralEarnings()->where('status', 'credited')->sum('commission_amount');
}

public function totalCashedOut(): float
{
    return (float) $this->cashOutRequests()->where('status', 'approved')->sum('amount');
}

public function pendingCashOut(): float
{
    return (float) $this->cashOutRequests()->where('status', 'pending')->sum('amount');
}

public function availableReferralBalance(): float
{
    $available = $this->totalReferralIncome() - ($this->totalCashedOut() + $this->pendingCashOut());
    return max(0.0, round($available, 2));
}

public static function generateUniqueReferralCode(): string
{
    do {
        $code = 'SL-' . mt_rand(100000, 999999);
    } while (static::where('referral_code', $code)->exists());

    return $code;
}
}