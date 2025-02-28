import Link from 'next/link';
import { getCityNames } from './utils/directory';

export const metadata = {
  title: 'Ice Bath Directory - Find Ice Bath Locations Near You',
  description: 'Discover ice bath and cold therapy locations across major cities. Find ratings, reviews, and booking information for ice bath facilities near you.',
};

// Helper function to format city name for display
function formatCityName(cityName: string): string {
  return cityName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function Home() {
  const cities = getCityNames();

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">
          Ice Bath Directory
        </h1>
        <p className="text-xl text-center text-gray-600 mb-12">
          Discover ice bath and cold therapy locations in these cities
        </p>
        
        {cities.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">No cities found</h2>
            <p className="text-gray-600">
              We couldn&apos;t find any city data at this time. Please add CSV files to the data/cities directory.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.map((city) => {
              const formattedCityName = formatCityName(city);
              return (
                <Link
                  key={city}
                  href={`/${city.toLowerCase()}`}
                  className="transform hover:scale-105 transition-transform duration-200"
                >
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6">
                      <h2 className="text-2xl font-semibold text-gray-900">{formattedCityName}</h2>
                      <p className="mt-2 text-gray-600">
                        View ice bath locations in {formattedCityName}
                      </p>
                      <div className="mt-4 flex items-center text-blue-600">
                        Explore directory →
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
