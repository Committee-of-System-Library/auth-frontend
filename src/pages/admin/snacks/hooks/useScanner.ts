import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

const ELEMENT_ID = 'snack-qr-region'
const STUDENT_NUMBER_LENGTH = 10
const RESCAN_DEBOUNCE_MS = 1500

export type ScannerState = 'idle' | 'starting' | 'running' | 'denied' | 'error'

type Options = {
    onStudentNumber: (studentNumber: string) => void
    enabled: boolean
}

export function useScanner({ onStudentNumber, enabled }: Options) {
    const [state, setState] = useState<ScannerState>('idle')
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const scannerRef = useRef<Html5Qrcode | null>(null)
    const lastScanRef = useRef<{ value: string; at: number }>({ value: '', at: 0 })
    const onStudentNumberRef = useRef(onStudentNumber)

    useEffect(() => {
        onStudentNumberRef.current = onStudentNumber
    }, [onStudentNumber])

    useEffect(() => {
        if (!enabled) return

        let cancelled = false
        const scanner = new Html5Qrcode(ELEMENT_ID, { verbose: false })
        scannerRef.current = scanner
        setState('starting')

        scanner
            .start(
                { facingMode: 'environment' },
                {
                    fps: 10,
                    qrbox: { width: 240, height: 240 },
                    aspectRatio: window.innerHeight / window.innerWidth,
                },
                (decodedText) => {
                    const studentNumber = decodedText.substring(0, STUDENT_NUMBER_LENGTH)
                    if (studentNumber.length < STUDENT_NUMBER_LENGTH) return

                    const now = Date.now()
                    const last = lastScanRef.current
                    if (last.value === studentNumber && now - last.at < RESCAN_DEBOUNCE_MS) {
                        return
                    }
                    lastScanRef.current = { value: studentNumber, at: now }
                    onStudentNumberRef.current(studentNumber)
                },
                () => {
                    // ignore per-frame decode failures
                }
            )
            .then(() => {
                if (cancelled) return
                setState('running')
            })
            .catch((err: unknown) => {
                if (cancelled) return
                const message = err instanceof Error ? err.message : String(err)
                if (
                    message.toLowerCase().includes('permission') ||
                    message.toLowerCase().includes('notallowed')
                ) {
                    setState('denied')
                    setErrorMessage('카메라 권한이 거부되었습니다. 브라우저 설정에서 권한을 허용해 주세요.')
                } else {
                    setState('error')
                    setErrorMessage(message)
                }
            })

        return () => {
            cancelled = true
            const s = scannerRef.current
            scannerRef.current = null
            if (s) {
                s.stop()
                    .then(() => s.clear())
                    .catch(() => {
                        // ignore — may already be stopped
                    })
            }
        }
    }, [enabled])

    return { state, errorMessage, elementId: ELEMENT_ID }
}

const FREQ = {
    OK: 880,
    DUPLICATE: 440,
    UNPAID: 220,
    NOT_FOUND: 180,
} as const

export function playFeedback(result: keyof typeof FREQ) {
    try {
        const ctx = new (window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.type = 'sine'
        osc.frequency.value = FREQ[result]
        gain.gain.setValueAtTime(0.0001, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.01)
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18)
        osc.start(ctx.currentTime)
        osc.stop(ctx.currentTime + 0.2)
        osc.onended = () => ctx.close()
    } catch {
        // audio is best-effort
    }
}
