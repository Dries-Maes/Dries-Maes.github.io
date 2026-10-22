/**
 * Language toggle (Dutch / English)
 *
 * The Dutch text lives in the HTML; the English text lives in the dictionary below.
 *   data-i18n="key"                      replaces the element's content
 *   data-i18n-attr="attr:key; attr:key"  replaces attributes (alt, content, aria-label, ...)
 * A translation may contain {name} placeholders, filled from the element's data-name attribute.
 * The chosen language is remembered, and ?lang=en in the URL opens the site in English.
 */
(function() {
  "use strict";

  const DEFAULT_LANGUAGE = 'nl'
  const STORAGE_KEY = 'language'

  const translations = {
    en: {
      'meta.description': 'Dries Maes from Ghent: deputy head of ICT, .NET developer and project manager. Experience, skills, portfolio and contact details.',
      'backToTop': 'Back to top',

      'nav.about': 'About me',
      'nav.resume': 'My experience',

      'hero.your': 'Your',
      'hero.roles': '.NET developer, project manager, IT consultant',

      'about.title': 'About me',
      'about.intro': 'I was born into a family of problem solvers. Although we count many different profiles, we all have one thing in common: whenever we face a problem, take on a challenge or even have grand and impossible ambitions, we find a way. Whatever you expect from me, you can count on me to tackle it independently and master it quickly.',
      'about.born': 'Born:',
      'about.bornValue': '4 June 1986',
      'about.street': 'Street:',
      'about.city': 'City:',
      'about.cityValue': 'Ghent, Belgium',
      'about.children': 'Children:',
      'about.statusValue': 'Married',
      'about.mobile': 'Mobile:',
      'about.age': 'Age:',
      'about.studies': 'Education:',
      'about.studiesValue': 'Master in Public Administration',
      'about.email': 'Email:',
      'about.text': 'Out-of-the-box, innovative, creative and analytical thinking are my strengths. My studies and work experience taught me to solve problems quickly and efficiently, and to anticipate them through good planning. I learn quickly and eagerly, and I welcome new experiences. I am looking for a new challenge in a pleasant and professional working environment, with opportunities for growth and development within the company. Thanks to my dedication and motivation, I get up to speed quickly. I can take on a variety of roles and readily expand my skill set to meet the needs of your company.',

      'skills.analysis': 'Functional analysis • Business analysis • UX/UI',

      'resume.title': 'Experience',
      'resume.summary': 'Summary',
      'resume.summaryText': 'After 3 years as a project manager in the public IT sector, it was clear that my future lay in IT. I retrained and started as a .NET C# developer, where I quickly grew into a product owner/manager role. My strengths: I am eager to learn, easy to work with and I take responsibility. You can count on a very short onboarding time with a high degree of reliability and professionalism. I am highly versatile and looking for a long-term commitment.',
      'resume.address': 'Liefbilkstraat 11, 9040 Ghent, Belgium',
      'resume.phone': '+32 484 62 39 97',
      'resume.education': 'Education',
      'resume.training': 'Intensive .NET developer training',
      'resume.trainingText': 'An intensive 9-month full-time programme focused on .NET C#, aimed at the practical skills expected in the workplace. The broad curriculum included CLI, UWP, MVC, Angular, Razor, Blazor, JavaScript, TypeScript, XAML, YAML and much more.',
      'resume.master': 'Master of Science in Public Administration and Management',
      'resume.university': 'Ghent University',
      'resume.masterText': 'The Master in Public Administration and Management trains versatile people with the insights and skills to ensure modern governance in today\'s public sector. Leading efficiently relies on the right balance of knowledge and skills.',
      'resume.professional': 'Professional experience',
      'resume.fwo.role': 'Deputy Head of ICT',
      'resume.fwo.period': '2022 - present',
      'resume.fwo.employer': 'Research Foundation – Flanders (FWO)',
      'resume.fwo.team': 'As deputy head, I lead a team of 14 developers and 2 IT staff members, organised into 4 teams (3 × Scrum, 1 × Kanban).',
      'resume.fwo.roles': 'Besides my management responsibilities, I also fulfil the following roles: project manager, product owner, functional analyst, business analyst, facilitator and DevOps engineer.',
      'resume.developer.employer': 'Research Foundation – Flanders (FWO) via DotNetLab',
      'resume.developer.text': 'Developer on .NET C# projects with a DDD architecture and an Angular front end, in a challenging programme to modernise all legacy languages and structures.',
      'resume.cipal.role': 'Project manager: Taxes',
      'resume.cipal.text': 'Project lead: analysis, implementation and migration management.',
      'resume.cevi.role': 'Product management: administrative fines and taxes',
      'resume.cevi.text': 'As the link between the developers and the customer, I was responsible for the analyses, quotes, drafting tender specifications and project follow-up.',

      'portfolio.consoleApp': 'Console app',

      'contact.address': 'Address:',
      'contact.addressValue': 'Liefbilkstraat 11, Ghent, Belgium',

      'details.category': 'Category',
      'details.date': 'Project date',
      'details.url': 'Project URL',
      'details.jobdagsite.date': '10 March 2021',
    }
  }

  // Project names, plus the page titles and screenshot descriptions built from them
  const projects = {
    viswinkel: 'Fish Shop',
    pizzashop: 'Pizza Shop',
    coffeeshop: 'Coffee Shop',
    ganzenbord: 'Game of the Goose',
    jobdagsite: 'Job Fair Site'
  }
  for (const [id, name] of Object.entries(projects)) {
    translations.en[`project.${id}`] = name
    translations.en[`project.${id}.title`] = `${name} ▪ Portfolio Dries Maes`
    translations.en[`project.${id}.screenshot`] = `${name}: screenshot {n}`
  }

  const isSupported = (language) => language === DEFAULT_LANGUAGE || Object.prototype.hasOwnProperty.call(translations, language)

  const readStoredLanguage = () => {
    try {
      return localStorage.getItem(STORAGE_KEY)
    } catch (e) {
      return null
    }
  }

  const storeLanguage = (language) => {
    try {
      localStorage.setItem(STORAGE_KEY, language)
    } catch (e) {
      // Storage unavailable (private mode, blocked cookies): the choice just isn't remembered
    }
  }

  const parseAttributeKeys = (el) => el.dataset.i18nAttr
    .split(';')
    .map(pair => pair.trim())
    .filter(Boolean)
    .map(pair => {
      const separator = pair.indexOf(':')
      return [pair.slice(0, separator).trim(), pair.slice(separator + 1).trim()]
    })

  // Remember the original (Dutch) content of every translatable element, so we can switch back
  const originals = new Map()
  document.querySelectorAll('[data-i18n], [data-i18n-attr]').forEach(el => {
    originals.set(el, {
      html: el.innerHTML,
      attributes: el.dataset.i18nAttr
        ? parseAttributeKeys(el).map(([attribute, key]) => ({ attribute, key, value: el.getAttribute(attribute) }))
        : []
    })
  })

  const translate = (language, key, el) => {
    if (language === DEFAULT_LANGUAGE) return null
    const text = translations[language][key]
    if (text === undefined) {
      console.warn(`Missing "${language}" translation for "${key}"`)
      return null
    }
    return text.replace(/\{(\w+)\}/g, (match, name) => el.dataset[name] ?? match)
  }

  const applyLanguage = (language) => {
    originals.forEach((original, el) => {
      if (el.dataset.i18n) {
        el.innerHTML = translate(language, el.dataset.i18n, el) ?? original.html
      }
      original.attributes.forEach(({ attribute, key, value }) => {
        el.setAttribute(attribute, translate(language, key, el) ?? value)
      })
    })

    document.documentElement.lang = language
    document.querySelectorAll('.lang-switch [data-lang]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.lang === language))
    })
    document.dispatchEvent(new CustomEvent('languagechanged', { detail: { language } }))
  }

  const setLanguage = (language) => {
    applyLanguage(language)
    storeLanguage(language)

    // Keep a ?lang= parameter in sync, so a reload doesn't switch back
    const url = new URL(window.location.href)
    if (url.searchParams.has('lang')) {
      url.searchParams.set('lang', language)
      history.replaceState(null, '', url)
    }
  }

  document.querySelectorAll('.lang-switch [data-lang]').forEach(button => {
    button.addEventListener('click', () => setLanguage(button.dataset.lang))
  })

  const urlLanguage = new URLSearchParams(window.location.search).get('lang')
  if (isSupported(urlLanguage)) {
    setLanguage(urlLanguage)
  } else {
    const storedLanguage = readStoredLanguage()
    applyLanguage(isSupported(storedLanguage) ? storedLanguage : DEFAULT_LANGUAGE)
  }

})()
