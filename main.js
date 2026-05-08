/* ============================================================
   1.  THEME  (dark / light)
   ============================================================ */
const root         = document.documentElement;
const THEME_KEY    = 'theme';

function getInitialTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored) return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  if (theme === 'dark') root.classList.add('dark');
  else                  root.classList.remove('dark');
  localStorage.setItem(THEME_KEY, theme);
}

function toggleTheme() {
  const next = root.classList.contains('dark') ? 'light' : 'dark';
  applyTheme(next);
}

// Apply on load
applyTheme(getInitialTheme());

// Wire both toggle buttons (desktop + mobile)
document.getElementById('themeToggleDesktop')?.addEventListener('click', toggleTheme);
document.getElementById('themeToggleMobile')?.addEventListener('click', toggleTheme);

/* ============================================================
   2.  HAMBURGER MENU
   ============================================================ */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger?.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('is-open');
  hamburger.setAttribute('aria-expanded', isOpen);
  mobileMenu.setAttribute('aria-hidden', !isOpen);
});

// Close menu when a mobile link is clicked
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('is-open');
    hamburger?.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  });
});

/* ============================================================
   3.  SMOOTH SCROLL  (replaces react-scroll)
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const targetId = anchor.getAttribute('href').slice(1);
    const target   = document.getElementById(targetId);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ============================================================
   4.  TYPEWRITER  (replaces <Typewriter> component)
   ============================================================ */
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const words   = ['React.js','JavaScript','HTML5','CSS3','Tailwind CSS',
                   'Bootstrap','Framer Motion','Redux','Vite','Git & GitHub'];
  let wIdx      = 0;
  let cIdx      = 0;
  let deleting  = false;
  const SPEED_T = 100;   // ms per char (typing)
  const SPEED_D = 60;    // ms per char (deleting)
  const PAUSE   = 1500;  // ms pause when word is complete

  function tick() {
    const word    = words[wIdx];
    const current = deleting
      ? word.slice(0, cIdx - 1)
      : word.slice(0, cIdx + 1);

    el.textContent = current;

    if (!deleting && current === word) {
      // Finished typing — pause then start deleting
      setTimeout(() => { deleting = true; cIdx = current.length; tick(); }, PAUSE);
      return;
    }

    if (deleting && current === '') {
      // Finished deleting — move to next word
      deleting = false;
      wIdx = (wIdx + 1) % words.length;
      cIdx = 0;
      setTimeout(tick, 300);
      return;
    }

    deleting ? cIdx-- : cIdx++;
    setTimeout(tick, deleting ? SPEED_D : SPEED_T);
  }

  tick();
})();

/* ============================================================
   5.  SCROLL REVEAL  (replaces framer-motion whileInView)
   ============================================================ */
(function initReveal() {
  const els = document.querySelectorAll('.reveal-up, .reveal-down, .reveal-left, .reveal-right');
  if (!els.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);   // animate once
        }
      });
    },
    { threshold: 0.05 } // تقليل النسبة ليظهر القسم بمجرد لمس طرف الشاشة
  );

  els.forEach(el => observer.observe(el));
})();

/* ============================================================
   6.  FOOTER YEAR  (replaces {new Date().getFullYear()})
   ============================================================ */
const yearEl = document.getElementById('footerYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ============================================================
   7.  CONTACT FORM  (replaces emailjs React hook)
   ============================================================ */
(function initContactForm() {
  const form      = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  if (!form) return;

  // Init EmailJS with your public key
  emailjs.init('SbDomgQQVDv-sjahf');

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const name    = document.getElementById('contactName').value.trim();
    const email   = document.getElementById('contactEmail').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    if (!name || !email || !message) return;

    submitBtn.disabled    = true;
    submitBtn.textContent = 'Sending...';

    try {
      await emailjs.send('service_ktotnqk', 'template_7eq1dno', { name, email, message });
      alert('Message sent successfully!');
      form.reset();
    } catch (err) {
      alert('Failed to send message, try again later.');
      console.error(err);
    } finally {
      submitBtn.disabled    = false;
      submitBtn.textContent = 'Send Message';
    }
  });
})();