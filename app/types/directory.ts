export interface DirectoryListing {
  name: string;
  site?: string;
  phone?: string;
  full_address?: string;
  city?: string;
  rating?: number;
  reviews?: number;
  working_hours?: { [key: string]: string };
  about?: {
    hasGym?: boolean;
    hasSauna?: boolean;
    hasContrastTherapy?: boolean;
    [key: string]: any;
  };
  photo?: string;
  booking_appointment_link?: string;
  // Additional fields from CSV
  prices?: string;
  social?: string;
}

export interface CityData {
  cityName: string;
  listings: DirectoryListing[];
} 