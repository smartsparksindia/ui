Export & Commit Published Data

Workflow:
1. In the CMS (`cms-published-chapters.html`) click **Export Published Data**. This downloads a JSON file containing all published chapters, flashcards and questions.
2. Copy the downloaded JSON into your dev machine, then run the import script to place the data into the repo and commit it.

Example:

```bash
# from project root
node scripts/import-published.js /path/to/smartspark-published-2026-05-18.json "Import published content"

# Then push to remote
git push origin main
```

Notes:
- The script will write into `data/published/chapters.json`, `data/published/flashcards.json`, and `data/published/questions.json`.
- You must have git configured locally and permission to commit & push.
- This approach keeps published content under version control so other environments can pull the same data.

Run a local publish server (auto-commit)
--------------------------------------
You can run a small local server that accepts CMS POSTs and automatically writes and commits the published JSON into `data/published`.

Start the server:

```bash
# install dependencies first
npm install
# start the server (defaults: port 4000)
node server/publish-server.js
```

Then in the CMS, clicking **Export Published Data** will attempt to POST to `http://localhost:4000/publish` and auto-commit the files. If the server isn't reachable the CMS will fall back to downloading the JSON file as before.

Server options (via env vars):
- `PORT` — server port (default 4000)
- `PUBLISH_SECRET` — optional shared secret; if set the CMS must include header `X-PUBLISH-SECRET`
- `PUSH_ON_PUBLISH=true` — attempt `git push` after commit

