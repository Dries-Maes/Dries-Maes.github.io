/**
* Template Name: MyResume - v4.0.1
* Template URL: https://bootstrapmade.com/free-html-bootstrap-template-my-resume/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener, { passive: true })
  }

  /**
   * Returns the element a "#hash" points to, or null for an empty or unknown hash
   */
  const selectHash = (hash) => {
    if (!hash || hash.length < 2) return null
    return document.getElementById(decodeURIComponent(hash.slice(1)))
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      let section = selectHash(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element
   */
  const scrollto = (el) => {
    window.scrollTo({
      top: el.offsetTop,
      behavior: 'smooth'
    })
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      backtotop.classList.toggle('active', window.scrollY > 100)
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('body').classList.toggle('mobile-nav-active')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Scroll to the section on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    let section = selectHash(this.hash)
    if (section) {
      e.preventDefault()

      let body = select('body')
      if (body.classList.contains('mobile-nav-active')) {
        body.classList.remove('mobile-nav-active')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(section)
    }
  }, true)

  /**
   * Scroll to the section on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    let section = selectHash(window.location.hash)
    if (section) {
      scrollto(section)
    }
  });

  /**
   * Preloader
   */
  let preloader = select('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove()
    });
  }

  /**
   * Hero type effect, restarted with the new words when the language changes
   */
  const typed = select('.typed')
  if (typed && typeof Typed !== 'undefined') {
    let typedInstance = null
    const startTyped = () => {
      if (typedInstance) typedInstance.destroy()
      let typed_strings = typed.getAttribute('data-typed-items').split(',').map(item => item.trim())
      typedInstance = new Typed('.typed', {
        strings: typed_strings,
        loop: true,
        typeSpeed: 75,
        backSpeed: 50,
        backDelay: 1200,
        cursorChar: '...',
        showCursor: true,
        fadeOut: false,
      });
    }
    startTyped()
    document.addEventListener('languagechanged', startTyped)
  }

  /**
   * Age, calculated from the birth date so it never goes stale
   */
  select('[data-birthdate]', true).forEach(el => {
    const [year, month, day] = el.dataset.birthdate.split('-').map(Number)
    const today = new Date()
    const hadBirthdayThisYear = today.getMonth() + 1 > month || (today.getMonth() + 1 === month && today.getDate() >= day)
    el.textContent = today.getFullYear() - year - (hadBirthdayThisYear ? 0 : 1)
  })

  /**
   * Skills animation: fill the bars once the skills come into view
   */
  let skillsContent = select('.skills-content');
  if (skillsContent) {
    const fillSkillBars = () => {
      select('.progress .progress-bar', true).forEach((el) => {
        el.style.width = el.getAttribute('aria-valuenow') + '%'
      });
    }
    if ('IntersectionObserver' in window) {
      const skillsObserver = new IntersectionObserver((entries) => {
        if (entries.some(entry => entry.isIntersecting)) {
          fillSkillBars()
          skillsObserver.disconnect()
        }
      }, { rootMargin: '0px 0px -20% 0px' })
      skillsObserver.observe(skillsContent)
    } else {
      fillSkillBars()
    }
  }

  /**
   * Initiate portfolio details lightbox
   */
  if (typeof GLightbox !== 'undefined') {
    GLightbox({
      selector: '.portfolio-details-lightbox',
      width: '90%',
      height: '90vh'
    });
  }

  /**
   * Portfolio details slider
   */
  if (typeof Swiper !== 'undefined' && select('.portfolio-details-slider')) {
    new Swiper('.portfolio-details-slider', {
      speed: 400,
      loop: true,
      autoplay: {
        delay: 2000,
        disableOnInteraction: false
      },
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      }
    });
  }

  /**
   * Animation on scroll
   */
  if (typeof AOS !== 'undefined') {
    window.addEventListener('load', () => {
      AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      })
    });
    // Translated text changes the page height, so recalculate where the animations trigger
    document.addEventListener('languagechanged', () => AOS.refresh())
  }

})()
