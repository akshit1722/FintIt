/**
 * FindIt — Lost & Found Campus Platform
 * Global Client Script (Vanilla JS)
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNavigation();
  initHeaderScrollShadow();
});

/**
 * Mobile Navigation Drawer Toggle & Keyboard Accessibility
 */
function initMobileNavigation() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const navMenu = document.getElementById('mobileNavMenu');
  const overlay = document.getElementById('mobileNavOverlay');

  if (!toggleBtn || !navMenu) return;

  function openMenu() {
    toggleBtn.setAttribute('aria-expanded', 'true');
    navMenu.classList.add('is-open');
    if (overlay) overlay.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    toggleBtn.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('is-open');
    if (overlay) overlay.classList.remove('is-visible');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', () => {
    const isOpen = toggleBtn.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }

  // Close on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
      closeMenu();
      toggleBtn.focus();
    }
  });

  // Close when clicking any nav link inside mobile drawer
  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });
}

/**
 * Dynamic elevation shadow on navbar upon page scroll
 */
function initHeaderScrollShadow() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 12) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }
  }, { passive: true });
}
