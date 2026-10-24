# eggseed

A tiny, monochrome, early-web country-music archive inspired by the intimate page geometry of poempuppy.neocities.org. Independent HTML/CSS implementation with original textual cowboy and record drawings. No original site source or assets copied.

## Pages

- Home: little introduction, listening corner, recent three blog posts
- About, Blog, 45 RPM, Media/scans, Photos, ASCII maker
- Three starter blog pages in `blog/`

## Publish

GitHub Pages: Settings > Pages > Deploy from branch > main > /(root). Address: https://eggseed1.github.io/eggseed/

## Edit

Change content in the relevant HTML file. Add records to `45rpm.html`, real scans to `media.html`, and new posts to `blog/`, then update the home/blog indexes. Every page uses `style.css`. The core site is pure HTML/CSS. Only `ascii.html` loads a small self-hosted vanilla JavaScript file for local image conversion. No libraries, external assets, image uploads, remote requests, cookies, or trackers.

The in-browser ASCII maker converts local raster pictures to editable text, with width, contrast, brightness, character-palette and invert controls. Save the result as .txt or copy it. It needs JavaScript because plain HTML/CSS cannot read pixels; all computation stays in your browser. The optional Python converter still works offline.
