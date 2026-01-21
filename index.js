const navItems = document.querySelectorAll('.nav-item');

navItems.forEach((item) => {
  item.addEventListener('click', () => {
    navItems.forEach((navItem) => navItem.classList.remove('active'));
    item.classList.add('active');
  });
});

// Add background to navbar on scroll
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Make hero section fade on scroll (index.html only)
const hero = document.querySelector('.hero');
const projects = document.querySelector('.projects');

if (hero && projects) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const projectsTop = projects.offsetTop;

    // Calculate opacity: 1 at top, 0 when projects top reaches top of viewport
    let opacity = 1 - scrollY / projectsTop;
    if (opacity < 0) opacity = 0; // cap at 0
    hero.style.opacity = opacity;

    // Fade out scroll hint together
    const scrollHint = document.querySelector('.scroll-hint');
    if (scrollHint) {
      scrollHint.style.opacity = opacity;
    }
  });
}

// Changes year dynamically
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Gallery & lightbox
let currentIndex = 0;

const imgs = Array.from(document.querySelectorAll('.gallery img'));
const prevBtn = document.querySelector('.gallery-btn.prev');
const nextBtn = document.querySelector('.gallery-btn.next');
const dots = Array.from(document.querySelectorAll('.gallery-dots .dot'));
const wrapper = document.getElementById('galleryWrapper');

// Lightbox elements
const lightbox = document.querySelector('.lightbox');
const lightboxImg = document.querySelector('.lightbox-img');
const lightboxCaption = document.querySelector('.lightbox-caption');
const lightboxClose = document.querySelector('.lightbox-close');

function showImage(index) {
  imgs.forEach((img, i) => img.classList.toggle('active', i === index));
  dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  currentIndex = index;
}

function next() {
  showImage((currentIndex + 1) % imgs.length);
}

function prev() {
  showImage((currentIndex - 1 + imgs.length) % imgs.length);
}

if (imgs.length && prevBtn && nextBtn && dots.length && wrapper) {
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);
  dots.forEach((dot, i) => dot.addEventListener('click', () => showImage(i)));

  const openLightboxAt = (index) => {
    const img = imgs[index];
    if (!img || !lightbox || !lightboxImg || !lightboxCaption) return;
    currentIndex = index;

    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt || '';
    lightboxCaption.textContent = img.dataset.caption || '';

    lightbox.classList.add('active');
    document.body.classList.add('lightbox-open');
  };

  // --- Lightbox open ---
  if (lightbox && lightboxImg && lightboxCaption) {
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');

    imgs.forEach((img, index) => {
      img.addEventListener('click', () => {
        lightbox.classList.add('lightbox-has-gallery');
        openLightboxAt(index);
      });
    });

    lightboxImg.addEventListener('click', () => {
      if (!lightbox.classList.contains('lightbox-has-gallery')) return;
      const nextIndex = (currentIndex + 1) % imgs.length;
      openLightboxAt(nextIndex);
    });

    if (lightboxPrev) {
      lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        const prevIndex = (currentIndex - 1 + imgs.length) % imgs.length;
        openLightboxAt(prevIndex);
      });
    }

    if (lightboxNext) {
      lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        const nextIndex = (currentIndex + 1) % imgs.length;
        openLightboxAt(nextIndex);
      });
    }
  }

  // --- Lightbox close ---
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.classList.remove('lightbox-open');
    if (lightboxImg) lightboxImg.src = ''; // optional: clear
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Swipe (mobile)
  let startX = 0;
  wrapper.addEventListener(
    'touchstart',
    (e) => {
      startX = e.changedTouches[0].clientX;
    },
    { passive: true },
  );

  wrapper.addEventListener(
    'touchend',
    (e) => {
      const endX = e.changedTouches[0].clientX;
      const dx = endX - startX;
      if (Math.abs(dx) > 40) (dx < 0 ? next() : prev());
    },
    { passive: true },
  );

  // Init
  showImage(0);
}

// Scroll reveal (run once per section)
const revealElements = Array.from(document.querySelectorAll('.reveal-on-scroll'));

if (revealElements.length) {
  const revealInView = () => {
    let remaining = 0;

    revealElements.forEach((el) => {
      if (el.classList.contains('is-visible')) return;
      const rect = el.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.85) {
        el.classList.add('is-visible');
      } else {
        remaining += 1;
      }
    });

    if (remaining === 0) {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    }
  };

  const onScroll = () => requestAnimationFrame(revealInView);

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -10% 0px',
      },
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  requestAnimationFrame(revealInView);
}

// Case-study image lightbox
const lb = document.querySelector('.lightbox');
const lbImg = document.querySelector('.lightbox-img'); // make sure your lightbox img has this class
const lbCap = document.querySelector('.lightbox-caption');
const lbClose = document.querySelector('.lightbox-close');

document.querySelectorAll('.lightbox-trigger').forEach((img) => {
  img.addEventListener('click', () => {
    lb.classList.remove('lightbox-has-gallery');
    lb.classList.add('active');
    document.body.classList.add('lightbox-open');

    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt || '';
    lbCap.textContent = img.dataset.caption || '';
  });
});

function closeLB() {
  lb.classList.remove('active');
  document.body.classList.remove('lightbox-open');
  lbImg.src = '';
}

lbClose?.addEventListener('click', closeLB);
lb?.addEventListener('click', (e) => {
  if (e.target === lb) closeLB();
});

