// tests/preferences-service.test.js
import {
  getPreferences,
  savePreferences,
  resetPreferences,
} from "../src/services/preferences-service";

describe("PreferencesService", () => {
  beforeEach(() => {
    // Mock localStorage
    const localStorageMock = (function () {
      let store = {};
      return {
        getItem: function (key) {
          return store[key] || null;
        },
        setItem: function (key, value) {
          store[key] = value.toString();
        },
        removeItem: function (key) {
          delete store[key];
        },
        clear: function () {
          store = {};
        },
      };
    })();

    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
      writable: true,
    });

    // Mock console.error
    jest.spyOn(console, "error").mockImplementation(() => {});

    resetPreferences();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("should return default preferences when nothing is stored", () => {
    const prefs = getPreferences();
    expect(prefs).toEqual({
      theme: "system",
      showChords: true,
      showComments: true,
      zoomLevel: 1.0,
      autoLoadLastSong: true,
      googleClientId: "",
      googleApiKey: "",
      googleFolderId: "",
      googleFolderName: "ChordProJS",
      driveFileExtension: ".pro",
      drivePollInterval: 30,
    });
  });

  test("should save and load preferences", () => {
    const newPrefs = {
      theme: "dark",
      showChords: false,
      showComments: false,
      zoomLevel: 1.5,
      autoLoadLastSong: false,
      googleClientId: "test-client-id",
      googleApiKey: "test-api-key",
      googleFolderId: "",
      googleFolderName: "ChordProJS",
      driveFileExtension: ".cho",
      drivePollInterval: 60,
    };

    savePreferences(newPrefs);
    const loadedPrefs = getPreferences();
    expect(loadedPrefs).toEqual(newPrefs);
  });

  test("should validate and merge partial preferences", () => {
    const stored = JSON.stringify({
      theme: "dark",
      zoomLevel: 2.0,
      invalidKey: "should be ignored",
    });
    window.localStorage.setItem("user_preferences", stored);

    const loadedPrefs = getPreferences();
    expect(loadedPrefs.theme).toBe("dark");
    expect(loadedPrefs.zoomLevel).toBe(2.0);
    expect(loadedPrefs.showChords).toBe(true); // default
    expect(loadedPrefs).not.toHaveProperty("invalidKey");
  });

  test("should handle invalid JSON in localStorage", () => {
    window.localStorage.setItem("user_preferences", "invalid-json");
    const prefs = getPreferences();
    expect(prefs.theme).toBe("system"); // returns default
    expect(console.error).toHaveBeenCalled();
  });

  test("should reset preferences", () => {
    savePreferences({ theme: "dark" });
    resetPreferences();
    const prefs = getPreferences();
    expect(prefs.theme).toBe("system");
  });

  test("should throw error if saving fails", () => {
    jest.spyOn(window.localStorage, "setItem").mockImplementation(() => {
      throw new Error("Quota exceeded");
    });

    expect(() => {
      savePreferences({ theme: "dark" });
    }).toThrow("Failed to save preferences");
    expect(console.error).toHaveBeenCalled();
  });
});
