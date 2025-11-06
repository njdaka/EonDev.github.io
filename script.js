// ============================================
//  DECYPHER AI - PREMIUM EXPERIENCE ENGINE
// ============================================

'use strict';

// ====== PERFORMANCE & UTILITIES ======
const debounce = (func, wait = 100) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const throttle = (func, limit = 16) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Check if user prefers reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ====== SMOOTH SCROLL WITH OFFSET ======
const initSmoothScroll = () => {
  const navLinks = document.querySelectorAll('nav ul li a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').slice(1);
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        const navbar = document.getElementById('navbar');
        const offset = navbar ? navbar.offsetHeight : 80;
        const targetPosition = targetSection.offsetTop - offset;
        
        window.scrollTo({
          top: targetPosition,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
        
        // Close mobile menu if open
        const navMenu = document.querySelector('nav ul');
        const mobileMenuBtn = document.querySelector('.mobile-menu');
        if (navMenu && navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          mobileMenuBtn.classList.remove('open');
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });
};

// ====== ACTIVE NAV HIGHLIGHT ======
const initActiveNav = () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav ul li a[href^="#"]');
  
  const highlightNav = throttle(() => {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, 100);
  
  window.addEventListener('scroll', highlightNav, { passive: true });
};

// ====== MOBILE NAV TOGGLE ======
const initMobileNav = () => {
  const mobileMenuBtn = document.querySelector('.mobile-menu');
  const navMenu = document.querySelector('nav ul');
  
  if (!mobileMenuBtn || !navMenu) return;
  
  mobileMenuBtn.addEventListener('click', () => {
    const isOpen = mobileMenuBtn.classList.toggle('open');
    navMenu.classList.toggle('open');
    mobileMenuBtn.setAttribute('aria-expanded', isOpen);
    
    // Prevent body scroll when menu is open on mobile
    if (window.innerWidth <= 768) {
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }
  });
  
  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      mobileMenuBtn.classList.remove('open');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
  
  // Close menu on window resize
  window.addEventListener('resize', debounce(() => {
    if (window.innerWidth > 768 && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      mobileMenuBtn.classList.remove('open');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }, 250));
};

// ====== ENHANCED NAVBAR ON SCROLL ======
const initNavbarScroll = () => {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  
  let lastScrollY = 0;
  let ticking = false;
  
  const updateNavbar = () => {
    const currentScrollY = window.pageYOffset;
    
    if (currentScrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    lastScrollY = currentScrollY;
    ticking = false;
  };
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  }, { passive: true });
};

// ====== INTERSECTION OBSERVER FOR FADE ANIMATIONS ======
const initScrollAnimations = () => {
  const fadeElements = document.querySelectorAll('.fade-in, .fade-up, .fade-left, .fade-right');
  
  if (fadeElements.length === 0) return;
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -80px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('appear');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  fadeElements.forEach(element => observer.observe(element));
};

// ====== HERO MESH OVERLAY INTERACTION ======
const initHeroMeshOverlay = () => {
  const heroSection = document.getElementById('hero');
  const meshOverlay = document.querySelector('.hero-mesh-overlay');
  
  if (!heroSection || !meshOverlay || prefersReducedMotion) return;
  
  let ticking = false;
  
  const updateMeshPosition = (e) => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const rect = heroSection.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        meshOverlay.style.setProperty('--mouse-x', `${x}px`);
        meshOverlay.style.setProperty('--mouse-y', `${y}px`);
        
        ticking = false;
      });
      ticking = true;
    }
  };
  
  heroSection.addEventListener('mousemove', throttle(updateMeshPosition, 50));
  
  heroSection.addEventListener('mouseenter', () => {
    meshOverlay.classList.add('active');
  });
  
  heroSection.addEventListener('mouseleave', () => {
    meshOverlay.classList.remove('active');
  });
};

