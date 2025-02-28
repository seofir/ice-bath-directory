import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import type { DirectoryListing, CityData } from '../types/directory';

// Path to the cities data directory
const CITIES_DIR = path.join(process.cwd(), 'data', 'cities');

export function getCityNames(): string[] {
  try {
    // Ensure the directory exists
    if (!fs.existsSync(CITIES_DIR)) {
      console.warn('Data directory does not exist:', CITIES_DIR);
      return [];
    }
    
    const files = fs.readdirSync(CITIES_DIR);
    return files
      .filter(file => file.endsWith('.csv'))
      .map(file => file.replace('.csv', ''));
  } catch (error) {
    console.error('Error reading city names:', error);
    return [];
  }
}

export function getCityData(citySlug: string): CityData {
  try {
    // Convert slug to proper filename format (e.g., "san-diego" to "San-Diego")
    const cityName = citySlug.split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('-');
    
    const filePath = path.join(CITIES_DIR, `${cityName}.csv`);
    
    if (!fs.existsSync(filePath)) {
      console.warn(`Data file for ${cityName} does not exist:`, filePath);
      return { cityName: citySlug, listings: [] };
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
      skip_records_with_error: true
    });
    
    const listings = records.map((record: any) => {
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
      let workingHours: { [key: string]: string } = {};
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
      if (record['Name']) {
        name = record['Name'].toString().trim();
        // Remove any non-printable characters that might be causing issues
        name = name.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
      }
      
      // Handle special case for "Does it also have a gym?" field
      let hasGym = false;
      if (record['Does it also have a gym?']) {
        const gymValue = record['Does it also have a gym?'].toString().trim();
        hasGym = gymValue === 'Yes' || gymValue.startsWith('Yes ');
      }
      
      return {
        name: name,
        site: record['Website'] || '',
        phone: record['Phone Number'] || '',
        full_address: '', // Not available in your CSV
        city: citySlug,
        rating: rating,
        reviews: reviews,
        working_hours: workingHours,
        about: {
          hasGym: hasGym,
          hasSauna: record['Do they also have a sauna?'] === 'Yes',
          hasContrastTherapy: record['Ice bath contrast therapy?'] === 'Yes'
        },
        photo: '', // Not available in your CSV
        booking_appointment_link: '', // Not available in your CSV
        // Additional fields from your CSV
        prices: record['Prices'] || '',
        social: record['Official Social Account'] || ''
      } as DirectoryListing;
    });
    
    return {
      cityName: citySlug,
      listings
    };
  } catch (error) {
    console.error(`Error reading data for ${citySlug}:`, error);
    return { cityName: citySlug, listings: [] };
  }
}

export function getAllCitiesData(): CityData[] {
  return getCityNames().map(cityName => getCityData(cityName));
} 