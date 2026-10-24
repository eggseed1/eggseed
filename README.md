# eggseed

A tiny, monochrome, early-web country-music archive inspired by the intimate page geometry of poempuppy.neocities.org. Independent HTML/CSS implementation with original textual cowboy and record drawings. Original horse ASCII illustrations and ASCII lace sampled from the user-supplied reference.

## Pages

- Home: ASCII title, moving horses, introduction, Currently sidebar, and maker entrance
- About, Blog (writing), Archive (collected items), 45 RPM, Media/scans, Photos, ASCII maker
- Three starter blog pages in `blog/`

## Publish

GitHub Pages: Settings > Pages > Deploy from branch > main > /(root). Address: https://eggseed1.github.io/eggseed/

## Edit

Change content in the relevant HTML file. Add record photos in `assets/records/`, real magazine scans on `media.html`, and new posts in `blog/`. Update each index when adding a new item. Every page uses `style.css`. The core site is pure HTML/CSS. Only `ascii.html` loads a self-hosted vanilla JavaScript file for locally converting images and typed words to ASCII. No libraries, external assets, image uploads, remote requests, cookies, or trackers.

## Last.fm — currently listening (text only)

The shared **currently...** sidebar box on every page shows:
- **reading:** *Warlock* — Oakley Hall (static)
- **listening:** the most recent Last.fm scrobble (rendered into every page during deployment)

To connect your public Last.fm profile, edit `lastfm-username.txt` and enter your Last.fm username on its own line. Alternatively set the repository Actions variable `LASTFM_USERNAME`. Then run **Actions → Publish eggseed → Run workflow** or push to `main`. The scheduled workflow also refreshes the last played track at approximately minute 17 of every hour (GitHub schedule times are not guaranteed).

With only a username, the build fetches a public RSS feed from the unofficial `lfm.xiffy.nl` bridge; no Last.fm API key is needed. If you prefer the official Last.fm recent tracks API, set GitHub Actions secret `LASTFM_API_KEY` (do not commit it). The official API detects now-playing tracks, while RSS is shown as the last scrobble. No visitor-side JavaScript, tracking or Last.fm requests are added.

If the feed is temporarily down, the website displays a profile link instead of claiming a track is playing. The listening line remains a placeholder until a username is configured.

The in-browser ASCII maker turns local photos, record scans and screenshots into editable text at **24–1,200 columns**. Use the quick presets (80, 160, 320, 640 and 1,200) or type an exact column count. The fine-detail palette offers many more grayscale steps than classic ASCII; edge sharpening, optional dithering, contrast, brightness and inversion help retain photographic detail.

Use **text size** to zoom the editor and **wide view** to expand it across most of the screen. Very wide art stays unwrapped and can be scrolled horizontally, copied, or saved as a complete `.txt` file. For browser safety, the converter limits a single output to about **1.2 million characters / 2,200 rows**; when extremely tall inputs exceed that limit it reports the actual adjusted width rather than silently compressing them to 200 rows. A dependency-free smoke test at `scripts/test-ascii-maker.cjs` runs before GitHub Pages publication and validates a real 1,200-column conversion. The published website uses JavaScript only on this maker page; all image processing stays local. The optional Python converter works offline too.

## Blog layout & the record cabinet

The **blog** is an old-web dated index in `blog.html`. Each entry points to its own HTML page in `blog/`. To add a real post, create the post page, then add its date/title/excerpt to the list in `blog.html`.

The **45rpm records** shelf in `45rpm.html` is an image-first **2-column grid**; there is no text table. Each thumbnail opens an individual detail page, `records/001.html` through `records/006.html`. The first six images (`assets/records/001.svg` … `006.svg`) are clearly labeled illustrations, **not photographs of owned records or real catalog entries**.

To add your real record scans:
1. Place your scan in `assets/records/` (for example, `001.jpg`).
2. Update the image `src` in both `45rpm.html` (`assets/records/001.jpg`) and `records/001.html` (`../assets/records/001.jpg`).
3. Fill out the artist, a-side, b-side, label/cat. no., year, condition, and notes on the detail page.
4. Replace the placeholder image description with a useful description of your actual record.

The catalog intentionally does not claim to contain any specific records until real item information is added. Everything is static HTML/CSS; no external image hosting or JavaScript is required for the gallery.
