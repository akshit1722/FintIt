/**
 * FindIt — Lost & Found Campus Platform
 * Dashboard Controller & Centralized Demonstration Dataset
 * Vanilla ES6+ Script
 */

// ============================================================================
// 1. Centralized Demonstration Dataset (14 Fictional Campus Records)
// ============================================================================
const DEMO_ITEMS = [
  {
    id: "ITEM001",
    name: "Black Wireless Earbuds",
    status: "found",
    category: "electronics",
    location: "library",
    locationLabel: "Central Library, Desk #14",
    date: "Today, 10:15 AM",
    description: "Pair of wireless earbuds in a black matte charging case. Left on study desk cubicle.",
    image: "assets/images/items/earbuds.jpg"
  },
  {
    id: "ITEM002",
    name: "Blue Metal Water Bottle",
    status: "missing",
    category: "accessories",
    location: "academic-block",
    locationLabel: "Main Academic Block, Hall B",
    date: "Yesterday, 3:45 PM",
    description: "Insulated 750ml stainless steel water bottle with small campus sticker near cap.",
    image: "assets/images/items/water-bottle.jpg"
  },
  {
    id: "ITEM003",
    name: "Campus Student ID Card",
    status: "found",
    category: "id-cards",
    location: "cafeteria",
    locationLabel: "Student Cafeteria, Center Booth",
    date: "2 days ago",
    description: "Official student identification card attached to blue fabric campus lanyard.",
    image: "assets/images/items/student-id.jpg"
  },
  {
    id: "ITEM004",
    name: "Grey Canvas Backpack",
    status: "missing",
    category: "bags",
    location: "sports-complex",
    locationLabel: "Sports Complex, Bleachers",
    date: "2 days ago",
    description: "Dark grey durable backpack with padded 15-inch laptop sleeve and dual side pockets.",
    image: "assets/images/items/backpack.jpg"
  },
  {
    id: "ITEM005",
    name: "Scientific Calculator",
    status: "found",
    category: "electronics",
    location: "laboratory",
    locationLabel: "Science Laboratory, Bench 4",
    date: "3 days ago",
    description: "Engineering scientific calculator with hard slide cover and faint 'AK' initials on back.",
    image: "assets/images/items/calculator.jpg"
  },
  {
    id: "ITEM006",
    name: "Black Leather Wallet",
    status: "missing",
    category: "accessories",
    location: "other",
    locationLabel: "North Parking Area, Row D",
    date: "4 days ago",
    description: "Bi-fold black leather wallet containing bus transit pass and student library card.",
    image: "assets/images/items/wallet.jpg"
  },
  {
    id: "ITEM007",
    name: "Reading Glasses in Case",
    status: "missing",
    category: "accessories",
    location: "library",
    locationLabel: "Central Library, 1st Fl Stacks",
    date: "5 days ago",
    description: "Thin black wireframe reading glasses inside protective brown magnetic leather case.",
    image: "assets/images/items/glasses.jpg"
  },
  {
    id: "ITEM008",
    name: "Dorm Keys & Lanyard",
    status: "found",
    category: "others",
    location: "sports-complex",
    locationLabel: "Sports Complex, Court #2",
    date: "4 days ago",
    description: "Set of three brass locker and room keys attached to blue braided campus lanyard.",
    image: "assets/images/items/keys.jpg"
  },
  {
    id: "ITEM009",
    name: "Over-Ear Wireless Headphones",
    status: "missing",
    category: "electronics",
    location: "cafeteria",
    locationLabel: "Student Cafeteria, Quiet Corner",
    date: "3 days ago",
    description: "Silver and grey active noise-canceling headphones left on soft booth seating.",
    image: "assets/images/items/headphones.jpg"
  },
  {
    id: "ITEM010",
    name: "Engineering Mechanics Textbook",
    status: "found",
    category: "books",
    location: "academic-block",
    locationLabel: "Main Academic Block, Room 204",
    date: "Yesterday, 11:00 AM",
    description: "Hardcover engineering textbook with yellow sticky notes throughout Chapter 4.",
    image: "assets/images/items/books.jpg"
  },
  {
    id: "ITEM011",
    name: "Spiral Grid Notebook",
    status: "missing",
    category: "books",
    location: "laboratory",
    locationLabel: "Chemistry Lab, Prep Table",
    date: "Yesterday, 4:30 PM",
    description: "A4 size spiral-bound graph notebook containing chemistry laboratory notes and charts.",
    image: "assets/images/items/notebook.jpg"
  },
  {
    id: "ITEM012",
    name: "Compact Folding Umbrella",
    status: "found",
    category: "accessories",
    location: "academic-block",
    locationLabel: "Academic Block, Main Entrance",
    date: "3 days ago",
    description: "Dark navy collapsible umbrella left on umbrella stand during afternoon rain.",
    image: "assets/images/items/umbrella.jpg"
  },
  {
    id: "ITEM013",
    name: "Navy College Hoodie",
    status: "missing",
    category: "others",
    location: "sports-complex",
    locationLabel: "Gymnasium Changing Locker #12",
    date: "6 days ago",
    description: "Size M navy blue pullover fleece hoodie with white college insignia on front.",
    image: "assets/images/items/hoodie.jpg"
  },
  {
    id: "ITEM014",
    name: "Smartphone with Clear Case",
    status: "found",
    category: "electronics",
    location: "cafeteria",
    locationLabel: "Cafeteria Cashier Counter",
    date: "Today, 1:20 PM",
    description: "Black smartphone with transparent bumper case. Surrendered to cafeteria cashier.",
    image: "assets/images/items/smartphone.jpg"
  }
];

