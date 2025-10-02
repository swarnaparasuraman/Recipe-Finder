<img width="1887" height="931" alt="Screenshot 2025-10-02 192816 - Copy" src="https://github.com/user-attachments/assets/0682a2c5-9263-42e2-beea-dbd6053578fd" />NeoKitchen Interactive Recipe Finder
A playful, futuristic web app for discovering recipes by searching or speaking ingredients. Features colorful UI, gamified XP, and live integrations with real recipe APIs for an engaging cooking experience.

Demo Previewjpg
![Screenshot of NeoKitchen](![Uploading Screenshot 2025-10-02 192816 - Copy.png…]



Features
Search recipes by typing or speaking ingredients (Web Speech API).

Dynamic recipe gallery with glowing hover effects and quick save option.

Detailed modal with checklist, step-by-step instructions, and cooking overlay.

Gamified XP, streaks, confetti animations for saving and cooking.

Multiple filter options (cuisine, diet, difficulty, time).

Badges for "Quick Cook," "Master Chef," and "Vegan Friend."

Attractive neon styling, floating shapes, and dark mode toggle for enhanced UX.

Offline demo with mock recipe data—just open in a browser or run locally.

Technologies Used
HTML, CSS (Neon gradients, glass effect cards, responsive grid).

JavaScript (ES6, Web Speech API, localStorage, fetch, dynamic rendering).

Recipe API integrations:

Spoonacular (complexSearch pattern included).

Edamam (integration template provided).

Getting Started
Run Locally
Open index.html in your browser under any static file server.

Recommended (for API features): Use Python server or similar.

bash
python -m http.server 8080 --directory .
Add Real Recipe APIs
For Spoonacular:

Set window.EDUNETCONFIG.provider = "spoonacular" and add your spoonacularKey in config.js.

For Edamam:

Set provider to "edamam", add your edamamAppId and edamamAppKey in config.js.

Integration steps are left as an exercise.

Image Assets
Download curated images using the included PowerShell script (optional but recommended).

Without running the script, SVG placeholders appear by default.

Usage
Type or speak any set of ingredients to find recipes.

Filter by cuisine, diet, difficulty, and maximum prep time.

Click recipe cards to view details, save favorites, and begin cooking.

Use the modal for a step-by-step cooking experience with timers.

Earn XP and streaks for each action.

Next Steps & Contribution
Fully integrate Edamam API and add backend for saved recipes.

Pagination, swipe gestures for mobile, and more interactive badges.

Contributions welcome via pull requests.

Notes
Focused on frontend UI/UX; replace mock data with API keys in config.js to fetch live recipes.

Works best with colorful images and playful micro-interactions.

Designed for CSE students, web portfolio, or hackathon demos.



