<?php
declare(strict_types=1);

header('Content-Type: application/json');
header('Cache-Control: no-store, no-cache');

/**
 * Returns the first public IP from a comma-separated X-Forwarded-For value.
 */
function firstPublicIp(string $header): ?string {
    foreach (explode(',', $header) as $ip) {
        $ip = trim($ip);
        if (filter_var($ip, FILTER_VALIDATE_IP,
                FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
            return $ip;
        }
    }
    return null;
}

/**
 * Resolves the real client IP, preferring public IPs over private/reserved ones.
 */
function getClientIp(): ?string {
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip = firstPublicIp($_SERVER['HTTP_X_FORWARDED_FOR']);
        if ($ip) return $ip;
    }
    foreach (['HTTP_X_REAL_IP', 'REMOTE_ADDR'] as $key) {
        if (!empty($_SERVER[$key])) {
            $ip = trim($_SERVER[$key]);
            if (filter_var($ip, FILTER_VALIDATE_IP)) return $ip;
        }
    }
    return null;
}

/**
 * Calls ipapi.co with a hard 1s timeout.
 * Free tier: 1,000 req/day. For higher traffic, use Cloudflare proxy or MaxMind GeoLite2.
 * Returns a 2-letter country code or null on any failure.
 */
function lookupCountryByIp(string $ip): ?string {
    $url = 'https://ipapi.co/' . rawurlencode($ip) . '/country/';
    $ctx = stream_context_create([
        'http' => [
            'method'        => 'GET',
            'timeout'       => 1.0,
            'header'        => "User-Agent: PHP\r\n",
            'ignore_errors' => true,
        ],
        'ssl' => ['verify_peer' => true],
    ]);
    $body = @file_get_contents($url, false, $ctx);
    if ($body === false) return null;
    $code = strtoupper(trim($body));
    return preg_match('/^[A-Z]{2}$/', $code) ? $code : null;
}

/**
 * Normalises any country code to 'US', 'CA', or null.
 * Fail-closed: anything outside US/CA → null → site defaults to CA version.
 */
function normaliseCountry(?string $code): ?string {
    if ($code === 'US') return 'US';
    if ($code === 'CA') return 'CA';
    return null;
}

// ── 1. CDN / reverse-proxy headers (zero extra latency in production) ──────────
foreach ([
    'HTTP_CF_IPCOUNTRY',              // Cloudflare
    'HTTP_X_COUNTRY',                 // Netlify
    'HTTP_X_VERCEL_IP_COUNTRY',       // Vercel
    'HTTP_CLOUDFRONT_VIEWER_COUNTRY', // AWS CloudFront
    'HTTP_X_APPENGINE_COUNTRY',       // Google App Engine
] as $h) {
    if (empty($_SERVER[$h])) continue;
    $code = strtoupper(trim($_SERVER[$h]));
    if ($code === 'XX') continue;  // Cloudflare sentinel for unknown
    if (preg_match('/^[A-Z]{2}$/', $code)) {
        echo json_encode(['country' => normaliseCountry($code)]);
        exit;
    }
}

// ── 2. IP-based fallback (≤ 1 s timeout, fail-closed on any error) ───────────
$ip      = getClientIp();
$country = $ip ? lookupCountryByIp($ip) : null;
echo json_encode(['country' => normaliseCountry($country)]);