// Expose helper to retrieve combined items (demo items + locally submitted reports)
function getAllItems() {
  try {
    const local = JSON.parse(localStorage.getItem('findit_custom_reports') || '[]');
    if (Array.isArray(local) && local.length > 0) {
      return [...local, ...DEMO_ITEMS];
    }
  } catch (err) {
    console.warn('LocalStorage read skipped:', err);
  }
  return DEMO_ITEMS;
}

// Expose globally so subsequent pages (e.g. item-details.html) can read records easily
window.FindItData = getAllItems();
window.resetAllFilters = resetAllFilters;

// ============================================================================
// 2. Active Filter State
// ============================================================================
const filterState = {
  searchTerm: '',
  status: 'all',       // 'all' | 'missing' | 'found'
  category: 'all',     // 'all' | 'electronics' | 'id-cards' | etc.
  location: 'all'      // 'all' | 'library' | 'cafeteria' | etc.
};

// ============================================================================
// 3. Initialization on DOM Content Loaded
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  initDashboard();
});

function initDashboard() {
  const searchInput = document.getElementById('dashboardSearchInput');
  const missingGrid = document.getElementById('missingItemsGrid');

  // Guard: exit gracefully if not on the dashboard page
  if (!searchInput && !missingGrid) return;
  const categorySelect = document.getElementById('categoryFilter');
  const locationSelect = document.getElementById('locationFilter');
  const clearFiltersBtn = document.getElementById('clearFiltersBtn');
  const statusButtons = document.querySelectorAll('.status-pill-btn');

  // Search input event listener (real-time filtering)
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      filterState.searchTerm = e.target.value.trim().toLowerCase();
      applyFilters();
    });
  }

  // Status buttons event listener
  statusButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      statusButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      filterState.status = btn.getAttribute('data-status') || 'all';
      applyFilters();
    });
  });

  // Category select listener
  if (categorySelect) {
    categorySelect.addEventListener('change', (e) => {
      filterState.category = e.target.value;
      applyFilters();
    });
  }

  // Location select listener
  if (locationSelect) {
    locationSelect.addEventListener('change', (e) => {
      filterState.location = e.target.value;
      applyFilters();
    });
  }

  // Clear filters button listener
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', resetAllFilters);
  }

  // Initial render of all items
  applyFilters();
}

// ============================================================================
// 4. Combined Filtering Algorithm
// ============================================================================
function applyFilters() {
  const allItems = getAllItems();
  window.FindItData = allItems;

  // Filter the demonstration dataset across all active criteria
  const filtered = allItems.filter((item) => {
    // 1. Text Search (matches name, category, locationLabel, or description)
    const matchesSearch =
      !filterState.searchTerm ||
      item.name.toLowerCase().includes(filterState.searchTerm) ||
      item.category.toLowerCase().includes(filterState.searchTerm) ||
      item.locationLabel.toLowerCase().includes(filterState.searchTerm) ||
      item.description.toLowerCase().includes(filterState.searchTerm);

    // 2. Status Match
    const matchesStatus =
      filterState.status === 'all' || item.status === filterState.status;

    // 3. Category Match
    const matchesCategory =
      filterState.category === 'all' || item.category === filterState.category;

    // 4. Location Match
    const matchesLocation =
      filterState.location === 'all' || item.location === filterState.location;

    // Item must satisfy ALL active filter conditions
    return matchesSearch && matchesStatus && matchesCategory && matchesLocation;
  });

  renderDashboard(filtered);
}

