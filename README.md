# 경북대 컴퓨터학부 통합 인증/인가 클라이언트

React + TypeScript + Vite 기반의 SSO(통합 인증) 프론트엔드입니다.  
Auth Server(SSO 백엔드)와 연동해 로그인·회원가입·동의·에러 화면을 제공합니다.

---

## 요구 사항

- **Node.js** 18+
- **pnpm** (권장) 또는 npm / yarn

---

## 빠른 시작

### 1. 저장소 클론 및 의존성 설치

```bash
pnpm install
```

### 2. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 만들고 아래 변수를 넣습니다.  
**예시는 `.env.example`** 에 있으니 복사한 뒤 값만 수정하면 됩니다.

```bash
cp .env.example .env.local
# .env.local 을 열어 값 수정
```

| 변수 | 설명 | 예시 (로컬 개발) |
|------|------|------------------|
| `VITE_AUTH_SERVER_BASE_URL` | SSO(Auth) 서버 주소 | `http://localhost:8081` |
| `VITE_FRONTEND_BASE_URL` | 이 프론트엔드 주소 (로그인 콜백 등에 사용) | `http://localhost:5173` |
| `VITE_API_BASE_URL` | 기타 API 서버 주소 (필요한 경우) | `http://localhost:40001` |

- **주의:** Vite는 빌드 시점에 `VITE_*` 변수를 코드에 넣습니다. 값을 바꾼 뒤에는 **개발 서버를 다시 실행**해야 합니다.
- 로그인 시 **같은 주소로 접속**해야 합니다. `localhost`와 `127.0.0.1`은 브라우저에서 서로 다른 주소로 취급되므로, `.env.local`에 `http://localhost:5173`을 썼다면 브라우저에도 `http://localhost:5173`으로 접속하세요.

### 3. 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 `http://localhost:5173` (또는 터미널에 표시된 주소)로 접속합니다.

### 4. 빌드 및 미리보기

```bash
pnpm build
pnpm preview
```

---

## 주요 스크립트

| 명령어 | 설명 |
|--------|------|
| `pnpm dev` | 개발 서버 실행 (HMR) |
| `pnpm build` | TypeScript 검사 후 프로덕션 빌드 |
| `pnpm preview` | 빌드 결과물 로컬 서버로 미리보기 |
| `pnpm lint` | ESLint 실행 |

---

## 프로젝트 구조 (요약)

```
src/
├── app/
│   └── routes.tsx              # 라우터 설정
├── pages/
│   ├── login/                  # 로그인
│   │   ├── LoginPage.tsx
│   │   ├── translations.ts
│   │   └── components/
│   │       ├── LoginCardSection.tsx
│   │       └── LoginIntroSection.tsx
│   ├── signup/                 # 회원가입
│   │   ├── SignupFormPage.tsx
│   │   ├── types.ts
│   │   └── constants.ts
│   ├── consent/                # 동의
│   │   ├── ConsentPage.tsx
│   │   ├── constants/consentContent.ts
│   │   └── components/
│   │       ├── ConsentCardSection.tsx
│   │       └── ConsentAgreementItem.tsx
│   ├── error/                  # 에러 안내
│   │   ├── ErrorPage.tsx
│   │   └── constants/errorMessages.ts
│   ├── main/
│   │   └── MainPage.tsx        # 로그인 후 메인
│   └── AuthCallbackPage.tsx    # 로그인 콜백 (state 검증)
├── shared/
│   ├── api/
│   │   ├── http.ts             # 공통 HTTP (VITE_API_BASE_URL)
│   │   ├── authHttp.ts         # Auth Server 전용 (VITE_AUTH_SERVER_BASE_URL)
│   │   └── auth.api.ts         # 인증 API (me, signup, logout 등)
│   ├── constants/routes.ts
│   ├── types/error.ts
│   ├── utils/
│   │   ├── oauth.ts            # 로그인 URL, state 저장/검증
│   │   ├── url.ts
│   │   └── error.ts
│   └── components/
│       ├── PageContainer.tsx
│       └── LoadingSpinner.tsx
├── contexts/
│   └── LanguageContext.tsx
├── components/ui/              # 버튼, 폼 필드, 셀렉트 등
├── lib/utils.ts
├── main.tsx
├── App.tsx
└── index.css
```

**라우트:** `/`(로그인), `/auth/callback`, `/consent`, `/error`, `/signup`, `/main`

---

## Auth Server(백엔드) 연동

- 로그인: `GET {SSO_주소}/login?redirect_uri=xx&state=xx`  
  - `redirect_uri`: 이 프론트의 콜백 URL (예: `http://localhost:5173/auth/callback`)
  - `state`: 프론트에서 생성한 랜덤 문자열 (콜백 시 동일한 값으로 돌려받아야 함)
- 백엔드에서 **콜백 리다이렉트 시** 클라이언트가 보낸 `redirect_uri`와 `state`를 **그대로** 사용해야 합니다.
- 참고: [knu-cse-auth-server](https://github.com/Woohyeon-Hong/knu-cse-auth-server)

---

## Docker 이미지 빌드 및 푸시 (GHCR)

프로젝트 루트에 `Dockerfile`이 있습니다. 순수 React/Vite 빌드 후 nginx로 서빙하는 이미지를 만듭니다.

**1. 이미지 빌드**

```bash
# 환경 변수 없이 (기본값/빈 값으로 빌드)
docker build -t ghcr.io/committee-of-system-library/knu-cse-official-client:latest .

# 배포 환경 URL 넣어서 빌드 (선택)
docker build \
  --build-arg VITE_AUTH_SERVER_BASE_URL=https://auth.example.com \
  --build-arg VITE_FRONTEND_BASE_URL=https://client.example.com \
  -t ghcr.io/committee-of-system-library/knu-cse-official-client:latest .
```

**2. GHCR에 푸시**

```bash
# GitHub 로그인 (토큰: Settings → Developer settings → Personal access tokens, write:packages)
echo "YOUR_GITHUB_TOKEN" | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin

docker push ghcr.io/committee-of-system-library/knu-cse-official-client:latest
```

팀에서 이미지 이름을 `knu-cse-auth-client` 등으로 쓰라고 하면 `-t` 뒤 이름만 바꾸면 됩니다.
