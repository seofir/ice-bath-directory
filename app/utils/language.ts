// Map of countries to their primary language codes
const countryLanguageMap: Record<string, string> = {
  'Israel': 'he',
  'USA': 'en',
  'UK': 'en',
  'France': 'fr',
  'Germany': 'de',
  'Spain': 'es',
  'Italy': 'it',
  'Japan': 'ja',
  // Add more countries and language codes as needed
};

// Map of language codes to their reading direction
const languageDirectionMap: Record<string, 'ltr' | 'rtl'> = {
  'he': 'rtl', // Hebrew
  'ar': 'rtl', // Arabic
  'ur': 'rtl', // Urdu
  'fa': 'rtl', // Persian
  // All other languages default to 'ltr'
};

export function getLanguageForCountry(countryName: string): string {
  return countryLanguageMap[countryName] || 'en';
}

export function getLanguageDirection(langCode: string): 'ltr' | 'rtl' {
  return languageDirectionMap[langCode] || 'ltr';
}

export function getCountrySlug(countryName: string): string {
  const langCode = getLanguageForCountry(countryName);
  return `${countryName.toLowerCase()}-${langCode}`;
}

export function parseCountrySlug(slug: string): { country: string; langCode: string } {
  const parts = slug.split('-');
  if (parts.length < 2) {
    // Default fallback if slug format is incorrect
    return { country: slug, langCode: 'en' };
  }
  
  const langCode = parts[parts.length - 1];
  // If the last part is a valid 2-letter language code, extract it
  if (langCode.length === 2) {
    const country = parts.slice(0, parts.length - 1).join('-');
    return { country, langCode };
  }
  
  // If no valid language code is found, assume the whole slug is the country
  return { country: slug, langCode: 'en' };
}
