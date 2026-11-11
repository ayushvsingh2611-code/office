/* ==========================================================
   SMARTPANTRY CHEF — APP LOGIC & INTERACTION ENGINE
   ================ =========================================== */

// Initial Mock Pantry Inventory Data
let inventory = [
    { id: '1', name: 'Organic Avocados', quantity: '3 pcs', category: 'Produce', expiry: '2025-03-12' },
    { id: '2', name: 'Free-Range Eggs', quantity: '12 pcs', category: 'Dairy', expiry: '2025-03-25' },
    { id: '3', name: 'Greek Yogurt', quantity: '500g', category: 'Dairy', expiry: '2025-03-18' },
    { id: '4', name: 'Chicken Breast', quantity: '2 fillets', category: 'Meat', expiry: '2025-03-10' },
    { id: '5', name: 'Ripe Tomatoes', quantity: '4 pcs', category: 'Produce', expiry: '2025-03-14' },
    { id: '6', name: 'Baby Spinach', quantity: '200g', category: 'Produce', expiry: '2025-03-11' },
    { id: '7', name: 'Extra Virgin Olive Oil', quantity: '750ml', category: 'Pantry', expiry: '2026-01-01' },
    { id: '8', name: 'Garlic Cloves', quantity: '1 bulb', category: 'Produce', expiry: '2025-04-01' },
    { id: '9', name: 'Sourdough Bread', quantity: '1 loaf', category: 'Bakery', expiry: '2025-03-13' },
    { id: '10', name: 'Parmesan Cheese', quantity: '150g', category: 'Dairy', expiry: '2025-04-15' }
];

// Curated AI Recipe Suggestions Database
const recipesDatabase = [
    {
        id: 'rec-1',
        title: 'Avocado Smashed Toast with Poached Egg',
        category: 'Breakfast',
        prepTime: '10 mins',
        difficulty: 'Easy',
        calories: '340 kcal',
        diets: ['Vegetarian', 'High-Protein'],
        matchScore: 98,
        image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
        matchedIngredients: ['Organic Avocados', 'Free-Range Eggs', 'Sourdough Bread', 'Extra Virgin Olive Oil'],
        missingIngredients: ['Sea Salt & Chili Flakes'],
        instructions: [
            'Toast a thick slice of sourdough bread until golden and crisp.',
            'In a bowl, mash ripe avocados with a drizzle of olive oil, salt, and pepper.',
            'Gently poach or fry an egg to your preferred doneness.',
            'Spread generous avocado smash over the toasted sourdough and top with the egg. Enjoy!'
        ]
    },
    {
        id: 'rec-2',
        title: 'Garlic Herb Grilled Chicken & Spinach Salad',
        category: 'Dinner',
        prepTime: '20 mins',
        difficulty: 'Medium',
        calories: '480 kcal',
        diets: ['Gluten-Free', 'Keto', 'High-Protein'],
        matchScore: 95,
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
        matchedIngredients: ['Chicken Breast', 'Baby Spinach', 'Ripe Tomatoes', 'Extra Virgin Olive Oil', 'Garlic Cloves'],
        missingIngredients: ['Balsamic Vinegar'],
        instructions: [
            'Season chicken breast with minced garlic, olive oil, salt, and herbs.',
            'Pan-sear or grill chicken for 6-8 minutes per side until fully cooked and golden brown.',
            'Toss fresh baby spinach and chopped ripe tomatoes in a large bowl.',
            'Slice chicken breast and place atop the bed of fresh spinach. Drizzle with olive oil and vinegar.'
        ]
    },
    {
        id: 'rec-3',
        title: 'Creamy Garlic Parmesan Spinach Bowl',
        category: 'Lunch',
        prepTime: '15 mins',
        difficulty: 'Easy',
        calories: '390 kcal',
        diets: ['Vegetarian', 'Gluten-Free'],
        matchScore: 90,
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
        matchedIngredients: ['Baby Spinach', 'Parmesan Cheese', 'Garlic Cloves', 'Extra Virgin Olive Oil', 'Greek Yogurt'],
        missingIngredients: ['Quinoa or Rice'],
        instructions: [
            'Sauté minced garlic in extra virgin olive oil over medium heat until fragrant.',
            'Add fresh baby spinach and toss gently until just wilted (approx. 2 minutes).',
            'Stir in a dollop of Greek yogurt and freshly grated Parmesan cheese to create a creamy sauce.',
            'Serve warm as a nourishing side dish or grain bowl base.'
        ]
    },
    {
        id: 'rec-4',
        title: 'Protein-Packed Greek Yogurt Berry Parfait',
        category: 'Breakfast',
        prepTime: '5 mins',
        difficulty: 'Easy',
        calories: '280 kcal',
        diets: ['Vegetarian', 'High-Protein', 'Gluten-Free'],
        matchScore: 85,
        image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
        matchedIngredients: ['Greek Yogurt'],
        missingIngredients: ['Mixed Berries', 'Honey', 'Granola'],
        instructions: [
            'Scoop thick Greek yogurt into your favorite breakfast bowl or glass.',
            'Layer with fresh berries and crunchy granola.',
            'Drizzle with pure honey for natural sweetness and serve immediately.'
        ]
    }
];

