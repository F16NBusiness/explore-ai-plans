// This service handles communication with OpenAI API for generating travel content
import { API_CONFIG } from '@/config/api';

// Types for OpenAI API responses
interface OpenAIActivitySuggestion {
  time: string;
  title: string;
  description: string;
  budget?: string;  // Optional budget
  location?: string; // Optional location/address
}

interface OpenAITripContent {
  activities: OpenAIActivitySuggestion[];
  packingList: string[];
  tips: string[];
}

// User preferences interface
interface UserPreferences {
  interests: string[];
  travelStyle: string;
  familyFriendly?: boolean;
  accessibility?: boolean;
}

/**
 * Generate travel content based on destination information and user preferences
 * @param destination The destination city and country
 * @param tripDurationDays Number of days for the trip
 * @param userPreferences User's selected interests and travel style
 * @param budget Optional budget amount for the trip/city in USD
 * @returns Generated content including activities, packing list and local tips
 */
export const generateDestinationContent = async (
  destination: string,
  tripDurationDays: number,
  userPreferences?: UserPreferences,
  budget?: number
): Promise<OpenAITripContent> => {
  try {
    console.log(`Generating content for ${destination} for ${tripDurationDays} days with budget ${budget || 'unspecified'}`);
    
    const [city, country] = destination.split(',').map(part => part.trim());
    
    // Get API key from config
    const apiKey = API_CONFIG.openai.apiKey;
    
    if (!apiKey) {
      throw new Error("OpenAI API key is not configured. Please contact support.");
    }
    
    // Extract user preferences for the prompt
    const interests = userPreferences?.interests?.join(', ') || '';
    const travelStyle = userPreferences?.travelStyle || '';
    const familyFriendly = userPreferences?.familyFriendly || false;
    const accessibility = userPreferences?.accessibility || false;
    
    // Create a more personalized and detailed prompt for OpenAI with enhanced budget context
    const prompt = `
      Generate a detailed and highly specific travel plan for ${tripDurationDays} days in ${city}, ${country}. 
      
      ${interests ? `The traveler is particularly interested in: ${interests}.` : ''}
      ${travelStyle ? `This is a ${travelStyle.toLowerCase()} trip.` : ''}
      ${budget ? `The budget for this portion of the trip is $${budget}.` : ''}
      ${familyFriendly ? 'This is a family-friendly trip with children. Please suggest activities suitable for families.' : ''}
      ${accessibility ? 'Please ensure all suggested activities and locations are wheelchair accessible.' : ''}
      
      The response should be in JSON format with the following structure:
      {
        "activities": [
          {
            "time": "9:00 AM", (provide different times throughout the day)
            "title": "Visit to [SPECIFIC PLACE NAME]",
            "description": "Detailed description of the activity with specific information",
            "location": "Actual address or area within ${city}",
            "budget": "[REQUIRED] Approximate cost in local currency AND USD equivalent (e.g., '฿200 / $6' for Thailand)"
          }
        ],
        "packingList": ["item1", "item2", ...], (List of 10-15 items specific to ${city}, ${country})
        "tips": ["tip1", "tip2", ...] (List of 5-8 local tips specific to ${city}, ${country})
      }
      
      Please provide ${tripDurationDays * 4} activities (4 activities per day, morning, noon, afternoon, evening).
      
      CRITICALLY IMPORTANT REQUIREMENTS:
      1. Be EXTREMELY SPECIFIC - ALWAYS use actual attraction names, landmarks, museums, restaurants, parks, etc.
      2. NEVER use generic descriptions like "local museum" or "central park" - instead ALWAYS use real place names like "The Jim Thompson House Museum" or "Lumpini Park"
      3. For restaurants, ONLY suggest actual restaurant names that exist in ${city} and include their current address
      4. Include specific street names, neighborhoods, or districts where relevant
      5. For activities, include what makes each place special or interesting to visit
      6. Tailor all suggestions to the traveler's interests: ${interests || 'general tourism'}
      7. Adapt recommendations to the travel style: ${travelStyle || 'general travel'}
      8. BUDGET FIELD IS REQUIRED - Base your budget estimations on average costs in ${city} and allocate within the total trip budget of $${budget || 'moderate amount'}.
      9. For Thailand specifically, include authentic local experiences and mention specific dishes at restaurants
      10. All activities should be suitable for families with children. Include playgrounds, family-friendly museums, and activities that children would enjoy.
      11. All suggested locations must be wheelchair accessible. Include information about accessibility features where relevant.
      12. For pricing information:
          - Use current 2024 prices
          - Include both local currency and USD equivalent
          - For restaurants, include average meal prices
          - For attractions, include current admission fees
          - For transportation, include current fare prices
          - For shopping, include typical price ranges
      13. For locations:
          - Use current, verified addresses
          - Include neighborhood/district names
          - Include nearby landmarks for reference
          - Include public transportation options
          - Include parking information if relevant
      14. For timing:
          - Include current opening hours
          - Note any seasonal variations
          - Include best times to visit to avoid crowds
          - Include time needed for each activity
      
      Create an authentic, detailed travel experience with specific places that someone could actually follow in ${city}, ${country}.
    `;

    try {
      console.log("Calling OpenAI API with prompt...");
      
      // Make the actual API call to OpenAI
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: 'system',
              content: 'You are a travel expert providing detailed information about destinations.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("OpenAI API error:", errorData);
        throw new Error(`OpenAI API responded with status ${response.status}: ${JSON.stringify(errorData)}`);
      }
      
      const data = await response.json();
      console.log("OpenAI API response received");
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error("Invalid response structure from OpenAI:", data);
        throw new Error("Invalid response structure from OpenAI");
      }
      
      // Parse the content which should be a JSON string
      try {
        const content = data.choices[0].message.content;
        console.log("Parsing JSON from OpenAI response");
        
        // Extract JSON from the response (in case it's wrapped in markdown or other text)
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                          content.match(/```([\s\S]*?)```/) ||
                          [null, content];
        
        const jsonContent = jsonMatch[1] || content;
        const parsedContent = JSON.parse(jsonContent);
        
        console.log("Successfully parsed OpenAI response");
        
        // Validate the response has the expected structure
        if (!parsedContent.activities || !Array.isArray(parsedContent.activities)) {
          console.error("OpenAI response missing activities array:", parsedContent);
          throw new Error("OpenAI response missing activities array");
        }
        
        // Ensure activities have all required fields
        const validatedActivities = parsedContent.activities.map((activity: any) => ({
          time: activity.time || "12:00 PM",
          title: activity.title || `Visit to a place in ${city}`,
          description: activity.description || `Enjoy your time in ${city}`,
          budget: activity.budget || "$15-30",
          location: activity.location || `${city}, ${country}`
        }));
        
        // Return the parsed and validated content
        return {
          activities: validatedActivities,
          packingList: Array.isArray(parsedContent.packingList) ? parsedContent.packingList : [],
          tips: Array.isArray(parsedContent.tips) ? parsedContent.tips : []
        };
        
      } catch (parseError) {
        console.error("Failed to parse OpenAI response:", parseError);
        console.log("Raw response:", data.choices[0].message.content);
        throw new Error("Failed to parse OpenAI response");
      }
      
    } catch (apiError) {
      console.error("Error calling OpenAI API:", apiError);
      throw new Error("Failed to generate travel content. Please check your API key and try again.");
    }
  } catch (error) {
    console.error("Error generating destination content:", error);
    throw error; // Propagate the error instead of providing fallback content
  }
};

