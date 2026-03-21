/**
 * 경북대학교 단과대학/학과 데이터 (knuDepartments.json에서 로드)
 *
 * 관리 방법:
 * - 학과 추가: departments 배열에 { "name": "xxx", "active": true } 추가
 * - 학과 폐과: active를 false로 변경 (절대 삭제하지 않음 — 기존 가입자 데이터 하위호환)
 * - 학과 명칭 변경: 기존 항목 active: false + 새 항목 추가
 */
import data from './knuDepartments.json'

export type KnuDepartment = {
  name: string
  active: boolean
  /** 폐과/비활성화된 연도 (선택) */
  deprecatedSince?: string
}

export type KnuCollege = {
  campus: '대구' | '상주'
  college: string
  departments: KnuDepartment[]
}

export type KnuDepartmentsData = {
  lastUpdated: string
  note: string
  colleges: KnuCollege[]
}

const departmentsData = data as KnuDepartmentsData

/** 전체 데이터 (메타 정보 포함) */
export const KNU_DEPARTMENTS_DATA = departmentsData

/** active인 단과대학만 (departments에 active 항목이 1개 이상) */
export const KNU_COLLEGES = departmentsData.colleges

/** 특정 단과대학의 active 학과 목록 */
export function getActiveDepartments(collegeName: string): string[] {
  const college = departmentsData.colleges.find((c) => c.college === collegeName)
  if (!college) return []
  return college.departments.filter((d) => d.active).map((d) => d.name)
}
