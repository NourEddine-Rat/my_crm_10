<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'client_id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'status',
        'insurance_type',
        'health_regime',
        'postal_code',
        'birth_date',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'birth_date' => 'date',
    ];

    /**
     * Get the subscriptions associated with the client.
     */
    public function subscriptions()
    {
        return $this->hasMany(Subscription::class, 'client_id', 'client_id');
    }

    /**
     * Get the vehicle details associated with the client.
     */
    public function vehicleDetails()
    {
        return $this->hasMany(VehicleDetail::class, 'client_id', 'client_id');
    }
    public function documents()
{
    return $this->hasMany(ClientDocument::class, 'client_id', 'client_id');
}
}