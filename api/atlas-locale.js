'use strict';

// Vercel supplies this two-letter country code from the connection's public IP.
// The client only receives a language code. The regional default is never
// written to the storage used for a visitor's explicit language preference.
const russianDefaults = new Set(['AM', 'AZ', 'BY', 'KZ', 'RU', 'TJ', 'TM', 'UZ']);

function regionalLanguage(country) {
  if (country === 'KG') return 'ky';
  // Moldova's announced CIS withdrawal takes effect on 8 April 2027.
  if (country === 'MD' && Date.now() < Date.UTC(2027, 3, 8)) return 'ru';
  return russianDefaults.has(country) ? 'ru' : 'en';
}

module.exports = function atlasLocale(req, res) {
  const headers = {
    'Cache-Control': 'private, no-store',
    'Vary': 'X-Vercel-IP-Country',
    'Content-Type': 'application/javascript; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
  };
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { ...headers, Allow: 'GET, HEAD' });
    return res.end();
  }
  const language = regionalLanguage(req.headers['x-vercel-ip-country']);
  res.writeHead(200, headers);
  res.end(req.method === 'HEAD' ? undefined : 'globalThis.chronographRegionalLanguage=' + JSON.stringify(language) + ';');
};
