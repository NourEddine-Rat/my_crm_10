<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Client;
use App\Models\Subscription;
use App\Models\Payment;
use App\Models\Invoice;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

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
            $documentTypes = ['CIN', 'Carte Grise', 'Permis', 'RTP', "Relevé d'information"];
            $documents = [];
    
            foreach ($documentTypes as $type) {
                $documents[$type] = $client->documents->contains('document_type', $type);
            }
            
            // Get latest subscription info if exists
            $latestSubscription = $client->subscriptions->sortByDesc('created_at')->first();
            
            // Get payment status from the most recent payment if exists
            $paymentStatus = null;
            if ($latestSubscription && $latestSubscription->payments->isNotEmpty()) {
                $paymentStatus = $latestSubscription->payments->sortByDesc('payment_date')->first()->payment_status;
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
                'documents' => $documents
            ];
        });
        $cinq_dernier_lead = Client::orderBy('created_at', 'desc')->limit(5)->get();
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
                'role' => $request->user() ? $request->user()->user_role : null,
                'name' => $request->user() ? $request->user()->name : "Admin",
            ],
            'clients' => $mappedClients,
            'CinqDernierLead' => $cinq_dernier_lead,
        ];
    }
}