// ====== IMPACT SECTION - CONTINUOUS TEXT LOOP ======
const initImpactSection = () => {
  const impactContainer = document.querySelector('.impact-content');
  const impactStatements = document.querySelectorAll('.impact-statement');
  
  if (!impactContainer || impactStatements.length === 0) return;
  
  let currentIndex = 0;
  let intervalId = null;
  
  const showNextStatement = () => {
    impactStatements.forEach(statement => statement.classList.remove('active'));
    impactStatements[currentIndex].classList.add('active');
    currentIndex = (currentIndex + 1) % impactStatements.length;
  };
  
  const startLoop = () => {
    showNextStatement();
    intervalId = setInterval(showNextStatement, 4000);
  };
  
  const stopLoop = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };
  
  // Intersection Observer to control when the loop runs
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startLoop();
      } else {
        stopLoop();
      }
    });
  }, { threshold: 0.1 });
  
  observer.observe(impactContainer);
};

// ====== BACKGROUND VIDEO PARALLAX (IMPACT SECTION) ======
const initImpactParallax = () => {
  if (prefersReducedMotion) return;
  
  const impactSection = document.getElementById('impact');
  const impactBgVideo = document.querySelector('.impact-background video');
  
  if (!impactSection || !impactBgVideo) return;
  
  let ticking = false;
  
  const updateParallax = () => {
    const sectionTop = impactSection.offsetTop;
    const sectionHeight = impactSection.offsetHeight;
    const scrollPos = window.pageYOffset;
    
    // Check if section is in viewport
    if (scrollPos > sectionTop - window.innerHeight && 
        scrollPos < sectionTop + sectionHeight) {
      
      const relativeScroll = (scrollPos - sectionTop + window.innerHeight) / 
                             (sectionHeight + window.innerHeight);
      const parallaxOffset = relativeScroll * 20;
      
      impactBgVideo.style.transform = `scale(1.05) translateY(${parallaxOffset}px)`;
    }
    
    ticking = false;
  };
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
};

// ====== VIDEO AUTOPLAY OPTIMIZATION ======
const initVideoOptimization = () => {
  const videos = document.querySelectorAll('video[autoplay]');
  
  videos.forEach(video => {
    // Attempt to play
    const playPromise = video.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        console.log('Autoplay prevented:', err);
        
        // Fallback: try to play on user interaction
        const playOnInteraction = () => {
          video.play().catch(e => console.log('Play failed:', e));
          document.removeEventListener('click', playOnInteraction);
          document.removeEventListener('touchstart', playOnInteraction);
        };
        
        document.addEventListener('click', playOnInteraction, { once: true });
        document.addEventListener('touchstart', playOnInteraction, { once: true, passive: true });
      });
    }
    
    // Intersection Observer for play/pause based on viewport visibility
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.play().catch(err => console.log('Play failed:', err));
        } else {
          entry.target.pause();
        }
      });
    }, { threshold: 0.2 });
    
    videoObserver.observe(video);
  });
};

// ====== FEATURE CARDS 3D TILT EFFECT ======
const initFeatureCardTilt = () => {
  if (prefersReducedMotion) return;
  
  const featureCards = document.querySelectorAll('.feature-card');
  
  featureCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 25;
      const rotateY = (centerX - x) / 25;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
};

// ====== PRICING PLAN HOVER EFFECTS ======
const initPricingHover = () => {
  const pricingPlans = document.querySelectorAll('.plan:not(.highlighted)');
  
  pricingPlans.forEach(plan => {
    plan.addEventListener('mouseenter', () => {
      pricingPlans.forEach(p => {
        if (p !== plan) {
          p.style.opacity = '0.5';
        }
      });
    });
    
    plan.addEventListener('mouseleave', () => {
      pricingPlans.forEach(p => {
        p.style.opacity = '1';
      });
    });
  });
};

// ====== NEWSLETTER FORM HANDLING ======
const initNewsletterForm = () => {
  const form = document.querySelector('.newsletter-form');
  
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = form.querySelector('input[type="email"]').value;
    
    // Here you would typically send the email to your backend
    console.log('Newsletter signup:', email);
    
    // Show success message (you can customize this)
    const button = form.querySelector('.btn-newsletter');
    const originalText = button.textContent;
    button.textContent = 'Subscribed! ✓';
    button.style.background = 'linear-gradient(135deg, #84e1bc, #70a9ff)';
    
    setTimeout(() => {
      button.textContent = originalText;
      button.style.background = '';
      form.reset();
    }, 3000);
  });
};

