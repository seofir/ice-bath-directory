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
    console.log(`Reading file: ${filePath}`);
    
    if (!fs.existsSync(filePath)) {
      console.warn(`Data file for ${cityName} does not exist:`, filePath);
      return { cityName: citySlug, listings: [] };
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    console.log(`File content length: ${fileContent.length} bytes`);
    
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
      skip_records_with_error: true
    });
    
    console.log(`Raw records for ${cityName}:`, JSON.stringify(records, null, 2));
    console.log(`Number of records: ${records.length}`);
    
    const listings = records.map((record: Record<string, string>, index: number) => {
      console.log(`Processing record ${index}:`, JSON.stringify(record, null, 2));
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
      // First check if the 'Name' field exists with exact casing
      if (record['Name'] !== undefined && record['Name'] !== null && record['Name'] !== '') {
        name = record['Name'].toString().trim();
        // Remove any non-printable characters that might be causing issues
        name = name.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
        console.log(`Extracted name from 'Name' field: ${name}`);
      } else {
        // If 'Name' field is not found or empty, try to find a field with similar name
        const nameKey = Object.keys(record).find(key => 
          key.toLowerCase() === 'name' || 
          key.toLowerCase().includes('name') || 
          key.toLowerCase() === 'title' || 
          key.toLowerCase().includes('title')
        );
        
        if (nameKey) {
          name = record[nameKey].toString().trim();
          name = name.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
          console.log(`Found name with different casing or similar field '${nameKey}': ${name}`);
        } else {
          console.log('Name field missing or empty in record:', JSON.stringify(record, null, 2));
          // As a last resort, use the first non-empty string field
          for (const key in record) {
            if (record[key] && typeof record[key] === 'string' && record[key].trim() !== '') {
              name = record[key].toString().trim();
              console.log(`Using first non-empty field '${key}' as name: ${name}`);
              break;
            }
          }
        }
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