/**
 * Generate fallback activities for a destination when the main API call doesn't provide enough activities
 * @param destination The destination city and country
 * @param dayNumber The day number for which to generate activities
 * @returns Generated fallback activities
 */
export const generateFallbackActivities = async (
  destination: string,
  dayNumber: number
): Promise<OpenAIActivitySuggestion[]> => {
  try {
    const [city, country] = destination.split(',').map(part => part.trim());
    
    const prompt = `
      Generate 4 specific activities for day ${dayNumber} in ${city}, ${country}.
      The response should be in JSON format with the following structure:
      {
        "activities": [
          {
            "time": "9:00 AM",
            "title": "Visit to [SPECIFIC PLACE NAME]",
            "description": "Detailed description of the activity with specific information",
            "location": "Actual address or area within ${city}",
            "budget": "Approximate cost in local currency AND USD equivalent"
          }
        ]
      }

      CRITICALLY IMPORTANT REQUIREMENTS:
      1. Be EXTREMELY SPECIFIC - ALWAYS use actual attraction names, landmarks, museums, restaurants, parks, etc.
      2. NEVER use generic descriptions like "local museum" or "central park"
      3. For restaurants, ONLY suggest actual restaurant names that exist in ${city}
      4. Include specific street names, neighborhoods, or districts where relevant
      5. For activities, include what makes each place special or interesting to visit
      6. Include current 2024 prices in both local currency and USD
      7. Use current, verified addresses
      8. Include opening hours and best times to visit
      9. Space the activities throughout the day (morning, noon, afternoon, evening)
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.openai.apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: 'system',
            content: 'You are a travel expert providing detailed information about destinations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API responded with status ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Extract JSON from the response
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                      content.match(/```([\s\S]*?)```/) ||
                      [null, content];
    
    const jsonContent = jsonMatch[1] || content;
    const parsedContent = JSON.parse(jsonContent);

    return parsedContent.activities.map((activity: any) => ({
      time: activity.time,
      title: activity.title,
      description: activity.description,
      budget: activity.budget || "$15-30",
      location: activity.location || `${city} Area`
    }));
  } catch (error) {
    console.error("Error generating fallback activities:", error);
    const [city] = destination.split(',').map(part => part.trim());
    // If even the fallback fails, return generic activities
    return [
      {
        time: "9:00 AM",
        title: `Morning Exploration in ${city}`,
        description: `Start your day by exploring ${city}. Visit local attractions and enjoy the morning atmosphere.`,
        budget: "$15-30",
        location: `${city} Area`
      },
      {
        time: "12:30 PM",
        title: `Local Lunch in ${city}`,
        description: `Enjoy a meal at a local restaurant in ${city}. Try some regional specialties.`,
        budget: "$15-30",
        location: `${city} Area`
      },
      {
        time: "3:00 PM",
        title: `Afternoon Activity in ${city}`,
        description: `Spend your afternoon discovering more of ${city}'s attractions and culture.`,
        budget: "$15-30",
        location: `${city} Area`
      },
      {
        time: "7:00 PM",
        title: `Evening Entertainment in ${city}`,
        description: `End your day with some evening entertainment in ${city}.`,
        budget: "$15-30",
        location: `${city} Area`
      }
    ];
  }
};
