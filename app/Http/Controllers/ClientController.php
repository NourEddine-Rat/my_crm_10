<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Client;

class ClientController extends Controller
{
    public function index()
    {
        $clients = Client::all(); // Fetch clients here

        return Inertia::render('Clients/Index', [
            'clients' => $clients, // Pass clients to the component
        ]);
    }
}