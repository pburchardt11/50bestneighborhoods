// lib/affiliate.js
// Deep links for hotel booking and POI discovery. Affiliate IDs are optional
// environment variables; when absent, we fall through to the vendor's public URL.

const BOOKING_AID = process.env.NEXT_PUBLIC_BOOKING_AID || '';
const GYG_PARTNER_ID = process.env.NEXT_PUBLIC_GYG_PARTNER_ID || '';
const VIATOR_PID = process.env.NEXT_PUBLIC_VIATOR_PID || '';

// Booking.com — hotels in the neighborhood
export function getBookingUrl(neighborhood, city, country) {
  const q = encodeURIComponent(`${neighborhood} ${city} ${country}`);
  const base = `https://www.booking.com/searchresults.html?ss=${q}`;
  return BOOKING_AID ? `${base}&aid=${BOOKING_AID}` : base;
}

// GetYourGuide — experiences, tours and activities
export function getGYGUrl(neighborhood, city) {
  const q = encodeURIComponent(`${neighborhood} ${city}`);
  const base = `https://www.getyourguide.com/s/?q=${q}`;
  return GYG_PARTNER_ID ? `${base}&partner_id=${GYG_PARTNER_ID}` : base;
}

// Viator — tours (backup experience provider)
export function getViatorUrl(neighborhood, city) {
  const q = encodeURIComponent(`${neighborhood} ${city}`);
  const base = `https://www.viator.com/searchResults/all?text=${q}`;
  return VIATOR_PID ? `${base}&pid=${VIATOR_PID}&mcid=42383&medium=link` : base;
}

// Google Maps — categorical discovery within a neighborhood
export function getGoogleMapsSearchUrl(query, lat, lon) {
  const q = encodeURIComponent(query);
  if (lat && lon) {
    return `https://www.google.com/maps/search/${q}/@${lat},${lon},15z`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

// Curated POI category links for a neighborhood
export function getPOILinks(neighborhood, city, coords) {
  const lat = coords?.lat;
  const lon = coords?.lon;
  const base = `${neighborhood} ${city}`;
  return [
    { category: 'Restaurants',  icon: '🍽️', url: getGoogleMapsSearchUrl(`best restaurants in ${base}`, lat, lon) },
    { category: 'Cafés',         icon: '☕',  url: getGoogleMapsSearchUrl(`specialty coffee ${base}`,    lat, lon) },
    { category: 'Bars & Clubs',  icon: '🍸', url: getGoogleMapsSearchUrl(`cocktail bars ${base}`,       lat, lon) },
    { category: 'Shops',         icon: '🛍️', url: getGoogleMapsSearchUrl(`independent shops ${base}`,    lat, lon) },
    { category: 'Museums & Art', icon: '🖼️', url: getGoogleMapsSearchUrl(`museums galleries ${base}`,    lat, lon) },
    { category: 'Hotels',        icon: '🛏️', url: getBookingUrl(neighborhood, city, '') },
  ];
}

// Google Maps pinpoint link for the neighborhood itself
export function getGoogleMapsPinUrl(neighborhood, city, country, coords) {
  if (coords?.lat && coords?.lon) {
    return `https://www.google.com/maps/?q=${coords.lat},${coords.lon}`;
  }
  return getGoogleMapsSearchUrl(`${neighborhood} ${city} ${country}`);
}
