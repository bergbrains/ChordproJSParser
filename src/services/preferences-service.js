// src/services/preferences-service.js

const PREFERENCES_KEY = "user_preferences";

const defaultPreferences = {
  theme: "system",
  showChords: true,
  showComments: true,
  zoomLevel: 1.0,
  autoLoadLastSong: true,
  googleClientId: "",
  googleApiKey: "",
};

const validatePreferences = (data) => {
  const validated = {};

  if (data.theme === "light" || data.theme === "dark" || data.theme === "system") {
    validated.theme = data.theme;
  }

  if (typeof data.showChords === "boolean") {
    validated.showChords = data.showChords;
  }

  if (typeof data.showComments === "boolean") {
    validated.showComments = data.showComments;
  }

  if (typeof data.zoomLevel === "number" && data.zoomLevel > 0) {
    validated.zoomLevel = data.zoomLevel;
  }

  if (typeof data.autoLoadLastSong === "boolean") {
    validated.autoLoadLastSong = data.autoLoadLastSong;
  }

  if (typeof data.googleClientId === "string") {
    validated.googleClientId = data.googleClientId;
  }

  if (typeof data.googleApiKey === "string") {
    validated.googleApiKey = data.googleApiKey;
  }

  return validated;
};

export const getPreferences = () => {
  try {
    const stored = localStorage.getItem(PREFERENCES_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const validated = validatePreferences(parsed);
      return { ...defaultPreferences, ...validated };
    }
  } catch (error) {
    console.error("Failed to load preferences", error);
  }
  return defaultPreferences;
};

export const savePreferences = (preferences) => {
  try {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error("Failed to save preferences", error);
    throw new Error("Failed to save preferences");
  }
};

export const resetPreferences = () => {
  try {
    localStorage.removeItem(PREFERENCES_KEY);
  } catch (error) {
    console.error("Failed to reset preferences", error);
  }
};
