# Notion Hosted Embed Integration

To use the ChordproJS plugin within Notion, follow these steps to host your rendering environment and embed it.

### Code Structure
The implementation is located in `plugins/notion/index.html`. It provides:
- A target `<div id="plugin-root"></div>` for rendering.
- Inclusion of the `chordprojs` library via CDN.
- Basic styling that works well with Notion's embed block.

### Hosting Steps
To make this file available online for Notion, use one of these free services:

1. **GitHub Pages (Easiest for this repo)**
   - Push this directory to a GitHub repository.
   - Go to **Settings > Pages** and select the branch you've pushed to.
   - Once deployed, your URL will be `https://<username>.github.io/<repo-name>/plugins/notion/index.html`.

2. **Vercel / Netlify**
   - Connect your GitHub repo to Vercel or Netlify.
   - They will automatically deploy your files on every push.
   - Your URL will be something like `https://<project-name>.vercel.app/plugins/notion/index.html`.

### Notion Integration
1. Open your Notion page.
2. Type `/embed` and press Enter.
3. Paste the **live URL** of your hosted `index.html`.
4. Notion will render the HTML file inside an iframe, loading your plugin and rendering the ChordPro content.

### Troubleshooting
- **'Refused to connect' (X-Frame-Options):** Ensure your hosting provider allows embedding. GitHub Pages and Vercel allow this by default. If you use a custom server, make sure the `X-Frame-Options` header is NOT set to `DENY` or `SAMEORIGIN`.
- **'Unsafe attempt to load URL' (Security Origin):** If you're testing locally via the `file://` protocol, browsers may block the script from loading or restrict frame access. For local development, use a simple HTTP server (e.g., `npx serve .` or `python -m http.server`).
- **Content not updating:** Notion may cache the embed. Try re-pasting the URL or adding a query parameter like `?v=1` to force a refresh.
- **Scrollbars:** If your content is longer than the embed block, Notion will show scrollbars. Resize the embed block in Notion to fit your content.
