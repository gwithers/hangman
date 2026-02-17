# React Hangman (Vite)

This is a minimal, well-documented React Hangman game scaffolded with Vite.

Quick start (use nvm to isolate Node):

1. Install latest Node via nvm and use it:

```bash
nvm install node
nvm use node
```

2. Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

3. Open the URL printed by Vite (usually http://localhost:5173).

Project notes
- `.nvmrc`: recommends using the latest Node (run `nvm use` to switch). 
- `src/words.txt`: newline-separated words used for random selection. Edit this file to add your own words.
- `src/App.jsx`: main game logic with detailed comments. Uses Vite's `?raw` import to load the word list.
- `src/Hangman.css`: basic styles for layout and keyboard.

How the game works (overview)
- The app picks a random word on each round.
- Player clicks letters (A-Z). Correct guesses reveal letters; incorrect guesses increment the hangman drawing.
- After too many wrong guesses (6), the player loses and can start a new game.

Extending the app
- Add difficulty levels by filtering `words.txt` by length.
- Persist high scores in localStorage.
- Replace the SVG drawing with images or animations.

License: public domain for demo purposes.
