# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy

Pushes to the `main` branch trigger a GitHub Actions workflow that builds the app and publishes it to GitHub Pages. After merging, the site will be available at `https://<username>.github.io/contagem/`.
