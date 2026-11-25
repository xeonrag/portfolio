import { useRef, useState } from 'react'
import './hrithikuday.css'
import './portrait.css'

async function readJsonResponse(response) {
  const contentType = response.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    if (response.status === 403) {
      throw new Error('The message service rejected the request. Refresh and try again.')
    }
    throw new Error('The message service returned an unexpected response. Please try again later.')
  }

  try {
    return await response.json()
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('The message service returned an invalid response. Please try again later.')
    }
    throw error
  }
}

const navigation = [
  ['Home', '#home'],
  ['About', '#about'],
  ['Skills', '#skills'],
  ['Experience', '#experience'],
  ['Contact', '#contact'],
]

const services = [
  {
    title: 'Frontend Development',
    icon: 'frontend',
    description:
      'Responsive, accessible interfaces and polished web experiences built with React, Next.js, and TypeScript.',
    tools: ['React', 'HTML', 'CSS', 'JavaScript'],
  },
  {
    title: 'Bot Development',
    icon: 'bot',
    description:
      'Custom Telegram bots for group workflows, notifications, and task automation that simplify repetitive work.',
    tools: ['Chat bots', 'Auto-filter bots', 'Streaming bots', 'Downloader bots', 'Utility bots'],
  },
  {
    title: 'Backend Development',
    icon: 'backend',
    description:
      'Python and Django backends, REST APIs, and database-driven systems using Django REST Framework, PostgreSQL, and MongoDB.',
    tools: ['Python', 'Django', 'Django REST Framework', 'PostgreSQL', 'MongoDB'],
  },
  {
    title: 'Automation',
    icon: 'automation',
    description:
      'Custom productivity tools, scripting workflows, and automation for repetitive tasks.',
    tools: ['Workflow automation', 'Task automation', 'File and data processing'],
  },
]

const skills = [
  'React',
  'Next.js',
  'TypeScript',
  'Node.js',
  'Express',
  'Python',
  'Django',
  'Go',
  'PostgreSQL',
  'MongoDB',
  'SQLite',
  'Tailwind CSS',
  'JavaScript',
  'HTML5',
  'Pyrogram',
  'Flask',
  'Django REST Framework',
  'MySQL',
]

function ArrowIcon({ className = '' }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 19 19 5M5 5h14v14" />
    </svg>
  )
}

function StarIcon({ className = '' }) {
  return (
    <svg
      className={className}
      width="35"
      height="35"
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M24 0v48M0 24h48M7 7l34 34M7 41 41 7"
        stroke="currentColor"
        strokeWidth="3"
      />
    </svg>
  )
}

function ServiceIcon({ type }) {
  const iconProps = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
    focusable: false,
  }

  if (type === 'frontend') {
    return (
      <span className="service-tech-icons" aria-hidden="true">
        <svg viewBox="0 0 32 32" {...iconProps}>
          <ellipse cx="16" cy="16" rx="13" ry="5" />
          <ellipse cx="16" cy="16" rx="13" ry="5" transform="rotate(60 16 16)" />
          <ellipse cx="16" cy="16" rx="13" ry="5" transform="rotate(120 16 16)" />
          <circle cx="16" cy="16" r="1.5" />
        </svg>
        <svg viewBox="0 0 32 32" {...iconProps}>
          <path d="m6 4 2 23 8 3 8-3 2-23z" />
          <path d="M11 10h10l-.5 4H12l.4 4h7.7l-.7 6-3.4 1.2-3.4-1.2-.2-2" />
        </svg>
        <svg viewBox="0 0 32 32" {...iconProps}>
          <path d="m6 4 2 23 8 3 8-3 2-23z" />
          <path d="M21 10h-9l.4 4h8.2l-.8 10-3.8 1.2-3.8-1.2-.3-3" />
        </svg>
        <svg viewBox="0 0 32 32" {...iconProps}>
          <path d="M5 5h22v22H5z" />
          <path d="M19 11c-.6-.7-1.4-1-2.4-1-1.4 0-2.3.8-2.3 2 0 3 5.2 1.4 5.2 4.7 0 1.6-1.3 2.7-3.2 2.7-1.4 0-2.6-.5-3.4-1.5M21 20h3" />
        </svg>
      </span>
    )
  }

  if (type === 'bot') {
    return (
      <svg className="service-icon" viewBox="0 0 32 32" {...iconProps}>
        <path d="M7 6h18a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3h-9l-7 4v-4h-2a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3Z" />
        <path d="M10 12h12M10 17h8" />
      </svg>
    )
  }

  if (type === 'backend') {
    return (
      <svg className="service-icon" viewBox="0 0 32 32" {...iconProps}>
        <rect x="4" y="5" width="24" height="9" rx="2" />
        <rect x="4" y="18" width="24" height="9" rx="2" />
        <path d="M9 9.5h.01M13 9.5h.01M9 22.5h.01M13 22.5h.01M18 9.5h6M18 22.5h6" />
      </svg>
    )
  }

  return (
    <svg className="service-icon" viewBox="0 0 32 32" {...iconProps}>
      <path d="m13 3-.8 3.2a10 10 0 0 0-2.3 1.3L6.8 6.4l-3 5.2 2.5 2.2a10 10 0 0 0 0 2.6l-2.5 2.2 3 5.2 3.1-1.1a10 10 0 0 0 2.3 1.3L13 27h6l.8-3.2a10 10 0 0 0 2.3-1.3l3.1 1.1 3-5.2-2.5-2.2a10 10 0 0 0 0-2.6l2.5-2.2-3-5.2-3.1 1.1a10 10 0 0 0-2.3-1.3L19 3z" />
      <circle cx="16" cy="15" r="4" />
    </svg>
  )
}

