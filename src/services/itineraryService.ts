import { generateDestinationContent, generateFallbackActivities } from "./openaiService";
import { toast } from "sonner";

export interface Activity {
  time: string;
  title: string;
  description: string;
  budget?: string; // Made optional to support cases without pricing
  location?: string; // Added location information
}

export interface DayItinerary {
  day: number;
  date: string;
  title: string;
  activities: Activity[];
  city: string; // Added city information
}

export interface CityStay {
  city: string;
  country: string;
  startDate: Date;
  endDate: Date;
  days: DayItinerary[];
}

export interface TripItinerary {
  destinations: string[]; // Multiple destinations
  dates: string;
  totalBudget: string;
  cities: CityStay[]; // City stays
  packingList: string[];
  tips: string[];
}

// User preferences interface
export interface UserPreferences {
  interests: string[];
  travelStyle: string;
}

// Helper to format date as "Month Day, Year"
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

// Helper to format date range as "Month Day - Month Day, Year"
const formatDateRange = (from: Date, to: Date): string => {
  if (from.getFullYear() === to.getFullYear() && from.getMonth() === to.getMonth()) {
    return `${from.toLocaleDateString('en-US', { month: 'long' })} ${from.getDate()} - ${to.getDate()}, ${from.getFullYear()}`;
  }
  return `${formatDate(from)} - ${formatDate(to)}`;
};

// Generate activities for a specific day based on destination
const generateActivitiesForDay = async (
  allActivities: any[],
  dayNumber: number,
  city: string,
  country: string
): Promise<Activity[]> => {
  // Make sure allActivities is an array and has items
  if (!Array.isArray(allActivities) || allActivities.length === 0) {
    console.warn(`No activities available for ${city} on day ${dayNumber}, generating fallback activities`);
    return generateFallbackActivities(`${city}, ${country}`, dayNumber);
  }
  
  // Get the activities for this specific day (4 activities per day)
  const startIndex = (dayNumber - 1) * 4;
  const dayActivities = allActivities.slice(startIndex, startIndex + 4);
  
  // If we don't have enough activities for this day, generate fallbacks
  if (dayActivities.length < 4) {
    console.warn(`Not enough activities available for ${city} on day ${dayNumber}, generating fallback activities`);
    const fallbackActivities = await generateFallbackActivities(`${city}, ${country}`, dayNumber);
    return [...dayActivities, ...fallbackActivities.slice(0, 4 - dayActivities.length)];
  }
  
  // Map the activities to ensure they have all required fields
  return dayActivities.map((activity, index) => {
    if (!activity.time || !activity.title || !activity.description) {
      console.warn(`Activity ${index + 1} for ${city} on day ${dayNumber} is missing required fields, using fallback`);
      return {
        time: activity.time || getGenericTimeslot(index).time,
        title: activity.title || `Visit to a place in ${city}`,
        description: activity.description || `Enjoy your time in ${city}`,
        budget: activity.budget || "$15-30",
        location: activity.location || `${city} Area`
      };
    }
    
    return {
      time: activity.time,
      title: activity.title,
      description: activity.description,
      budget: activity.budget || "$15-30",
      location: activity.location || `${city} Area`
    };
  });
};

// Helper to get generic timeslot if we need fallbacks
const getGenericTimeslot = (index: number): { time: string; title: string } => {
  switch (index % 4) {
    case 0:
      return { time: "9:00 AM", title: "Morning Exploration" };
    case 1:
      return { time: "12:30 PM", title: "Local Lunch" };
    case 2:
      return { time: "3:00 PM", title: "Afternoon Activity" };
    case 3:
      return { time: "7:00 PM", title: "Evening Entertainment" };
    default:
      return { time: "12:00 PM", title: "Midday Activity" };
  }
};

// Get user preferences from localStorage
const getUserPreferences = (): UserPreferences | undefined => {
  try {
    // Get preferences from local storage if they exist
    const interestsStr = localStorage.getItem('user_interests');
    const travelStyle = localStorage.getItem('user_travel_style');
    
    if (!interestsStr && !travelStyle) {
      return undefined;
    }
    
    return {
      interests: interestsStr ? JSON.parse(interestsStr) : [],
      travelStyle: travelStyle || ''
    };
  } catch (error) {
    console.error('Error retrieving user preferences:', error);
    return undefined;
  }
};

