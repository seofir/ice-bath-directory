export interface DirectoryListing {
  name: string;
  site?: string;
  phone?: string;
  full_address?: string;
  address?: string;
  about_text?: string;
  city?: string;
  country?: string;
  rating?: number;
  reviews?: number;
  working_hours?: { [key: string]: string };
  about?: {
    hasGym?: boolean;
    hasSauna?: boolean;
    hasContrastTherapy?: boolean;
    [key: string]: boolean | string | number | undefined;
  };
  photo?: string;
  booking_appointment_link?: string;
  // Additional fields from CSV
  prices?: string;
  social?: string;
}

export interface CityData {
  cityName: string;
  country?: string | null;
  listings: DirectoryListing[];
}

export interface CountryData {
  countryName: string;
  cities: CityData[];
}