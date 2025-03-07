import Link from 'next/link';
import { getCountryNames, getCitiesByCountry } from '../../utils/directory';
import { getLanguageForCountry, getLanguageDirection } from '../../utils/language';

export async function generateStaticParams() {
  const countries = getCountryNames();
  return countries.map((country) => ({
    country: country.toLowerCase(),
  }));
}

// Helper function to format city name for display
function formatCityName(cityName: string): string {
  return cityName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export async function generateMetadata({ params }: { params: { country: string } }) {
  const countryName = params.country.charAt(0).toUpperCase() + params.country.slice(1);
  const langCode = getLanguageForCountry(countryName);
  
  return {
    title: `Ice Bath Locations in ${countryName} - Directory & Reviews`,
    description: `Find the best ice bath and cold therapy locations in ${countryName}. Browse cities and discover ice bath facilities.`,
    alternates: {
      languages: {
        [langCode]: `/country/${params.country}`,
      },
    },
  };
}

export default async function CountryPage({ params }: { params: { country: string } }) {
  const countrySlug = params.country;
  const countryName = countrySlug.charAt(0).toUpperCase() + countrySlug.slice(1);
  const cities = getCitiesByCountry(countryName);
  const langCode = getLanguageForCountry(countryName);
  const direction = getLanguageDirection(langCode);

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to all countries
          </Link>
        </div>

        <div className={`text-right ${direction === 'rtl' ? 'rtl' : ''}`}>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-gray-900">
              Ice Bath Locations in {countryName}
            </h1>
            <div className="text-sm bg-gray-100 rounded-full px-3 py-1">
              {langCode.toUpperCase()}
            </div>
          </div>
          <p className="text-xl text-gray-600 mb-8">
            Browse cities in {countryName} to find ice bath facilities
          </p>
        </div>

        {cities.length === 0 ? (
          <div className={`bg-white rounded-lg shadow-lg p-8 text-center ${direction === 'rtl' ? 'rtl' : ''}`}>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">No cities found</h2>
            <p className="text-gray-600">
              We couldn&apos;t find any cities in {countryName} at this time.
            </p>
          </div>
        ) : (
          <div className={`bg-white rounded-lg shadow-lg p-8 ${direction === 'rtl' ? 'rtl' : ''}`}>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Cities in {countryName}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cities.map((city) => {
                const formattedCityName = formatCityName(city);
                return (
                  <Link
                    key={city}
                    href={`/${city.toLowerCase()}`}
                    className="transform hover:scale-105 transition-transform duration-200"
                  >
                    <div className="bg-blue-50 rounded-lg shadow overflow-hidden">
                      <div className="p-6">
                        <h3 className="text-2xl font-semibold text-gray-900">{formattedCityName}</h3>
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
          </div>
        )}
      </div>
    </main>
  );
}
