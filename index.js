console.log("JS is running");

// Puts curent year into footer
document.getElementById("currentYear").textContent = new Date().getFullYear();

const lightbox = document.querySelector('.lightbox');
if(lightbox) {
  const images = document.querySelectorAll('.gallery-track img');
  const lightboxImg = lightbox.querySelector('img');
  let caption = lightbox.querySelector('.caption');
  if (!caption) {
    caption = document.createElement('div');
    caption.className = 'caption';
    lightbox.appendChild(caption);
  }
  images.forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      caption.textContent = img.dataset.caption || '';
      caption.style.display = img.dataset.caption ? 'block' : 'none';
      lightbox.style.display = 'flex';
    });
  });
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === lightboxImg) {
      lightbox.style.display = 'none';
    }
  });
}

// GALLERY SCROLLING
// Only run gallery code if gallery exists
const gallery = document.querySelector('.gallery-viewport');
if(gallery) {
  const leftArrow = document.querySelector('.gallery-arrow.left');
  const rightArrow = document.querySelector('.gallery-arrow.right');
  const scrollAmount = 300;
  rightArrow.addEventListener('click', () => {
    if (gallery.scrollLeft + gallery.clientWidth >= gallery.scrollWidth) {
      gallery.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      gallery.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  });
  leftArrow.addEventListener('click', () => {
    if (gallery.scrollLeft === 0) {
      gallery.scrollTo({ left: gallery.scrollWidth, behavior: 'smooth' });
    } else {
      gallery.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  });
}


// Contact Form
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    if(!form) return; // Stop if form doesn't exist
  
    const inputs = form.querySelectorAll('input, textarea');
  
    function isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
  
    function validateField(input) {
        const value = input.value.trim();
        const error = input.closest('.input-group').querySelector('.error-message');
        let valid = true;
      
        // Reset error
        error.textContent = '';
        input.closest('.input-group').classList.remove('error');
      
        // Only validate if the field is not empty
        if (value.length > 0) {
          if(input.name === 'name' && value.length < 2) {
            error.textContent = "Name must be at least 2 letters";
            input.closest('.input-group').classList.add('error');
            valid = false;
          } else if(input.name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            error.textContent = "Email must be valid";
            input.closest('.input-group').classList.add('error');
            valid = false;
          } else if(input.name === 'message' && value.length < 10) {
            error.textContent = "Message must be at least 10 characters";
            input.closest('.input-group').classList.add('error');
            valid = false;
          }
        }
      
        return valid;
    }      
  
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
    });
  
    form.addEventListener('submit', e => {
        e.preventDefault();
        let formValid = true;
      
        inputs.forEach(input => {
          if(!validateField(input)) formValid = false;
        });
      
        if(formValid) {
          // Submit the form to Formspree
          form.submit();
        }
    });
});

// Project Pages Lightbox
const splitLightbox = document.querySelector('.lightbox');

if (splitLightbox) {
  const images = document.querySelectorAll('.split-lightbox');
  const lightboxImg = splitLightbox.querySelector('img');
  let caption = splitLightbox.querySelector('.caption');

  images.forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      caption.textContent = img.dataset.caption || '';
      caption.style.display = img.dataset.caption ? 'block' : 'none';
      splitLightbox.style.display = 'flex';
    });
  });

  splitLightbox.addEventListener('click', (e) => {
    if (e.target === splitLightbox || e.target === lightboxImg) {
      splitLightbox.style.display = 'none';
    }
  });
}

// Scroll to Top Button
const scrollTopBtn = document.querySelector('.scroll-top-btn');

if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
