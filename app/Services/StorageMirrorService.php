<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;

class StorageMirrorService
{
    /**
     * Ensure a file stored in Laravel's local public disk (storage/app/public)
     * is mirrored to the web root storage directory (e.g. /www/wwwroot/.../storage)
     * so Nginx on shared hosting can serve it directly without 404.
     */
    public static function mirrorToRoot(?string $relativePath): ?string
    {
        if (empty($relativePath)) {
            return null;
        }

        // Clean relative path (remove leading /storage/ or slashes)
        $cleanPath = ltrim(preg_replace('#^/storage/#', '', $relativePath), '/');
        if (empty($cleanPath)) {
            return null;
        }

        $localFile = storage_path('app/public/' . $cleanPath);
        $rootStorage = dirname(base_path()) . '/storage/' . $cleanPath;
        $publicStorage = public_path('storage/' . $cleanPath);

        // 1. If exists in local public storage, mirror to root storage and public storage
        if (file_exists($localFile) && !is_dir($localFile)) {
            if (!file_exists($rootStorage)) {
                @mkdir(dirname($rootStorage), 0777, true);
                @copy($localFile, $rootStorage);
                @chmod($rootStorage, 0666);
            }
            if (!file_exists($publicStorage)) {
                @mkdir(dirname($publicStorage), 0777, true);
                @copy($localFile, $publicStorage);
                @chmod($publicStorage, 0666);
            }
        } elseif (file_exists($rootStorage) && !is_dir($rootStorage)) {
            // Reverse sync: if exists in rootStorage but missing in localFile
            if (!file_exists($localFile)) {
                @mkdir(dirname($localFile), 0777, true);
                @copy($rootStorage, $localFile);
                @chmod($localFile, 0666);
            }
            if (!file_exists($publicStorage)) {
                @mkdir(dirname($publicStorage), 0777, true);
                @copy($rootStorage, $publicStorage);
                @chmod($publicStorage, 0666);
            }
        }

        // Always return clean /storage/ path without /index.php so Nginx serves it directly
        return '/storage/' . $cleanPath;
    }

    /**
     * Scan and mirror all files in a folder (e.g. 'quest_proofs' or 'avatars')
     */
    public static function mirrorDirectory(string $folder): int
    {
        $localDir = storage_path('app/public/' . $folder);
        if (!is_dir($localDir)) {
            return 0;
        }

        $count = 0;
        $files = scandir($localDir);
        foreach ($files as $file) {
            if ($file !== '.' && $file !== '..' && !is_dir($localDir . '/' . $file)) {
                self::mirrorToRoot($folder . '/' . $file);
                $count++;
            }
        }

        // Also check if root storage has files not present in local storage
        $rootDir = dirname(base_path()) . '/storage/' . $folder;
        if (is_dir($rootDir)) {
            $rootFiles = scandir($rootDir);
            foreach ($rootFiles as $file) {
                if ($file !== '.' && $file !== '..' && !is_dir($rootDir . '/' . $file)) {
                    self::mirrorToRoot($folder . '/' . $file);
                }
            }
        }

        return $count;
    }
}
