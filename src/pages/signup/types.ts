/**
 * 회원가입 폼 데이터 (API/동의 페이지 전달용)
 */
export interface SignupFormData {
  studentId: string
  major: string
  userType: 'CSE_STUDENT' | 'KNU_OTHER_DEPT' | 'EXTERNAL'
}
