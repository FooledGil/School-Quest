<?php
/**
 * School-Quest Storage Mirror & Diagnostic Utility
 * Dapat diakses via:
 * 1. https://sk0011jb6j.skipper.my.id/school_quest_deploy/public/sync-storage.php
 * 2. https://sk0011jb6j.skipper.my.id/sync-storage.php
 * 3. https://sk0011jb6j.skipper.my.id/index.php/sync-storage
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

// 1. Salin file ini sendiri ke root web agar url sk0011jb6j.skipper.my.id/sync-storage.php langsung terbuka
$rootSyncScript = $rootWebDir . '/sync-storage.php';
if (!file_exists($rootSyncScript) || filesize($rootSyncScript) !== filesize(__FILE__)) {
    @copy(__FILE__, $rootSyncScript);
    @chmod($rootSyncScript, 0666);
}

// Cari path source
$localPublicStorage = null;
$possiblePaths = [
    $deployDir . '/storage/app/public',
    $currentDir . '/../storage/app/public',
    $rootWebDir . '/school_quest_deploy/storage/app/public',
    $currentDir . '/storage/app/public',
    dirname(__DIR__) . '/storage/app/public',
];

foreach ($possiblePaths as $p) {
    if (is_dir($p)) {
        $localPublicStorage = realpath($p);
        break;
    }
}

// Cari path destination
$rootStorage = null;
$possibleRoots = [
    $rootWebDir . '/storage',
    dirname($deployDir) . '/storage',
    $currentDir . '/storage',
];

foreach ($possibleRoots as $r) {
    if (is_dir($r) || is_dir(dirname($r))) {
        $rootStorage = $r;
        break;
    }
}

$results = [];
$diagnostic = [];

if (!$localPublicStorage) {
    $results[] = "❌ Direktori local public storage tidak ditemukan.";
} else {
    $results[] = "📁 Source (Laravel Storage): <code>{$localPublicStorage}</code>";
    $results[] = "📁 Destination (Nginx Web Root): <code>{$rootStorage}</code>";

    @mkdir($rootStorage, 0777, true);
    @mkdir($rootStorage . '/quest_proofs', 0777, true);
    @mkdir($rootStorage . '/avatars', 0777, true);
    @chmod($rootStorage, 0777);
    @chmod($rootStorage . '/quest_proofs', 0777);
    @chmod($rootStorage . '/avatars', 0777);

    // Sync folders
    $folders = ['quest_proofs', 'avatars'];

    foreach ($folders as $folder) {
        $srcDir = $localPublicStorage . '/' . $folder;
        $dstDir = $rootStorage . '/' . $folder;

        $srcFiles = is_dir($srcDir) ? array_diff(scandir($srcDir), ['.', '..']) : [];
        $dstFiles = is_dir($dstDir) ? array_diff(scandir($dstDir), ['.', '..']) : [];

        $syncedCount = 0;
        foreach ($srcFiles as $file) {
            $srcFile = $srcDir . '/' . $file;
            $dstFile = $dstDir . '/' . $file;

            if (is_file($srcFile)) {
                if (!file_exists($dstFile) || filesize($dstFile) !== filesize($srcFile)) {
                    @copy($srcFile, $dstFile);
                    @chmod($dstFile, 0666);
                    $syncedCount++;
                }
            }
        }

        // Reverse sync jika ada di web root tapi belum di local
        $reverseCount = 0;
        foreach ($dstFiles as $file) {
            $srcFile = $srcDir . '/' . $file;
            $dstFile = $dstDir . '/' . $file;
            if (is_file($dstFile) && !file_exists($srcFile)) {
                @copy($dstFile, $srcFile);
                @chmod($srcFile, 0666);
                $reverseCount++;
            }
        }

        $currentDstFiles = is_dir($dstDir) ? array_diff(scandir($dstDir), ['.', '..']) : [];
        $results[] = "✅ Folder <b>{$folder}</b>: Total <b>" . count($currentDstFiles) . "</b> berkas aktif di web root ({$syncedCount} disalin dari local, {$reverseCount} disinkronkan balik).";

        $diagnostic[$folder] = array_values($currentDstFiles);
    }
}

// 2. Cek Database untuk verifikasi status bukti quest
$dbSubmissions = [];
$envFile = $deployDir . '/.env';
if (file_exists($envFile)) {
    $envContent = file_get_contents($envFile);
    preg_match('/DB_HOST=(.*)/', $envContent, $mHost);
    preg_match('/DB_DATABASE=(.*)/', $envContent, $mDb);
    preg_match('/DB_USERNAME=(.*)/', $envContent, $mUser);
    preg_match('/DB_PASSWORD=(.*)/', $envContent, $mPass);

    $dbHost = trim($mHost[1] ?? '127.0.0.1');
    $dbName = trim($mDb[1] ?? 'school_quest');
    $dbUser = trim($mUser[1] ?? 'root');
    $dbPass = trim($mPass[1] ?? '');

    try {
        $pdo = new PDO("mysql:host={$dbHost};dbname={$dbName};charset=utf8mb4", $dbUser, $dbPass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);

        $stmt = $pdo->query("SELECT id, user_id, quest_id, proof_text, proof_image, status, completed_at FROM quest_completions ORDER BY id DESC LIMIT 5");
        $dbSubmissions = $stmt->fetchAll();
    } catch (Exception $e) {
        $results[] = "⚠️ Koneksi DB untuk pengecekan data: " . htmlspecialchars($e->getMessage());
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SchoolQuest - Sinkronisasi & Diagnostik Bukti Quest</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0b0f17; color: #e2e8f0; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; padding: 24px; }
        .card { background: #131c31; border: 1px solid #222e46; border-radius: 16px; padding: 32px; max-width: 720px; width: 100%; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.6); }
        h1 { font-size: 20px; color: #f59e0b; margin-top: 0; margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }
        p { color: #94a3b8; font-size: 14px; margin-bottom: 20px; line-height: 1.5; }
        ul { list-style: none; margin: 0 0 24px 0; padding: 0; }
        li { padding: 10px 14px; border-bottom: 1px solid #1e293b; font-size: 13px; }
        code { background: #070b14; padding: 2px 6px; border-radius: 4px; color: #38bdf8; font-size: 12px; }
        .table-wrap { overflow-x: auto; margin: 16px 0 24px 0; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #222e46; }
        th { background: #0b0f17; color: #f59e0b; }
        .badge-ok { background: #064e3b; color: #34d399; padding: 2px 8px; border-radius: 6px; font-weight: bold; }
        .badge-fail { background: #881337; color: #fb7185; padding: 2px 8px; border-radius: 6px; font-weight: bold; }
        .btn { display: block; text-align: center; background: linear-gradient(135deg, #f59e0b, #d97706); color: #0b0f17; text-decoration: none; padding: 14px; border-radius: 8px; font-weight: bold; font-size: 15px; }
        .btn:hover { opacity: 0.9; }
    </style>
</head>
<body>
    <div class="card">
        <h1>⚡ Status Sinkronisasi Bukti Quest</h1>
        <p>Halaman ini menyalin dan menyelaraskan seluruh file bukti quest & avatar agar langsung disajikan oleh web server Nginx tanpa 404.</p>
        
        <ul>
            <?php foreach ($results as $res): ?>
                <li><?= $res ?></li>
            <?php endforeach; ?>
        </ul>

        <?php if (!empty($dbSubmissions)): ?>
            <h3 style="font-size: 14px; color: #38bdf8; margin: 20px 0 8px 0;">🔍 5 Kiriman Quest Terakhir di Database:</h3>
            <div class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Status</th>
                            <th>Proof Text</th>
                            <th>Proof Image</th>
                            <th>Status File di Web</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($dbSubmissions as $sub): ?>
                            <?php 
                                $cleanPath = ltrim(preg_replace('#^/storage/#', '', $sub['proof_image'] ?? ''), '/');
                                $fullUrl = $sub['proof_image'] ? 'https://sk0011jb6j.skipper.my.id/storage/' . $cleanPath : null;
                                $existsOnDisk = $cleanPath && file_exists($rootStorage . '/' . $cleanPath);
                            ?>
                            <tr>
                                <td>#<?= $sub['id'] ?></td>
                                <td><b><?= $sub['status'] ?></b></td>
                                <td><?= htmlspecialchars(mb_substr($sub['proof_text'] ?? '-', 0, 25)) ?></td>
                                <td><code><?= htmlspecialchars($sub['proof_image'] ?? '-') ?></code></td>
                                <td>
                                    <?php if (!$sub['proof_image']): ?>
                                        <span style="color:#64748b;">(Teks saja)</span>
                                    <?php elseif ($existsOnDisk): ?>
                                        <a href="<?= $fullUrl ?>" target="_blank" class="badge-ok">Ada di Web (Klik Cek)</a>
                                    <?php else: ?>
                                        <span class="badge-fail">File Hilang di Disk</span>
                                    <?php endif; ?>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        <?php endif; ?>

        <a href="https://sk0011jb6j.skipper.my.id/index.php/admin/validations" class="btn">👉 Buka Halaman Validasi Admin Sekarang</a>
    </div>
</body>
</html>
