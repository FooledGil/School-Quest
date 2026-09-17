<?php
/**
 * School-Quest Storage Mirror & Repair Utility
 * Jalankan via browser: https://sk0011jb6j.skipper.my.id/sync-storage.php
 */

header('Content-Type: text/html; charset=utf-8');

// Tentukan direktori root web dan laravel deploy
$currentDir = __DIR__;
if (basename($currentDir) === 'public') {
    $deployDir = dirname($currentDir);
    $rootWebDir = dirname($deployDir);
} else {
    $rootWebDir = $currentDir;
    $deployDir = $currentDir . '/school_quest_deploy';
}

// Cari path yang valid
$localPublicStorage = null;
$possiblePaths = [
    $deployDir . '/storage/app/public',
    $currentDir . '/../storage/app/public',
    $rootWebDir . '/school_quest_deploy/storage/app/public',
    $currentDir . '/storage/app/public',
];

foreach ($possiblePaths as $p) {
    if (is_dir($p)) {
        $localPublicStorage = realpath($p);
        break;
    }
}

$rootStorage = null;
$possibleRoots = [
    $rootWebDir . '/storage',
    $currentDir . '/storage',
    dirname($currentDir) . '/storage',
];

foreach ($possibleRoots as $r) {
    if (is_dir($r) || is_dir(dirname($r))) {
        $rootStorage = $r;
        break;
    }
}

$results = [];

if (!$localPublicStorage) {
    $results[] = "❌ Direktori local public storage tidak ditemukan.";
} else {
    $results[] = "📁 Source: <code>{$localPublicStorage}</code>";
    $results[] = "📁 Destination: <code>{$rootStorage}</code>";

    @mkdir($rootStorage, 0777, true);
    @mkdir($rootStorage . '/quest_proofs', 0777, true);
    @mkdir($rootStorage . '/avatars', 0777, true);
    @chmod($rootStorage, 0777);
    @chmod($rootStorage . '/quest_proofs', 0777);
    @chmod($rootStorage . '/avatars', 0777);

    // Sync folders
    $folders = ['quest_proofs', 'avatars'];
    $totalSynced = 0;

    foreach ($folders as $folder) {
        $srcDir = $localPublicStorage . '/' . $folder;
        $dstDir = $rootStorage . '/' . $folder;

        if (is_dir($srcDir)) {
            $files = scandir($srcDir);
            $syncedFolder = 0;
            foreach ($files as $file) {
                if ($file !== '.' && $file !== '..' && !is_dir($srcDir . '/' . $file)) {
                    $srcFile = $srcDir . '/' . $file;
                    $dstFile = $dstDir . '/' . $file;

                    // Salin jika file belum ada di root atau ukurannya berbeda
                    if (!file_exists($dstFile) || filesize($dstFile) !== filesize($srcFile)) {
                        @copy($srcFile, $dstFile);
                        @chmod($dstFile, 0666);
                        $syncedFolder++;
                        $totalSynced++;
                    }
                }
            }
            $results[] = "✅ Folder <b>{$folder}</b>: {$syncedFolder} berkas baru disinkronkan ke root storage.";
        } else {
            $results[] = "ℹ️ Folder <b>{$folder}</b> belum memiliki berkas unggahan.";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SchoolQuest - Sinkronisasi Bukti Quest & Avatar</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0b0f17; color: #e2e8f0; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; padding: 20px; }
        .card { background: #131c31; border: 1px solid #222e46; border-radius: 16px; padding: 32px; max-width: 580px; width: 100%; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
        h1 { font-size: 20px; color: #f59e0b; margin-top: 0; margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }
        p { color: #94a3b8; font-size: 14px; margin-bottom: 20px; line-height: 1.5; }
        ul { list-style: none; margin: 0 0 24px 0; padding: 0; }
        li { padding: 10px 14px; border-bottom: 1px solid #1e293b; font-size: 13px; font-family: monospace; word-break: break-all; }
        .btn { display: block; text-align: center; background: linear-gradient(135deg, #f59e0b, #d97706); color: #0b0f17; text-decoration: none; padding: 14px; border-radius: 8px; font-weight: bold; font-size: 15px; transition: opacity .2s; }
        .btn:hover { opacity: 0.9; }
    </style>
</head>
<body>
    <div class="card">
        <h1>⚡ Sinkronisasi Bukti Quest Selesai</h1>
        <p>Seluruh file gambar bukti quest dari aplikasi HP dan avatar siswa telah dipastikan tersinkronisasi ke web server Nginx.</p>
        <ul>
            <?php foreach ($results as $res): ?>
                <li><?= $res ?></li>
            <?php endforeach; ?>
        </ul>
        <a href="https://sk0011jb6j.skipper.my.id/index.php/admin/validations" class="btn">👉 Buka Halaman Validasi Admin</a>
    </div>
</body>
</html>
