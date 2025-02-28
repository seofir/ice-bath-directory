import { getCityData, getCityNames } from '../../utils/directory';
import type { DirectoryListing } from '../../types/directory';
import Link from 'next/link';
import FilterBar from '../../components/FilterBar';
import ListingCard from '../../components/ListingCard';

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
  return {
    title: `Ice Bath Locations with Gym in ${cityName} - Directory & Reviews`,
    description: `Find the best ice bath facilities with gym access in ${cityName}. Compare ratings, reviews, and book appointments at ice bath facilities with gym amenities.`,
  };
}

export default async function GymPage({ params }: { params: { city: string } }) {
  const citySlug = params.city;
  const cityName = formatCityName(citySlug);
  const { listings } = getCityData(citySlug);
  
  // Filter listings to only show those with gym
  const filteredListings = listings.filter(listing => listing.about?.hasGym === true);

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to all cities
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Ice Bath Locations with Gym in {cityName}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Find and compare ice bath facilities with gym access in {cityName}
        </p>

        {/* Filter Bar */}
        <FilterBar citySlug={citySlug} activeFilter="gym" />

        {filteredListings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">No listings found</h2>
            <p className="text-gray-600">
              We couldn&apos;t find any ice bath facilities with gym access in {cityName} at this time.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
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