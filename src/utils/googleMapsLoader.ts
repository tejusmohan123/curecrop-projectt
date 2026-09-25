import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

let isInitialized = false;

export function initGoogleMaps() {
  if (!isInitialized && apiKey) {
    setOptions({
      key: apiKey,
      v: 'weekly',
    });
    isInitialized = true;
  }
}

export async function loadMapsLibrary() {
  initGoogleMaps();
  const mapsLib = await importLibrary('maps');
  return mapsLib;
}

export async function loadMarkerLibrary() {
  initGoogleMaps();
  const markerLib = await importLibrary('marker');
  return markerLib;
}

export async function loadPlacesLibrary() {
  initGoogleMaps();
  const placesLib = await importLibrary('places');
  return placesLib;
}

export async function loadGeocodingLibrary() {
  initGoogleMaps();
  const geocodingLib = await importLibrary('geocoding');
  return geocodingLib;
}

export function isGoogleMapsConfigured(): boolean {
  return Boolean(apiKey && apiKey.trim().length > 0);
}
