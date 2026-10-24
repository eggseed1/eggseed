# eggseed

A tiny, monochrome, early-web country-music archive inspired by the intimate page geometry of poempuppy.neocities.org. Independent HTML/CSS implementation with original textual cowboy and record drawings. Original horse ASCII illustrations and ASCII lace sampled from the user-supplied reference.

## Pages

- Home: ASCII title, moving horses, introduction, Currently sidebar, and maker entrance
- About, Blog (writing), Archive (collected items), 45 RPM, Media/scans, Photos, ASCII maker
- Three starter blog pages in `blog/`

## Publish

GitHub Pages: Settings > Pages > Deploy from branch > main > /(root). Address: https://eggseed1.github.io/eggseed/

## Edit

Change content in the relevant HTML file. Add records to `45rpm.html`, real scans to `media.html`, and new posts to `blog/`, then update the home/blog indexes. Every page uses `style.css`. The core site is pure HTML/CSS. Only `ascii.html` loads a self-hosted vanilla JavaScript file for locally converting images and typed words to ASCII. No libraries, external assets, image uploads, remote requests, cookies, or trackers.

## Last.fm — currently listening (text only)

The shared **currently...** sidebar box on every page shows:
- **reading:** *Warlock* — Oakley Hall (static)
- **listening:** the most recent Last.fm scrobble (rendered into every page during deployment)

To connect your public Last.fm profile, edit `lastfm-username.txt` and enter your Last.fm username on its own line. Alternatively set the repository Actions variable `LASTFM_USERNAME`. Then run **Actions → Publish eggseed → Run workflow** or push to `main`. The scheduled workflow also refreshes the last played track at approximately minute 17 of every hour (GitHub schedule times are not guaranteed).

With only a username, the build fetches a public RSS feed from the unofficial `lfm.xiffy.nl` bridge; no Last.fm API key is needed. If you prefer the official Last.fm recent tracks API, set GitHub Actions secret `LASTFM_API_KEY` (do not commit it). The official API detects now-playing tracks, while RSS is shown as the last scrobble. No visitor-side JavaScript, tracking or Last.fm requests are added.

If the feed is temporarily down, the website displays a profile link instead of claiming a track is playing. The listening line remains a placeholder until a username is configured.

The in-browser ASCII maker converts local raster pictures to editable text, with width, contrast, brightness, character-palette and invert controls. Save the result as .txt or copy it. It needs JavaScript because plain HTML/CSS cannot read pixels; all computation stays in your browser. The optional Python converter still works offline.
