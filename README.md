# Deutsch lernen · Expert Tongue

Free German A1 and A2 study app (PWA) with explanations in the learner's own language: Albanian, Arabic (Modern Standard), Bengali, Bosnian/Croatian/Serbian, Bulgarian, Chinese (simplified), English (British and American), Farsi/Dari, French, Greek, Hindi, Hungarian, Italian, Korean, Kurdish (Kurmanji), Malayalam, Polish, Portuguese (Brazil and Portugal), Romanian, Russian, Spanish (Spain and Latin America), Tagalog / Filipino, Thai, Turkish, Ukrainian, Urdu and Vietnamese (northern and southern words).

## How it is built (since v16)
- `languages.js`: **the one list of languages.** The start page, the "Andere Sprachen" cards, the games' language buttons and offline saving all read it.
- `index.html`: start page. It puts the phone's own language first and has a search box. Returning students go straight to their language (add `?choose` to see the page again).
- `core/`: the shared engine. `a1.js`/`a2.js` hold the page code and `a1.css`/`a2.css` the styles. Every language uses the same files, so a fix here reaches all languages at once.
- `xx/` (one folder per language): the home page, the install file, and `a1/` and `a2/`. Each level has an `index.html` (texts on the page) and a `data.js` (vocabulary, tips, exam items, phrases and labels).
- `spiele/`: the games. Each language has its own word list (`words-xx.js`), and only the chosen one is downloaded.
- `sw.js`: offline support. It saves the shared files plus each language the phone has opened.
- `a1/`, `a2/`: old BKS addresses that redirect to `bks/a1/` and `bks/a2/`.

## Updating the app
1. Change the files.
2. In `sw.js`, raise the version on line 3 (e.g. `deutsch-bks-v21` → `deutsch-bks-v22`).
3. Upload the changed files (you can drag whole folders into GitHub's "Upload files" page). Students get the update the next time they open the app.

## Adding a language
1. Add one line to `languages.js`.
2. Upload the new `xx/` folder and `spiele/words-xx.js`. Also upload the updated shared game files (`spiele.js`, `spiele.css`, `satzbau.html`), which hold the game labels and sentence translations.
3. Raise the version in `sw.js`.