// Parse a destination string like "Bangkok, Thailand"
const parseDestination = (destination: string): { city: string; country: string } => {
  const [city, country] = destination.split(',').map(part => part.trim());
  
  if (!city || !country) {
    console.error("Invalid destination format");
    return { city: destination, country: "Unknown" };
  }
  
  return { city, country };
};

export interface MultiCityTripInput {
  destinations: { city: string; country: string; nights: number }[];
  startDate: Date;
  budget: number;
  preferences?: {
    familyFriendly: boolean;
    accessibility: boolean;
    interests: string[];
    travelStyle: string;
  };
}

export const generateMultiCityItinerary = async (
  tripInput: MultiCityTripInput
): Promise<TripItinerary | null> => {
  try {
    // We're now using a predefined API key (handled in openaiService)
    
    if (!tripInput.destinations || tripInput.destinations.length === 0) {
      toast.error("Please add at least one destination.");
      return null;
    }
    
    // Get user preferences if available
    const userPreferences = getUserPreferences();
    console.log("User preferences for multi-city itinerary:", userPreferences);
    
    // Show loading toast
    const loadingToast = toast.loading("Generating your personalized multi-city itinerary...");
    
    try {
      // Process each destination
      let currentDate = new Date(tripInput.startDate);
      const cityStays: CityStay[] = [];
      const destinationStrings: string[] = [];
      
      // Calculate total days for budget allocation
      const totalNights = tripInput.destinations.reduce((sum, dest) => sum + dest.nights, 0);
      
      // Generate combined destination list for tips
      const destinationList = tripInput.destinations.map(d => `${d.city}, ${d.country}`).join(", ");
      console.log(`Generating content for ${destinationList} for ${totalNights} days`);
      
      for (const destination of tripInput.destinations) {
        const startDate = new Date(currentDate);
        
        // Add nights to current date to get end date
        const endDate = new Date(currentDate);
        endDate.setDate(endDate.getDate() + destination.nights);
        
        // Generate destination string
        const destinationString = `${destination.city}, ${destination.country}`;
        destinationStrings.push(destinationString);
        
        // Calculate budget allocation for this city stay
        const cityBudget = Math.round((destination.nights / totalNights) * tripInput.budget);
        console.log(`Budget for ${destinationString}: $${cityBudget}`);
        
        // Generate content for this city WITH the budget information
        const destinationContent = await generateDestinationContent(
          destinationString, 
          destination.nights,
          {
            ...userPreferences,
            interests: [
              ...(userPreferences?.interests || []),
              ...(tripInput.preferences?.interests || [])
            ],
            travelStyle: tripInput.preferences?.travelStyle || userPreferences?.travelStyle || 'balanced',
            familyFriendly: tripInput.preferences?.familyFriendly || false,
            accessibility: tripInput.preferences?.accessibility || false
          },
          cityBudget
        );
        
        // Generate days for this city stay
        const days: DayItinerary[] = [];
        for (let i = 0; i < destination.nights; i++) {
          const currentDayDate = new Date(startDate);
          currentDayDate.setDate(startDate.getDate() + i);
          
          const dayNumber = i + 1;
          
          days.push({
            day: dayNumber,
            date: formatDate(currentDayDate),
            title: i === 0 
              ? `Arrival & First Day in ${destination.city}`
              : i === destination.nights - 1 
              ? `Last Day in ${destination.city}`
              : `Exploring ${destination.city} - Day ${dayNumber}`,
            activities: await generateActivitiesForDay(
              destinationContent.activities, 
              dayNumber,
              destination.city,
              destination.country
            ),
            city: destination.city
          });
        }
        
        cityStays.push({
          city: destination.city,
          country: destination.country,
          startDate: startDate,
          endDate: endDate,
          days: days
        });
        
        // Move current date to next city
        currentDate = new Date(endDate);
      }
      
      // Calculate overall trip dates
      const overallStartDate = new Date(tripInput.startDate);
      const overallEndDate = new Date(currentDate);
      
      // Get common packing list and tips
      // Use the first city's content for packing list and tips as a base
      const packingList = cityStays[0].days.length > 0 ? 
        ["Light cotton clothing",
         "Comfortable walking shoes",
         "Sun protection (hat, sunglasses, sunscreen)",
         "Swimwear",
         "Insect repellent",
         "Travel adapters",
         "Lightweight rain jacket",
         "Small day bag",
         "Reusable water bottle",
         "Basic medical supplies",
         "Travel documents",
         "Local currency"] : [];
      
      const tips = cityStays[0].days.length > 0 ? 
        ["Respect local customs and dress modestly when visiting temples",
         "Always carry some local currency for small purchases",
         "Drink bottled water and avoid ice in street stalls",
         "Use reputable taxi companies or ride-sharing apps",
         "Learn a few basic phrases in the local language",
         "Bargain at markets but remain respectful",
         "Try the street food but choose busy stalls with high turnover",
         "Be aware of common scams targeting tourists"] : [];
      
      // Dismiss loading toast on success
      toast.dismiss(loadingToast);
      toast.success("Multi-city itinerary generated successfully!");
      
      return {
        destinations: destinationStrings,
        dates: formatDateRange(overallStartDate, overallEndDate),
        totalBudget: `$${tripInput.budget}`,
        cities: cityStays,
        packingList: packingList,
        tips: tips
      };
      
    } catch (error) {
      // Dismiss loading toast on error
      toast.dismiss(loadingToast);
      toast.error("Failed to generate multi-city itinerary. Please try again.");
      console.error("Error in multi-city itinerary generation:", error);
      return null;
    }
  } catch (error) {
    toast.error("Error generating itinerary. Please check your inputs and try again.");
    console.error("Error generating multi-city itinerary:", error);
    return null;
  }
};

