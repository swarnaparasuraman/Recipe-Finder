/* Interactive Recipe Finder — app logic
   - Auto-loads recipes using provider in config.js (mock by default)
   - Voice input via Web Speech API (if available)
   - Modal for recipe details
   - Save recipe with confetti and XP
*/
(function(){
  const cfg = window.EDUNET_CONFIG || {provider:'mock'};
  const gallery = document.getElementById('gallery');
  const searchInput = document.getElementById('searchInput');
  const voiceBtn = document.getElementById('voiceBtn');
  const modal = document.getElementById('recipeModal');
  const modalInner = document.getElementById('modalInner');
  const modalClose = document.getElementById('modalClose');
  const xpCount = document.getElementById('xpCount');
  const streakCount = document.getElementById('streakCount');
  const badgesRow = document.getElementById('badgesRow');
  const emptyState = document.getElementById('emptyState');

  let XP = Number(localStorage.getItem('nk_xp')||0);
  let STREAK = Number(localStorage.getItem('nk_streak')||0);
  let SAVED = JSON.parse(localStorage.getItem('nk_saved')||'[]');

  xpCount.textContent = XP; streakCount.textContent = STREAK;

  // Mock dataset used when no API key is provided
  const MOCK = [
     {id:1,title:'Neon Tomato Risotto',time:35,rating:4.7,image:'https://images.pexels.com/photos/4874787/pexels-photo-4874787.jpeg',calories:420,diet:'vegetarian',cuisine:'Italian',difficulty:'medium',ingredients:['tomato','rice','parmesan','onion','olive oil','white wine'],instructions:['Saute onions in olive oil','Toast rice briefly','Add white wine and simmer','Stir in chopped tomatoes and simmer until creamy','Finish with parmesan and butter']},
     {id:2,title:'Coral Curry Bowl',time:20,rating:4.2,image:'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg',calories:520,diet:'vegan',cuisine:'Indian',difficulty:'easy',ingredients:['chickpeas','tomato','spinach','curry powder','coconut milk'],instructions:['Fry spices and aromatics','Add chickpeas and tomatoes','Pour coconut milk and simmer','Add spinach and wilt','Serve with rice or flatbread']},
     {id:3,title:'Electric Blue Pancakes',time:15,rating:4.9,image:'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg',calories:300,diet:'vegetarian',cuisine:'American',difficulty:'easy',ingredients:['flour','milk','egg','blueberries','butter'],instructions:['Mix batter until smooth','Heat pan and melt butter','Pour batter and add blueberries','Flip when bubbles appear','Serve warm with syrup']},
     {id:4,title:'Lemon Zest Salmon',time:25,rating:4.6,image:'https://images.pexels.com/photos/3763847/pexels-photo-3763847.jpeg',calories:430,diet:'pescatarian',cuisine:'Mediterranean',difficulty:'medium',ingredients:['salmon fillet','lemon','garlic','olive oil','parsley'],instructions:['Preheat oven to 200°C','Season salmon and add lemon slices','Bake 12-15 minutes until cooked','Garnish with parsley and serve']},
     {id:5,title:'Midnight Veggie Stir-fry',time:12,rating:4.3,image:'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg',calories:280,diet:'vegan',cuisine:'Chinese',difficulty:'easy',ingredients:['broccoli','carrot','bell pepper','soy sauce','garlic','ginger'],instructions:['Heat wok with oil','Add garlic and ginger','Toss vegetables on high heat','Add soy sauce and sesame oil','Serve over rice or noodles']},
    {id:6,title:'Galaxy Beef Tacos',time:18,rating:4.8,image:'https://images.pexels.com/photos/4955249/pexels-photo-4955249.jpeg',calories:510,diet:'omnivore',cuisine:'Mexican',difficulty:'easy',ingredients:['beef mince','taco shells','lettuce','cheese','salsa'],instructions:['Season and cook beef mince','Warm shells','Assemble tacos with toppings','Serve with lime wedges']},
    {id:7,title:'Sunrise Avocado Toast',time:10,rating:4.4,image:'https://images.pexels.com/photos/1351238/pexels-photo-1351238.jpeg',calories:320,diet:'vegetarian',cuisine:'American',difficulty:'easy',ingredients:['bread','avocado','lemon','chili flakes'],instructions:['Toast bread','Smash avocado with lemon','Spread and season','Top with chili flakes']},
    {id:8,title:'Spiralized Zoodle Salad',time:15,rating:4.1,image:'https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg',calories:210,diet:'vegan',cuisine:'Mediterranean',difficulty:'easy',ingredients:['zucchini','cherry tomatoes','olive oil','basil'],instructions:['Spiralize zucchini','Toss with tomatoes and dressing','Serve chilled']},
    {id:9,title:'Aurora Chocolate Mousse',time:30,rating:4.9,image:'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg',calories:450,diet:'vegetarian',cuisine:'French',difficulty:'medium',ingredients:['dark chocolate','cream','sugar','eggs'],instructions:['Melt chocolate','Whisk egg yolks with sugar','Fold in whipped cream','Chill until set']},
    {id:10,title:'Starlight Shrimp Skewers',time:22,rating:4.5,image:'https://images.pexels.com/photos/3843224/pexels-photo-3843224.jpeg',calories:380,diet:'pescatarian',cuisine:'Mediterranean',difficulty:'medium',ingredients:['shrimp','lemon','garlic','skewers'],instructions:['Marinate shrimp','Thread onto skewers','Grill 2-3 mins per side','Serve with lemon']},
    {id:11,title:'Comet Chocolate Chip Cookies',time:25,rating:4.7,image:'https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg',calories:250,diet:'vegetarian',cuisine:'American',difficulty:'easy',ingredients:['flour','butter','sugar','chocolate chips'],instructions:['Cream butter and sugar','Add dry ingredients','Fold in chips','Bake until golden']}
  ];

  // Utility: create element from HTML
  function htmlToEl(html){const t=document.createElement('template');t.innerHTML=html.trim();return t.content.firstChild}

  function showEmpty(state){emptyState.style.display = state ? 'block' : 'none'}

  function renderBadges(){
    badgesRow.innerHTML='';
    const badges = ['Quick Cook','Master Chef','Vegan Friend'];
    badges.forEach((b,i)=>{
      const el = document.createElement('div');el.className='badge';el.textContent=b;badgesRow.appendChild(el);
    });
  }

  function renderGallery(items){
    gallery.innerHTML='';
    if(!items || items.length===0){showEmpty(true);return}
    showEmpty(false);
    items.forEach(r=>{
      const card = htmlToEl(`<div class="card" data-id="${r.id}">
          <div class="media"><img loading="lazy" src="${r.image}" alt="${r.title}" onerror="this.onerror=null;this.src='https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg';this.classList.add('fallback-image')"/></div>
          <div class="meta">
            <div class="title-row"><h4>${r.title}</h4><div class="rating">⭐ ${r.rating}</div></div>
            <p>${r.cuisine} • ${r.diet} • ${r.time} mins</p>
          </div>
          <div class="actions">
            <div>
              <button class="icon-btn saveBtn" title="Save">❤️</button>
            </div>
            <div class="pill">${r.time}m</div>
          </div>
        </div>`);

      // Hover glow
      card.addEventListener('mouseenter',()=>{
        card.style.boxShadow = `0 20px 60px rgba(126,242,201,0.08)`;
      });
      card.addEventListener('mouseleave',()=>{card.style.boxShadow=''});

      // Open modal
      card.addEventListener('click',(e)=>{
        if(e.target && e.target.classList.contains('saveBtn')) return; // handled separately
        openModal(r);
      });

      // Save
      card.querySelector('.saveBtn').addEventListener('click',(ev)=>{ev.stopPropagation();saveRecipe(r, ev.target)});

      gallery.appendChild(card);
    });
  }

  function openModal(recipe){
    modal.classList.add('open');
    modalInner.innerHTML = '';
  const hero = document.createElement('div');hero.className='hero-image';
  const heroImg = document.createElement('img'); 
  heroImg.src = recipe.image; 
  heroImg.alt = recipe.title; 
  heroImg.loading = 'eager'; 
  heroImg.onerror = function(){
    this.onerror = null;
    const fallbackImages = {
      'italian': 'https://images.pexels.com/photos/1527603/pexels-photo-1527603.jpeg',
      'indian': 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg',
      'american': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      'mediterranean': 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg',
      'chinese': 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg',
      'mexican': 'https://images.pexels.com/photos/2092897/pexels-photo-2092897.jpeg',
      'french': 'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg'
    };
    this.src = fallbackImages[recipe.cuisine.toLowerCase()] || 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg';
    this.classList.add('fallback-image');
  }; 
  hero.appendChild(heroImg);
    const title = document.createElement('h2');title.textContent=recipe.title;
    const meta = document.createElement('div');meta.className='pill';meta.textContent = `${recipe.cuisine} • ${recipe.diet} • ${recipe.time}m`;

    const detailRow = document.createElement('div');detailRow.className='detail-row';

    const left = document.createElement('div');
    const ingrBox = document.createElement('div');ingrBox.className='ingredients';
    ingrBox.innerHTML = '<h3>Ingredients</h3>';
      recipe.ingredients.forEach(i => {
        const it = document.createElement('label'); it.className = 'ingredient-item';
        it.innerHTML = `<input type="checkbox"> <span>${i}</span>`; 
        // improve interaction: toggle row highlight when checked
        const checkbox = it.querySelector('input');
        checkbox.addEventListener('change', () => {
          if (checkbox.checked) {
            it.style.opacity = 0.6;
            it.style.textDecoration = 'line-through';
          } else {
            it.style.opacity = 1;
            it.style.textDecoration = 'none';
          }
        });
        ingrBox.appendChild(it);
      });

    const instr = document.createElement('div');instr.className='instructions';instr.innerHTML='<h3>Instructions</h3>';
      const ol = document.createElement('ol'); recipe.instructions.forEach((s, idx) => {
        const li = document.createElement('li'); 
        li.innerHTML = `<div class="step"><span class="step-number">${idx + 1}</span><div class="step-text">${s}</div></div>`;
        ol.appendChild(li);
      });
      instr.appendChild(ol);

      // Further Instructions (collapsible)
      const further = document.createElement('details'); 
      further.className = 'further'; 
      further.innerHTML = `<summary>Further instructions & tips</summary><div class="tips">Pro tip: Taste as you go. Use fresh herbs for better aroma. Adjust seasoning at the end.</div>`;
      instr.appendChild(further);

    left.appendChild(ingrBox);left.appendChild(instr);

    const right = document.createElement('div');right.innerHTML = `<div style="padding:12px;background:linear-gradient(135deg, rgba(255,255,255,0.02), transparent);border-radius:12px">
      <h3>Details</h3>
      <p>Time: <strong>${recipe.time} mins</strong></p>
      <p>Calories: <strong>${recipe.calories||'—'}</strong></p>
      <p>Difficulty: <strong>${recipe.difficulty||'—'}</strong></p>
      <div style="display:flex;gap:8px;margin-top:12px">
        <button id="modalSave" class="btn">Save Recipe</button>
        <button id="modalShare" class="btn ghost">Share</button>
        <button id="modalCook" class="btn small">Start Cooking</button>
      </div>
    </div>`;

    detailRow.appendChild(left);detailRow.appendChild(right);

    modalInner.appendChild(hero);modalInner.appendChild(title);modalInner.appendChild(meta);modalInner.appendChild(detailRow);

    document.getElementById('modalSave').addEventListener('click',()=>{saveRecipe(recipe);});
    document.getElementById('modalShare').addEventListener('click',()=>{navigator.share?navigator.share({title:recipe.title,text:'Check this recipe',url:location.href}):alert('Share not available in this browser')});
      document.getElementById('modalCook').addEventListener('click',()=>{openCookingFlow(recipe)});
  }

  modalClose.addEventListener('click',()=>modal.classList.remove('open'));
  modal.addEventListener('click',(e)=>{if(e.target===modal)modal.classList.remove('open')});

  function saveRecipe(recipe, btn){
    if(!SAVED.find(s=>s.id===recipe.id)){
      SAVED.push(recipe);localStorage.setItem('nk_saved', JSON.stringify(SAVED));
      // XP & streak
      XP += 25; STREAK += 1; localStorage.setItem('nk_xp', XP); localStorage.setItem('nk_streak', STREAK);
      xpCount.textContent = XP; streakCount.textContent = STREAK;
      confettiBurst();
    }
    if(btn) btn.classList.add('save');
  }

  // Cooking flow: overlay with step-by-step controls and optional timers
  function openCookingFlow(recipe){
    // create overlay
    const overlay = document.createElement('div'); overlay.className = 'cook-overlay';
    const panel = document.createElement('div'); panel.className = 'cook-panel';
    panel.innerHTML = `<header><h2>Cooking: ${recipe.title}</h2><button class="close-cook">✖</button></header>
      <div class="cook-body">
        <div class="cook-steps"></div>
        <div class="cook-controls"><button class="prev">◀ Prev</button><button class="next">Next ▶</button></div>
      </div>
      <footer class="cook-footer"><div class="progress"><div class="bar"></div></div><div class="cook-xp">Earn XP: <strong>+50</strong></div></footer>`;
    overlay.appendChild(panel); document.body.appendChild(overlay);

    const stepsEl = panel.querySelector('.cook-steps');
    recipe.instructions.forEach((s, idx) => {
      const step = document.createElement('div'); step.className = 'cook-step'; step.innerHTML = `<h3>Step ${idx + 1}</h3><p>${s}</p><div class="timer-row"><label>Timer (mins): <input type="number" min="0" value="0" class="step-timer"/></label><button class="start-timer">Start</button></div>`;
      stepsEl.appendChild(step);
    });

    let current = 0; const stepEls = Array.from(stepsEl.querySelectorAll('.cook-step'));
    function show(i) {
      stepEls.forEach((el, idx) => { el.style.display = idx === i ? 'block' : 'none' });
      panel.querySelector('.progress .bar').style.width = `${((i + 1) / stepEls.length) * 100}%`;
    }
    show(current);

    panel.querySelector('.next').addEventListener('click', () => {
      if (current < stepEls.length - 1) {
        current++;
        show(current);
      } else {
        finishCooking(recipe, overlay);
      }
    });
    panel.querySelector('.prev').addEventListener('click', () => {
      if (current > 0) {
        current--;
        show(current);
      }
    });
    panel.querySelector('.close-cook').addEventListener('click', () => { overlay.remove() });

    // Start timer per step
    stepsEl.addEventListener('click', (e) => {
      if (e.target.classList.contains('start-timer')) {
        const input = e.target.previousElementSibling.querySelector('.step-timer');
        const mins = Number(input.value) || 0;
        if (mins > 0) { runStepTimer(mins, e.target) }
      }
    });
  }

  function runStepTimer(mins, btn) {
    let remaining = mins * 60; btn.textContent = 'Running...'; const orig = btn;
    const int = setInterval(() => {
      remaining--; const m = Math.floor(remaining / 60); const s = remaining % 60; orig.textContent = `${m}:${s.toString().padStart(2, '0')}`;
      if (remaining <= 0) {
        clearInterval(int); orig.textContent = 'Done!'; navigator.vibrate && navigator.vibrate(200); alert('Timer finished for step');
      }
    }, 1000);
  }

  function finishCooking(recipe, overlay) {
    // award XP
    XP += 50; localStorage.setItem('nk_xp', XP); document.getElementById('xpCount').textContent = XP;
    // small modal thanks
    overlay.remove();
    const thanks = document.createElement('div'); thanks.className = 'cook-thanks'; thanks.innerHTML = `<div><h3>Nice! You finished cooking ${recipe.title}</h3><p>You've earned 50 XP and a badge progress.</p><button id="closeThanks">Close</button></div>`;
    document.body.appendChild(thanks);
    document.getElementById('closeThanks').addEventListener('click', () => thanks.remove());
  }

  // Confetti (simple)
  function confettiBurst(){
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = innerWidth; canvas.height = innerHeight; canvas.style.display='block';
    const pieces = [];
    for(let i=0;i<80;i++){pieces.push({x:innerWidth/2,y:innerHeight/3, vx:(Math.random()-0.5)*10, vy:(Math.random()-0.5)*10+2, size:4+Math.random()*8, color:[cfg.accent1||'#7ef2c9',cfg.accent2||'#ff6b88',cfg.accent3||'#fff28a'][Math.floor(Math.random()*3)]})}
    let t=0; const id = setInterval(()=>{
      t++; ctx.clearRect(0,0,canvas.width,canvas.height);
      pieces.forEach(p=>{p.x+=p.vx; p.y+=p.vy; p.vy+=0.25; ctx.fillStyle=p.color; ctx.fillRect(p.x,p.y,p.size,p.size)});
      if(t>90){clearInterval(id);ctx.clearRect(0,0,canvas.width,canvas.height);canvas.style.display='none'}
    },16);
  }

  // Voice input
  if(window.SpeechRecognition || window.webkitSpeechRecognition){
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition; const recog = new SR(); recog.lang='en-US';recog.interimResults=false;
    voiceBtn.addEventListener('click',()=>{recog.start(); voiceBtn.classList.add('listening')});
    recog.addEventListener('result',e=>{const t = e.results[0][0].transcript;searchInput.value = t;doSearch(t);voiceBtn.classList.remove('listening')});
    recog.addEventListener('end',()=>voiceBtn.classList.remove('listening'));
  } else {voiceBtn.style.display='none'}

  // Simple search handler with debounce
  let timeout;
  searchInput.addEventListener('input',(e)=>{clearTimeout(timeout);timeout=setTimeout(()=>doSearch(e.target.value),450)});

  function doSearch(q){
    const terms = (q||'').split(',').map(s=>s.trim()).filter(Boolean);
    if(cfg.provider === 'mock' || (!cfg.spoonacularKey && !cfg.edamamAppKey)){
      // filter mock
      const results = MOCK.filter(m=>{
        if(terms.length===0) return true;
        return terms.every(t=>m.ingredients.join(' ').toLowerCase().includes(t.toLowerCase()) || m.title.toLowerCase().includes(t.toLowerCase()));
      });
      renderGallery(results);
      return Promise.resolve(results);
    }
    // For brevity, we show mock fetch pattern; full API calls require keys
    // If spoonacular configured, call it
    if(cfg.provider === 'spoonacular' && cfg.spoonacularKey){
      // Example: https://api.spoonacular.com/recipes/complexSearch
      const params = new URLSearchParams({apiKey:cfg.spoonacularKey,query:q,number:12,addRecipeInformation:true});
      return fetch('https://api.spoonacular.com/recipes/complexSearch?'+params).then(r=>r.json()).then(res=>{
        const items = (res.results||[]).map(it=>({id:it.id,title:it.title,time:it.readyInMinutes||30,rating: (it.spoonacularScore||4).toFixed(1),image:it.image||'assets/placeholder.jpg',calories:it.nutrition&&it.nutrition.nutrients?Math.round((it.nutrition.nutrients.find(n=>n.name==='Calories')||{amount:0}).amount):'—',diet:it.diets&&it.diets[0]||'—',cuisine:it.cuisines&&it.cuisines[0]||'—',difficulty:'medium',ingredients:(it.extendedIngredients||[]).map(x=>x.name),instructions: [it.instructions||'Follow steps shown']}));
        renderGallery(items);
        return items;
      }).catch(err=>{console.error(err);renderGallery([])});
    }
    // Edamam left as exercise — fallback to mock
    renderGallery([]);
  }

  // Filters
  document.getElementById('filtersToggle').addEventListener('click',()=>{const f = document.getElementById('filters'); f.style.display = f.style.display==='none' ? 'block' : 'none'});
  document.getElementById('applyFilters').addEventListener('click',()=>{alert('Filters applied (demo)')});
  document.getElementById('clearFilters').addEventListener('click',()=>{document.getElementById('cuisineFilter').value='';document.getElementById('dietFilter').value='';document.getElementById('difficultyFilter').value='';document.getElementById('maxTime').value='';doSearch(searchInput.value)});

  // Dark mode toggle (simulate by inverting background)
  document.getElementById('darkToggle').addEventListener('click',()=>{document.body.classList.toggle('light');if(document.body.classList.contains('light')){document.body.style.background='linear-gradient(120deg,#fff9f2,#f0fff7)';document.body.style.color='#071421'}else{document.body.style.background='radial-gradient(1200px 600px at 10% 10%, rgba(11,7,19,0.75), transparent), radial-gradient(900px 500px at 90% 90%, rgba(5,10,30,0.6), transparent), var(--bg)';document.body.style.color='#eaf2ff'}});

  // Auto-load initial recipes
  renderBadges(); doSearch('');

  // Floating shapes
  const fs1 = document.createElement('div');fs1.className='floating-shape fs1';document.body.appendChild(fs1);
  const fs2 = document.createElement('div');fs2.className='floating-shape fs2';document.body.appendChild(fs2);

})();
