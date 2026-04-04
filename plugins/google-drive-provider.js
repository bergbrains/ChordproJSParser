/**
 * GoogleDriveProvider - A pluggable storage provider that uses Google Drive
 * to store and retrieve ChordPro song files.
 *
 * Usage:
 *   1. Replace CLIENT_ID and API_KEY with your own credentials from Google Cloud Console.
 *   2. Call provider.init() to load the necessary Google API scripts.
 *   3. Call provider.login() to trigger the OAuth2 popup flow.
 *   4. Use listSongs(), saveSong(), loadSong(), saveState(), loadState() as needed.
 *
 * All files are stored in a folder named "ChordproJS" on the user's Google Drive.
 * A manifest.json index and a state.json are maintained in that folder.
 */

(function (root, factory) {
  /* global define */
  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory();
  } else if (typeof define === "function" && define.amd) {
    define(factory);
  } else {
    root.GoogleDriveProvider = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this, function () {

  // ---------------------------------------------------------------------------
  // Replace these placeholders with your own credentials from Google Cloud Console.
  // Steps:
  //   1. Go to https://console.cloud.google.com/apis/credentials
  //   2. Create an OAuth 2.0 Client ID (Web application type).
  //   3. Add your site's origin to "Authorized JavaScript origins".
  //   4. Create an API Key and restrict it to the Drive API.
  //   5. Replace the values below — never commit real credentials to source control.
  // ---------------------------------------------------------------------------
  var DEFAULT_CLIENT_ID = "YOUR_CLIENT_ID.apps.googleusercontent.com";
  var DEFAULT_API_KEY = "YOUR_API_KEY";

  var DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest";
  var SCOPES = "https://www.googleapis.com/auth/drive.file";
  var DEFAULT_FOLDER_NAME = "ChordProJS";
  var MANIFEST_FILE = "manifest.json";
  var STATE_FILE = "state.json";

  /**
   * GoogleDriveProvider constructor
   * @param {object} options
   * @param {string} [options.clientId] - OAuth2 Client ID (overrides DEFAULT_CLIENT_ID)
   * @param {string} [options.apiKey]   - API Key (overrides DEFAULT_API_KEY)
   * @param {string} [options.folderId] - Google Drive folder ID
   * @param {string} [options.folderName] - Google Drive folder name
   */
  function GoogleDriveProvider(options) {
    options = options || {};
    this.clientId = options.clientId || DEFAULT_CLIENT_ID;
    this.apiKey = options.apiKey || DEFAULT_API_KEY;
    this.folderId = options.folderId || null;
    this.folderName = options.folderName || DEFAULT_FOLDER_NAME;

    this._gapiReady = false;
    this._gisReady = false;
    this._pickerReady = false;
    this._initPromise = null;
    this._tokenClient = null;
    this._accessToken = null;
    this._cachedFolderId = this.folderId;
  }

  // ---------------------------------------------------------------------------
  // Initialisation
  // ---------------------------------------------------------------------------

  /**
   * Load the Google API (gapi) and Google Identity Services (GIS) scripts,
   * then initialise the gapi client with the Drive discovery document.
   *
   * @returns {Promise<void>}
   */
  GoogleDriveProvider.prototype.init = function () {
    var self = this;

    if (self._initPromise) {
      return self._initPromise;
    }

    if ((!self.apiKey || self.apiKey === "YOUR_API_KEY") && (!self.clientId || self.clientId === "YOUR_CLIENT_ID.apps.googleusercontent.com")) {
      var errDefault = new Error("GoogleDriveProvider: Missing credentials (API Key or Client ID). Please replace placeholders in 'plugins/google-drive-provider.js' or pass valid credentials to the constructor.");
      console.error(errDefault.message);
      return Promise.reject(errDefault);
    }

    if (window.location.protocol === "file:") {
      var errProtocol = new Error("GoogleDriveProvider: Cannot be used from 'file://' origin. Please run via a web server (e.g., http://localhost).");
      console.error(errProtocol.message);
      return Promise.reject(errProtocol);
    }

    self._initPromise = Promise.all([
      self._loadScript("https://apis.google.com/js/api.js").then(function () {
        return new Promise(function (resolve, reject) {
          if (!window.gapi) {
            reject(new Error("GoogleDriveProvider: window.gapi not found after script load."));
            return;
          }
          /* eslint-disable-next-line no-console */
          console.log("GoogleDriveProvider: gapi script loaded, loading client and picker...");
          window.gapi.load("client:picker", {
            callback: function () {
              if (!window.gapi.client) {
                reject(new Error("GoogleDriveProvider: window.gapi.client not found after gapi.load."));
                return;
              }
              self._pickerReady = true;
              var initOptions = {
                discoveryDocs: [DISCOVERY_DOC]
              };

              // Only include API Key if it's not the placeholder and not empty
              if (self.apiKey && self.apiKey !== "YOUR_API_KEY" && self.apiKey.trim() !== "") {
                initOptions.apiKey = self.apiKey;
              }

              window.gapi.client
                .init(initOptions)
                .then(function () {
                  /* eslint-disable-next-line no-console */
                  console.log("GoogleDriveProvider: gapi client initialized.");
                  self._gapiReady = true;
                  resolve();
                })
                .catch(function (err) {
                  var msg = (err && err.details) || (err && err.message) || (err && JSON.stringify(err)) || "Unknown gapi.client.init error";

                  // Check if it's an API key error
                  if (msg.indexOf("API_KEY_INVALID") !== -1 || msg.indexOf("API key not valid") !== -1) {
                    msg = "Invalid API key. See: https://console.cloud.google.com/apis/credentials";
                  }

                  reject(new Error("GoogleDriveProvider: gapi.client.init failed: " + msg));
                });
            },
            onerror: function (err) {
              reject(new Error("GoogleDriveProvider: gapi.load failed: " + (err || "unknown error")));
            }
          });
        });
      }),

      self._loadScript("https://accounts.google.com/gsi/client").then(function () {
        return new Promise(function (resolve, reject) {
          if (!window.google || !window.google.accounts || !window.google.accounts.oauth2) {
            reject(new Error("GoogleDriveProvider: window.google.accounts.oauth2 not found after script load."));
            return;
          }

          // Only initialize token client if we have a potentially valid Client ID
          if (self.clientId && self.clientId !== "YOUR_CLIENT_ID.apps.googleusercontent.com" && self.clientId.trim() !== "") {
            try {
              self._tokenClient = window.google.accounts.oauth2.initTokenClient({
                client_id: self.clientId,
                scope: SCOPES,
                callback: function (tokenResponse) {
                  if (tokenResponse && tokenResponse.access_token) {
                    self._accessToken = tokenResponse.access_token;
                  }
                }
              });
              self._gisReady = true;
              resolve();
            } catch (err) {
              reject(new Error("GoogleDriveProvider: initTokenClient failed: " + (err.message || "unknown error")));
            }
          } else {
            // We can't init the token client yet, but the script is loaded.
            // We'll mark GIS as ready but tokenClient as null.
            self._gisReady = true;
            resolve();
          }
        });
      })
    ]);

    return self._initPromise;
  };

  // ---------------------------------------------------------------------------
  // Authentication
  // ---------------------------------------------------------------------------

  /**
   * Trigger the OAuth2 Implicit Grant popup.
   * Resolves once an access token has been granted.
   *
   * @param {object} [options]
   * @param {string} [options.prompt] - OAuth prompt parameter. Defaults to '' (silent/minimal
   *   prompt — no popup if the user has an active session). Pass 'select_account' to force
   *   the account-selection UI (e.g. when the user explicitly clicks "Sign in").
   * @returns {Promise<string>} The access token
   */
  GoogleDriveProvider.prototype.login = function (options) {
    var self = this;
    options = options || {};

    if (!self._gisReady || !self._gapiReady) {
      return self.init().then(function () {
        return self.login(options);
      });
    }

    if (!self._tokenClient) {
      var errNoClient = new Error("GoogleDriveProvider: Cannot login because Client ID is missing or invalid. Please provide a valid Google OAuth2 Client ID in the settings.");
      return Promise.reject(errNoClient);
    }

    return new Promise(function (resolve, reject) {
      var timeout = setTimeout(function () {
        reject(new Error("GoogleDriveProvider: Login timed out. Please check if the popup was blocked or closed."));
      }, 60000); // 60s timeout

      // Override the callback to resolve the promise
      self._tokenClient.callback = function (tokenResponse) {
        clearTimeout(timeout);
        /* eslint-disable-next-line no-console */
        console.log("GoogleDriveProvider: GIS callback received.", tokenResponse);
        if (tokenResponse.error) {
          reject(new Error("OAuth error: " + tokenResponse.error + (tokenResponse.error_description ? " - " + tokenResponse.error_description : "")));
          return;
        }
        self._accessToken = tokenResponse.access_token;
        window.gapi.client.setToken({ access_token: self._accessToken });
        resolve(self._accessToken);
      };

      /* eslint-disable-next-line no-console */
      console.log("GoogleDriveProvider: Requesting access token...");
      // Default to silent/minimal prompt ('') to avoid unnecessary re-auth.
      // Callers can pass { prompt: 'select_account' } to force account selection.
      var prompt = (options.prompt !== undefined) ? options.prompt : "";
      self._tokenClient.requestAccessToken({ prompt: prompt });
    });
  };

  /**
   * Revoke the current access token.
   */
  GoogleDriveProvider.prototype.logout = function () {
    if (this._accessToken) {
      try {
        window.google.accounts.oauth2.revoke(this._accessToken);
      } catch (e) {
        console.warn("GoogleDriveProvider: Failed to revoke token:", e);
      }
      this._accessToken = null;
      if (window.gapi && window.gapi.client) {
        window.gapi.client.setToken(null);
      }
    }
  };

  /**
   * Returns true if the user is currently authenticated.
   * @returns {boolean}
   */
  GoogleDriveProvider.prototype.isAuthenticated = function () {
    return !!this._accessToken;
  };

  // ---------------------------------------------------------------------------
  // Song management
  // ---------------------------------------------------------------------------

  /**
   * List songs from the ChordproJS folder on Drive.
   * Always performs a live scan for .pro files so newly-added or externally-uploaded
   * files are always visible (no stale manifest cache).
   *
   * @returns {Promise<Array<{id: string, name: string, lastModified: string}>>}
   */
  GoogleDriveProvider.prototype.listSongs = function () {
    var self = this;

    return self._ensureFolder().then(function (folderId) {
      return self._listProFiles(folderId).then(function (files) {
        return files.map(function (f) {
          return {
            id: f.id,
            name: f.name,
            lastModified: f.modifiedTime || new Date().toISOString()
          };
        });
      });
    });
  };

  /**
   * Save or update a .pro file in the ChordproJS folder and refresh manifest.json.
   *
   * @param {string} fileName - File name (e.g. "mysong.pro")
   * @param {string} content  - Raw ChordPro text
   * @returns {Promise<{id: string, name: string, lastModified: string}>} File metadata
   */
  GoogleDriveProvider.prototype.saveSong = function (fileName, content) {
    var self = this;

    return self._ensureFolder().then(function (folderId) {
      return self._findFile(fileName, folderId).then(function (existing) {
        var promise = existing
          ? self._updateFile(existing.id, content)
          : self._createFile(fileName, "text/plain", content, folderId);

        return promise.then(function (file) {
          var entry = {
            id: file.id,
            name: fileName,
            lastModified: file.modifiedTime || new Date().toISOString()
          };

          // Refresh manifest
          return self.listSongs().then(function (manifest) {
            var idx = manifest.findIndex(function (m) { return m.name === fileName; });
            if (idx >= 0) {
              manifest[idx] = entry;
            } else {
              manifest.push(entry);
            }
            return self._saveManifest(manifest, folderId).then(function () {
              return entry;
            });
          });
        });
      });
    });
  };

  /**
   * Fetch the raw text content of a file by its Drive file ID.
   *
   * @param {string} fileId - Google Drive file ID
   * @returns {Promise<string>} Raw file content
   */
  GoogleDriveProvider.prototype.loadSong = function (fileId) {
    return this._fetchFileContent(fileId);
  };

  // ---------------------------------------------------------------------------
  // State management
  // ---------------------------------------------------------------------------

  /**
   * Persist an arbitrary state object to state.json in the ChordproJS folder.
   *
   * @param {object} state
   * @returns {Promise<void>}
   */
  GoogleDriveProvider.prototype.saveState = function (state) {
    var self = this;
    var content = JSON.stringify(state);

    return self._ensureFolder().then(function (folderId) {
      return self._findFile(STATE_FILE, folderId).then(function (existing) {
        if (existing) {
          return self._updateFile(existing.id, content);
        }
        return self._createFile(STATE_FILE, "application/json", content, folderId);
      });
    });
  };

  /**
   * Load the state object from state.json in the ChordproJS folder.
   * Returns null if no state has been saved yet.
   *
   * @returns {Promise<object|null>}
   */
  GoogleDriveProvider.prototype.loadState = function () {
    var self = this;

    return self._ensureFolder().then(function (folderId) {
      return self._findFile(STATE_FILE, folderId).then(function (stateFile) {
        if (!stateFile) {
          return null;
        }
        return self._fetchFileContent(stateFile.id).then(function (text) {
          try {
            return JSON.parse(text);
          } catch (_e) {
            return null;
          }
        });
      });
    });
  };

  // ---------------------------------------------------------------------------
  // Folder configuration
  // ---------------------------------------------------------------------------

  /**
   * Update the target folder without requiring re-authentication.
   * The previously-cached folder ID is cleared so the next operation resolves
   * (and if necessary creates) the new folder.
   *
   * @param {string|null} folderId   - Known Drive folder ID, or null to resolve by name.
   * @param {string}      folderName - Human-readable folder name used when folderId is null.
   */
  GoogleDriveProvider.prototype.updateFolderSettings = function (folderId, folderName) {
    this.folderId = folderId || null;
    this.folderName = folderName || DEFAULT_FOLDER_NAME;
    this._cachedFolderId = folderId || null;
  };

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  /**
   * Ensure the folder exists on Drive, creating it if needed.
   * Caches the folder ID for subsequent calls.
   *
   * @returns {Promise<string>} Folder ID
   */
  GoogleDriveProvider.prototype._ensureFolder = function () {
    var self = this;

    if (self._cachedFolderId) {
      return Promise.resolve(self._cachedFolderId);
    }

    var query =
      "mimeType='application/vnd.google-apps.folder'" +
      " and name='" + self.folderName + "'" +
      " and trashed=false";

    return window.gapi.client.drive.files
      .list({ q: query, fields: "files(id, name)", spaces: "drive" })
      .then(function (response) {
        var files = response.result.files;
        if (files && files.length > 0) {
          self._cachedFolderId = files[0].id;
          return self._cachedFolderId;
        }

        // Create the folder
        return window.gapi.client.drive.files
          .create({
            resource: {
              name: self.folderName,
              mimeType: "application/vnd.google-apps.folder"
            },
            fields: "id"
          })
          .then(function (response) {
            self._cachedFolderId = response.result.id;
            return self._cachedFolderId;
          });
      });
  };

  /**
   * Find a file by name within a specific folder.
   *
   * @param {string} name     - File name
   * @param {string} folderId - Parent folder ID
   * @returns {Promise<{id: string, name: string}|null>}
   */
  GoogleDriveProvider.prototype._findFile = function (name, folderId) {
    var safeName = name.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
    var query =
      "name='" + safeName + "'" +
      " and '" + folderId + "' in parents" +
      " and trashed=false";

    return window.gapi.client.drive.files
      .list({ q: query, fields: "files(id, name, modifiedTime)", spaces: "drive" })
      .then(function (response) {
        var files = response.result.files;
        return files && files.length > 0 ? files[0] : null;
      });
  };

  /**
   * List all .pro files inside a folder, handling Drive API pagination automatically.
   *
   * @param {string} folderId
   * @param {string} [pageToken] - Internal pagination cursor; callers should omit this.
   * @returns {Promise<Array<{id: string, name: string, modifiedTime: string}>>}
   */
  GoogleDriveProvider.prototype._listProFiles = function (folderId, pageToken) {
    var self = this;
    var query =
      "'" + folderId + "' in parents" +
      " and name contains '.pro'" +
      " and mimeType != 'application/vnd.google-apps.folder'" +
      " and trashed=false";

    var params = {
      q: query,
      fields: "nextPageToken, files(id, name, modifiedTime)",
      spaces: "drive",
      pageSize: 1000
    };

    if (pageToken) {
      params.pageToken = pageToken;
    }

    return window.gapi.client.drive.files
      .list(params)
      .then(function (response) {
        var files = response.result.files || [];
        var nextToken = response.result.nextPageToken;
        if (nextToken) {
          return self._listProFiles(folderId, nextToken).then(function (more) {
            return files.concat(more);
          });
        }
        return files;
      });
  };

  /**
   * Fetch the text content of a Drive file using the alt=media download endpoint.
   *
   * @param {string} fileId
   * @returns {Promise<string>}
   */
  GoogleDriveProvider.prototype._fetchFileContent = function (fileId) {
    var self = this;

    return window.gapi.client
      .request({
        path: "https://www.googleapis.com/drive/v3/files/" + fileId,
        params: { alt: "media" },
        headers: { Authorization: "Bearer " + self._accessToken }
      })
      .then(function (response) {
        return response.body;
      });
  };

  /**
   * Create a new file on Drive with the given content.
   *
   * @param {string} name      - File name
   * @param {string} mimeType  - MIME type
   * @param {string} content   - File text content
   * @param {string} folderId  - Parent folder ID
   * @returns {Promise<{id: string, modifiedTime: string}>}
   */
  GoogleDriveProvider.prototype._createFile = function (name, mimeType, content, folderId) {
    var self = this;
    var boundary = "chordprojs_boundary_" + Date.now();
    var delimiter = "--" + boundary;
    var closeDelimiter = "--" + boundary + "--";

    var metadata = JSON.stringify({ name: name, parents: [folderId] });

    var body =
      delimiter + "\r\n" +
      "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
      metadata + "\r\n" +
      delimiter + "\r\n" +
      "Content-Type: " + mimeType + "\r\n\r\n" +
      content + "\r\n" +
      closeDelimiter;

    return window.gapi.client
      .request({
        path: "https://www.googleapis.com/upload/drive/v3/files",
        method: "POST",
        params: { uploadType: "multipart", fields: "id, modifiedTime" },
        headers: {
          "Content-Type": "multipart/related; boundary=" + boundary,
          Authorization: "Bearer " + self._accessToken
        },
        body: body
      })
      .then(function (response) {
        return response.result;
      });
  };

  /**
   * Update the content of an existing Drive file.
   *
   * @param {string} fileId  - Drive file ID
   * @param {string} content - New file content
   * @returns {Promise<{id: string, modifiedTime: string}>}
   */
  GoogleDriveProvider.prototype._updateFile = function (fileId, content) {
    var self = this;

    return window.gapi.client
      .request({
        path: "https://www.googleapis.com/upload/drive/v3/files/" + fileId,
        method: "PATCH",
        params: { uploadType: "media", fields: "id, modifiedTime" },
        headers: {
          "Content-Type": "text/plain",
          Authorization: "Bearer " + self._accessToken
        },
        body: content
      })
      .then(function (response) {
        return response.result;
      });
  };

  /**
   * Open the Google Picker to let the user select a folder.
   * Shows a hierarchical Drive browser filtered to folders only.
   * @returns {Promise<{id: string, name: string}>}
   */
  GoogleDriveProvider.prototype.pickFolder = function () {
    var self = this;

    if (!self._pickerReady || !self._accessToken) {
      return self.login().then(function () {
        return self.pickFolder();
      });
    }

    return new Promise(function (resolve, reject) {
      if (!window.google || !window.google.picker) {
        reject(new Error("GoogleDriveProvider: Google Picker API not loaded."));
        return;
      }

      var timeout = setTimeout(function () {
        reject(new Error("GoogleDriveProvider: Picker timed out."));
      }, 120000); // 120s timeout for picking

      // Use a DocsView (not ViewId.FOLDERS) so users can navigate the folder
      // hierarchy rather than seeing a flat alphabetical list of all folders.
      var view = new window.google.picker.DocsView()
        .setIncludeFolders(true)
        .setMimeTypes("application/vnd.google-apps.folder")
        .setSelectFolderEnabled(true);

      var pickerBuilder = new window.google.picker.PickerBuilder()
        .setTitle("Select a Folder")
        .addView(view)
        .setOAuthToken(self._accessToken)
        .setCallback(function (data) {
          /* eslint-disable-next-line no-console */
          console.log("GoogleDriveProvider: Picker callback action:", data.action);
          if (data.action === window.google.picker.Action.PICKED) {
            clearTimeout(timeout);
            var doc = data.docs[0];
            self.folderId = doc.id;
            self.folderName = doc.name;
            self._cachedFolderId = doc.id;
            resolve({ id: doc.id, name: doc.name });
          } else if (data.action === window.google.picker.Action.CANCEL) {
            clearTimeout(timeout);
            reject(new Error("Picker cancelled"));
          }
        });

      if (self.apiKey && self.apiKey !== "YOUR_API_KEY") {
        pickerBuilder.setDeveloperKey(self.apiKey);
      }

      var picker = pickerBuilder.build();
      picker.setVisible(true);
    });
  };

  /**
   * Overwrite manifest.json in the ChordproJS folder.
   *
   * @param {Array} manifest
   * @param {string} folderId
   * @returns {Promise<void>}
   */
  GoogleDriveProvider.prototype._saveManifest = function (manifest, folderId) {
    var self = this;
    var content = JSON.stringify(manifest, null, 2);

    return self._findFile(MANIFEST_FILE, folderId).then(function (existing) {
      if (existing) {
        return self._updateFile(existing.id, content);
      }
      return self._createFile(MANIFEST_FILE, "application/json", content, folderId);
    });
  };

  /**
   * Dynamically load an external script, resolving when it is ready.
   *
   * @param {string} src
   * @returns {Promise<void>}
   */
  GoogleDriveProvider.prototype._loadScript = function (src) {
    return new Promise(function (resolve, reject) {
      // Avoid loading the same script twice
      var existing = document.querySelector("script[src=\"" + src + "\"]");
      if (existing) {
        resolve();
        return;
      }
      var script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.defer = true;
      script.onload = function () { resolve(); };
      script.onerror = function () { reject(new Error("Failed to load script: " + src)); };
      document.head.appendChild(script);
    });
  };

  return GoogleDriveProvider;
});
