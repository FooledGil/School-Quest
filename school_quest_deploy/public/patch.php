<?php
/**
 * School-Quest Server Auto Patcher
 * Jalankan lewat browser: https://sk0011jb6j.skipper.my.id/school_quest_deploy/public/patch.php
 */

header('Content-Type: text/html; charset=utf-8');

$root = dirname(__DIR__, 2);
$deploy = dirname(__DIR__); // .../school_quest_deploy

$results = [];

// 1. Patch bootstrap/app.php
$bootstrap_app_file = $deploy . '/bootstrap/app.php';
$bootstrap_code = <<<'EOT'
<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->trustProxies(at: '*');
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
            \App\Http\Middleware\SecurityHeadersMiddleware::class,
        ]);

        $middleware->alias([
            'admin' => \App\Http\Middleware\AdminMiddleware::class,
            'student' => \App\Http\Middleware\StudentMiddleware::class,
        ]);

        $middleware->redirectTo(
            guests: '/index.php/login',
            users: function ($request) {
                if ($request->user()?->role === 'admin') {
                    return '/index.php/admin/dashboard';
                }
                return '/index.php/dashboard';
            }
        );
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
EOT;

if (file_put_contents($bootstrap_app_file, $bootstrap_code)) {
    $results[] = "✅ bootstrap/app.php berhasil di-patch (Trust Proxies & HTTPS aktif)";
} else {
    $results[] = "❌ Gagal menulis bootstrap/app.php";
}

// 2. Patch AppServiceProvider.php
$app_service_file = $deploy . '/app/Providers/AppServiceProvider.php';
$app_service_code = <<<'EOT'
<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        \Illuminate\Support\Facades\URL::forceScheme('https');
    }
}
EOT;

if (file_put_contents($app_service_file, $app_service_code)) {
    $results[] = "✅ AppServiceProvider.php berhasil di-patch (Force HTTPS aktif)";
} else {
    $results[] = "❌ Gagal menulis AppServiceProvider.php";
}

// 3. Update .env
$env_file = $deploy . '/.env';
if (file_exists($env_file)) {
    $env = file_get_contents($env_file);
    $env = preg_replace('/^APP_URL=.*$/m', 'APP_URL=https://sk0011jb6j.skipper.my.id/index.php', $env);
    file_put_contents($env_file, $env);
    $results[] = "✅ .env berhasil di-update ke HTTPS";
}

// 4. Bersihkan Cache Laravel
@unlink($deploy . '/bootstrap/cache/packages.php');
@unlink($deploy . '/bootstrap/cache/services.php');
@unlink($deploy . '/bootstrap/cache/config.php');
@array_map('unlink', glob($deploy . '/storage/framework/views/*.php'));
@array_map('unlink', glob($deploy . '/storage/framework/cache/data/*/*/*'));
$results[] = "✅ Cache framework & view berhasil dibersihkan";

// 5. Sinkronkan Bukti Quest & Avatar ke Root Web
$storageSrc = $deploy . '/storage/app/public';
$storageDst = $root . '/storage';
@mkdir($storageDst . '/quest_proofs', 0777, true);
@mkdir($storageDst . '/avatars', 0777, true);
@chmod($storageDst, 0777);
@chmod($storageDst . '/quest_proofs', 0777);
@chmod($storageDst . '/avatars', 0777);

$syncedFiles = 0;
foreach (['quest_proofs', 'avatars'] as $folder) {
    $src = $storageSrc . '/' . $folder;
    $dst = $storageDst . '/' . $folder;
    if (is_dir($src)) {
        foreach (scandir($src) as $f) {
            if ($f !== '.' && $f !== '..' && is_file($src . '/' . $f)) {
                if (!file_exists($dst . '/' . $f) || filesize($dst . '/' . $f) !== filesize($src . '/' . $f)) {
                    @copy($src . '/' . $f, $dst . '/' . $f);
                    @chmod($dst . '/' . $f, 0666);
                    $syncedFiles++;
                }
            }
        }
    }
}
$results[] = "✅ Sinkronisasi storage selesai: {$syncedFiles} berkas bukti quest/avatar disalin ke root web";


?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Patch Berhasil</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #334155; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; }
        .card { background: white; border-radius: 16px; padding: 32px; max-width: 520px; width: 100%; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.3); }
        h1 { font-size: 22px; color: #166534; margin-bottom: 12px; }
        ul { list-style: none; margin: 20px 0; padding: 0; }
        li { padding: 10px 14px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
        .btn { display: block; text-align: center; background: #2563eb; color: white; text-decoration: none; padding: 14px; border-radius: 8px; font-weight: bold; font-size: 16px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="card">
        <h1>🎉 Backend Berhasil Di-Patch!</h1>
        <p style="color:#64748b; font-size:14px;">Sekarang server membaca SSL Cloudflare dengan benar (HTTPS).</p>
        <ul>
            <?php foreach ($results as $r): ?>
                <li><?= $r ?></li>
            <?php endforeach; ?>
        </ul>
        <a href="https://sk0011jb6j.skipper.my.id/index.php/login" class="btn">👉 Buka Login & Coba Lagi</a>
    </div>
</body>
</html>