function Header() {
  const menuRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)

  function openMenu() {
    menuRef.current?.showModal()
    setMenuOpen(true)
  }

  function closeMenu() {
    menuRef.current?.close()
    setMenuOpen(false)
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <a href="#home" className="wordmark" aria-label="Hrithik Uday home">
          hrithik<span>.</span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map(([label, href]) => (
            <a href={href} key={href}>
              {label}
            </a>
          ))}
        </nav>
        <a href="#contact" className="header-cta">
          Hire Me <ArrowIcon />
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-label="Open navigation"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={openMenu}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M4 8h16M4 16h16" />
          </svg>
        </button>
      </div>

      <dialog
        ref={menuRef}
        id="mobile-navigation"
        className="mobile-menu"
        aria-label="Main navigation"
        onClose={() => setMenuOpen(false)}
      >
        <div className="mobile-menu-top">
          <a href="#home" className="wordmark" onClick={closeMenu}>
            hrithik<span>.</span>
          </a>
          <button
            className="icon-button"
            type="button"
            aria-label="Close navigation"
            onClick={closeMenu}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="m6 6 12 12M6 18 18 6" />
            </svg>
          </button>
        </div>
        <nav aria-label="Mobile navigation">
          {navigation.map(([label, href], index) => (
            <a href={href} key={href} onClick={closeMenu}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              {label}
              <ArrowIcon />
            </a>
          ))}
        </nav>
        <a
          className="mobile-email"
          href="mailto:official.hrithikuday@gmail.com"
        >
          official.hrithikuday@gmail.com
        </a>
      </dialog>
    </header>
  )
}

function Hero() {
  return (
    <>
      <section id="home" className="hero" aria-labelledby="hero-name">
        <div className="hero-shade" />
        <img
          className="hero-portrait"
          src={`${import.meta.env.BASE_URL}hrithik-portrait-black-bg.png`}
          alt="Portrait of Hrithik Uday"
        />
        <div className="container hero-content">
          <div className="hero-topline">
            <p>
              <span className="status-dot" />
              <span className="hero-topline-copy">
                PYTHON FULL-STACK FREELANCER
                <span className="hero-topline-location">
                  <span className="hero-location-separator"> · </span>
                  MALAPPURAM, INDIA
                </span>
              </span>
            </p>
            <StarIcon className="hero-star" />
          </div>
          <h1 id="hero-name" className="hero-name">
            <span className="name-part">HRITHIK</span>
            <span className="name-part lime">
              UDAY<span className="name-period">.</span>
            </span>
          </h1>
          <div className="hero-introduction">
            <h2>
              <span>Python Full-Stack</span>
              <span><em>Developer</em></span>
            </h2>
            <p>
              I build complete web applications with Python, Django, and modern
              frontend tools—from database-backed APIs to responsive, polished
              interfaces. I focus on clean code and reliable user experiences.
            </p>
            <div className="hero-actions">
              <a href="#experience" className="button button-lime">
                View My Journey <ArrowIcon />
              </a>
              <a href="#contact" className="text-button">
                Contact Me <ArrowIcon />
              </a>
            </div>
          </div>
          <div className="scroll-indicator">
            <StarIcon />
            <span className="scroll-line" />
            15+ PROJECTS COMPLETED
          </div>
        </div>
      </section>
      <div className="brand-ribbon">
        <div>
          <span>REACT FRONTEND</span>
          <StarIcon />
          <span>PYTHON &amp; DJANGO</span>
          <StarIcon />
          <span>FULL-STACK DEVELOPMENT</span>
          <StarIcon />
          <span>SAAS PRODUCTS</span>
        </div>
      </div>
    </>
  )
}

