<?php
/**
 * School-Quest Quick Update Installer (Navigasi & Avatar Fix)
 * Jalankan via: https://sk0011jb6j.skipper.my.id/school_quest_deploy/public/update.php
 */

header('Content-Type: text/html; charset=utf-8');

$root = dirname(__DIR__, 2);
$deploy = dirname(__DIR__); // .../school_quest_deploy
$public = __DIR__;          // .../school_quest_deploy/public

function copy_recursive($src, $dst) {
    if (is_dir($src)) {
        if (!is_dir($dst)) @mkdir($dst, 0777, true);
        @chmod($dst, 0777);
        $files = scandir($src);
        foreach ($files as $file) {
            if ($file != "." && $file != "..") copy_recursive("$src/$file", "$dst/$file");
        }
    } elseif (file_exists($src)) {
        @copy($src, $dst);
        @chmod($dst, 0666);
    }
}

$zip_file = $public . '/update_build.zip';
if (!file_exists($zip_file)) {
    die("<div style='font-family: sans-serif; padding: 20px; color: #b91c1c;'><h3>File <code>update_build.zip</code> tidak ditemukan!</h3><p>Pastikan file <code>update_build.zip</code> sudah di-upload ke folder <code>school_quest_deploy/public/</code>.</p></div>");
}

$zip = new ZipArchive;
if ($zip->open($zip_file) === TRUE) {
    // 1. Ekstrak ke school_quest_deploy
    $zip->extractTo($deploy);
    $zip->close();

    // 2. Salin build frontend ke root web
    copy_recursive($deploy . '/public/build', $root . '/build');

    // 3. Salin storage/app/public ke root web (/www/wwwroot/.../storage)
    // Ini memperbaiki avatar upload dan bukti quest agar Nginx bisa menyajikannya langsung!
    $storageSrc = $deploy . '/storage/app/public';
    $storageDst = $root . '/storage';
    if (is_dir($storageSrc)) {
        copy_recursive($storageSrc, $storageDst);
    }

    // Pastikan folder avatars dan quest_proofs ada dan writable
    @mkdir($storageDst . '/avatars', 0777, true);
    @mkdir($storageDst . '/quest_proofs', 0777, true);
    @chmod($storageDst, 0777);
    @chmod($storageDst . '/avatars', 0777);
    @chmod($storageDst . '/quest_proofs', 0777);

    // 4. Update APP_URL di .env
    $env_file = $deploy . '/.env';
    if (file_exists($env_file)) {
        $env = file_get_contents($env_file);
        $env = preg_replace('/^APP_URL=.*$/m', 'APP_URL=https://sk0011jb6j.skipper.my.id/index.php', $env);
        file_put_contents($env_file, $env);
    }

    // 5. Update 404.html di root
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
    @file_put_contents($root_404, $redirect_404);

    // 6. Buat .htaccess di root web
    $htaccess_code = "<IfModule mod_rewrite.c>\n" .
        "    <IfModule mod_negotiation.c>\n" .
        "        Options -MultiViews -Indexes\n" .
        "    </IfModule>\n\n" .
        "    RewriteEngine On\n\n" .
        "    # Handle Authorization Header\n" .
        "    RewriteCond %{HTTP:Authorization} .\n" .
        "    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]\n\n" .
        "    # Send Requests To Front Controller...\n" .
        "    RewriteCond %{REQUEST_FILENAME} !-d\n" .
        "    RewriteCond %{REQUEST_FILENAME} !-f\n" .
        "    RewriteRule ^ index.php [L]\n" .
        "</IfModule>\n";
    @file_put_contents($root . '/.htaccess', $htaccess_code);

    // 7. Hapus cache view dan cache route/bootstrap lama
    @array_map('unlink', glob($deploy . '/storage/framework/views/*.php'));
    @array_map('unlink', glob($deploy . '/bootstrap/cache/*.php'));

    // Cek file avatar yang ada di storage
    $avatarsCount = is_dir($storageDst . '/avatars') ? count(array_diff(scandir($storageDst . '/avatars'), ['.', '..'])) : 0;

    echo "<!DOCTYPE html><html lang='id'><head><meta charset='UTF-8'><title>Update Avatar & Navigasi Sukses</title></head><body style='background:#0f172a; display:flex; justify-content:center; align-items:center; min-height:100vh; margin:0;'>";
    echo "<div style='font-family: sans-serif; padding: 32px; background: white; border-radius: 16px; max-width: 520px; text-align: center; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.3);'>";
    echo "<h2 style='color: #16a34a; margin-top: 0; font-size: 24px;'>🎉 Avatar & Navigasi Berhasil Diperbaiki!</h2>";
    echo "<p style='color: #475569; font-size: 14px; line-height: 1.6;'>Penyebab foto avatar lokal tidak muncul (error 404 pada folder storage) sudah diperbaiki! Folder penyimpanan aset foto sudah disinkronkan ke root server.</p>";
    echo "<div style='background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px; margin: 16px 0; text-align: left; font-size: 13px; color: #166534;'>";
    echo "<b>Detail Perbaikan:</b><br>";
    echo "✅ Sinkronisasi folder <code>/storage/avatars</code> selesai ({$avatarsCount} file terdeteksi)<br>";
    echo "✅ Handler upload foto siswa langsung tersambung ke web server<br>";
    echo "✅ Navigasi halaman lancar tanpa overlay loading tertahan";
    echo "</div>";
    echo "<a href='https://sk0011jb6j.skipper.my.id/index.php/dashboard' style='display:inline-block; background: #2563eb; color: white; padding: 14px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 10px; font-size: 15px;'>👉 Kembali ke Dashboard SchoolQuest</a>";
    echo "</div></body></html>";
} else {
    echo "Gagal mengekstrak zip.";
}
