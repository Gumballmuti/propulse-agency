document.getElementById('year').textContent = new Date().getFullYear();

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(contactForm);
    formStatus.textContent = 'Envoi en cours…';
    formStatus.classList.remove('is-error');

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(data).toString(),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        formStatus.textContent = 'Merci ! Votre message a bien été envoyé.';
        contactForm.reset();
      })
      .catch(() => {
        formStatus.textContent = "Une erreur est survenue, réessayez ou écrivez-nous directement à mail.propulse.agency@gmail.com.";
        formStatus.classList.add('is-error');
      });
  });
}

const navToggle = document.getElementById('navToggle');
const primaryNav = document.getElementById('primaryNav');

navToggle.addEventListener('click', () => {
  const isOpen = primaryNav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

primaryNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    primaryNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

const carousel = document.getElementById('processCarousel');
if (carousel) {
  const slides = carousel.querySelectorAll('.step');
  const dots = carousel.querySelectorAll('.carousel-dot');
  const prevBtn = carousel.querySelector('.carousel-prev');
  const nextBtn = carousel.querySelector('.carousel-next');
  const length = slides.length;
  const AUTOPLAY_DELAY = 3800;
  let current = 0;
  let autoplayTimer = null;

  const render = () => {
    slides.forEach((slide) => {
      const i = Number(slide.dataset.index);
      let diff = (i - current) % length;
      if (diff > length / 2) diff -= length;
      if (diff < -length / 2) diff += length;

      let pos = 'far';
      if (diff === 0) pos = 'active';
      else if (diff === -1) pos = 'prev';
      else if (diff === 1) pos = 'next';
      slide.dataset.pos = pos;
    });
    dots.forEach((dot, i) => {
      const isActive = i === current;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-selected', String(isActive));
    });
  };

  const goTo = (index) => {
    current = (index + length) % length;
    render();
  };

  const stopAutoplay = () => {
    if (autoplayTimer) clearInterval(autoplayTimer);
    autoplayTimer = null;
  };

  const startAutoplay = () => {
    stopAutoplay();
    autoplayTimer = setInterval(() => goTo(current + 1), AUTOPLAY_DELAY);
  };

  const manualNav = (fn) => {
    fn();
    startAutoplay();
  };

  prevBtn.addEventListener('click', () => manualNav(() => goTo(current - 1)));
  nextBtn.addEventListener('click', () => manualNav(() => goTo(current + 1)));
  dots.forEach((dot) => {
    dot.addEventListener('click', () => manualNav(() => goTo(Number(dot.dataset.index))));
  });

  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);

  render();

  const carouselObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        goTo(0);
        startAutoplay();
        carouselObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  carouselObserver.observe(carousel);
}

const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach((el) => observer.observe(el));
