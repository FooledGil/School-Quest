<?php
/**
 * School-Quest Auto Installer & Database Importer
 * Akses via browser: https://sk0011jb6j.skipper.my.id/school_quest_deploy/public/import-db.php
 * atau: https://sk0011jb6j.skipper.my.id/import-db.php
 */

header('Content-Type: text/html; charset=utf-8');

$default_host = 'localhost';
$default_name = 'u_sk0011jb6j';
$default_user = 'u_sk0011jb6j';
$domain = 'https://sk0011jb6j.skipper.my.id';

// Cari file SQL di beberapa lokasi umum
$possible_sql_paths = [
    __DIR__ . '/school_quest_backup.sql',
    __DIR__ . '/../school_quest_backup.sql',
    __DIR__ . '/../../school_quest_backup.sql',
    dirname(__DIR__, 2) . '/school_quest_backup.sql'
];

$sql_path = null;
foreach ($possible_sql_paths as $p) {
    if (file_exists($p)) {
        $sql_path = $p;
        break;
    }
}

// Cari file .env
$possible_env_paths = [
    __DIR__ . '/../.env',
    __DIR__ . '/.env',
    __DIR__ . '/../../school_quest_deploy/.env',
    dirname(__DIR__, 2) . '/school_quest_deploy/.env'
];

$env_path = null;
foreach ($possible_env_paths as $p) {
    if (file_exists($p)) {
        $env_path = $p;
        break;
    }
}

