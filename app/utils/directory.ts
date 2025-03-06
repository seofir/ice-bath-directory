import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import type { DirectoryListing, CityData, CountryData } from '../types/directory';

// Path to the data directories
const CITIES_DIR = path.join(process.cwd(), 'data', 'cities');
const COUNTRIES_DIR = path.join(process.cwd(), 'data', 'countries');

export function getCountryNames(): string[] {
  try {
    // Ensure the directory exists
    if (!fs.existsSync(COUNTRIES_DIR)) {
      console.warn('Countries directory does not exist:', COUNTRIES_DIR);
      return [];
    }
    
    return fs.readdirSync(COUNTRIES_DIR)
      .filter(file => {
        const stat = fs.statSync(path.join(COUNTRIES_DIR, file));
        return stat.isDirectory();
      });
  } catch (error) {
    console.error('Error reading country names:', error);
    return [];
  }
}

export function getCitiesByCountry(countryName: string): string[] {
  try {
    const countryDir = path.join(COUNTRIES_DIR, countryName);
    
    // Ensure the directory exists
    if (!fs.existsSync(countryDir)) {
      console.warn('Country directory does not exist:', countryDir);
      return [];
    }
    
    return fs.readdirSync(countryDir)
      .filter(file => file.endsWith('.csv'))
      .map(file => file.replace('.csv', ''));
  } catch (error) {
    console.error(`Error reading cities for country ${countryName}:`, error);
    return [];
  }
}

export function getCityNames(): string[] {
  try {
    // First check all countries directories (prioritize this structure)
    const countryCities = getCountryNames()
      .flatMap(country => getCitiesByCountry(country));
    
    // Then check the legacy directory
    const legacyCities = getLegacyCityNames();
    
    // Combine and deduplicate
    return [...new Set([...countryCities, ...legacyCities])];
  } catch (error) {
    console.error('Error reading city names:', error);
    return [];
  }
}

function getLegacyCityNames(): string[] {
  try {
    // Ensure the directory exists
    if (!fs.existsSync(CITIES_DIR)) {
      console.warn('Legacy data directory does not exist:', CITIES_DIR);
      return [];
    }
    
    const files = fs.readdirSync(CITIES_DIR);
    return files
      .filter(file => file.endsWith('.csv'))
      .map(file => file.replace('.csv', ''));
  } catch (error) {
    console.error('Error reading legacy city names:', error);
    return [];
  }
}

export function getCountryForCity(cityName: string): string | null {
  // Check each country directory for the city
  for (const country of getCountryNames()) {
    const countryDir = path.join(COUNTRIES_DIR, country);
    const cityPath = path.join(countryDir, `${cityName}.csv`);
    
    if (fs.existsSync(cityPath)) {
      return country;
    }
  }
  
  return null;
}

export function getCityData(citySlug: string): CityData {
  try {
    // Convert slug to proper filename format (e.g., "san-diego" to "San-Diego")
    const cityName = citySlug.split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('-');
    
    // First check if the city exists in a country directory
    const country = getCountryForCity(cityName);
    let filePath;
    
    if (country) {
      filePath = path.join(COUNTRIES_DIR, country, `${cityName}.csv`);
    } else {
      // Fall back to the legacy directory
      filePath = path.join(CITIES_DIR, `${cityName}.csv`);
    }
    
    if (!fs.existsSync(filePath)) {
      return { cityName: citySlug, country, listings: [] };
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
      skip_records_with_error: true
    });
    
    const listings = records.map((record: Record<string, string>) => {
      // Parse the ratings and reviews
      let rating = 0;
      let reviews = 0;
      
      if (record['Average Reviews (Number of Ratings)']) {
        const ratingMatch = record['Average Reviews (Number of Ratings)'].match(/(\d+\.\d+)\s*\((\d+)\)/);
        if (ratingMatch) {
          rating = parseFloat(ratingMatch[1]);
          reviews = parseInt(ratingMatch[2]);
        }
      }
      
      // Parse working hours into the expected format
      const workingHours: { [key: string]: string } = {};
      if (record['Opening Hours']) {
        const hoursText = record['Opening Hours'];
        // Split by commas and format as key-value pairs
        const hoursParts = hoursText.split(',').map((part: string) => part.trim());
        hoursParts.forEach((part: string) => {
          const [days, hours] = part.split(':').map((s: string) => s.trim());
          if (days && hours) {
            workingHours[days] = hours;
          }
        });
      }
      
      // Ensure name is properly extracted and cleaned
      let name = '';
      if (record['Name'] !== undefined && record['Name'] !== null && record['Name'] !== '') {
        name = record['Name'].toString().trim();
        name = name.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
      } else {
        const nameKey = Object.keys(record).find(key => 
          key.toLowerCase() === 'name' || 
          key.toLowerCase().includes('name') || 
          key.toLowerCase() === 'title' || 
          key.toLowerCase().includes('title')
        );
        
        if (nameKey) {
          name = record[nameKey].toString().trim();
          name = name.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
        } else {
          for (const key in record) {
            if (record[key] && typeof record[key] === 'string' && record[key].trim() !== '') {
              name = record[key].toString().trim();
              break;
            }
          }
        }
      }
      
      // Handle special case for "Does it also have a gym?" field
      let hasGym = false;
      if (record['Does it also have a gym?']) {
        const gymValue = record['Does it also have a gym?'].toString().trim().toLowerCase();
        hasGym = gymValue === 'yes' || gymValue === 'true' || gymValue === '1';
      }
      
      // Handle special case for "Do they also have a sauna?" field
      let hasSauna = false;
      if (record['Do they also have a sauna?']) {
        const saunaValue = record['Do they also have a sauna?'].toString().trim().toLowerCase();
        hasSauna = saunaValue === 'yes' || saunaValue === 'true' || saunaValue === '1';
      }
      
      // Handle special case for "Ice bath contrast therapy?" field
      let hasContrastTherapy = false;
      if (record['Ice bath contrast therapy?']) {
        const contrastValue = record['Ice bath contrast therapy?'].toString().trim().toLowerCase();
        hasContrastTherapy = contrastValue === 'yes' || contrastValue === 'true' || contrastValue === '1';
      }
      
      return {
        name,
        phone: record['Phone Number'] || undefined,
        site: record['Website'] || undefined,
        social: record['Official Social Account'] || undefined,
        prices: record['Prices'] || undefined,
        rating,
        reviews,
        working_hours: Object.keys(workingHours).length > 0 ? workingHours : undefined,
        about: {
          hasGym,
          hasSauna,
          hasContrastTherapy
        }
      } as DirectoryListing;
    });
    
    return {
      cityName: citySlug,
      country,
      listings
    };
  } catch (error) {
    console.error(`Error processing data for ${citySlug}:`, error);
    return { cityName: citySlug, country: null, listings: [] };
  }
}

export function getAllCitiesData(): CityData[] {
  return getCityNames().map(city => getCityData(city));
}

export function getCountriesData(): CountryData[] {
  return getCountryNames().map(country => {
    const cities = getCitiesByCountry(country).map(city => getCityData(city));
    return {
      countryName: country,
      cities
    };
  });
}