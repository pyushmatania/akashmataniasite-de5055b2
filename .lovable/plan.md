

## Plan: Trigger GitHub Sync

Add a harmless HTML comment timestamp to `index.html` to trigger a new commit and sync to GitHub.

### Change
**File: `index.html`** — Add/update a comment with the current date near the top of the file, e.g.:
```html
<!-- Last sync: 2026-03-26 -->
```

This is invisible to users and triggers a fresh GitHub push.