// Contact form validation
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');

  const errorFor = (field) =>
    document.querySelector(`[data-error-for="${field}"]`);

  const setError = (field, message) => {
    const el = errorFor(field);
    if (el) el.textContent = message || '';
  };

  const validators = {
    name: (value) => {
      if (!value) return '';
      return value.trim().length >= 2 ? '' : 'Please enter at least 2 characters.';
    },
    email: (value) => {
      if (!value) return '';
      const trimmed = value.trim();
      const isValid = /^[^@]+@[^@]{2,}$/.test(trimmed);
      return isValid
        ? ''
        : 'Please enter a valid email (must include @ and 2+ characters after).';
    },
    message: (value) => {
      if (!value) return '';
      return value.trim().length >= 12 ? '' : 'Please enter at least 12 characters.';
    },
  };

  const validateField = (fieldName, value) => {
    const error = validators[fieldName](value);
    setError(fieldName, error);
    return !error;
  };

  const touched = {
    name: false,
    email: false,
    message: false,
  };

  const bindValidation = (input, fieldName) => {
    if (!input) return;
    input.addEventListener('blur', () => {
      touched[fieldName] = true;
      validateField(fieldName, input.value);
    });
    input.addEventListener('input', () => {
      if (input.value.trim() === '') {
        setError(fieldName, '');
        return;
      }
      if (touched[fieldName] && validators[fieldName](input.value) === '') {
        setError(fieldName, '');
      }
    });
  };

  bindValidation(nameInput, 'name');
  bindValidation(emailInput, 'email');
  bindValidation(messageInput, 'message');

  contactForm.addEventListener('submit', (e) => {
    touched.name = true;
    touched.email = true;
    touched.message = true;

    const nameOk = validateField('name', nameInput?.value || '');
    const emailOk = validateField('email', emailInput?.value || '');
    const messageOk = validateField('message', messageInput?.value || '');

    if (!nameOk || !emailOk || !messageOk) {
      e.preventDefault();
    }
  });
}

const backToTopBtn = document.querySelector('.back-to-top');

backToTopBtn?.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});

// FOOTER BUTTON COPY
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".copy-email-btn");
  if (!btn) return;

  const email = "robynparadis@gmail.com";
  const defaultText = btn.querySelector(".btn-default");
  const copyWord = btn.querySelector(".btn-copy-word");

  // Reset back to the default label when leaving hover
  btn.addEventListener("mouseleave", () => {
    defaultText.textContent = "Copy my email";
    copyWord.textContent = "Copy";
  });

  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(email);
      copyWord.textContent = "Copied!";
    } catch (err) {
      // Fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = email;
      ta.setAttribute("readonly", "");
      ta.style.position = "absolute";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      copyWord.textContent = "Copied!";
    }
  });
});

// Experience accordion (independent panels; multiple can stay open)
document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".xp-item");

  items.forEach((item) => {
    const btn = item.querySelector(".xp-trigger");
    const panel = item.querySelector(".xp-panel");

    if (!btn || !panel) return;

    // Ensure closed on load
    btn.setAttribute("aria-expanded", "false");
    panel.style.height = "0px";

    const openPanel = () => {
      item.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");

      // Set explicit height to animate
      panel.style.height = panel.scrollHeight + "px";

      // If content inside changes size later (fonts/images), keep height accurate
      const ro = new ResizeObserver(() => {
        if (item.classList.contains("is-open")) {
          panel.style.height = panel.scrollHeight + "px";
        }
      });
      panel._ro = ro;
      ro.observe(panel);
    };

    const closePanel = () => {
      item.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");

      // Animate to 0
      panel.style.height = panel.scrollHeight + "px"; // set current height
      requestAnimationFrame(() => {
        panel.style.height = "0px";
      });

      if (panel._ro) {
        panel._ro.disconnect();
        panel._ro = null;
      }
    };

    btn.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");
      if (isOpen) closePanel();
      else openPanel();
    });

    // Optional: allow Enter/Space (button already does this, but kept for safety)
    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        btn.click();
      }
    });
  });
});

// Testimonials
document.addEventListener("DOMContentLoaded", () => {
  const cards = Array.from(document.querySelectorAll(".testimonial-card"));
  const buttons = Array.from(document.querySelectorAll(".avatar-btn"));

  function setActive(targetId) {
    // Toggle cards
    cards.forEach((card) => {
      const isActive = card.dataset.testimonial === targetId;
      card.classList.toggle("is-active", isActive);
      card.setAttribute("aria-hidden", isActive ? "false" : "true");
    });

    // Toggle buttons
    buttons.forEach((btn) => {
      const isActive = btn.dataset.target === targetId;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-selected", isActive ? "true" : "false");
      btn.setAttribute("tabindex", isActive ? "0" : "-1");
    });
  }

  // Click handlers
  buttons.forEach((btn, index) => {
    btn.addEventListener("click", () => setActive(btn.dataset.target));

    // Keyboard navigation
    btn.addEventListener("keydown", (e) => {
      const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
      if (!keys.includes(e.key)) return;

      e.preventDefault();
      let nextIndex = index;

      if (e.key === "ArrowLeft") nextIndex = (index - 1 + buttons.length) % buttons.length;
      if (e.key === "ArrowRight") nextIndex = (index + 1) % buttons.length;
      if (e.key === "Home") nextIndex = 0;
      if (e.key === "End") nextIndex = buttons.length - 1;

      const nextBtn = buttons[nextIndex];
      setActive(nextBtn.dataset.target);
      nextBtn.focus();
    });
  });

  // Init
  const defaultActive = buttons.find((b) => b.classList.contains("is-active")) || buttons[0];
  if (defaultActive) setActive(defaultActive.dataset.target);
});