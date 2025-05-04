
export interface Destination {
  id: string;
  name: string;
  country: string;
}

const popularDestinations: Destination[] = [
  {
    id: "tokyo-japan",
    name: "Tokyo",
    country: "Japan"
  },
  {
    id: "paris-france",
    name: "Paris",
    country: "France"
  },
  {
    id: "new-york-usa",
    name: "New York",
    country: "USA"
  },
  {
    id: "london-uk",
    name: "London",
    country: "UK"
  },
  {
    id: "rome-italy",
    name: "Rome",
    country: "Italy"
  },
  {
    id: "barcelona-spain",
    name: "Barcelona",
    country: "Spain"
  },
  {
    id: "sydney-australia",
    name: "Sydney",
    country: "Australia"
  },
  {
    id: "cairo-egypt",
    name: "Cairo",
    country: "Egypt"
  },
  {
    id: "bangkok-thailand",
    name: "Bangkok",
    country: "Thailand"
  },
  {
    id: "rio-de-janeiro-brazil",
    name: "Rio de Janeiro",
    country: "Brazil"
  }
];

export const getDestinations = () => {
  return popularDestinations;
};

export const getDestinationByNameAndCountry = (name: string, country: string) => {
  return popularDestinations.find(
    (dest) => 
      dest.name.toLowerCase() === name.toLowerCase() && 
      dest.country.toLowerCase() === country.toLowerCase()
  );
};

export const getDestinationById = (id: string) => {
  return popularDestinations.find((dest) => dest.id === id);
};

// Custom search function that's more flexible
export const getDestinationSuggestions = (query: string) => {
  if (!query) return [];
  
  const lowercaseQuery = query.toLowerCase();
  
  // Check in our predefined destinations first
  const predefinedMatches = popularDestinations
    .filter((dest) => 
      dest.name.toLowerCase().includes(lowercaseQuery) || 
      dest.country.toLowerCase().includes(lowercaseQuery)
    )
    .map((dest) => `${dest.name}, ${dest.country}`);
    
  if (predefinedMatches.length > 0) {
    return predefinedMatches;
  }
  
  // If the query contains a comma, it might be a custom "City, Country" format
  if (query.includes(',')) {
    const [cityPart, countryPart] = query.split(',').map(part => part.trim());
    if (cityPart && countryPart) {
      // This is a valid format, so suggest it as-is
      return [query];
    }
  }
  
  // If we couldn't find matches and it doesn't contain a comma yet,
  // assume it's a city name and suggest some common countries
  if (!query.includes(',') && query.length > 2) {
    const cityName = query.trim();
    const firstLetter = cityName.charAt(0).toUpperCase();
    const restOfName = cityName.slice(1);
    const formattedCityName = `${firstLetter}${restOfName}`;
    
    // Suggest common countries for this city
    return [
      `${formattedCityName}, USA`,
      `${formattedCityName}, UK`,
      `${formattedCityName}, France`,
      `${formattedCityName}, Italy`,
      `${formattedCityName}, Spain`
    ];
  }
  
  return [];
};
