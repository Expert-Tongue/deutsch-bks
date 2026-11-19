# Deutsch für BKS · Expert Tongue

Free German A1 and A2 study app (PWA) for speakers of Bosnian, Croatian and Serbian.

- `index.html`: home screen (choose A1 or A2, install help)
- `a1/index.html`, `a2/index.html`: the two study sites
- `manifest.webmanifest`, `icons/`: app name and icons
- `sw.js`: offline support

## Updating the app
1. Edit the page you want to change.
2. In `sw.js`, raise the version on line 3 (e.g. `deutsch-bks-v1` → `deutsch-bks-v2`).
3. Upload the changed files. Students get the update the next time they open the app.