// Weekly Meal Plan Schedule
let mealPlan = {
    Monday: { Breakfast: 'Avocado Smashed Toast with Poached Egg', Lunch: 'Creamy Garlic Parmesan Spinach Bowl', Dinner: 'Garlic Herb Grilled Chicken & Spinach Salad' },
    Tuesday: { Breakfast: 'Protein-Packed Greek Yogurt Berry Parfait', Lunch: 'Leftover Chicken Salad', Dinner: 'Avocado Smashed Toast with Poached Egg' },
    Wednesday: { Breakfast: 'Avocado Smashed Toast with Poached Egg', Lunch: 'Creamy Garlic Parmesan Spinach Bowl', Dinner: 'Garlic Herb Grilled Chicken & Spinach Salad' },
    Thursday: { Breakfast: 'Protein-Packed Greek Yogurt Berry Parfait', Lunch: 'Quick Spinach Wrap', Dinner: 'Garlic Herb Grilled Chicken & Spinach Salad' },
    Friday: { Breakfast: 'Avocado Smashed Toast with Poached Egg', Lunch: 'Creamy Garlic Parmesan Spinach Bowl', Dinner: 'Garlic Herb Grilled Chicken & Spinach Salad' },
    Saturday: { Breakfast: 'Protein-Packed Greek Yogurt Berry Parfait', Lunch: 'Avocado Smashed Toast', Dinner: 'Chef Special Creation' },
    Sunday: { Breakfast: 'Avocado Smashed Toast with Poached Egg', Lunch: 'Chef Special Salad', Dinner: 'Family Feast' }
};

let currentCategoryFilter = 'all';
let currentDietFilter = 'all';

// Initialize application on DOM load
document.addEventListener('DOMContentLoaded', () => {
    renderInventory();
    renderRecipes();
    renderCalendar();
    updateStats();
    populateRecipeSelectOptions();
});

