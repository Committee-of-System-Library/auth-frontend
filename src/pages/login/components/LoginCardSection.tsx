import { useLanguage } from '@/contexts/LanguageContext'
import { buildOAuthLoginUrl, INTERNAL_CLIENT_ID } from '@/shared/utils/oauth'
import { loginTranslations } from '../translations'

export default function LoginCardSection() {
    const { language, setLanguage } = useLanguage()
    const t = loginTranslations[language]

    const handleLoginClick = () => {
        const url = buildOAuthLoginUrl({ clientId: INTERNAL_CLIENT_ID })
        window.location.href = url
    }

    return (
        <div className="w-full max-w-md glass rounded-3xl shadow-glass p-8 lg:p-10 animate-fade-up"
             style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
            {/* 언어 토글 */}
            <div className="flex justify-end mb-6">
                <div className="flex bg-black/5 rounded-xl p-1 gap-0.5">
                    <button
                        onClick={() => setLanguage('ko')}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            language === 'ko'
                                ? 'bg-white text-ink shadow-card'
                                : 'text-ink-300 hover:text-ink-500'
                        }`}
                    >
                        한국어
                    </button>
                    <button
                        onClick={() => setLanguage('en')}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            language === 'en'
                                ? 'bg-white text-ink shadow-card'
                                : 'text-ink-300 hover:text-ink-500'
                        }`}
                    >
                        EN
                    </button>
                </div>
            </div>

            {/* 모바일 로고 */}
            <div className="lg:hidden flex items-center gap-3 mb-6">
                <img
                    src={`${import.meta.env.BASE_URL}cse_logo.svg`}
                    alt="CSE Logo"
                    className="w-10 h-10"
                />
                <div>
                    <p className="text-ink font-bold text-base leading-tight">{t.universityName}</p>
                    <p className="text-ink font-bold text-base leading-tight">{t.cseName}</p>
                </div>
            </div>

            {/* 타이틀 */}
            <div className="mb-10">
                <p className="text-primary font-extrabold text-xs tracking-[0.15em] uppercase mb-2">LOGIN</p>
                <p className="text-ink-700 text-sm leading-relaxed lg:hidden whitespace-pre-line">
                    {t.welcomeMobile}
                </p>
                <p className="text-ink-700 text-sm leading-relaxed hidden lg:block">
                    통합인증시스템에 로그인하세요.
                </p>
            </div>

            {/* Google 로그인 */}
            <button
                type="button"
                onClick={handleLoginClick}
                className="w-full group flex items-center justify-center gap-3 bg-white border border-surface-200 rounded-2xl px-6 py-4 hover:border-primary-200 hover:shadow-card-hover transition-all duration-200"
            >
                <img
                    src={`${import.meta.env.BASE_URL}Googlelogo.svg`}
                    alt="Google"
                    className="w-5 h-5"
                />
                <span className="text-ink-700 font-semibold text-sm group-hover:text-ink">
                    {t.googleLogin}
                </span>
            </button>

            {/* 안내 */}
            <p className="text-ink-300 text-xs text-center mt-6 leading-relaxed whitespace-pre-line lg:whitespace-normal">
                {language === 'ko' ? (
                    <>
                        <span className="lg:hidden">{t.noticeMobile}</span>
                        <span className="hidden lg:inline">{t.notice}</span>
                    </>
                ) : t.notice}
            </p>

            {/* 정책 링크 */}
            <div className="flex items-center justify-center gap-3 text-xs text-ink-200 mt-4">
                <a
                    href="https://discreet-source-909.notion.site/terms-of-services"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                >
                    {t.terms}
                </a>
                <span>·</span>
                <a
                    href="https://discreet-source-909.notion.site/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                >
                    {t.privacy}
                </a>
                <span>·</span>
                <a
                    href="https://discreet-source-909.notion.site/email-address-harvesting-prohibited"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                >
                    {t.emailPolicy}
                </a>
            </div>
        </div>
    )
}
