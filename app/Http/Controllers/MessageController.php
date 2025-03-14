<?php

// app/Http/Controllers/MessageController.php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Message;
use App\Models\User;

class MessageController extends Controller
{
    public function index()
    {
        // Fetch all users except the authenticated user
        $users = User::where('id', '!=', auth()->id())->get();

        return Inertia::render('Messages', [
            'users' => $users, // Pass users to the frontend for the user list
        ]);
    }

    public function show($userId)
    {
        // Check if it's an AJAX request
        if (request()->header('X-Requested-With') == 'XMLHttpRequest') {
            $messages = Message::where(function($query) use ($userId) {
                $query->where('sender_id', auth()->id())
                      ->where('receiver_id', $userId);
            })->orWhere(function($query) use ($userId) {
                $query->where('sender_id', $userId)
                      ->where('receiver_id', auth()->id());
            })->orderBy('created_at', 'asc')->get();
    
            return response()->json([
                'messages' => $messages
            ]);
        }

        // For non-AJAX requests, return the full page
        $selectedUser = User::find($userId);
        $users = User::where('id', '!=', auth()->id())->get();

        return Inertia::render('Messages', [
            'selectedUser' => $selectedUser,
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'message_text' => 'required|string',
        ]);

        // Create a new message
        $message = Message::create([
            'sender_id' => auth()->id(),
            'receiver_id' => $request->receiver_id,
            'message_text' => $request->message_text,
        ]);

        // Return the new message if it's an AJAX request
        if ($request->ajax()) {
            return response()->json(['message' => $message]);
        }

        return redirect()->back();
    }
}