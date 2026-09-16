<?php
/**
 * School-Quest Asset & URL Fixer (Pure PHP, No Symlink Required)
 * Jalankan via: https://sk0011jb6j.skipper.my.id/school_quest_deploy/public/fix-assets.php
 */

header('Content-Type: text/html; charset=utf-8');

$root = dirname(__DIR__, 2); // /www/wwwroot/sk0011jb6j.skipper.my.id
$public = __DIR__;          // .../school_quest_deploy/public

function copy_recursive($src, $dst) {
    if (is_dir($src)) {
        if (!is_dir($dst)) {
            @mkdir($dst, 0755, true);
        }
        $files = scandir($src);
        foreach ($files as $file) {
            if ($file != "." && $file != "..") {
                copy_recursive("$src/$file", "$dst/$file");
            }
        }
    } elseif (file_exists($src)) {
        @copy($src, $dst);
    }
}

$results = [];

// 1. Copy Aset (build, fonts, images, favicon.ico) langsung ke root web
$assets = ['build', 'fonts', 'images', 'favicon.ico', 'robots.txt'];

foreach ($assets as $item) {
    $src = $public . '/' . $item;
    $dst = $root . '/' . $item;

    if (file_exists($src)) {
        copy_recursive($src, $dst);
        $results[] = "✅ Berhasil menyalin <b>{$item}</b> ke root folder";
    }
}

// 2. Buat root index.php
$root_index = $root . '/index.php';
$index_code = "<?php\nrequire __DIR__ . '/school_quest_deploy/public/index.php';\n";
file_put_contents($root_index, $index_code);
$results[] = "✅ Root <code>index.php</code> berhasil disiapkan";

// 3. Perbaiki 404.html agar Nginx otomatis mengarahkan ke index.php
$root_404 = $root . '/404.html';
$redirect_404 = '<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>SchoolQuest</title>
    <script>
        var p = window.location.pathname;
        var s = window.location.search;
        var h = window.location.hash;
        if (!p.startsWith("/index.php")) {
            window.location.replace("/index.php" + p + s + h);
        }
    </script>
</head>
<body style="font-family: -apple-system, sans-serif; text-align: center; padding-top: 60px; background: #0f172a; color: #94a3b8;">
    <p>Mengarahkan...</p>
</body>
</html>';

file_put_contents($root_404, $redirect_404);
$results[] = "✅ Handler Nginx 404 berhasil diperbarui (agar URL seperti /login otomatis terbaca)";

?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Perbaikan Aset Selesai</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #334155; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; }
        .card { background: white; border-radius: 16px; padding: 32px; max-width: 550px; width: 100%; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.2); }
        h1 { font-size: 22px; color: #1e293b; margin-bottom: 12px; }
        ul { list-style: none; margin: 16px 0; padding: 0; }
        li { padding: 8px 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
        .btn { display: block; text-align: center; background: #16a34a; color: white; text-decoration: none; padding: 14px; border-radius: 8px; font-weight: bold; font-size: 16px; margin-top: 20px; transition: background .2s; }
        .btn:hover { background: #15803d; }
    </style>
</head>
<body>
    <div class="card">
        <h1>🎉 Semua Aset Berhasil Disalin!</h1>
        <ul>
            <?php foreach ($results as $res): ?>
                <li><?= $res ?></li>
            <?php endforeach; ?>
        </ul>
        <a href="https://sk0011jb6j.skipper.my.id/index.php/login" class="btn" target="_blank">🚀 Buka Website SchoolQuest Sekarang</a>
    </div>
</body>
</html>
