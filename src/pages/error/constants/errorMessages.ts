import type { ErrorCode, ErrorMessage } from '@/shared/types/error'

export type { ErrorCode, ErrorMessage }

export const ERROR_MESSAGES: Record<ErrorCode, ErrorMessage> = {
    unauthorized_domain: {
        title: '인증 실패',
        description: '경북대학교 Google Workspace 계정(@knu.ac.kr)만 로그인 가능합니다.',
    },
    consent_required: {
        title: '동의 필요',
        description: '서비스 이용을 위해 약관 동의가 필요합니다.',
    },
    session_expired: {
        title: '세션 만료',
        description: '로그인 세션이 만료되었습니다. 다시 로그인해주세요.',
    },
    network_error: {
        title: '네트워크 오류',
        description: '서버와의 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    },
    invalid_redirect: {
        title: '잘못된 요청',
        description: '리다이렉트 URL이 유효하지 않습니다.',
    },
    session_failed: {
        title: '세션 검증 실패',
        description: '로그인 세션을 확인할 수 없습니다. 다시 로그인해주세요.',
    },
    state_mismatch: {
        title: '로그인 검증 실패',
        description:
            'state가 일치하지 않습니다. 다른 탭에서 로그인을 시도했거나, 세션이 만료되었을 수 있습니다. 같은 탭에서 처음부터 다시 로그인해 주세요. (Auth Server는 로그인 시작 시 클라이언트가 보낸 state를 콜백 리다이렉트에 그대로 붙여 보내야 합니다.)',
    },
    state_missing: {
        title: '로그인 검증 실패',
        description:
            '로그인 후 돌아온 주소에 state가 없습니다. Auth Server 세션 쿠키가 Keycloak 리다이렉트 후에도 유지되는지 백엔드에서 확인해 주세요.',
    },
    state_storage_lost: {
        title: '로그인 검증 실패',
        description:
            '저장된 state를 찾을 수 없습니다. 로그인할 때 사용한 주소와 돌아온 주소가 같아야 합니다. localhost와 127.0.0.1은 서로 다른 주소이므로, 항상 같은 주소로 접속한 뒤 같은 주소로 돌아오도록 Auth Server의 redirect_uri를 맞춰 주세요.',
    },
}

