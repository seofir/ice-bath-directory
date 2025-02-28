import Link from 'next/link';

interface FilterBarProps {
  citySlug: string;
  activeFilter?: string | null;
}

export default function FilterBar({ citySlug, activeFilter }: FilterBarProps) {
  const filters = [
    { id: 'all', label: 'All Locations', path: `/${citySlug}`, icon: (
      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
      </svg>
    ) },
    { id: 'gym', label: 'With Gym', path: `/${citySlug}/icebath-with-gym`, icon: (
      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
      </svg>
    ) },
    { id: 'sauna', label: 'With Sauna', path: `/${citySlug}/icebath-with-sauna`, icon: (
      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
      </svg>
    ) },
    { id: 'therapy', label: 'With Contrast Therapy', path: `/${citySlug}/icebath-with-contrast-therapy`, icon: (
      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
      </svg>
    ) }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8 border border-gray-100">
      <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900">Filter By Amenities</h2>
      </div>
      <div className="p-4">
        <div className="flex flex-wrap gap-3">
          {filters.map(filter => {
            const isActive = 
              (filter.id === 'all' && !activeFilter) || 
              (activeFilter === filter.id);
            
            return (
              <Link
                key={filter.id}
                href={filter.path}
                className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md transform scale-105'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200 hover:shadow'
                }`}
              >
                {filter.icon}
                {filter.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
} 