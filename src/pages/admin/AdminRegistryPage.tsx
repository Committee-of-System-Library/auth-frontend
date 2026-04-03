import { useEffect, useState, useMemo, useRef } from 'react'
import { Upload, Plus, Search, Trash2, X, Loader2 } from 'lucide-react'
import { authApi, type CseStudentRegistry, type RegistryUploadResult } from '@/shared/api/auth.api'

export default function AdminRegistryPage() {
    const [students, setStudents] = useState<CseStudentRegistry[]>([])
    const [loading, setLoading] = useState(true)
    const [query, setQuery] = useState('')
    const [actionLoading, setActionLoading] = useState<string | null>(null)
    const [uploadResult, setUploadResult] = useState<RegistryUploadResult | null>(null)
    const [showAddModal, setShowAddModal] = useState(false)
    const [addForm, setAddForm] = useState({ studentNumber: '', name: '', major: '컴퓨터학부', grade: 1, enrollmentStatus: '재학' })
    const [addLoading, setAddLoading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const load = () => {
        setLoading(true)
        authApi.adminRegistry.list()
            .then(setStudents)
            .catch(() => alert('학생 명단을 불러올 수 없습니다.'))
            .finally(() => setLoading(false))
    }

    useEffect(() => { load() }, [])

    const filtered = useMemo(() => {
        if (!query.trim()) return students
        const q = query.trim().toLowerCase()
        return students.filter(s =>
            s.studentNumber.toLowerCase().includes(q) ||
            s.name.toLowerCase().includes(q)
        )
    }, [students, query])

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        try {
            const result = await authApi.adminRegistry.upload(file)
            setUploadResult(result)
            load()
        } catch { alert('CSV 업로드에 실패했습니다.') }
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const handleAdd = async () => {
        if (!addForm.studentNumber || !addForm.name) return
        setAddLoading(true)
        try {
            const created = await authApi.adminRegistry.add(addForm)
            setStudents(prev => [...prev, created])
            setShowAddModal(false)
            setAddForm({ studentNumber: '', name: '', major: '컴퓨터학부', grade: 1, enrollmentStatus: '재학' })
        } catch { alert('학생 추가에 실패했습니다.') }
        setAddLoading(false)
    }

    const handleDelete = async (s: CseStudentRegistry) => {
        if (!confirm(`정말 "${s.name}" (${s.studentNumber})을 삭제하시겠습니까?`)) return
        setActionLoading(s.studentNumber)
        try {
            await authApi.adminRegistry.delete(s.studentNumber)
            setStudents(prev => prev.filter(x => x.studentNumber !== s.studentNumber))
        } catch { alert('삭제에 실패했습니다.') }
        setActionLoading(null)
    }

    return (
        <div className="animate-fade-up">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-ink">학생 명단</h1>
                    <p className="text-ink-300 text-sm mt-1">컴퓨터학부 학생 명단을 관리합니다.</p>
                </div>
                <div className="flex gap-2">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        onChange={handleUpload}
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-surface-200 rounded-xl text-sm font-medium text-ink-700 hover:border-primary-200 hover:text-primary transition-all"
                    >
                        <Upload className="w-4 h-4" />
                        CSV 업로드
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        수동 추가
                    </button>
                </div>
            </div>

            {/* 검색 */}
            <div className="bg-white rounded-2xl shadow-card p-4 mb-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-200" />
                    <input
                        type="text"
                        placeholder="학번 또는 이름으로 검색"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-surface-50 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
                    />
                </div>
            </div>

            {/* 테이블 */}
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-surface-100">
                            <th className="text-left px-6 py-4 text-xs font-semibold text-ink-300 uppercase tracking-wider">학번</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-ink-300 uppercase tracking-wider">이름</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-ink-300 uppercase tracking-wider">전공</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-ink-300 uppercase tracking-wider">학년</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-ink-300 uppercase tracking-wider">학적상태</th>
                            <th className="text-right px-6 py-4 text-xs font-semibold text-ink-300 uppercase tracking-wider">작업</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-50">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-16 text-center">
                                    <Loader2 className="w-5 h-5 animate-spin text-ink-200 mx-auto" />
                                </td>
                            </tr>
                        ) : filtered.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-16 text-center text-ink-300 text-sm">
                                    {query ? '검색 결과가 없습니다.' : '등록된 학생이 없습니다.'}
                                </td>
                            </tr>
                        ) : filtered.map(s => (
                            <tr key={s.id} className="hover:bg-surface-50 transition-colors">
                                <td className="px-6 py-3 text-sm text-ink font-mono">{s.studentNumber}</td>
                                <td className="px-6 py-3 text-sm text-ink font-medium">{s.name}</td>
                                <td className="px-6 py-3 text-sm text-ink-500">{s.major}</td>
                                <td className="px-6 py-3 text-sm text-ink-500">{s.grade}학년</td>
                                <td className="px-6 py-3">
                                    <select
                                        value={s.enrollmentStatus ?? ''}
                                        onChange={async (e) => {
                                            const newStatus = e.target.value
                                            try {
                                                const updated = await authApi.adminRegistry.changeEnrollmentStatus(s.studentNumber, newStatus)
                                                setStudents(prev => prev.map(x => x.id === updated.id ? updated : x))
                                            } catch { alert('학적상태 변경에 실패했습니다.') }
                                        }}
                                        className="px-2 py-1 bg-surface-50 rounded-lg text-sm border-none focus:outline-none focus:ring-2 focus:ring-primary-200"
                                    >
                                        {['재학', '휴학', '휴학예정', '학사학위취득유예', '수료'].map(st => (
                                            <option key={st} value={st}>{st}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="px-6 py-3 text-right">
                                    <button
                                        onClick={() => handleDelete(s)}
                                        disabled={actionLoading === s.studentNumber}
                                        className="p-1.5 rounded-lg text-ink-300 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                                    >
                                        {actionLoading === s.studentNumber ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="w-4 h-4" />
                                        )}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 업로드 결과 모달 */}
            {uploadResult && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setUploadResult(null)}>
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-ink">업로드 결과</h3>
                            <button onClick={() => setUploadResult(null)} className="p-1 rounded-lg hover:bg-surface-100 text-ink-300">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-ink-400">전체 행</span><span className="font-medium">{uploadResult.totalRows}</span></div>
                            <div className="flex justify-between"><span className="text-ink-400">추가</span><span className="font-medium text-green-600">{uploadResult.insertedCount}</span></div>
                            <div className="flex justify-between"><span className="text-ink-400">갱신</span><span className="font-medium text-blue-600">{uploadResult.updatedCount}</span></div>
                            <div className="flex justify-between"><span className="text-ink-400">오류</span><span className="font-medium text-red-600">{uploadResult.errorCount}</span></div>
                        </div>
                        <button
                            onClick={() => setUploadResult(null)}
                            className="mt-5 w-full py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition-colors"
                        >
                            확인
                        </button>
                    </div>
                </div>
            )}

            {/* 수동 추가 모달 */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowAddModal(false)}>
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-ink">학생 수동 추가</h3>
                            <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg hover:bg-surface-100 text-ink-300">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="학번"
                                value={addForm.studentNumber}
                                onChange={e => setAddForm(f => ({ ...f, studentNumber: e.target.value }))}
                                className="w-full px-4 py-2.5 bg-surface-50 rounded-xl text-sm border-none focus:outline-none focus:ring-2 focus:ring-primary-200"
                            />
                            <input
                                type="text"
                                placeholder="이름"
                                value={addForm.name}
                                onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
                                className="w-full px-4 py-2.5 bg-surface-50 rounded-xl text-sm border-none focus:outline-none focus:ring-2 focus:ring-primary-200"
                            />
                            <input
                                type="text"
                                placeholder="전공"
                                value={addForm.major}
                                onChange={e => setAddForm(f => ({ ...f, major: e.target.value }))}
                                className="w-full px-4 py-2.5 bg-surface-50 rounded-xl text-sm border-none focus:outline-none focus:ring-2 focus:ring-primary-200"
                            />
                            <select
                                value={addForm.grade}
                                onChange={e => setAddForm(f => ({ ...f, grade: Number(e.target.value) }))}
                                className="w-full px-4 py-2.5 bg-surface-50 rounded-xl text-sm border-none focus:outline-none focus:ring-2 focus:ring-primary-200"
                            >
                                {[1, 2, 3, 4, 5].map(g => (
                                    <option key={g} value={g}>{g}학년</option>
                                ))}
                            </select>
                            <select
                                value={addForm.enrollmentStatus}
                                onChange={e => setAddForm(f => ({ ...f, enrollmentStatus: e.target.value }))}
                                className="w-full px-4 py-2.5 bg-surface-50 rounded-xl text-sm border-none focus:outline-none focus:ring-2 focus:ring-primary-200"
                            >
                                {['재학', '휴학', '휴학예정', '학사학위취득유예', '수료'].map(st => (
                                    <option key={st} value={st}>{st}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={handleAdd}
                            disabled={addLoading || !addForm.studentNumber || !addForm.name}
                            className="mt-5 w-full py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {addLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                            추가
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
