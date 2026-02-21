import { useLanguage } from '@/contexts/LanguageContext'
import { buildOAuthLoginUrl } from '@/shared/utils/oauth'
import { loginTranslations } from '../translations'

export default function LoginCardSection() {
    const { language, setLanguage } = useLanguage()
    const t = loginTranslations[language]

    const handleLoginClick = () => {
        window.location.href = buildOAuthLoginUrl()
    }

    return (
        <div className="w-full lg:w-[55%] bg-white rounded-2xl shadow-md p-6 lg:p-10 mb-6 lg:mb-0 flex flex-col justify-between max-h-[90vh] order-1 lg:order-2">
            {/* 상단 영역 */}
            <div>
                {/* 언어 선택 (우측 상단) */}
                <div className="flex justify-end mb-6">
                    <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setLanguage('ko')}
                            className={`flex-1 min-w-0 px-4 py-2 rounded-md font-medium text-sm text-center flex items-center justify-center transition-colors ${language === 'ko'
                                ? 'bg-white text-gray-900'
                                : 'text-gray-600 hover:bg-white'
                                }`}
                        >
                            한국어
                        </button>
                        <button
                            onClick={() => setLanguage('en')}
                            className={`flex-1 min-w-0 px-4 py-2 rounded-md font-medium text-sm text-center flex items-center justify-center transition-colors ${language === 'en'
                                ? 'bg-white text-gray-900'
                                : 'text-gray-600 hover:bg-white'
                                }`}
                        >
                            English
                        </button>
                    </div>
                </div>
                {/* LOGIN 타이틀과 환영 문구 */}
                <div className="mb-4 flex items-center gap-4 justify-center">
                    <h2 className="text-primary text-lg lg:text-2xl font-bold whitespace-nowrap">LOGIN</h2>
                    <p className="text-gray-900 text-sm lg:text-xl leading-relaxed whitespace-pre-line lg:whitespace-normal">
                        {language === 'ko' ? (
                            <>
                                <span className="lg:hidden">{t.welcomeMobile}</span>
                                <span className="hidden lg:inline">{t.welcome}</span>
                            </>
                        ) : (
                            t.welcome
                        )}
                    </p>
                </div>
            </div>

            {/* Google 로그인 버튼 - 세로 중앙 */}
            <div className="flex-1 flex items-center justify-center my-16 lg:my-4 min-h-0">
                <button type="button" onClick={handleLoginClick} className="w-[80%] bg-white border border-[1.5px] border-button-gray/80 rounded-lg px-4 py-4 lg:px-6 lg:py-6 flex flex-col items-center justify-center gap-2 lg:gap-3 hover:border-gray-400 transition-colors">
                    {/* Google G 로고 */}
                    <div className="w-8 h-8 lg:w-12 lg:h-12 flex items-center justify-center">
                        <img src="/Googlelogo.svg" alt="Google" className="w-full h-full" />
                    </div>
                    <span className="text-gray-900 font-medium text-sm lg:text-base">{t.googleLogin}</span>
                </button>
            </div>

            {/* 하단: 안내 문구와 정책 링크 */}
            <div className="text-center">
                <p className="text-xs text-gray-600 mb-2 whitespace-pre-line lg:whitespace-normal">
                    {language === 'ko' ? (
                        <>
                            <span className="lg:hidden">{t.noticeMobile}</span>
                            <span className="hidden lg:inline">{t.notice}</span>
                        </>
                    ) : (
                        t.notice
                    )}
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                    <a href="#" className="hover:text-primary transition-colors">{t.terms}</a>
                    <span className="text-gray-400">|</span>
                    <a href="https://www.knu.ac.kr/wbbs/wbbs/contents/index.action?menu_url=siteinfo/policy01&menu_idx=94" className="hover:text-primary transition-colors">{t.privacy}</a>
                    <span className="text-gray-400">|</span>
                    <a href="https://www.knu.ac.kr/wbbs/wbbs/contents/index.action?menu_url=siteinfo/policy01_20220128&menu_idx=95" className="hover:text-primary transition-colors">{t.emailPolicy}</a>
                </div>
            </div>
        </div>
    )
}