$message = null;
$error = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $db_host = trim($_POST['db_host'] ?? 'localhost');
    $db_name = trim($_POST['db_name'] ?? '');
    $db_user = trim($_POST['db_user'] ?? '');
    $db_pass = trim($_POST['db_pass'] ?? '');

    if (empty($db_pass)) {
        $error = 'Password database tidak boleh kosong!';
    } elseif (!$sql_path) {
        $error = 'File <code>school_quest_backup.sql</code> tidak ditemukan di hosting! Pastikan sudah di-upload.';
    } else {
        try {
            // 1. Tes Koneksi Database
            $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
            ]);

            // 2. Import SQL
            $sql = file_get_contents($sql_path);
            $pdo->exec($sql);

            // 3. Update file .env jika ditemukan
            $env_updated = false;
            if ($env_path && file_exists($env_path)) {
                $envContent = file_get_contents($env_path);
                
                // Update DB credentials & APP_URL
                $replacements = [
                    '/^DB_HOST=.*$/m' => "DB_HOST={$db_host}",
                    '/^DB_DATABASE=.*$/m' => "DB_DATABASE={$db_name}",
                    '/^DB_USERNAME=.*$/m' => "DB_USERNAME={$db_user}",
                    '/^DB_PASSWORD=.*$/m' => "DB_PASSWORD=\"{$db_pass}\"",
                    '/^APP_URL=.*$/m' => "APP_URL={$domain}",
                    '/^APP_DEBUG=.*$/m' => "APP_DEBUG=true",
                ];
                
                $newEnv = preg_replace(array_keys($replacements), array_values($replacements), $envContent);
                file_put_contents($env_path, $newEnv);
                $env_updated = true;
            }

            // 4. Buat root index.php jika Nginx belum punya
            $root_index = dirname(__DIR__, 2) . '/index.php';
            if (!file_exists($root_index)) {
                $index_code = "<?php\nrequire __DIR__ . '/school_quest_deploy/public/index.php';\n";
                @file_put_contents($root_index, $index_code);
            }

            $message = "Sukses!";
        } catch (Exception $e) {
            $error = 'Koneksi database gagal: ' . $e->getMessage();
        }
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Setup Database School-Quest</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #334155; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; }
        .card { background: white; border-radius: 16px; padding: 32px; max-width: 520px; width: 100%; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.2); }
        .header { text-align: center; margin-bottom: 24px; }
        .header h1 { font-size: 24px; color: #1e293b; margin-bottom: 6px; }
        .header p { font-size: 14px; color: #64748b; }
        .alert-error { background: #fef2f2; border-left: 4px solid #ef4444; color: #991b1b; padding: 14px; border-radius: 8px; font-size: 14px; margin-bottom: 20px; }
        .alert-success { background: #f0fdf4; border-left: 4px solid #22c55e; color: #166534; padding: 18px; border-radius: 8px; font-size: 14px; margin-bottom: 20px; line-height: 1.5; }
        .form-group { margin-bottom: 16px; }
        label { display: block; font-size: 13px; font-weight: 600; color: #475569; margin-bottom: 6px; }
        input[type="text"], input[type="password"] { width: 100%; padding: 10px 14px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none; transition: border .2s; }
        input[type="text"]:focus, input[type="password"]:focus { border-color: #3b82f6; }
        .btn { width: 100%; background: #2563eb; color: white; padding: 12px; border: none; border-radius: 8px; font-weight: 600; font-size: 15px; cursor: pointer; transition: background .2s; margin-top: 10px; }
        .btn:hover { background: #1d4ed8; }
        .btn-link { display: inline-block; background: #16a34a; color: white; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; margin-top: 12px; }
        .badge { display: inline-block; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600; }
        .badge-found { background: #dcfce7; color: #15803d; }
        .badge-missing { background: #fee2e2; color: #b91c1c; }
        .status-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 20px; font-size: 13px; }
    </style>
</head>
<body>
    <div class="card">
        <div class="header">
            <h1>🎒 School-Quest Setup</h1>
            <p>Setup Database & Konfigurasi Otomatis</p>
        </div>

        <div class="status-box">
            <div>Status File Backup SQL: 
                <?php if ($sql_path): ?>
                    <span class="badge badge-found">✅ Ditemukan</span>
                <?php else: ?>
                    <span class="badge badge-missing">❌ school_quest_backup.sql Belum Ada</span>
                <?php endif; ?>
            </div>
        </div>

        <?php if ($error): ?>
            <div class="alert-error">
                <strong>Error:</strong> <?= htmlspecialchars($error) ?>
            </div>
        <?php endif; ?>

        <?php if ($message): ?>
            <div class="alert-success">
                <h3 style="font-size: 16px; margin-bottom: 8px;">🎉 Setup Berhasil 100%!</h3>
                <p>1. Semua tabel dan data database berhasil di-import.</p>
                <p>2. File <code>.env</code> sudah otomatis di-update dengan password kamu.</p>
                <p>3. Website sudah siap dibuka!</p>
                <br>
                <a href="<?= $domain ?>/school_quest_deploy/public/" class="btn-link" target="_blank">🚀 Buka Website School-Quest</a>
                <p style="margin-top: 12px; color: #dc2626; font-size: 12px; font-weight: 600;">*Demi keamanan, silakan hapus file <code>import-db.php</code> dan <code>school_quest_backup.sql</code> setelah mencoba website.</p>
            </div>
        <?php else: ?>
            <form method="POST">
                <div class="form-group">
                    <label>DB Host</label>
                    <input type="text" name="db_host" value="<?= htmlspecialchars($default_host) ?>" required>
                </div>
                <div class="form-group">
                    <label>DB Name</label>
                    <input type="text" name="db_name" value="<?= htmlspecialchars($default_name) ?>" required>
                </div>
                <div class="form-group">
                    <label>DB Username</label>
                    <input type="text" name="db_user" value="<?= htmlspecialchars($default_user) ?>" required>
                </div>
                <div class="form-group">
                    <label>DB Password (Salin dari Dashboard Skipper)</label>
                    <input type="password" name="db_pass" placeholder="Ketik atau paste password MySQL kamu" required autofocus>
                </div>
                <button type="submit" class="btn">⚡ Mulai Setup Database Otomatis</button>
            </form>
        <?php endif; ?>
    </div>
</body>
</html>
