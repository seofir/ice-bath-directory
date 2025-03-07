import { getCityData, getCityNames, getCountryForCity } from '../utils/directory';
import { getLanguageForCountry, getLanguageDirection } from '../utils/language';
import type { DirectoryListing } from '../types/directory';
import Link from 'next/link';
import FilterBar from '../components/FilterBar';
import ListingCard from '../components/ListingCard';

export async function generateStaticParams() {
  const cities = getCityNames();
  return cities.map((city) => ({
    city: city.toLowerCase(),
  }));
}

// Helper function to format city name for display
function formatCityName(cityName: string): string {
  return cityName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export async function generateMetadata({ params }: { params: { city: string } }) {
  const cityName = formatCityName(params.city);
  const country = getCountryForCity(cityName);
  const langCode = country ? getLanguageForCountry(country) : 'en';
  
  return {
    title: `Ice Bath Locations in ${cityName} - Directory & Reviews`,
    description: `Find the best ice bath and cold therapy locations in ${cityName}. Compare ratings, reviews, and book appointments at ice bath facilities.`,
    alternates: {
      languages: {
        [langCode]: `/${params.city}`,
      },
    },
  };
}

export default async function CityPage({ params, searchParams }: { 
  params: { city: string },
  searchParams: { filter?: string }
}) {
  const citySlug = params.city;
  const cityName = formatCityName(citySlug);
  const { listings, country } = getCityData(citySlug);
  const activeFilter = searchParams.filter;
  const langCode = country ? getLanguageForCountry(country) : 'en';
  const direction = getLanguageDirection(langCode);

  // Filter listings based on the active filter
  const filteredListings = listings.filter(listing => {
    if (!activeFilter) return true;
    
    switch (activeFilter) {
      case 'gym':
        return listing.about?.hasGym === true;
      case 'sauna':
        return listing.about?.hasSauna === true;
      case 'therapy':
        return listing.about?.hasContrastTherapy === true;
      default:
        return true;
    }
  });

  // Generate SEO-friendly title based on filter
  const getPageTitle = () => {
    if (!activeFilter) return `Ice Bath Locations in ${cityName}`;
    
    switch (activeFilter) {
      case 'gym':
        return `Ice Bath Locations with Gym in ${cityName}`;
      case 'sauna':
        return `Ice Bath Locations with Sauna in ${cityName}`;
      case 'therapy':
        return `Ice Bath Locations with Contrast Therapy in ${cityName}`;
      default:
        return `Ice Bath Locations in ${cityName}`;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8 flex justify-between items-center">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to all cities
          </Link>
          {country && (
            <Link href={`/country/${country.toLowerCase()}`} className="text-blue-600 hover:underline">
              View all cities in {country} →
            </Link>
          )}
        </div>

        <div className={`${direction === 'rtl' ? 'rtl text-right' : ''}`}>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-gray-900">
              {getPageTitle()}
            </h1>
            {country && (
              <div className="text-sm bg-gray-100 rounded-full px-3 py-1">
                {langCode.toUpperCase()}
              </div>
            )}
          </div>
          <p className="text-xl text-gray-600 mb-2">
            Find and compare ice bath facilities in {cityName}
          </p>
          
          {country && (
            <p className="text-md text-gray-500 mb-8">
              Located in {country}
            </p>
          )}
        </div>

        {/* Filter Bar */}
        <FilterBar citySlug={citySlug} activeFilter={activeFilter} />

        {filteredListings.length === 0 ? (
          <div className={`bg-white rounded-lg shadow-lg p-8 text-center ${direction === 'rtl' ? 'rtl' : ''}`}>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">No listings found</h2>
            <p className="text-gray-600">
              {activeFilter 
                ? `We couldn't find any ice bath facilities in ${cityName} with the selected filter.`
                : `We couldn't find any ice bath facilities in ${cityName} at this time.`
              }
            </p>
          </div>
        ) : (
          <div className={`grid grid-cols-1 gap-8 ${direction === 'rtl' ? 'rtl' : ''}`}>
            {filteredListings.map((listing: DirectoryListing, index: number) => (
              <ListingCard 
                key={`${listing.name}-${index}`}
                listing={listing}
                citySlug={citySlug}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}