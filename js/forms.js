/**
 * FindIt — Lost & Found Campus Platform
 * Report Form Controller (Type Toggle, Image Preview & Local Submission)
 * Vanilla ES6+ Script
 */

document.addEventListener('DOMContentLoaded', () => {
  initReportForm();
});

function initReportForm() {
  const form = document.getElementById('reportItemForm');
  const typeRadios = document.querySelectorAll('input[name="reportType"]');
  const typeCards = document.querySelectorAll('.type-choice-card');
  const fileInput = document.getElementById('itemImage');
  const dropzone = document.getElementById('fileDropzone');
  const previewContainer = document.getElementById('imagePreviewContainer');
  const previewImg = document.getElementById('previewThumbnailImg');
  const previewFilename = document.getElementById('previewFilename');
  const previewFilesize = document.getElementById('previewFilesize');
  const removePreviewBtn = document.getElementById('removePreviewBtn');
  const modalBackdrop = document.getElementById('reportSuccessModal');
  const modalDialog = document.getElementById('reportModalDialog');
  const resetFormBtn = document.getElementById('resetFormBtn');

  // Currently stored preview Data URL (Base64)
  let currentImageDataURL = '';

  // --------------------------------------------------------------------------
  // 1. Report Type Toggle (Missing vs. Found)
  // --------------------------------------------------------------------------
  typeRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      const selectedType = radio.value;

      typeCards.forEach((card) => {
        card.classList.remove('is-active');
      });

      const activeCard = radio.closest('.type-choice-card');
      if (activeCard) {
        activeCard.classList.add('is-active');
      }

      updateTypeLabels(selectedType);
    });
  });

  function updateTypeLabels(type) {
    const dateLabel = document.getElementById('dateFieldLabel');
    const locationLabel = document.getElementById('locationFieldLabel');
    const submitBtnText = document.getElementById('submitBtnText');

    if (type === 'missing') {
      if (dateLabel) dateLabel.innerHTML = 'Date Lost <span class="form-label-required"></span>';
      if (locationLabel) locationLabel.innerHTML = 'Approximate Location Last Seen <span class="form-label-required"></span>';
      if (submitBtnText) submitBtnText.textContent = 'Submit Missing Item Report';
    } else {
      if (dateLabel) dateLabel.innerHTML = 'Date Found <span class="form-label-required"></span>';
      if (locationLabel) locationLabel.innerHTML = 'Approximate Location Found <span class="form-label-required"></span>';
      if (submitBtnText) submitBtnText.textContent = 'Register Found Item';
    }
  }

  // --------------------------------------------------------------------------
  // 2. Image File Upload & Live FileReader Preview
  // --------------------------------------------------------------------------
  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      handleFileSelected(file);
    });
  }

  // Drag and drop events on dropzone
  if (dropzone) {
    ['dragenter', 'dragover'].forEach((eventName) => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach((eventName) => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
      });
    });

    dropzone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const file = dt.files && dt.files[0];
      if (file && fileInput) {
        fileInput.files = dt.files;
        handleFileSelected(file);
      }
    });
  }

  function handleFileSelected(file) {
    if (!file) return;

    // Validate that file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, JPEG, WebP).');
      clearFilePreview();
      return;
    }

    // Limit size to 5MB for browser local storage safety
    if (file.size > 5 * 1024 * 1024) {
      alert('Image file is too large. Please select an image under 5MB.');
      clearFilePreview();
      return;
    }

    // Use HTML5 FileReader to generate client-side Base64 preview
    const reader = new FileReader();
    reader.onload = (event) => {
      currentImageDataURL = event.target.result;
      if (previewImg) previewImg.src = currentImageDataURL;
      if (previewFilename) previewFilename.textContent = file.name;
      if (previewFilesize) previewFilesize.textContent = formatBytes(file.size);
      if (previewContainer) previewContainer.classList.add('is-visible');
    };
    reader.readAsDataURL(file);
  }

  if (removePreviewBtn) {
    removePreviewBtn.addEventListener('click', clearFilePreview);
  }

  function clearFilePreview() {
    currentImageDataURL = '';
    if (fileInput) fileInput.value = '';
    if (previewImg) previewImg.src = '';
    if (previewFilename) previewFilename.textContent = '';
    if (previewFilesize) previewFilesize.textContent = '';
    if (previewContainer) previewContainer.classList.remove('is-visible');
  }

  // --------------------------------------------------------------------------
  // 3. Form Submission & Validation (Local Prototype Execution)
  // --------------------------------------------------------------------------
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Check native HTML5 form validity
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // Collect form fields
      const reportTypeInput = document.querySelector('input[name="reportType"]:checked');
      const reportType = reportTypeInput ? reportTypeInput.value : 'missing';
      const itemName = document.getElementById('itemName').value.trim();
      const itemCategory = document.getElementById('itemCategory').value;
      const itemLocation = document.getElementById('itemLocation').value;
      const itemDate = document.getElementById('itemDate').value;
      const itemColour = document.getElementById('itemColour').value.trim();
      const itemDesc = document.getElementById('itemDescription').value.trim();
      const identifyingFeatures = document.getElementById('identifyingFeatures').value.trim();
      const contactEmail = document.getElementById('contactEmail').value.trim();

      // Fallback default image placeholder if user did not choose a file
      const finalImage = currentImageDataURL || 'assets/images/items/backpack.jpg';

      // Generate a mock unique reference ID for demonstration
      const randomRef = 'DEMO-' + Math.floor(1000 + Math.random() * 9000);

      // Create demonstration record object
      const newReport = {
        id: randomRef,
        name: itemName,
        status: reportType,
        category: itemCategory,
        location: itemLocation,
        locationLabel: formatLocationName(itemLocation),
        date: formatDateDisplay(itemDate),
        colour: itemColour,
        description: itemDesc,
        identifyingFeatures: identifyingFeatures,
        contactEmail: contactEmail,
        image: finalImage,
        createdAt: new Date().toISOString()
      };

      // Save to browser localStorage (client-side prototype persistence)
      saveReportLocally(newReport);

      // Populate summary modal
      displaySubmissionConfirmation(newReport);
    });
  }

  function saveReportLocally(report) {
    try {
      const existing = JSON.parse(localStorage.getItem('findit_custom_reports') || '[]');
      existing.unshift(report);
      localStorage.setItem('findit_custom_reports', JSON.stringify(existing));
    } catch (err) {
      console.warn('LocalStorage save skipped (quota or private mode):', err);
    }
  }

  function displaySubmissionConfirmation(report) {
    const modalItemName = document.getElementById('modalSummaryName');
    const modalItemType = document.getElementById('modalSummaryType');
    const modalItemCategory = document.getElementById('modalSummaryCategory');
    const modalItemLocation = document.getElementById('modalSummaryLocation');
    const modalItemDate = document.getElementById('modalSummaryDate');
    const modalItemRef = document.getElementById('modalSummaryRef');

    if (modalItemName) modalItemName.textContent = report.name;
    if (modalItemType) {
      modalItemType.textContent = report.status === 'missing' ? 'Missing (Lost)' : 'Found Item';
      modalItemType.className = report.status === 'missing' ? 'badge badge-lost' : 'badge badge-found';
    }
    if (modalItemCategory) modalItemCategory.textContent = formatCategoryName(report.category);
    if (modalItemLocation) modalItemLocation.textContent = report.locationLabel;
    if (modalItemDate) modalItemDate.textContent = report.date;
    if (modalItemRef) modalItemRef.textContent = report.id;

    // Show modal
    if (modalBackdrop) modalBackdrop.classList.add('is-open');
    if (modalDialog) modalDialog.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  // Close / Reset Modal
  if (resetFormBtn) {
    resetFormBtn.addEventListener('click', () => {
      closeConfirmationModal();
      if (form) form.reset();
      clearFilePreview();
      // Reset type selection to missing
      const missingRadio = document.getElementById('typeMissing');
      if (missingRadio) {
        missingRadio.checked = true;
        missingRadio.dispatchEvent(new Event('change'));
      }
    });
  }

  function closeConfirmationModal() {
    if (modalBackdrop) modalBackdrop.classList.remove('is-open');
    if (modalDialog) modalDialog.classList.remove('is-open');
    document.body.style.overflow = '';
  }
}

// ----------------------------------------------------------------------------
// 4. Helper Formatting Utilities
// ----------------------------------------------------------------------------
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function formatLocationName(loc) {
  const map = {
    'library': 'Central Library',
    'cafeteria': 'Student Cafeteria',
    'academic-block': 'Main Academic Block',
    'sports-complex': 'Sports Complex & Gym',
    'laboratory': 'Science Laboratory Block',
    'hostel': 'Campus Hostels & Dorms',
    'other': 'General Campus Area'
  };
  return map[loc] || 'Campus Grounds';
}

function formatCategoryName(cat) {
  const map = {
    'electronics': 'Electronics',
    'id-cards': 'ID & Access Cards',
    'bags': 'Bags & Luggage',
    'accessories': 'Accessories',
    'books': 'Books & Stationery',
    'clothing': 'Clothing & Apparel',
    'others': 'Other Miscellaneous'
  };
  return map[cat] || 'General';
}

function formatDateDisplay(dateStr) {
  if (!dateStr) return 'Recently';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  } catch (e) {
    // fallback
  }
  return dateStr;
}
