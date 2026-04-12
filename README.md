# Archivum

An interactive plant taxonomy browser built with React + Vite. Features zoom/pan canvas rendering, collapsible nodes, search/highlight, and AI-powered plant classification via the Anthropic API.

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Add your Anthropic API key
cp .env.example .env
# Edit .env and replace the placeholder with your real key

# 3. Start the dev server
npm run dev
```

Then open http://localhost:5173 in your browser.

## Styles

DM Sans: https://fonts.google.com/specimen/DM+Sans?preview.script=Latn


## Getting an API key

1. Go to https://console.anthropic.com and sign up / log in
2. Navigate to **API Keys** and click **Create Key**
3. Copy the key (starts with `sk-ant-...`) and paste it into your `.env` file

> **Note:** Calling the Anthropic API directly from the browser exposes your key in network requests. This is fine for local development, but for a production deployment you should proxy API calls through a backend server that holds the key securely.

## Project structure

```
src/
  data/
    taxonomy.js          # Built-in plant taxonomy dataset + helpers
  hooks/
    useTreeLayout.js     # Tree layout calculation + state management
    useCanvasRenderer.js # Canvas drawing engine
  components/
    TaxonomyTree.jsx     # Main app shell (canvas, toolbar, interaction)
    TaxonomyTree.module.css
    DetailPanel.jsx      # Right-side node detail panel
    DetailPanel.module.css
    AddPlantBar.jsx      # AI classify + add bar at the bottom
    AddPlantBar.module.css
  App.jsx
  main.jsx
  index.css              # Global styles + light/dark theme variables
```

## Controls

| Action | How |
|--------|-----|
| Pan | Click and drag on empty space |
| Zoom | Scroll wheel / trackpad pinch |
| Expand/collapse node | Click the +/− on the right edge of any node |
| View details | Click a node |
| Search | Type in the search bar — matching nodes highlight |
| Add a plant | Type a plant name at the bottom and press Enter or click "Classify + Add" |

## Building for production

```bash
npm run build
```

Output goes to `dist/`. Remember to move your API calls to a backend before deploying publicly.
