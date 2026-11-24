/**
 * FindIt — Lost & Found Campus Platform
 * Item Details & Claim Controller
 * Vanilla ES6+ Script
 */

document.addEventListener('DOMContentLoaded', () => {
  initItemDetailsPage();
});

function initItemDetailsPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const itemId = urlParams.get('id');

  const detailsContainer = document.getElementById('itemDetailsContainer');
  const notFoundContainer = document.getElementById('itemNotFoundContainer');

  // If no ID provided in URL, show Not Found state immediately
  if (!itemId) {
    showItemNotFound();
    return;
  }

  // Retrieve item from master dataset or custom local reports
  const item = findItemRecord(itemId);

  if (!item) {
    showItemNotFound();
    return;
  }

  // Record found — populate page and show content
  renderItemDetails(item);
  initClaimForm(item);
}

/**
 * Searches the master DEMO_ITEMS and any locally submitted reports
 */
function findItemRecord(id) {
  if (!id) return null;
  const cleanId = id.trim().toLowerCase();

  // Consolidate dataset
  let pool = [];
  if (window.FindItData && Array.isArray(window.FindItData)) {
    pool = [...window.FindItData];
  }
  try {
    const localReports = JSON.parse(localStorage.getItem('findit_custom_reports') || '[]');
    if (Array.isArray(localReports)) {
      pool = [...localReports, ...pool];
    }
  } catch (e) {
    console.warn('LocalStorage read skipped:', e);
  }

  // 1. Direct match (e.g. "item001" === "item001")
  let match = pool.find((it) => it.id.toLowerCase() === cleanId);
  if (match) return match;

  // 2. Numeric / padded match (e.g. "1" matches "ITEM001")
  const numMatch = cleanId.match(/\d+/);
  if (numMatch) {
    const padded = 'item' + numMatch[0].padStart(3, '0');
    match = pool.find((it) => it.id.toLowerCase() === padded);
    if (match) return match;
  }

  return null;
}

/**
 * Displays the "Item not found." empty state
 */
function showItemNotFound() {
  const detailsContainer = document.getElementById('itemDetailsContainer');
  const notFoundContainer = document.getElementById('itemNotFoundContainer');

  if (detailsContainer) detailsContainer.style.display = 'none';
  if (notFoundContainer) notFoundContainer.style.display = 'block';
  document.title = 'Item Not Found – FindIt';
}

/**
 * Populates all DOM elements with the item's details
 */
function renderItemDetails(item) {
  const isFound = item.status === 'found';
  const badgeClass = isFound ? 'badge-found' : 'badge-lost';
  const badgeText = isFound ? 'Found Item' : 'Missing Item';
  const formattedCat = formatCategory(item.category);

  // Update Page Title
  document.title = `${item.name} – FindIt Campus Platform`;

  // Breadcrumbs
  const breadcrumbCurrent = document.getElementById('breadcrumbCurrent');
  if (breadcrumbCurrent) breadcrumbCurrent.textContent = item.name;

  // Image & Badge
  const itemImage = document.getElementById('detailItemImage');
  const itemBadge = document.getElementById('detailItemBadge');
  if (itemImage) {
    itemImage.src = item.image;
    itemImage.alt = item.name;
  }
  if (itemBadge) {
    itemBadge.className = `badge ${badgeClass} item-photo-status-badge`;
    itemBadge.innerHTML = `<span class="badge-dot"></span> ${badgeText}`;
  }

  // Title & ID
  const itemTitle = document.getElementById('detailItemTitle');
  const itemId = document.getElementById('detailItemId');
  if (itemTitle) itemTitle.textContent = item.name;
  if (itemId) itemId.textContent = `REF: ${item.id}`;

  // Metadata Grid
  const metaCategory = document.getElementById('detailMetaCategory');
  const metaLocation = document.getElementById('detailMetaLocation');
  const metaDate = document.getElementById('detailMetaDate');
  const metaColour = document.getElementById('detailMetaColour');

  if (metaCategory) metaCategory.textContent = formattedCat;
  if (metaLocation) metaLocation.textContent = item.locationLabel || item.location;
  if (metaDate) metaDate.textContent = item.date;
  if (metaColour) metaColour.textContent = item.colour || 'Standard / Unspecified';

  // Description
  const itemDesc = document.getElementById('detailItemDescription');
  if (itemDesc) itemDesc.textContent = item.description;

  // Identifying Features
  const itemFeatures = document.getElementById('detailIdentifyingFeatures');
  if (itemFeatures) {
    itemFeatures.textContent =
      item.identifyingFeatures ||
      'Standard manufacturer design. Specific marks or engravings are to be verified directly during in-person pickup.';
  }

  // Toggle Action Cards: Claim Form vs. Report Found Alternative
  const claimCard = document.getElementById('claimActionCard');
  const missingCard = document.getElementById('missingAlternativeCard');

  if (isFound) {
    if (claimCard) claimCard.style.display = 'block';
    if (missingCard) missingCard.style.display = 'none';
  } else {
    if (claimCard) claimCard.style.display = 'none';
    if (missingCard) missingCard.style.display = 'block';
  }
}

/**
 * Initializes the Ownership Claim Request form for Found items
 */
function initClaimForm(item) {
  const claimForm = document.getElementById('claimItemForm');
  const claimModal = document.getElementById('claimSuccessModal');
  const claimDialog = document.getElementById('claimModalDialog');
  const closeClaimModalBtn = document.getElementById('closeClaimModalBtn');

  if (!claimForm) return;

  claimForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!claimForm.checkValidity()) {
      claimForm.reportValidity();
      return;
    }

    const claimantName = document.getElementById('claimantName').value.trim();
    const claimantEmail = document.getElementById('claimantEmail').value.trim();
    const claimEvidence = document.getElementById('claimEvidence').value.trim();
    const claimAdditional = document.getElementById('claimAdditional').value.trim();

    const claimRecord = {
      claimId: 'CLM-' + Math.floor(1000 + Math.random() * 9000),
      itemId: item.id,
      itemName: item.name,
      claimantName,
      claimantEmail,
      evidenceSummary: claimEvidence,
      additionalInfo: claimAdditional,
      submittedAt: new Date().toISOString()
    };

    // Store claim record locally in browser
    try {
      const claims = JSON.parse(localStorage.getItem('findit_demo_claims') || '[]');
      claims.unshift(claimRecord);
      localStorage.setItem('findit_demo_claims', JSON.stringify(claims));
    } catch (err) {
      console.warn('LocalStorage save skipped:', err);
    }

    // Populate confirmation modal summary
    const modalClaimItem = document.getElementById('modalClaimItemName');
    const modalClaimRef = document.getElementById('modalClaimRef');
    if (modalClaimItem) modalClaimItem.textContent = item.name;
    if (modalClaimRef) modalClaimRef.textContent = claimRecord.claimId;

    // Show confirmation modal
    if (claimModal) claimModal.classList.add('is-open');
    if (claimDialog) claimDialog.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  });

  if (closeClaimModalBtn) {
    closeClaimModalBtn.addEventListener('click', () => {
      if (claimModal) claimModal.classList.remove('is-open');
      if (claimDialog) claimDialog.classList.remove('is-open');
      document.body.style.overflow = '';
      claimForm.reset();
    });
  }
}

function formatCategory(cat) {
  const map = {
    'electronics': 'Electronics',
    'id-cards': 'ID & Access Cards',
    'bags': 'Bags & Luggage',
    'accessories': 'Accessories',
    'books': 'Books & Stationery',
    'clothing': 'Clothing & Apparel',
    'others': 'Other Miscellaneous'
  };
  return map[cat] || 'General Category';
}
