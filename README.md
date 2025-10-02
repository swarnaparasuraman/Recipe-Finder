# NeoKitchen — Interactive Recipe Finder

![Recipe Screenshot]([image.jpg](https://1drv.ms/i/c/8d1bdde74cf55abd/EdS8QqS-cdBFi_ZJpFVm3-8B7-tXMO-hF9d6hfdtnshZqw?e=6mVbJL))

**NeoKitchen** is a playful, futuristic web app for discovering recipes by typing or speaking ingredients. It’s designed as a colorful, micro-interaction-rich frontend demo suitable for student portfolios, hackathons, or as a prototype for a full recipe product.

---

## 🚀 Highlights

* Search recipes by typing or speaking ingredients (Web Speech API).
* Dynamic recipe gallery with glowing hover effects and quick-save option.
* Detailed recipe modal with checklist, step-by-step instructions, and cooking overlay.
* Gamified UX: XP, streaks, confetti animations, and collectible badges.
* Powerful filters: cuisine, diet, difficulty, and maximum prep time.
* Neon styling, floating shapes, glassmorphism cards, and dark mode toggle.
* Offline demo mode using mock recipe data — open in a browser or run locally.

---

## 🧩 Features

* **Ingredient search (text & voice)** using the Web Speech API.
* **Dynamic gallery**: responsive grid, animated hover glow, quick-save.
* **Recipe modal**: ingredient checklist, step timers, and progress overlay.
* **Gamification**: XP points, streak tracking, and badges (`Quick Cook`, `Master Chef`, `Vegan Friend`).
* **Filtering** by cuisine, diet, difficulty, and time.
* **Offline-first demo** with mock JSON data; live API integration available.
* **Accessibility & UX**: keyboard navigation, ARIA-friendly modal, and contrast-aware dark mode.

---

## 🛠️ Tech Stack

* **HTML5** + semantic markup
* **CSS3** (Neon gradients, glassmorphism, responsive grid)
* **JavaScript (ES6+)**: dynamic rendering, localStorage, fetch
* **Web APIs**: Web Speech API, Notification API (optional), Clipboard API
* **Optional**: Python `http.server` for local static serving

---

## 📁 Repository Structure

```
neo-kitchen/
├─ assets/
│  ├─ images/
│  └─ styles/
├─ data/
│  └─ mock-recipes.json
├─ src/
│  ├─ index.html
│  ├─ styles.css
│  ├─ app.js
│  └─ config.js
├─ scripts/
│  └─ download-images.ps1
└─ README.md
```

---

## 🔧 Getting Started — Run Locally

> You can use this project entirely offline (mock data), or enable live recipe APIs by adding keys to `config.js`.

1. Clone or download the repo.
2. (Recommended) Serve with a static server so `fetch` works correctly:

```bash
# from project root
python -m http.server 8080 --directory .
# or using Node's http-server
npx http-server . -p 8080
```

3. Open `http://localhost:8080/src/index.html` in your browser.

---

## ⚙️ Configuration (API Integration)

`src/config.js` exposes a small config object used by `app.js` to switch between mock data and real providers.

```js
// src/config.js
window.NEOKITCHEN_CONFIG = {
  provider: 'mock', // 'mock' | 'spoonacular' | 'edamam'
  spoonacularKey: '', // e.g. 'YOUR_SPOONACULAR_KEY'
  edamamAppId: '',
  edamamAppKey: '',
  resultsPerPage: 12
};
```

### Spoonacular (example)

If you set `provider = 'spoonacular'`, the app expects `spoonacularKey`. Example query pattern used in the demo (in `api/spoonacular.js` or inline `app.js`):

```js
// Example fetch (complexSearch style)
const q = encodeURIComponent(ingredients.join(','));
const url = `https://api.spoonacular.com/recipes/complexSearch?query=${q}&number=12&apiKey=${window.NEOKITCHEN_CONFIG.spoonacularKey}`;
const res = await fetch(url);
const data = await res.json();
// Map Spoonacular results into the app's recipe shape
```

> Note: Spoonacular limits requests and requires a valid API key. Do not commit your keys to public repos.

### Edamam (example)

For Edamam, set `provider = 'edamam'` and add `edamamAppId`/`edamamAppKey`. Typical integration follows their search API pattern and maps results into the app's recipe model.

---

## 🧭 App Data Model (simplified)

```json
{
  "id": "string",
  "title": "string",
  "image": "string",
  "ingredients": ["string"],
  "instructions": ["string"],
  "prepTimeMinutes": 25,
  "difficulty": "easy|medium|hard",
  "diet": "vegan|vegetarian|omnivore",
  "cuisine": "italian|indian|thai",
  "xp": 50
}
```

---

## 🧪 Usage

* **Search:** Type or click the microphone and speak ingredients ("tomato, basil, garlic").
* **Filter:** Use the filter bar to limit by cuisine, diet, difficulty, or time.
* **Save:** Click the heart/quick-save on cards to add to `localStorage` favorites and earn XP.
* **Cook:** Open the recipe modal and follow checklist + step timers; earning streaks and confetti when completed.

---

## ✅ Offline Demo & Mock Data

* `data/mock-recipes.json` contains sample recipes tailored to the neon UI.
* The app gracefully falls back to SVG placeholders when images are unavailable.

---

## 🎯 Next Steps / Roadmap

* Fully integrate Edamam API and server-side proxy to keep keys secret.
* Add a small backend to store user favorites, XP, and badges persistently.
* Pagination and infinite scrolling for large result sets.
* Mobile improvements: swipe gestures, haptics, and progressive web app support.

---

## 🤝 Contributing

Contributions are welcome! A good first PR:

* Implement a backend endpoint to cache API calls.
* Add pagination or lazy-loading images.
* Improve accessibility for the recipe modal and voice controls.

Please open issues or PRs against this repo. Use feature branches and keep commits focused and atomic.

---

## 📸 Screenshots

Include high-quality screenshots in `assets/screenshots/`:

* `demo-preview.jpg` — homepage gallery
* `recipe-modal.jpg` — expanded recipe modal
* `cooking-overlay.jpg` — step-by-step cooking overlay

---

## 📜 License

This project is released under the **MIT License** — see `LICENSE` for details.

---

## 🙋 Frequently Asked Questions

**Q: How do I test voice search locally?**
A: Run the site on `http://localhost` or `http://127.0.0.1` with a static server and allow microphone access when prompted.

**Q: Where do I store API keys?**
A: Never commit keys to a public repo. For production, use a backend proxy or environment variables on the server.

**Q: I want a GitHub-ready README — can you generate one with badges?**
A: Yes — request it and I’ll add shields for build/status, license, and browser support.

---

## Credits

Design inspired by playful neon UIs and micro-interaction patterns. Built as a frontend prototype for CSE students, portfolios, and hackathon demos.

---

*Made with ❤️ for creative web demos — NeoKitchen Team*

