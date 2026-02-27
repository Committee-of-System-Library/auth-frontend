import { useLanguage } from '@/contexts/LanguageContext'
import { loginTranslations } from '../translations'

export default function LoginIntroSection() {
    const { language } = useLanguage()
    const t = loginTranslations[language]

    return (
        <div className="flex w-full lg:w-[45%] bg-left-bg flex-col justify-between p-4 min-h-0 order-2 lg:order-1">
            <div className="flex flex-col items-center justify-center flex-1">
                <div className="hidden lg:flex flex-col items-center mb-8">
                    <div className="flex items-center gap-6">
                        <img src={`${import.meta.env.BASE_URL}cse_logo.svg`} alt="CSE Logo" className="w-16 h-16" />
                        <div className="flex flex-col">
                            <h1 className="text-primary text-3xl font-bold leading-tight">
                                {t.universityName}
                            </h1>
                            <h1 className="text-primary text-3xl font-bold leading-tight">
                                {t.cseName}
                            </h1>
                            <p className="text-gray-600 text-sm mt-1">{t.cseSub}</p>
                        </div>
                    </div>
                </div>
                <div className="space-y-3 w-[80%] lg:w-[50%] mt-4 lg:mt-8">
                    <a href="https://cse.knu.ac.kr/index.php" target="_blank" rel="noopener noreferrer" className="bg-button-gray/5 border border-[1.5px] border-button-gray/80 text-gray-800 hover:bg-primary/10 hover:border-primary/80 text-gray-900 px-6 py-2.5 rounded-md w-full text-center transition-colors font-medium block">
                        {t.linkDept}
                    </a>
                    <a href="https://www.knu.ac.kr/wbbs/wbbs/main/main.action" target="_blank" rel="noopener noreferrer" className="bg-button-gray/5 border border-[1.5px] text-gray-800 border-button-gray/80 hover:bg-primary/10 hover:border-primary/80 text-gray-900 px-6 py-2.5 rounded-md w-full text-center transition-colors font-medium block">
                        {t.linkUniv}
                    </a>
                </div>
            </div>
            <div className="text-[10px] lg:text-xs text-gray-600 space-y-1 mt-8">
                <p>{t.footerDept}</p>
                <p>{t.footerAddress}</p>
                <p className="text-gray-500">{t.footerCopyright}</p>
            </div>
        </div>
    )
}