// ====== CTA BUTTON RIPPLE EFFECT ======
const initButtonRipple = () => {
  const ctaButtons = document.querySelectorAll('.btn.primary');
  
  ctaButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      // Create ripple element
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        width: 100px;
        height: 100px;
        margin-top: -50px;
        margin-left: -50px;
        animation: ripple 0.6s;
        pointer-events: none;
      `;
      
      // Position the ripple
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      
      // Add ripple animation
      if (!document.querySelector('style#ripple-animation')) {
        const style = document.createElement('style');
        style.id = 'ripple-animation';
        style.textContent = `
          @keyframes ripple {
            0% {
              transform: scale(0);
              opacity: 1;
            }
            100% {
              transform: scale(4);
              opacity: 0;
            }
          }
        `;
        document.head.appendChild(style);
      }
      
      // Add and remove ripple
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
      
      // Analytics tracking (optional)
      console.log('CTA clicked:', this.textContent.trim());
    });
  });
};

// ====== HERO ANIMATIONS ON LOAD ======
const initHeroAnimations = () => {
  const heroElements = document.querySelectorAll('#hero .fade-up, #hero .fade-in');
  
  heroElements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add('appear');
    }, index * 100 + 200);
  });
};

// ====== PAGE LOAD HANDLER ======
const onPageLoad = () => {
  document.body.classList.add('loaded');
  initHeroAnimations();
};

// ====== PERFORMANCE MONITORING (DEV ONLY) ======
const logPerformance = () => {
  if (window.performance && window.performance.timing) {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    const connectTime = perfData.responseEnd - perfData.requestStart;
    const renderTime = perfData.domComplete - perfData.domLoading;
    
    console.log('🚀 Performance Metrics:');
    console.log(`   Page Load: ${pageLoadTime}ms`);
    console.log(`   Server Response: ${connectTime}ms`);
    console.log(`   Render Time: ${renderTime}ms`);
  }
};

// ====== ACCESSIBILITY ENHANCEMENTS ======
const initAccessibility = () => {
  // Add skip to main content link
  const skipLink = document.createElement('a');
  skipLink.href = '#hero';
  skipLink.className = 'skip-link';
  skipLink.textContent = 'Skip to main content';
  document.body.insertBefore(skipLink, document.body.firstChild);
  
  // Trap focus in mobile menu when open
  const navMenu = document.querySelector('nav ul');
  const mobileMenuBtn = document.querySelector('.mobile-menu');
  
  if (navMenu && mobileMenuBtn) {
    mobileMenuBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        mobileMenuBtn.click();
      }
    });
  }
};

// ====== CONSOLE BRANDING (EASTER EGG) ======
const initConsoleBranding = () => {
  console.log(
    '%c◆ Decypher AI',
    'color: #70a9ff; font-size: 28px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); padding: 10px;'
  );
  console.log(
    '%cBuilt with premium design principles ✨',
    'color: #84e1bc; font-size: 14px; font-weight: 500;'
  );
  console.log(
    '%cInterested in joining our team? → careers@decypher.ai',
    'color: #9aa0a6; font-size: 12px;'
  );
};

// ====== LAZY LOAD IMAGES (FUTURE ENHANCEMENT) ======
const initLazyLoad = () => {
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window && lazyImages.length > 0) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
  }
};

// ====== INITIALIZE ALL FEATURES ======
const init = () => {
  console.log('🎨 Initializing Decypher AI Premium Experience...');
  
  // Core functionality
  initSmoothScroll();
  initActiveNav();
  initMobileNav();
  initNavbarScroll();
  initScrollAnimations();
  
  // Premium interactions
  initHeroMeshOverlay();
  initImpactSection();
  initImpactParallax();
  initVideoOptimization();
  initFeatureCardTilt();
  initPricingHover();
  initNewsletterForm();
  initButtonRipple();
  
  // Accessibility & extras
  initAccessibility();
  initLazyLoad();
  initConsoleBranding();
  
  console.log('✅ Premium Experience Loaded Successfully');
};

// ====== DOM READY & PAGE LOAD EVENTS ======
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

window.addEventListener('load', () => {
  onPageLoad();
  logPerformance();
});

// ====== ERROR HANDLING ======
window.addEventListener('error', (e) => {
  console.error('❌ JavaScript Error:', e.message);
});

// ====== EXPORT FOR POTENTIAL MODULE USE ======
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    init,
    debounce,
    throttle
  };
}