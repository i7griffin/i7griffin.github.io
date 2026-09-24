# i7griffin.github.io

Source for my personal portfolio site, live at **[i7griffin.github.io](https://i7griffin.github.io)**.

Cybersecurity student portfolio — projects, CTF writeups, experience and notes. Plain HTML/CSS/JS, no build step, no frameworks, no trackers.

## Structure

- `index.html` — the whole site. All editable content (projects, CTF writeups, jobs, education, certs, links) lives in the `SITE` object near the top of the `<script>` block.
- `404.html` — matching dark-terminal 404 page.
- `activity.json` — GitHub contribution/activity data, refreshed daily by the `update-activity` workflow. If this file is missing or stale, the site falls back to the live GitHub API, then to a built-in snapshot.
- `update-activity.js` / `.github/workflows/update-activity.yml` — regenerates `activity.json` on a daily cron via the GitHub GraphQL + REST APIs.
- `robots.txt`, `sitemap.xml`, `security.txt` — standard site metadata.

## Local preview

No build step — just open `index.html` in a browser, or serve the folder:

```
python3 -m http.server
```

## License

Personal site content (bio, projects, writeups) is mine. Feel free to use the page structure/CSS as a starting point for your own portfolio.
