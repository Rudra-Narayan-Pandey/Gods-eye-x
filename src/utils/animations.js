/**
 * GOD'S EYE X — Scroll Reveal Animations
 */

let observer = null;

export function initScrollReveal() {
  if (observer) observer.disconnect();

  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px',
  });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

export function observeNewElements(container) {
  if (!observer) return;
  container.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/** Parallax effect on element based on scroll */
export function initParallax(element, speed = 0.3) {
  if (!element) return;
  
  function update() {
    const scrollY = window.scrollY;
    element.style.transform = `translateY(${scrollY * speed}px)`;
  }
  
  window.addEventListener('scroll', update, { passive: true });
  return () => window.removeEventListener('scroll', update);
}

/** Animate counter from 0 to target */
export function animateCounter(element, target, duration = 1500, formatter = null) {
  let start = 0;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    
    element.textContent = formatter ? formatter(current) : current.toLocaleString();
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

/** Stagger-animate children */
export function staggerAnimate(container, selector = ':scope > *', delay = 60) {
  const children = container.querySelectorAll(selector);
  children.forEach((child, i) => {
    child.style.opacity = '0';
    child.style.transform = 'translateY(20px)';
    child.style.transition = `opacity 0.5s ease ${i * delay}ms, transform 0.5s ease ${i * delay}ms`;
    
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        child.style.opacity = '1';
        child.style.transform = 'translateY(0)';
      });
    });
  });
}

/** Typewriter text effect */
export function typewriter(element, text, speed = 40) {
  return new Promise(resolve => {
    element.textContent = '';
    let i = 0;
    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else {
        resolve();
      }
    }
    type();
  });
}
