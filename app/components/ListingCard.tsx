import Link from 'next/link';
import type { DirectoryListing } from '../types/directory';

interface ListingCardProps {
  listing: DirectoryListing;
  citySlug: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${
            i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-2 text-gray-800 font-medium">{rating}</span>
    </div>
  );
}

export default function ListingCard({ listing, citySlug }: ListingCardProps) {
  // Debug the listing data
  console.log('Listing data:', listing);
  console.log('Listing name:', listing.name);
  
  // Format Instagram link if available
  const instagramLink = listing.social && listing.social.includes('@') 
    ? `https://www.instagram.com/${listing.social.replace('@', '').replace(' (Instagram)', '')}`
    : null;
  
  // Format working hours for display
  const formatHours = (hours: { [key: string]: string }) => {
    return Object.entries(hours).map(([day, time]) => (
      <div key={day} className="grid grid-cols-2 gap-2">
        <span className="font-medium text-gray-800">{day}:</span>
        <span className="text-gray-800">{time}</span>
      </div>
    ));
  };

  // Format prices for display as a list
  const formatPrices = (pricesString: string) => {
    if (!pricesString) return null;
    
    const priceItems = pricesString.split(';').map(item => item.trim());
    return (
      <ul className="list-disc pl-5 space-y-1">
        {priceItems.map((item, index) => (
          <li key={index} className="text-gray-800">{item}</li>
        ))}
      </ul>
    );
  };

  // Generate filter URLs for amenities
  const getFilterUrl = (filter: string) => {
    switch (filter) {
      case 'gym':
        return `/${citySlug}/icebath-with-gym`;
      case 'sauna':
        return `/${citySlug}/icebath-with-sauna`;
      case 'therapy':
        return `/${citySlug}/icebath-with-contrast-therapy`;
      default:
        return `/${citySlug}`;
    }
  };

  return (
    <article className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        {/* Header with name and rating */}
        <div className="border-b border-gray-100 pb-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {listing.name || listing.site?.replace(/^https?:\/\/(www\.)?/, '').split('/')[0] || "Unknown Name"}
          </h2>
          {listing.rating !== undefined && listing.rating > 0 && (
            <div className="flex items-center">
              <StarRating rating={listing.rating} />
              {listing.reviews !== undefined && listing.reviews > 0 && (
                <span className="ml-2 text-gray-700">
                  ({listing.reviews} reviews)
                </span>
              )}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">
              Location & Contact
            </h3>
            {listing.address && (
              <p className="text-gray-800 mb-3">{listing.address}</p>
            )}
            {listing.city && !listing.address && (
              <p className="text-gray-800 mb-3">{listing.city}</p>
            )}
            {listing.phone && (
              <p className="text-gray-800 mb-3">
                <a href={`tel:${listing.phone}`} className="text-blue-600 hover:underline font-medium">
                  {listing.phone}
                </a>
              </p>
            )}
            {listing.site && (
              <p className="mb-3">
                <a
                  href={listing.site.startsWith('http') ? listing.site : `https://${listing.site}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
                  Visit Website
                </a>
              </p>
            )}
            {instagramLink && (
              <p className="mb-3">
                <a
                  href={instagramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  {listing.social}
                </a>
              </p>
            )}
          </div>

          {/* Hours */}
          {listing.working_hours && Object.keys(listing.working_hours).length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">
                Hours
              </h3>
              <div className="text-sm text-gray-800">
                {formatHours(listing.working_hours)}
              </div>
            </div>
          )}
        </div>
        
        {/* Additional Information */}
        <div className="mt-8 grid md:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
          {/* About Section */}
          {listing.about_text && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">
                About
              </h3>
              <p className="text-gray-800">{listing.about_text}</p>
            </div>
          )}
          
          {/* Amenities */}
          {listing.about && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">
                Amenities
              </h3>
              <ul className="space-y-3">
                {listing.about.hasGym && (
                  <li className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <Link href={getFilterUrl('gym')} className="text-blue-600 hover:underline font-medium">
                      Gym Available
                    </Link>
                  </li>
                )}
                {listing.about.hasSauna && (
                  <li className="flex items-center">
                    <div className="bg-red-100 p-2 rounded-full mr-3">
                      <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <Link href={getFilterUrl('sauna')} className="text-blue-600 hover:underline font-medium">
                      Sauna Available
                    </Link>
                  </li>
                )}
                {listing.about.hasContrastTherapy && (
                  <li className="flex items-center">
                    <div className="bg-purple-100 p-2 rounded-full mr-3">
                      <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                      </svg>
                    </div>
                    <Link href={getFilterUrl('therapy')} className="text-blue-600 hover:underline font-medium">
                      Contrast Therapy Available
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          )}
          
          {/* Pricing */}
          {listing.prices && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">
                Pricing
              </h3>
              <div className="text-gray-800">
                {formatPrices(listing.prices)}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}