// Toast notification helper
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    const bgClass = type === 'success' ? 'bg-slate-900 text-white' : 'bg-emerald-600 text-white';
    const icon = type === 'success' ? 'fa-circle-check text-emerald-400' : 'fa-circle-info text-white';
    
    toast.className = `${bgClass} px-4 py-3 rounded-2xl shadow-xl flex items-center space-x-3 text-sm font-semibold transform translate-y-4 opacity-0 transition-all duration-300 pointer-events-auto`;
    toast.innerHTML = `<i class="fa-solid ${icon} text-lg"></i><span>${message}</span>`;
    
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.remove('translate-y-4', 'opacity-0');
    }, 10);

    setTimeout(() => {
        toast.classList.add('translate-y-4', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// Tab Switching Logic
function switchTab(tabId) {
    document.querySelectorAll('.tab-view').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.nav-tab').forEach(el => {
        el.classList.remove('bg-white', 'text-emerald-700', 'shadow-xs');
        el.classList.add('text-slate-600');
    });

    const activeView = document.getElementById(`view-${tabId}`);
    const activeNav = document.getElementById(`nav-${tabId}`);
    
    if (activeView) activeView.classList.remove('hidden');
    if (activeNav) {
        activeNav.classList.add('bg-white', 'text-emerald-700', 'shadow-xs');
        activeNav.classList.remove('text-slate-600');
    }
}

// Toggle Mobile Menu
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

// ================= INVENTORY LOGIC =================

function renderInventory() {
    const grid = document.getElementById('inventory-grid');
    const emptyState = document.getElementById('inventory-empty');
    const searchQuery = document.getElementById('site-search').value.toLowerCase();

    const filtered = inventory.filter(item => {
        const matchesCategory = currentCategoryFilter === 'all' || item.category === currentCategoryFilter;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery) || item.category.toLowerCase().includes(searchQuery);
        return matchesCategory && matchesSearch;
    });

    grid.innerHTML = '';

    if (filtered.length === 0) {
        emptyState.classList.remove('hidden');
        return;
    } else {
        emptyState.classList.add('hidden');
    }

    const today = new Date();

    filtered.forEach(item => {
        const expiryDate = new Date(item.expiry);
        const diffTime = expiryDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let badgeHTML = '';
        if (diffDays < 0) {
            badgeHTML = `<span class="px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 font-bold text-[10px] flex items-center"><i class="fa-solid fa-triangle-exclamation mr-1"></i>Expired</span>`;
        } else if (diffDays <= 3) {
            badgeHTML = `<span class="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-bold text-[10px] flex items-center"><i class="fa-solid fa-clock mr-1"></i>Expires in ${diffDays}d</span>`;
        } else {
            badgeHTML = `<span class="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] flex items-center"><i class="fa-solid fa-circle-check mr-1"></i>Fresh (${diffDays}d)</span>`;
        }

        const categoryIcons = {
            'Produce': 'fa-carrot text-emerald-600 bg-emerald-50',
            'Dairy': 'fa-cheese text-amber-600 bg-amber-50',
            'Meat': 'fa-drumstick-bite text-rose-600 bg-rose-50',
            'Pantry': 'fa-jar text-teal-600 bg-teal-50',
            'Bakery': 'fa-bread-slice text-orange-600 bg-orange-50'
        };
        const iconClass = categoryIcons[item.category] || 'fa-box text-slate-600 bg-slate-50';

        const card = document.createElement('div');
        card.className = `bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group`;
        card.innerHTML = `
            <div>
                <div class="flex items-start justify-between mb-3">
                    <div class="w-10 h-10 rounded-xl ${iconClass} flex items-center justify-center text-base font-bold shadow-xs">
                        <i class="fa-solid ${iconClass.split(' ')[0]}"></i>
                    </div>
                    <div class="flex items-center space-x-1">
                        <button onclick="editIngredient('${item.id}')" class="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-slate-50 transition-colors" title="Edit Item">
                            <i class="fa-solid fa-pen text-xs"></i>
                        </button>
                        <button onclick="deleteIngredient('${item.id}')" class="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-50 transition-colors" title="Delete Item">
                            <i class="fa-solid fa-trash text-xs"></i>
                        </button>
                    </div>
                </div>
                <h4 class="font-['Outfit'] font-bold text-slate-900 text-base mb-1 group-hover:text-emerald-600 transition-colors">${item.name}</h4>
                <div class="flex items-center space-x-2 text-xs text-slate-500 font-medium mb-3">
                    <span><i class="fa-solid fa-scale-balanced mr-1"></i>${item.quantity}</span>
                    <span>•</span>
                    <span>${item.category}</span>
                </div>
            </div>
            <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
                ${badgeHTML}
                <button onclick="consumeIngredient('${item.id}')" class="text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
                    Use Item
                </button>
            </div>
        `;
        grid.appendChild(card);
    });

    updateStats();
}

function setCategoryFilter(category) {
    currentCategoryFilter = category;
    document.querySelectorAll('.category-pill').forEach(btn => {
        btn.classList.remove('bg-emerald-600', 'text-white');
        btn.classList.add('bg-slate-100', 'text-slate-600');
    });
    const activeBtn = document.getElementById(`cat-${category}`);
    if (activeBtn) {
        activeBtn.classList.add('bg-emerald-600', 'text-white');
        activeBtn.classList.remove('bg-slate-100', 'text-slate-600');
    }
    renderInventory();
}

function filterInventory() {
    renderInventory();
}