// Keep the single city itinerary function but update it to use the new structure
export const generateItinerary = async (
  destination: string,
  startDate: Date,
  endDate: Date,
  budget: number
): Promise<TripItinerary | null> => {
  try {
    // We're now using a predefined API key (handled in openaiService)

    // Parse destination string (format: "City, Country")
    const { city, country } = parseDestination(destination);
    
    // Calculate trip duration in days
    const tripDurationMs = endDate.getTime() - startDate.getTime();
    const tripDurationDays = Math.ceil(tripDurationMs / (1000 * 60 * 60 * 24));
    
    if (tripDurationDays <= 0) {
      console.error("Invalid date range");
      toast.error("Please select a valid date range.");
      return null;
    }
    
    // Get user preferences if available
    const userPreferences = getUserPreferences();
    console.log("User preferences for itinerary:", userPreferences);
    
    // Show loading toast
    const loadingToast = toast.loading("Generating your personalized itinerary...");
    
    try {
      // Generate destination content using OpenAI service with user preferences AND budget
      const destinationContent = await generateDestinationContent(
        destination, 
        tripDurationDays, 
        userPreferences,
        budget  // Pass budget to ensure proper price generation
      );
      
      // Dismiss loading toast on success
      toast.dismiss(loadingToast);
      toast.success("Itinerary generated successfully!");
      
      // Generate days
      const days: DayItinerary[] = [];
      for (let i = 0; i < tripDurationDays; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        
        const dayNumber = i + 1;
        
        days.push({
          day: dayNumber,
          date: formatDate(currentDate),
          title: i === 0 
            ? `Arrival & First Day in ${city}`
            : i === tripDurationDays - 1 
            ? `Last Day in ${city}`
            : `Exploring ${city} - Day ${dayNumber}`,
          activities: await generateActivitiesForDay(destinationContent.activities, dayNumber, city, country),
          city: city
        });
      }
      
      // Create a city stay for the single destination
      const cityStat: CityStay = {
        city,
        country,
        startDate,
        endDate,
        days
      };
      
      return {
        destinations: [`${city}, ${country}`],
        dates: formatDateRange(startDate, endDate),
        totalBudget: `$${budget}`,
        cities: [cityStat],
        packingList: destinationContent.packingList || [],
        tips: destinationContent.tips || []
      };
    } catch (error) {
      // Dismiss loading toast on error
      toast.dismiss(loadingToast);
      toast.error("Failed to generate itinerary. Please try again.");
      console.error("Error in itinerary generation:", error);
      return null;
    }
  } catch (error) {
    toast.error("Error generating itinerary. Please check your inputs and try again.");
    console.error("Error generating itinerary:", error);
    return null;
  }
};
