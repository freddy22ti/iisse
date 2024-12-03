<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();

        // Mengisi semua properti yang tervalidasi
        $user->fill($request->validated());

        // Reset email_verified_at jika email berubah
        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        // Simpan perubahan
        $user->save();

        // Tambahkan feedback ke pengguna
        return Redirect::route('profile.edit');
    }

    /**
     * Update the user's profile picture.
     */
    public function update_profile_picture(Request $request)
    {
        $request->validate([
            'profile_picture' => 'required|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $user = Auth::user();

        // Hapus foto profil lama jika ada
        if ($user->profile_picture) {
            Storage::disk('public')->delete($user->profile_picture);
        }

        // Generate nama file acak dan simpan foto
        $path = $request->file('profile_picture')->storeAs(
            'profile_pictures',
            uniqid() . '_' . time() . '.' . $request->file('profile_picture')->getClientOriginalExtension(),
            'public'
        );

        $user->profile_picture = $path;
        $user->save();

        return Redirect::route('profile.edit')->with(
            'success',
            'Profile picture deleted successfully!'
        );
    }

    /**
     * Delete the user's profile picture.
     */
    public function delete_profile_picture(Request $request)
    {
        $user = Auth::user();
        // Delete the profile picture file if it exists
        if ($user->profile_picture) {
            Storage::disk('public')->delete($user->profile_picture);
            $user->profile_picture = null;
            $user->save();
        }
        return Redirect::route('profile.edit')->with(
            'success',
            'Profile picture deleted successfully!'
        );
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
