<?php

namespace App\Services;

use App\Models\User;

/**
 * Resolves a login / password-reset identity (name, NISN, or email) to a user.
 *
 * Excel imports and manual edits often leave invisible whitespace in names
 * (trailing spaces, double spaces, non-breaking spaces). A plain SQL equality
 * check then fails even though the name looks identical in the admin panel.
 * This resolver compares normalized values instead.
 */
class IdentityResolver
{
    /**
     * Normalize a value so visually identical strings compare as equal.
     */
    public static function normalize(?string $value): string
    {
        $value = (string) $value;
        // Normalize non-breaking and other exotic spaces to a regular space.
        $value = preg_replace('/[\s\x{00A0}\x{2007}\x{202F}]+/u', ' ', $value) ?? $value;
        $value = trim($value);

        return mb_strtolower($value);
    }

    /**
     * Find a user by name, NISN, or email.
     */
    public static function find(?string $identifier): ?User
    {
        $normalized = self::normalize($identifier);
        if ($normalized === '') {
            return null;
        }

        // Fast path: direct, trimmed, case-insensitive lookup.
        $user = User::query()
            ->where(function ($query) use ($normalized) {
                $query->whereRaw('LOWER(TRIM(nisn)) = ?', [$normalized])
                    ->orWhereRaw('LOWER(TRIM(email)) = ?', [$normalized])
                    ->orWhereRaw('LOWER(TRIM(name)) = ?', [$normalized]);
            })
            ->orderByRaw("CASE WHEN role = 'student' THEN 0 ELSE 1 END")
            ->first();

        if ($user) {
            return $user;
        }

        // Fallback: normalized comparison in PHP (double spaces, NBSP, etc.).
        $digits = preg_replace('/\D+/', '', (string) $identifier);
        $needle = self::normalize($identifier);

        $candidates = User::query()
            ->orderByRaw("CASE WHEN role = 'student' THEN 0 ELSE 1 END")
            ->get();

        foreach ($candidates as $candidate) {
            if (self::normalize($candidate->name) === $needle) {
                return $candidate;
            }

            if ($candidate->email && self::normalize($candidate->email) === $needle) {
                return $candidate;
            }

            if ($candidate->nisn) {
                $storedNisn = (string) $candidate->nisn;
                if (self::normalize($storedNisn) === $needle) {
                    return $candidate;
                }
                if ($digits !== '' && preg_replace('/\D+/', '', $storedNisn) === $digits) {
                    return $candidate;
                }
            }
        }

        return null;
    }
}
