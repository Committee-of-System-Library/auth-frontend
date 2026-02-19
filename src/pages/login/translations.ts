import type { Language } from '@/contexts/LanguageContext'

export const loginTranslations: Record<Language, {
  // 공통 (모바일 헤더 + 인트로)
  universityName: string
  cseName: string
  cseSub: string
  linkDept: string
  linkUniv: string
  // 카드
  welcome: string
  welcomeMobile: string
  googleLogin: string
  notice: string
  noticeMobile: string
  terms: string
  privacy: string
  emailPolicy: string
  // 푸터 (인트로)
  footerDept: string
  footerAddress: string
  footerTel: string
  footerFax: string
  footerEmail: string
  footerCopyright: string
}> = {
  ko: {
    universityName: '경북대학교',
    cseName: 'IT대학 컴퓨터학부 학생회',
    cseSub: 'KYUNGPOOK NATIONAL UNIVERSITY CSE',
    linkDept: '컴퓨터학부 홈페이지',
    linkUniv: '경북대학교 홈페이지',
    welcome: '경북대학교 컴퓨터학부 통합인증시스템 방문을 환영합니다.',
    welcomeMobile: '경북대학교 컴퓨터학부 통합인증시스템\n방문을 환영합니다.',
    googleLogin: 'Google 계정으로 로그인',
    notice: '경북대학교 Google Workspace 계정(@knu.ac.kr)만 로그인 가능합니다.',
    noticeMobile: '경북대학교 Google Workspace 계정(@knu.ac.kr)만\n 로그인 가능합니다.',
    terms: '이용 약관',
    privacy: '개인정보처리방침',
    emailPolicy: '이메일무단수집거부',
    footerDept: '경북대학교 IT대학 컴퓨터학부',
    footerAddress: '우)41566 대구광역시 북구 대학로 80 / IT대학 융복합관 (건물번호 : 415)',
    footerTel: 'TEL. 학부: 950-5550, 대학원 : 950-6420',
    footerFax: 'FAX. 053-957-4846',
    footerEmail: 'E-mail. scse@knu.ac.kr',
    footerCopyright: 'Copyright© 2026, KNU CSE All rights reserved',
  },
  en: {
    universityName: 'Kyungpook National University',
    cseName: 'CSE Student Council, School of IT',
    cseSub: 'KYUNGPOOK NATIONAL UNIVERSITY CSE',
    linkDept: 'Department of Computer Science',
    linkUniv: 'Kyungpook National University',
    welcome: 'Welcome to KNU CSE Integrated Authentication System.',
    welcomeMobile: 'Welcome to KNU CSE Integrated Authentication System.',
    googleLogin: 'Sign in with Google',
    notice: 'Only Kyungpook National University Google Workspace accounts (@knu.ac.kr) can sign in.',
    noticeMobile: 'Only Kyungpook National University Google Workspace accounts (@knu.ac.kr) can sign in.',
    terms: 'Terms of Service',
    privacy: 'Privacy Policy',
    emailPolicy: 'Email Collection Refusal',
    footerDept: 'KNU IT College, Department of Computer Science',
    footerAddress: '80 Daehak-ro, Buk-gu, Daegu 41566, Korea / IT Convergence Building (No. 415)',
    footerTel: 'TEL. Dept: 950-5550, Grad: 950-6420',
    footerFax: 'FAX. 053-957-4846',
    footerEmail: 'E-mail. scse@knu.ac.kr',
    footerCopyright: 'Copyright© 2026, KNU CSE All rights reserved',
  },
}
