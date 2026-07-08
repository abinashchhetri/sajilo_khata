// Meal voice parser
// Pure helper for voice quick-add — extracts meal name and optional calorie count.
// No DOM dependencies.

export interface ParsedMeal {
  name: string;
  calories: number | null;
}

export function parseMealVoice(transcript: string): ParsedMeal {
  // Look for a pattern like "100 cal" or "100calories" at the end
  const calorieMatch = transcript.match(/(\d+)\s*(?:cal|calories|kcal)(?:\s|$)/i);

  if (calorieMatch) {
    const calories = parseInt(calorieMatch[1], 10);
    // Remove the matched calorie fragment from the name
    const name = transcript
      .replace(calorieMatch[0], "")
      .trim();
    return { name: name || transcript, calories };
  }

  return { name: transcript.trim(), calories: null };
}
