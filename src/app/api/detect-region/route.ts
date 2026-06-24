import { NextRequest, NextResponse } from 'next/server';

// Map country codes to regions
function countryToRegion(countryCode: string): 'americas' | 'europe' | 'middle_east' | 'se_asia' | 'americas' {
  const code = countryCode.toUpperCase();

  // Americas
  const americasCountries = ['US', 'CA', 'MX', 'BR', 'AR', 'CL', 'CO', 'PE', 'VE', 'EC', 'UY', 'PY', 'BO', 'GY', 'SR', 'GF', 'PM', 'GL', 'BQ', 'AW', 'CW', 'SX', 'TC', 'BB', 'DM', 'GD', 'LC', 'VC', 'AG', 'KN', 'BS', 'JM', 'HT', 'DO', 'PR', 'TT', 'BZ', 'GT', 'SV', 'HN', 'NI', 'CR', 'PA', 'CU'];
  if (americasCountries.includes(code)) return 'americas';

  // Europe
  const europeCountries = ['GB', 'DE', 'FR', 'IT', 'ES', 'PT', 'NL', 'BE', 'AT', 'CH', 'SE', 'NO', 'DK', 'FI', 'IE', 'PL', 'CZ', 'HU', 'RO', 'BG', 'HR', 'SK', 'SI', 'EE', 'LV', 'LT', 'LU', 'MT', 'CY', 'GR', 'IS', 'LI', 'MC', 'SM', 'VA', 'AD', 'ME', 'MK', 'AL', 'RS', 'BA', 'XK', 'MD', 'UA', 'BY', 'RU'];
  if (europeCountries.includes(code)) return 'europe';

  // Middle East (GCC + wider MENA)
  const middleEastCountries = ['SA', 'AE', 'KW', 'BH', 'QA', 'OM', 'IQ', 'IR', 'JO', 'LB', 'SY', 'PS', 'YE', 'EG', 'LY', 'TN', 'DZ', 'MA', 'SD', 'MR', 'DJ', 'SO', 'KM'];
  if (middleEastCountries.includes(code)) return 'middle_east';

  // Southeast Asia
  const seAsiaCountries = ['SG', 'MY', 'TH', 'ID', 'PH', 'VN', 'MM', 'KH', 'LA', 'BN', 'TL'];
  if (seAsiaCountries.includes(code)) return 'se_asia';

  // Default: Americas for unknown
  return 'americas';
}

export async function GET(request: NextRequest) {
  // Try to get country from various headers (set by CDNs/proxies)
  const country =
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('cf-ipcountry') ||
    request.headers.get('x-geo-country') ||
    request.headers.get('x-country-code') ||
    '';

  // If we have a country code from headers, use it
  if (country && country.length === 2) {
    const region = countryToRegion(country);
    return NextResponse.json({
      country: country,
      region: region,
      source: 'header'
    });
  }

  // Fallback: try ip-api.com free API (no key required, 45 req/min)
  // In production, use a paid service or edge middleware
  const forwarded = request.headers.get('x-forwarded-for');
  const clientIp = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

  // Don't geo-locate localhost/private IPs
  if (clientIp === '127.0.0.1' || clientIp.startsWith('10.') || clientIp.startsWith('192.168.') || clientIp === '::1') {
    return NextResponse.json({
      country: 'US',
      region: 'americas',
      source: 'default'
    });
  }

  try {
    const geoRes = await fetch(`http://ip-api.com/json/${clientIp}?fields=countryCode`, {
      signal: AbortSignal.timeout(3000),
    });
    if (geoRes.ok) {
      const data = await geoRes.json();
      if (data.countryCode) {
        const region = countryToRegion(data.countryCode);
        return NextResponse.json({
          country: data.countryCode,
          region: region,
          source: 'ip-api'
        });
      }
    }
  } catch {
    // Geo API failed, return default
  }

  return NextResponse.json({
    country: 'US',
    region: 'americas',
    source: 'default'
  });
}
