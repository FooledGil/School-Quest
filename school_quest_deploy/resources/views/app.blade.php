<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="SchoolQuest - Level Up Your School Life! Gamifikasi produktivitas sekolah.">

    <title inertia>{{ config('app.name', 'SchoolQuest') }}</title>

    <!-- Self-hosted Fonts (eliminates render-blocking Google Fonts request) -->
    <link rel="preload" href="/fonts/Outfit-Variable-Latin.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="/fonts/PressStart2P-Latin.woff2" as="font" type="font/woff2" crossorigin>

    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    @inertiaHead
</head>
<body class="antialiased">
    @inertia
</body>
</html>