// ============================================================================
// 5. DOM Rendering Engine (Cards, Counts & Empty State)
// ============================================================================
function renderDashboard(items) {
  const missingSection = document.getElementById('missing-items');
  const foundSection = document.getElementById('found-items');
  const missingGrid = document.getElementById('missingItemsGrid');
  const foundGrid = document.getElementById('foundItemsGrid');
  const missingCountBadge = document.getElementById('missingCountBadge');
  const foundCountBadge = document.getElementById('foundCountBadge');
  const emptyState = document.getElementById('dashboardEmptyState');

  // Partition items into Missing and Found
  const missingItems = items.filter((item) => item.status === 'missing');
  const foundItems = items.filter((item) => item.status === 'found');

  // Handle Complete Empty State (0 results across entire filter)
  if (items.length === 0) {
    if (emptyState) emptyState.style.display = 'block';
    if (missingSection) missingSection.style.display = 'none';
    if (foundSection) foundSection.style.display = 'none';
    return;
  }

  // Results exist — hide empty state
  if (emptyState) emptyState.style.display = 'none';

  // --- Render Missing Items Section ---
  if (missingSection && missingGrid) {
    if (filterState.status === 'found' || missingItems.length === 0) {
      // Hide section if user explicitly filtered by "Found" or no missing items match
      missingSection.style.display = 'none';
    } else {
      missingSection.style.display = 'block';
      const allItems = getAllItems();
      if (missingCountBadge) {
        missingCountBadge.textContent = `Showing ${missingItems.length} of ${allItems.filter((i) => i.status === 'missing').length} items`;
      }
      missingGrid.innerHTML = missingItems.map(createItemCardHTML).join('');
    }
  }

  // --- Render Found Items Section ---
  if (foundSection && foundGrid) {
    if (filterState.status === 'missing' || foundItems.length === 0) {
      // Hide section if user explicitly filtered by "Missing" or no found items match
      foundSection.style.display = 'none';
    } else {
      foundSection.style.display = 'block';
      const allItems = getAllItems();
      if (foundCountBadge) {
        foundCountBadge.textContent = `Showing ${foundItems.length} of ${allItems.filter((i) => i.status === 'found').length} items`;
      }
      foundGrid.innerHTML = foundItems.map(createItemCardHTML).join('');
    }
  }
}

// ============================================================================
// 6. Item Card Component HTML Generator
// ============================================================================
function createItemCardHTML(item) {
  const isLost = item.status === 'missing';
  const badgeClass = isLost ? 'badge-lost' : 'badge-found';
  const badgeText = isLost ? 'Missing' : 'Found';
  const categoryFormatted = formatCategoryName(item.category);

  return `
    <article class="dash-item-card" data-id="${item.id}" aria-label="${escapeHTML(item.name)} - ${badgeText}">
      <div class="dash-card-thumb-wrap">
        <img 
          src="${item.image}" 
          alt="${escapeHTML(item.name)}" 
          class="dash-card-thumb" 
          width="320" 
          height="180" 
          loading="lazy">
        <div class="dash-card-badge">
          <span class="badge ${badgeClass}">
            <span class="badge-dot"></span> ${badgeText}
          </span>
        </div>
      </div>
      <div class="dash-card-body">
        <span class="dash-card-category">${categoryFormatted}</span>
        <h3 class="dash-card-title">${escapeHTML(item.name)}</h3>
        <p class="dash-card-desc">${escapeHTML(item.description)}</p>
        <div class="dash-card-meta">
          <div class="dash-meta-row">
            <svg class="dash-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>${escapeHTML(item.locationLabel)}</span>
          </div>
          <div class="dash-meta-row">
            <svg class="dash-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>${escapeHTML(item.date)}</span>
          </div>
        </div>
        <div class="dash-card-footer">
          <a href="item-details.html?id=${item.id}" class="btn btn-outline btn-sm" style="width: 100%;">
            View Details
          </a>
        </div>
      </div>
    </article>
  `;
}

// ============================================================================
// 7. Helper Utilities
// ============================================================================
function resetAllFilters() {
  const searchInput = document.getElementById('dashboardSearchInput');
  const categorySelect = document.getElementById('categoryFilter');
  const locationSelect = document.getElementById('locationFilter');
  const statusButtons = document.querySelectorAll('.status-pill-btn');

  // Reset state
  filterState.searchTerm = '';
  filterState.status = 'all';
  filterState.category = 'all';
  filterState.location = 'all';

  // Reset inputs
  if (searchInput) searchInput.value = '';
  if (categorySelect) categorySelect.value = 'all';
  if (locationSelect) locationSelect.value = 'all';

  statusButtons.forEach((btn) => {
    if (btn.getAttribute('data-status') === 'all') {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  applyFilters();
}

function formatCategoryName(category) {
  const map = {
    'electronics': 'Electronics',
    'id-cards': 'ID & Cards',
    'bags': 'Bags & Luggage',
    'accessories': 'Accessories',
    'books': 'Books & Stationery',
    'others': 'Others'
  };
  return map[category] || 'General';
}

function escapeHTML(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
