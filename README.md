# Blanc Mind Writer

Want to write but your mind goes completely blank? Do a stream-of-consciousness brain dump by writing anything that comes to mind for five minutes.

A minimal, distraction-free plain text editor that runs entirely in the browser.
Built with plain HTML, CSS and JavaScript (DOM only, no dependencies, no build step).

## Features

- Clean full-page editor in a monospace, dark/light themed layout
- **5-Minute Brain Dump timer**: pick 1–30 minutes (default 5), press Start, and write whatever comes to mind until the timer ends
- Automatic saving to your browser (`localStorage`), so a refresh never loses your text
- Live word count
- Save your writing as a `.txt` file

## Privacy

Everything stays in your browser. Nothing is sent to any server.

## Run locally

Just open `index.html` in a browser. Or serve the folder:

```bash
npx serve .
```

## Deploy on Vercel (free Hobby plan)

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Leave Framework Preset as **Other**, with no build command and no output directory.
4. Click **Deploy**.

Every push to `main` redeploys automatically.

## License

MIT
