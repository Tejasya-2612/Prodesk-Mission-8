import axios from 'axios'

const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

const GENERIC_MOOD_WORDS = new Set([
  'action',
  'adventure',
  'comedy',
  'drama',
  'fantasy',
  'happy',
  'horror',
  'mystery',
  'romance',
  'sad',
  'scary',
  'sci-fi',
  'science fiction',
  'thriller',
])

const getFallbackTitle = (mood) => {
  const normalizedMood = mood.toLowerCase()

  if (normalizedMood.includes('thriller')) return 'Se7en'
  if (normalizedMood.includes('sad')) return 'The Pursuit of Happyness'
  if (normalizedMood.includes('action')) return 'Mad Max: Fury Road'
  if (normalizedMood.includes('comedy') || normalizedMood.includes('funny')) {
    return 'The Grand Budapest Hotel'
  }
  if (normalizedMood.includes('horror') || normalizedMood.includes('scary')) {
    return 'Get Out'
  }
  if (normalizedMood.includes('romance')) return 'Before Sunrise'
  if (normalizedMood.includes('mystery')) return 'Gone Girl'
  if (normalizedMood.includes('sci-fi') || normalizedMood.includes('science fiction')) {
    return 'Arrival'
  }

  return 'The Shawshank Redemption'
}

export const getMoodMovieTitle = async (mood) => {
  const apiKey = import.meta.env.VITE_GEMINI_KEY

  if (!apiKey) {
    throw new Error('Missing VITE_GEMINI_KEY. Add it to your environment variables.')
  }

  let response

  try {
    response = await axios.post(
      `${GEMINI_ENDPOINT}?key=${apiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: [
                  'Suggest ONE real, well-known movie title based on this mood.',
                  'Return ONLY the exact movie title, with no genre names, no explanation, no punctuation, and no quotes.',
                  'Do not return broad words like thriller, comedy, action, sad, happy, horror, or romance.',
                  `Mood: ${mood}`,
                ].join('\n'),
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 80,
          thinkingConfig: {
            thinkingBudget: 0,
          },
        },
      },
    )
  } catch (error) {
    const status = error.response?.status

    if (!error.response) {
      throw new Error(
        'Could not reach Gemini from the browser. Check your internet connection, ad blocker, browser network permissions, or move this call to a Vercel/Netlify serverless function for production.',
        { cause: error },
      )
    }

    if (status === 400 || status === 403) {
      throw new Error(
        'Gemini rejected the request. Check that VITE_GEMINI_KEY is valid and enabled for the Gemini API.',
        { cause: error },
      )
    }

    if (status === 404) {
      throw new Error(
        'Gemini model was not found. The app now uses gemini-2.5-flash; restart Vite and try again.',
        { cause: error },
      )
    }

    throw new Error('Gemini recommendation failed. Please try again in a moment.', {
      cause: error,
    })
  }

  const rawTitle = response.data?.candidates?.[0]?.content?.parts?.[0]?.text

  if (!rawTitle) {
    return getFallbackTitle(mood)
  }

  const cleanedTitle = rawTitle
    .replace(/["'\n\r]/g, '')
    .replace(/^(movie title|title):/i, '')
    .trim()

  if (!cleanedTitle || GENERIC_MOOD_WORDS.has(cleanedTitle.toLowerCase())) {
    return getFallbackTitle(mood)
  }

  return cleanedTitle
}