function updateStats() {
    const total = inventory.length;
    document.getElementById('stat-total-items').innerText = total;

    const today = new Date();
    let expiring = 0;
    let fresh = 0;

    inventory.forEach(item => {
        const exp = new Date(item.expiry);
        const diffDays = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
        if (diffDays <= 3) expiring++;
        else fresh++;
    });

    document.getElementById('stat-expiring-count').innerText = expiring;
    document.getElementById('stat-fresh-count').innerText = fresh;
}

// ================= MODAL 1: ADD / EDIT INGREDIENT =================

function openAddIngredientModal(id = null) {
    const modal = document.getElementById('modal-ingredient');
    const card = document.getElementById('modal-ingredient-card');
    const title = document.getElementById('ingredient-modal-title');
    
    document.getElementById('form-ingredient').reset();
    document.getElementById('ing-id').value = '';

    if (id) {
        title.innerText = 'Edit Pantry Item';
        const item = inventory.find(i => i.id === id);
        if (item) {
            document.getElementById('ing-id').value = item.id;
            document.getElementById('ing-name').value = item.name;
            document.getElementById('ing-quantity').value = item.quantity;
            document.getElementById('ing-category').value = item.category;
            document.getElementById('ing-expiry').value = item.expiry;
        }
    } else {
        title.innerText = 'Add Pantry Item';
        // Default expiry to 7 days from now
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        document.getElementById('ing-expiry').value = nextWeek.toISOString().split('T')[0];
    }

    modal.classList.remove('hidden', 'pointer-events-none');
    modal.classList.add('modal-active');
}

function closeAddIngredientModal() {
    const modal = document.getElementById('modal-ingredient');
    modal.classList.add('hidden', 'pointer-events-none');
    modal.classList.remove('modal-active');
}

function saveIngredient(event) {
    event.preventDefault();
    const id = document.getElementById('ing-id').value;
    const name = document.getElementById('ing-name').value;
    const quantity = document.getElementById('ing-quantity').value;
    const category = document.getElementById('ing-category').value;
    const expiry = document.getElementById('ing-expiry').value;

    if (id) {
        const index = inventory.findIndex(i => i.id === id);
        if (index !== -1) {
            inventory[index] = { id, name, quantity, category, expiry };
            showToast(`Updated ${name} successfully!`);
        }
    } else {
        const newItem = {
            id: Date.now().toString(),
            name,
            quantity,
            category,
            expiry
        };
        inventory.push(newItem);
        showToast(`Added ${name} to pantry!`);
    }

    closeAddIngredientModal();
    renderInventory();
    renderRecipes();
    populateRecipeSelectOptions();
}

function editIngredient(id) {
    openAddIngredientModal(id);
}

function deleteIngredient(id) {
    const item = inventory.find(i => i.id === id);
    inventory = inventory.filter(i => i.id !== id);
    if (item) showToast(`Removed ${item.name} from inventory.`, 'info');
    renderInventory();
    renderRecipes();
    populateRecipeSelectOptions();
}

function consumeIngredient(id) {
    const item = inventory.find(i => i.id === id);
    if (item) {
        showToast(`Used ${item.name}! Inventory updated.`);
        inventory = inventory.filter(i => i.id !== id);
        renderInventory();
        renderRecipes();
    }
}


// ================= RECIPE SUGGESTIONS LOGIC =================

