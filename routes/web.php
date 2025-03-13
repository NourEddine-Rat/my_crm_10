<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Client;
use App\Models\Subscription;
use App\Models\Payment;
use Illuminate\Http\Request;

Route::get('/clients', function () {
    // Get all clients with their related data
    $clients = Client::select(
        'client_id',
        'first_name',
        'last_name',
        'email',
        'status',
        'insurance_type',
        'health_regime',
        'postal_code',
        'birth_date'
    )->with([
        'subscriptions' => function($query) {
            $query->select('subscription_id', 'client_id', 'contract_status', 'guarantee_type', 'insurance_formula');
        },
        'subscriptions.payments' => function($query) {
            $query->select('payment_id', 'subscription_id', 'payment_status');
        },
        'subscriptions.invoices' => function($query) {
            $query->select('invoice_id', 'subscription_id', 'status');
        },
        'vehicleDetails' => function($query) {
            $query->select('vehicle_id', 'client_id', 'registration_number');
        },
        'documents' => function($query) {
            $query->select('document_id', 'client_id', 'document_type', 'document_path');
        }
    ])->get();

    // Map clients to the format expected by the frontend
    $mappedClients = $clients->map(function ($client) {
        // Determine if client has any active subscription
        $hasActiveSubscription = $client->subscriptions->contains('contract_status', 'actif');
        
        // Get latest subscription info if exists
        $latestSubscription = $client->subscriptions->sortByDesc('created_at')->first();
        
        // Get payment status from the most recent payment if exists
        $paymentStatus = null;
        if ($latestSubscription && $latestSubscription->payments->isNotEmpty()) {
            $paymentStatus = $latestSubscription->payments->sortByDesc('payment_date')->first()->payment_status;
        }
        $documentTypes = ['CIN', 'Carte Grise', 'Permis', 'RTP', "Relevé d'information"];
        $documents = [];
        
        foreach ($documentTypes as $type) {
            $documents[$type] = $client->documents->contains('document_type', $type);
        }
        
        return [
            'id' => (string) $client->client_id,
            'name' => "{$client->first_name} {$client->last_name}",
            'email' => $client->email,
            'etat' => $client->status,
            'insuranceType' => $client->insurance_type,
            'healthRegime' => $client->health_regime,
            'postalCode' => $client->postal_code,
            'birthDate' => $client->birth_date ? $client->birth_date->format('Y-m-d') : null,
            'hasActiveSubscription' => $hasActiveSubscription,
            'contractStatus' => $latestSubscription ? $latestSubscription->contract_status : null,
            'insuranceFormula' => $latestSubscription ? $latestSubscription->insurance_formula : null,
            'paymentStatus' => $paymentStatus,
            'guaranteeType' => $latestSubscription ? $latestSubscription->guarantee_type : null,
            'hasVehicle' => $client->vehicleDetails->isNotEmpty(),
            'documents' => $documents,
        ];
    });

    return Inertia::render('Clients', [
        'clients' => $mappedClients,
    ]);
})->name('clients');

Route::put('/clients/{id}/status', function ($id, Request $request) {
    $validated = $request->validate([
        'status' => 'required|in:nouveau,en_qualification,client,archive',
    ]);

    $client = Client::find($id);
    if ($client) {
        $client->status = $validated['status'];
        $client->save();
        return response()->json(['message' => 'Status updated successfully'], 200);
    }

    return response()->json(['message' => 'Client not found'], 404);
});

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';