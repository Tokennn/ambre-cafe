import { useState, type FormEvent, type ReactNode } from 'react'
import { Logo } from './Logo'

export function HeroCard({ onExplore }: { onExplore: () => void }) {
  return (
    <div className="premium-botanical-card">
      <span className="premium-card-eyebrow">Café de spécialité</span>
      <h1 className="premium-card-title">
        Le café, <span className="italic">lentement</span> versé <span className="italic">ici.</span>
      </h1>
      <p className="premium-card-subtext">
        Torréfaction artisanale, grains d’origine unique et gestes précis pour chaque tasse servie au comptoir.
      </p>
      <button className="premium-action-circle" aria-label="Découvrir Ambre" onClick={onExplore}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 40 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M29.5 4.5L37 12m0 0l-7.5 7.5M37 12H3" />
        </svg>
      </button>
    </div>
  )
}

type Feature = { title: string; desc: string; icon: ReactNode }

const FEATURES: Feature[] = [
  {
    title: 'Origine unique',
    desc: 'Des grains tracés jusqu’à la ferme, sélectionnés auprès de petits producteurs d’Éthiopie, du Pérou et du Honduras.',
    icon: <circle cx="12" cy="12" r="9" />,
  },
  {
    title: 'Torréfaction lente',
    desc: 'Chaque lot est torréfié sur place, en petites quantités, pour révéler ses notes de caramel, d’agrume et de cacao.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m9-9H3m14.5-4.5l-11 11m11 0l-11-11" />,
  },
  {
    title: 'Extraction précise',
    desc: 'Espresso, filtre ou cold brew : chaque recette est pesée, chronométrée et ajustée chaque matin.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M16 3L7 12h12l-6 9" />,
  },
]

export function Features() {
  return (
    <div className="premium-features-container">
      {FEATURES.map((feature, i) => (
        <div key={feature.title} className="premium-feature-card">
          <div className="premium-feature-head">
            <div className="premium-feature-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                {feature.icon}
              </svg>
            </div>
            <span className="premium-feature-index" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
          </div>
          <h3 className="premium-feature-title">{feature.title}</h3>
          <p className="premium-feature-desc">{feature.desc}</p>
        </div>
      ))}
    </div>
  )
}

const MISSION: [string, string, string][] = [
  ['Pour révéler toute la richesse d’un', 'grain', 'nous prenons le temps de le comprendre, de la ferme à la tasse.'],
  ['Chaque matin, nous ajustons nos recettes au', 'gramme', 'près, pour que chaque espresso soit plus juste que la veille.'],
  ['Nous croyons qu’une tasse partagée en', 'douceur', 'reste la plus belle façon de commencer une journée.'],
]

export function Mission() {
  return (
    <div className="mission-container">
      <div className="mission-inner">
        {MISSION.map(([before, pill, after]) => (
          <div key={pill} className="mission-para">
            {before} <span className="mission-pill">{pill}</span> {after}
          </div>
        ))}
      </div>
    </div>
  )
}

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (email.trim()) setSubmitted(true)
  }

  return (
    <div className="feedback-container">
      <div className="feedback-form-card">
        <Logo className="fb-logo" />
        <h3 className="fb-title">Restez infusé</h3>
        <p className="fb-sub">Nouveaux crus, ateliers de dégustation et arrivages de saison, une fois par mois.</p>
        <form className="fb-form" onSubmit={handleSubmit}>
          <label htmlFor="fb-email" className="sr-only">Adresse e-mail</label>
          <input
            id="fb-email"
            type="email"
            required
            autoComplete="email"
            placeholder="nom@exemple.fr"
            className="fb-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitted}
          />
          <button type="submit" className={`fb-btn${submitted ? ' submitted' : ''}`} disabled={submitted}>
            {submitted ? 'Inscrit ✓' : 'S’inscrire'}
          </button>
        </form>
        <p className="fb-success" role="status">
          {submitted ? 'Bienvenue chez Ambre. Votre première lettre arrive bientôt.' : ''}
        </p>
      </div>
    </div>
  )
}