function renderRecipes() {
    const grid = document.getElementById('recipes-grid');
    grid.innerHTML = '';

    const filteredRecipes = recipesDatabase.filter(rec => {
        if (currentDietFilter === 'all') return true;
        return rec.diets.includes(currentDietFilter);
    });

    filteredRecipes.forEach(rec => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group';
        
        let dietBadges = rec.diets.map(d => `<span class="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">${d}</span>`).join('');

        card.innerHTML = `
            <div>
                <div class="relative h-48 overflow-hidden bg-slate-100">
                    <img src="${rec.image}" alt="${rec.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                    <div class="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-emerald-700 shadow-md">
                        <i class="fa-solid fa-bolt text-amber-500 mr-1"></i>${rec.matchScore}% Match
                    </div>
                    <div class="absolute bottom-3 left-3 flex flex-wrap gap-1">
                        ${dietBadges}
                    </div>
                </div>
                <div class="p-6">
                    <div class="flex items-center space-x-3 text-xs font-semibold text-slate-500 mb-2">
                        <span><i class="fa-regular fa-clock text-emerald-600 mr-1"></i>${rec.prepTime}</span>
                        <span>•</span>
                        <span><i class="fa-solid fa-fire text-amber-500 mr-1"></i>${rec.calories}</span>
                        <span>•</span>
                        <span>${rec.difficulty}</span>
                    </div>
                    <h3 class="font-['Outfit'] font-bold text-slate-900 text-lg mb-2 group-hover:text-emerald-600 transition-colors">${rec.title}</h3>
                    <div class="space-y-1 mb-4">
                        <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Matched Pantry Items:</p>
                        <div class="flex flex-wrap gap-1">
                            ${rec.matchedIngredients.map(i => `<span class="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium"><i class="fa-solid fa-check text-[10px] mr-1"></i>${i}</span>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
            <div class="px-6 pb-6 pt-0">
                <button onclick="openRecipeModal('${rec.id}')" class="w-full bg-slate-900 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl text-sm shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2">
                    <i class="fa-solid fa-utensils"></i>
                    <span>View Recipe & Cook</span>
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function setDietaryFilter(diet) {
    currentDietFilter = diet;
    document.querySelectorAll('.diet-pill').forEach(btn => {
        btn.classList.remove('bg-slate-950', 'text-white');
        btn.classList.add('bg-slate-100', 'text-slate-600');
    });
    const activeBtn = document.getElementById(`diet-${diet}`);
    if (activeBtn) {
        activeBtn.classList.add('bg-slate-950', 'text-white');
        activeBtn.classList.remove('bg-slate-100', 'text-slate-600');
    }
    renderRecipes();
}

function generateAiringRecipes() {
    showToast('AI Chef is analyzing your pantry inventory for fresh recipes...', 'info');
    setTimeout(() => {
        renderRecipes();
        showToast('Generated 4 custom AI recipes based on your pantry!');
    }, 800);
}


// ================= MODAL 2: RECIPE DETAILS =================

function openRecipeModal(recId) {
    const rec = recipesDatabase.find(r => r.id === recId);
    if (!rec) return;

    const modal = document.getElementById('modal-recipe');
    const content = document.getElementById('recipe-modal-content');

    let stepsHTML = rec.instructions.map((step, idx) => `
        <li class="flex items-start space-x-3">
            <span class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">${idx + 1}</span>
            <span class="text-sm text-slate-700 leading-relaxed">${step}</span>
        </li>
    `).join('');

    content.innerHTML = `
        <div class="flex items-center justify-between mb-6">
            <span class="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs">Chef AI Recommendation</span>
            <button onclick="closeRecipeModal()" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
        <div class="relative h-64 rounded-2xl overflow-hidden mb-6 shadow-md">
            <img src="${rec.image}" alt="${rec.title}" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex items-end p-6">
                <div>
                    <h2 class="text-xl sm:text-2xl font-['Outfit'] font-bold text-white mb-1">${rec.title}</h2>
                    <p class="text-emerald-300 text-xs font-semibold">${rec.prepTime} • ${rec.calories} • ${rec.difficulty}</p>
                </div>
            </div>
        </div>

        <div class="space-y-6">
            <div>
                <h4 class="font-['Outfit'] font-bold text-slate-900 text-base mb-3"><i class="fa-solid fa-list-check text-emerald-600 mr-2"></i>Ingredients Checklist</h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    ${rec.matchedIngredients.map(i => `<div class="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs font-semibold text-emerald-800 flex items-center"><i class="fa-solid fa-circle-check text-emerald-600 mr-2"></i>${i}</div>`).join('')}
                    ${rec.missingIngredients.map(i => `<div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-500 flex items-center"><i class="fa-solid fa-circle-plus text-slate-400 mr-2"></i>${i} (Optional)</div>`).join('')}
                </div>
            </div>

            <div>
                <h4 class="font-['Outfit'] font-bold text-slate-900 text-base mb-3"><i class="fa-solid fa-fire-burner text-emerald-600 mr-2"></i>Step-by-Step Instructions</h4>
                <ul class="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200/60">
                    ${stepsHTML}
                </ul>
            </div>

            <div class="pt-4 flex items-center justify-end space-x-3">
                <button onclick="closeRecipeModal()" class="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors cursor-pointer">Close</button>
                <button onclick="scheduleRecipeFromModal('${rec.title}')" class="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 transition-all cursor-pointer">
                    <i class="fa-solid fa-calendar-days mr-2"></i>Schedule to Meal Plan
                </button>
            </div>
        </div>
    `;

    modal.classList.remove('hidden', 'pointer-events-none');
    modal.classList.add('modal-active');
}

function closeRecipeModal() {
    const modal = document.getElementById('modal-recipe');
    modal.classList.add('hidden', 'pointer-events-none');
    modal.classList.remove('modal-active');
}

function scheduleRecipeFromModal(recipeTitle) {
    closeRecipeModal();
    openCalendarModal();
    // Preselect the recipe if possible
    const select = document.getElementById('plan-recipe-select');
    if (select) select.value = recipeTitle;
}


// ================= MEAL PLANNER CALENDAR LOGIC =================

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function renderCalendar() {
    const grid = document.getElementById('weekly-calendar-grid');
    grid.innerHTML = '';

    let totalScheduledCount = 0;

    daysOfWeek.forEach(day => {
        const meals = mealPlan[day] || {};
        const mealCount = Object.keys(meals).length;
        totalScheduledCount += mealCount;

        const col = document.createElement('div');
        col.className = 'bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between';
        
        let mealsHTML = '';
        ['Breakfast', 'Lunch', 'Dinner'].forEach(type => {
            const dish = meals[type];
            if (dish) {
                mealsHTML += `
                    <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs mb-2">
                        <span class="font-bold text-emerald-700 block mb-0.5">${type}</span>
                        <span class="text-slate-800 font-medium">${dish}</span>
                    </div>
                `;
            }
        });

        if (!mealsHTML) {
            mealsHTML = `<div class="text-center py-6 text-slate-400 text-xs italic">No meals scheduled yet</div>`;
        }

        col.innerHTML = `
            <div>
                <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                    <h4 class="font-['Outfit'] font-bold text-slate-900 text-sm">${day}</h4>
                    <span class="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center justify-center">${mealCount}</span>
                </div>
                <div class="space-y-1">
                    ${mealsHTML}
                </div>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100">
                <button onclick="openCalendarModalForDay('${day}')" class="w-full text-center text-xs font-semibold text-emerald-600 hover:text-emerald-700 py-1 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer">
                    + Add Meal
                </button>
            </div>
        `;
        grid.appendChild(col);
    });

    document.getElementById('planner-badge').innerText = totalScheduledCount;
}

function populateRecipeSelectOptions() {
    const select = document.getElementById('plan-recipe-select');
    if (!select) return;

    select.innerHTML = '';
    recipesDatabase.forEach(rec => {
        const opt = document.createElement('option');
        opt.value = rec.title;
        opt.textContent = `${rec.title} (${rec.category})`;
        select.appendChild(opt);
    });
}

function openCalendarModal(day = 'Monday') {
    const modal = document.getElementById('modal-calendar');
    document.getElementById('plan-day').value = day;
    modal.classList.remove('hidden', 'pointer-events-none');
    modal.classList.add('modal-active');
}

function openCalendarModalForDay(day) {
    openCalendarModal(day);
}

function closeCalendarModal() {
    const modal = document.getElementById('modal-calendar');
    modal.classList.add('hidden', 'pointer-events-none');
    modal.classList.remove('modal-active');
}

function saveMealPlan(event) {
    event.preventDefault();
    const day = document.getElementById('plan-day').value;
    const mealType = document.getElementById('plan-meal-type').value;
    const recipeTitle = document.getElementById('plan-recipe-select').value;

    if (!mealPlan[day]) mealPlan[day] = {};
    mealPlan[day][mealType] = recipeTitle;

    showToast(`Scheduled ${recipeTitle} for ${day} ${mealType}!`);
    closeCalendarModal();
    renderCalendar();
}

// Global Escape Key Listener & Modal Backdrop Click Handlers
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeAddIngredientModal();
        closeRecipeModal();
        closeCalendarModal();
    }
});

['modal-ingredient', 'modal-recipe', 'modal-calendar'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener('click', (e) => {
            if (e.target === el) {
                if (id === 'modal-ingredient') closeAddIngredientModal();
                if (id === 'modal-recipe') closeRecipeModal();
                if (id === 'modal-calendar') closeCalendarModal();
            }
        });
    }
});