function About() {
  const stats = [
    ['15', '+', 'Completed projects'],
    ['21', '', 'Technologies used'],
    ['40', '+', 'GitHub repositories'],
  ]

  return (
    <section id="about" className="section section-light about-section">
      <div className="container">
        <div className="about-grid">
          <div data-reveal>
            <div className="section-label">
              <span>01 /</span> ABOUT ME
            </div>
            <h2 className="section-heading">
              My Story &amp;
              <br />
              <span className="underline-accent">Journey.</span>
            </h2>
            <div className="about-signature">
              React in the browser.
              <br />
              <span>Django behind the scenes.</span>
            </div>
          </div>
          <div className="about-copy" data-reveal>
            <p>
              I am a full stack developer from Malappuram, India, focused on
              connecting polished React frontends with reliable Python and Django
              backends. I enjoy building scalable web applications, REST APIs,
              automation tools, and SaaS products, with attention to both the
              user experience and the systems behind it.
            </p>
            <p>
              <strong>Location:</strong> Malappuram, India
              <br />
              <strong>Age:</strong> 22
              <br />
              <strong>Experience:</strong> 2+ years learning and building
            </p>
            <a className="inline-link" href="#experience">
              Explore my journey <ArrowIcon />
            </a>
          </div>
        </div>
        <div className="statistics" data-reveal>
          {stats.map(([value, suffix, label]) => (
            <div className="statistic" key={label}>
              <div className="statistic-number" role="img" aria-label={`${value}${suffix}`}>
                <span aria-hidden="true">
                  <span data-count={value}>{value}</span>
                  {suffix && <span className="stat-suffix">{suffix}</span>}
                </span>
              </div>
              <p>{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Services() {
  return (
    <section id="services" className="section section-dark services-section">
      <div className="container">
        <div className="section-heading-row" data-reveal>
          <div>
            <div className="section-label">
              <span>02 /</span> SERVICES
            </div>
            <h2 className="section-heading">
              What I <span className="lime">Do.</span>
            </h2>
          </div>
        </div>
        <div className="services-grid" data-reveal>
          {services.map((service) => (
            <article
              className="service-item"
              key={service.title}
              tabIndex={0}
              aria-label={`${service.title}. Focus or hover to view tools and examples.`}
            >
              <span className="service-top">
                <ServiceIcon type={service.icon} />
              </span>
              <span className="service-title">{service.title}</span>
              <span className="service-description">{service.description}</span>
              <ul className="service-tools" aria-label="Tools and examples">
                {service.tools.map((tool) => (
                  <li key={tool}>{tool}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Skills() {
  return (
    <section id="skills" className="section section-dark skills-section">
      <div className="container">
        <div className="section-heading-row" data-reveal>
          <div>
            <div className="section-label">
              <span>03 /</span> MY STACK
            </div>
            <h2 className="section-heading">
              Technologies I
              <br />
              <span className="lime">Work With.</span>
            </h2>
          </div>
        </div>
        <div className="skills-list" data-reveal>
          {skills.map((skill, index) => (
            <a
              href="#experience"
              className="skill-link"
              key={skill}
              data-interest={skill}
            >
              <span className="skill-index">
                {String(index + 1).padStart(2, '0')}
              </span>
              {skill}
              <ArrowIcon />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

function Experience() {
  const milestones = [
    'Building responsive frontend experiences with React.',
    'Developing Python/Django backends and REST APIs.',
    'Building scalable web applications and modern mobile apps.',
    'Completed 15+ projects across 21 technologies.',
    'Built a portfolio of 40+ GitHub repositories.',
  ]

  return (
    <section id="experience" className="section section-light experience-section">
      <div className="container experience-grid">
        <div className="experience-heading" data-reveal>
          <div className="section-label">
            <span>04 /</span> LEARNING. BUILDING. EVOLVING.
          </div>
          <h2 className="section-heading">
            The Journey
            <br />
            So <span className="underline-accent">Far.</span>
          </h2>
          <p className="section-aside">
            2+ years learning and building full-stack products, from React
            interfaces to Django APIs.
          </p>
          <StarIcon className="career-star" />
        </div>
        <div className="timeline">
          <article className="timeline-entry" data-reveal>
            <span className="timeline-dot is-current" />
            <p className="timeline-dates">2+ Years</p>
            <h3>Learning &amp; Building</h3>
            <ul>
              {milestones.map((milestone) => (
                <li key={milestone}>{milestone}</li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const [isSending, setIsSending] = useState(false)
  const [submitFeedback, setSubmitFeedback] = useState(null)
  const socialLinks = [
    { label: 'GitHub', href: 'https://github.com/hrithikuday', icon: 'github-icon' },
    { label: 'WhatsApp', href: 'https://wa.me/918075557290', icon: 'whatsapp-icon' },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/hrithik-uday',
      icon: 'linkedin-icon',
    },
  ]

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSending(true)
    setSubmitFeedback(null)

    const form = event.currentTarget
    const formData = new FormData(form)

    try {
      const csrfResponse = await fetch('/api/contact/', {
        credentials: 'same-origin',
      })
      if (!csrfResponse.ok) {
        throw new Error('The message service is unavailable. Please try again later.')
      }

      const { csrfToken } = await readJsonResponse(csrfResponse)
      if (typeof csrfToken !== 'string') {
        throw new Error('The message service returned an invalid response.')
      }

      const response = await fetch('/api/contact/', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          interest: formData.get('interest'),
          project_details: formData.get('project_details'),
        }),
      })
      const result = await readJsonResponse(response)
      if (!response.ok) {
        throw new Error(result.error || 'Your message could not be sent.')
      }

      form.reset()
      setSubmitFeedback({
        type: 'success',
        message: 'Thanks—your message has been received.',
      })
    } catch (error) {
      setSubmitFeedback({
        type: 'error',
        message:
          error instanceof TypeError
            ? 'Unable to connect to the message service. Please try again later.'
            : error instanceof Error
              ? error.message
              : 'Your message could not be sent. Please try again.',
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <section id="contact" className="section section-dark contact-section">
      <div className="container">
        <div className="contact-heading" data-reveal>
          <div className="section-label">
            <span>05 /</span> GET IN TOUCH
          </div>
          <h2>
            Let&apos;s Build
            <br />
            <span className="lime">Together.</span>
            <ArrowIcon className="contact-heading-arrow" />
          </h2>
          <p>Have an idea? Let&apos;s bring the frontend and backend together.</p>
        </div>
        <div className="contact-grid">
          <div className="contact-details" data-reveal>
            <span className="eyebrow">CONTACT INFORMATION</span>
            <a
              href="mailto:official.hrithikuday@gmail.com"
              className="contact-email"
            >
              official.hrithikuday@gmail.com <ArrowIcon />
            </a>
            <a href="tel:+918075557290" className="contact-phone">
              +91 80755 57290
            </a>
            <div className="contact-location-social">
              <div className="contact-location-city-group">
                <p className="contact-location">Malappuram</p>
                <div className="social-links" role="group" aria-label="Social profiles">
                  {socialLinks.map(({ label, href, icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                      title={label}
                    >
                      <svg className="social-link-icon" aria-hidden="true" focusable="false">
                        <use href={`${import.meta.env.BASE_URL}icons.svg#${icon}`} />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
              <span className="contact-location-country">, India</span>
            </div>
          </div>
          <form
            className="contact-form"
            onSubmit={handleSubmit}
            data-reveal
          >
            <div className="form-field">
              <label htmlFor="contact-name">Your name</label>
              <input
                id="contact-name"
                name="name"
                type="text"
                placeholder="How should I call you?"
                autoComplete="name"
                maxLength={120}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="contact-email-address">Email address</label>
              <input
                id="contact-email-address"
                name="email"
                type="email"
                placeholder="you@yourcompany.com"
                autoComplete="email"
                maxLength={254}
                required
              />
            </div>
            <div className="form-field form-field-wide">
              <label htmlFor="contact-interest">I&apos;m interested in</label>
              <select
                id="contact-interest"
                name="interest"
                defaultValue="General collaboration"
              >
                <option>General collaboration</option>
                <option>Frontend development</option>
                <option>Backend development</option>
                <option>Full-stack project</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-field form-field-wide">
              <label htmlFor="contact-project">A little about your project</label>
              <textarea
                id="contact-project"
                name="project_details"
                placeholder="The idea, the ambition, the possibilities..."
                rows="3"
                maxLength={5000}
                required
              />
            </div>
            <div className="form-submit form-field-wide">
              <button className="button button-lime" type="submit" disabled={isSending}>
                {isSending ? 'Sending...' : "Let's Start a Conversation"} <ArrowIcon />
              </button>
              {submitFeedback && (
                <p
                  className={`form-note form-note-${submitFeedback.type}`}
                  role={submitFeedback.type === 'error' ? 'alert' : 'status'}
                >
                  {submitFeedback.message}
                </p>
              )}
              <p className="form-note">
                Your details are used only to respond to this inquiry.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <a className="wordmark" href="#home">
            hrithik<span>.</span>
          </a>
          <a className="back-to-top" href="#main-content">
            BACK TO TOP <ArrowIcon />
          </a>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Hrithik Uday. All rights reserved.</p>
          <span>Built with React</span>
        </div>
      </div>
    </footer>
  )
}

function App() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header />
      <main id="main-content" tabIndex="-1">
        <Hero />
        <About />
        <Services />
        <Skills />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
