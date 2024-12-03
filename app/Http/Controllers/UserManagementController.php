<?php

namespace App\Http\Controllers;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

use Illuminate\Http\Request;

class UserManagementController extends Controller
{
    public function index()
    {
        $users = User::select(
            'id',
            'first_name',
            'last_name',
            'email',
            'phone_number',
            'country',
            'city',
            'address',
            'postal_code',
            'profile_picture'
        )
            ->where('role', 'admin')
            ->orderBy('email')
            ->get();
        // Logika untuk halaman manage user
        return Inertia::render(
            'ManageUser',
            ['users' => $users]
        );
    }

    public function addUser(Request $request)
    {
        $request->validate([
            'email' => 'required|string|lowercase|email|max:255|unique:users',
            'password' => ['required', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);
        return response()->json([
            'user' => $user
        ], 201);
    }

    public function deleteUser(Request $request, $id)
    {
        // Temukan pengguna berdasarkan ID
        $user = User::find($id);

        // Jika pengguna tidak ditemukan, kembalikan respons dengan status 404
        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        // Hapus pengguna
        $user->delete();

        // Kembalikan respons sukses
        return response()->json([
            'message' => 'User deleted successfully'
        ], 200);

    }
}
