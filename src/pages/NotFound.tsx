import { useTranslation } from 'react-i18next'
import Button from '../components/ui/button'
import './NotFound.css'

export default function NotFound() {
  const { t } = useTranslation()

  return (
    <main className="container page-decor page-decor--not-found">
      <section className="not-found" aria-labelledby="not-found-title">
        <p className="not-found__code"><span className="tag">/</span>404</p>
        <h1 id="not-found-title">{t('not_found.title')}</h1>
        <p className="not-found__message">{t('not_found.message')}</p>
        <Button url="/" className="btn not-found__home-link">
          {t('not_found.back_home')}
        </Button>
      </section>
    </main>
  )
}
