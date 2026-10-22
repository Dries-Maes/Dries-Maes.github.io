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
      'meta.title': 'Dries Maes – .NET developer',
      'meta.description': 'Dries Maes: .NET developer at Vanden Broele (eGovFlow), former deputy head of ICT and project manager. Experience, skills, portfolio and contact details.',
      'backToTop': 'Back to top',
      'cv.file': 'assets/CV-Dries-Maes-ENG.pdf',

      'nav.about': 'About me',
      'nav.resume': 'My experience',

      'hero.your': 'Your',
      'hero.roles': '.NET developer, project manager, product owner',

      'about.title': 'About me',
      'about.intro': 'I was born into a family of problem solvers. Although we count many different profiles, we all have one thing in common: whenever we face a problem, take on a challenge or even have grand and impossible ambitions, we find a way. Whatever you expect from me, you can count on me to tackle it independently and master it quickly.',
      'about.age': 'Age:',
      'about.studies': 'Education:',
      'about.studiesValue': 'Master in Public Administration',
      'about.statusValue': 'Married',
      'about.children': 'Children:',
      'about.text': 'I combine a background in public administration and project management with hands-on experience as a .NET developer. That lets me see both the big picture and the technical details: I turn a customer\'s question into a workable analysis, plan the work realistically and help build the solution myself. I learn quickly and eagerly, and I feel at home in roles ranging from developer to product owner and team lead.',

      'skills.architecture': 'Architecture &amp; data',
      'skills.pipelines': 'CI/CD pipelines',
      'skills.workflow': 'Ways of working',
      'skills.projectManagement': 'Project management',
      'skills.analysis': 'Analysis',
      'skills.functionalAnalysis': 'Functional analysis',
      'skills.businessAnalysis': 'Business analysis',

      'resume.title': 'Experience',
      'resume.summary': 'Summary',
      'resume.summaryText': 'After 3 years as a project manager in the public IT sector, I knew my future lay in IT. I retrained as a .NET developer and grew into the role of deputy head of ICT at the Research Foundation – Flanders (FWO), where I led 4 teams and introduced a modern Scrum structure and a CI/CD cycle. Because I missed hands-on work, I made a deliberate move back into development: at Vanden Broele, my team and I brought a new product to market covering all kinds of local subsidy applications. I am eager to learn, easy to work with and I like to take responsibility. That mix of leadership, analysis and building things myself means I understand both what the customer needs and how to solve it technically.',
      'resume.education': 'Education',
      'resume.training': 'Intensive .NET developer training',
      'resume.trainingText': 'An intensive 9-month full-time programme focused on .NET C#, aimed at the practical skills expected in the workplace. The broad curriculum included CLI, UWP, MVC, Angular, Razor, Blazor, JavaScript, TypeScript, XAML, YAML and much more.',
      'resume.master': 'Master of Science in Public Administration and Management',
      'resume.university': 'Ghent University – magna cum laude',
      'resume.masterText': 'The Master of Public Administration and Management trains versatile professionals with the insight and skills to ensure modern governance in today\'s public sector. The four pillars of the programme were management, law, economics and political science. (I was president of the student council, editor of the student newspaper and a member of the faculty council.)',
      'resume.professional': 'Professional experience',
      'resume.egovflow.role': 'C# .NET developer (public sector)',
      'resume.egovflow.period': '2023 - present',
      'resume.egovflow.text': 'Developer on .NET C# projects with a DDD architecture and a Vue front end, in a challenging programme to modernise all legacy languages and structures.',
      'resume.egovflow.result': 'I led the team that brought a new product to market covering all kinds of local subsidy applications.',
      'resume.fwo.role': 'Deputy Head of ICT (public sector)',
      'resume.fwo.employer': 'Research Foundation – Flanders (FWO)',
      'resume.fwo.team': 'As deputy head, I was responsible for a team of 14 developers and 2 IT staff members, organised into 4 teams (3 × Scrum, 1 × Kanban).',
      'resume.fwo.result': 'I introduced a modern Scrum structure and a CI/CD cycle.',
      'resume.fwo.roles': 'Besides my management responsibilities, I also fulfilled the following roles: project manager, product owner, functional analyst, business analyst, facilitator and DevOps engineer.',
      'resume.cipal.role': 'Project manager (public sector)',
      'resume.cipal.text': 'Project lead: analysis, implementation and migration management.',
      'resume.cevi.role': 'Product management (public sector)',
      'resume.cevi.text': 'As the link between the developers and the customer, I was responsible for the analyses, quotes, drafting tender specifications and project follow-up.',

      'portfolio.subtitle': 'Projects from my .NET training',
      'portfolio.consoleApp': 'Console app',

      'contact.location': 'Location:',
      'contact.locationValue': 'Vinderhoute (near Ghent), Belgium',
      'contact.email': 'Email:',
      'contact.mobile': 'Mobile:',

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
