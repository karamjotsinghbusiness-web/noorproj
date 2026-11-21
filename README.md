# Noor's little happy place

A little matcha-and-lilies adventure for Noor, with ginger jokes and a letter at the end.

## Website

The game is published with GitHub Pages. The deployment workflow uploads only the contents of `dist/`, with `index.html` at the website root. There is no build step and no external library or font dependency.

Push changes to `dist/` on `main` to publish them automatically. Deployment status and the live URL appear in the repository's Actions and Deployments views. You can also run **Deploy game to GitHub Pages** manually from Actions.

The website is public. The user authorized making this repository public to enable GitHub Pages on the account's current plan.

## Local preview

```sh
python3 -m http.server 8000 --directory dist
```

Open `http://localhost:8000/` in a browser.

## Files

- `dist/index.html`: page structure and native controls.
- `dist/styles.css`: responsive layout, sprites, and animations.
- `dist/game.js`: the game, letter, and optional sound.
- `dist/assets/`: the watercolor garden and transparent sprite sheet.
- `.github/workflows/pages.yml`: GitHub Pages publication.

The `.openai/hosting.json` file records the earlier Sites deployment. GitHub Pages does not use it or publish it.
