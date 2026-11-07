
import { useEffect, useRef, useState } from 'react'
import {
  AlertTriangle,
  BellRing,
  Check,
  Eye,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'

import {
  getSafetyAlerts,
  subscribeToSafetyAlerts,
} from '../lib/safetyAlerts'

const severityRank = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
}

function getSeverity(alert) {
  const value = String(
    alert?.severity ?? alert?.riskLevel ?? alert?.priority ?? 'medium'
  ).toLowerCase()

  if (value.includes('critical') || value.includes('emergency')) {
    return 'critical'
  }

  if (value.includes('high') || value.includes('urgent')) {
    return 'high'
  }

  if (value.includes('low')) return 'low'

  return 'medium'
}

function getMessage(alert) {
  const title =
    alert?.title ||
    alert?.detection ||
    alert?.alertType ||
    alert?.type ||
    alert?.description ||
    alert?.details ||
    'Safety incident detected'

  const location =
    alert?.location ||
    alert?.area ||
    alert?.zone ||
    'Unknown location'

  const camera =
    alert?.cameraLabel ||
    (alert?.cameraId ? `Camera ${alert.cameraId}` : 'Monitoring system')

  const details = alert?.details
  const severity = getSeverity(alert)

  if (severity === 'critical') {
    return `Critical emergency! ${title}. Location: ${location}. ${
      details && details !== title ? `${details}. ` : ''
    }Raise the alarm and follow emergency procedures immediately.`
  }

  if (severity === 'high') {
    return `Urgent safety warning! ${title}. Location: ${location}. ${
      details && details !== title ? `${details}. ` : ''
    }Please investigate immediately and follow site safety procedures.`
  }

  return `Safety alert detected: ${title}. Location: ${location}. Camera: ${camera}. ${
    details && details !== title ? `${details}. ` : ''
  }Please review and take the necessary safety action.`
}

function speak(message, urgent = false) {
  if (
    typeof window === 'undefined' ||
    !('speechSynthesis' in window) ||
    !message
  ) {
    return
  }

  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(message)
  utterance.lang = 'en-IN'
  utterance.rate = urgent ? 1 : 0.9
  utterance.pitch = urgent ? 1.1 : 1

  window.speechSynthesis.speak(utterance)
}

function getTopAlert(alerts) {
  return [...alerts].sort(
    (a, b) =>
      (severityRank[getSeverity(b)] || 0) -
      (severityRank[getSeverity(a)] || 0)
  )[0] || null
}

export default function SafetyCartoonAssistant() {
  const [alert, setAlert] = useState(null)
  const [muted, setMuted] = useState(false)
  const [visible, setVisible] = useState(true)

  const mutedRef = useRef(false)
  const knownIds = useRef(new Set())

  useEffect(() => {
    const existing = getSafetyAlerts().filter(
      (item) => !item.closed
    )

    existing.forEach((item) => {
      knownIds.current.add(String(item.id))
    })

    setAlert(getTopAlert(existing))

    const syncAlerts = (allAlerts) => {
      const alerts = Array.isArray(allAlerts) ? allAlerts : []
      const activeAlerts = alerts.filter((item) => !item.closed)

      const freshAlert = activeAlerts.find(
        (item) => !knownIds.current.has(String(item.id))
      )

      activeAlerts.forEach((item) => {
        knownIds.current.add(String(item.id))
      })

      if (freshAlert) {
        setAlert(freshAlert)
        setVisible(true)

        if (!mutedRef.current) {
          const severity = getSeverity(freshAlert)
          speak(
            getMessage(freshAlert),
            severity === 'critical' || severity === 'high'
          )
        }

        return
      }

      setAlert((current) => {
        if (current) {
          const updated = activeAlerts.find(
            (item) => String(item.id) === String(current.id)
          )

          if (updated) return updated
        }

        return getTopAlert(activeAlerts)
      })
    }

    const unsubscribe = subscribeToSafetyAlerts(syncAlerts)

    return () => {
      unsubscribe()

      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const toggleMute = () => {
    setMuted((previous) => {
      const next = !previous
      mutedRef.current = next

      if (next && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }

      return next
    })
  }

  const openAssistant = () => {
    const activeAlerts = getSafetyAlerts().filter(
      (item) => !item.closed
    )

    setAlert(getTopAlert(activeAlerts))
    setVisible(true)
  }

  const minimize = () => {
    setVisible(false)

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }

  if (!alert || !visible) {
    return (
      <button
        type="button"
        onClick={() => {
          openAssistant()
        }}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-3 text-sm font-semibold text-blue-800 shadow-xl transition hover:-translate-y-1"
        aria-label="Open Safety Cartoon Assistant"
      >
        <span className="text-2xl" aria-hidden="true">
          👷‍♀️
        </span>
        Safety Assistant
        {getSafetyAlerts().some((item) => !item.closed) && (
          <span className="h-2 w-2 rounded-full bg-red-500" />
        )}
      </button>
    )
  }

  const severity = getSeverity(alert)
  const urgent = severity === 'critical' || severity === 'high'
  const message = getMessage(alert)

  return (
    <aside
      className={`fixed bottom-4 right-4 z-40 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-2xl border bg-white shadow-2xl ${
        urgent ? 'border-red-300' : 'border-blue-200'
      }`}
      aria-live={urgent ? 'assertive' : 'polite'}
      aria-label="Safety Cartoon Assistant"
    >
      <header
        className={`flex items-center justify-between px-3 py-3 text-white ${
          urgent ? 'bg-red-600' : 'bg-blue-700'
        }`}
      >
        <div className="flex items-center gap-2 text-xs font-bold">
          {urgent ? (
            <BellRing className="h-4 w-4" />
          ) : (
            <AlertTriangle className="h-4 w-4" />
          )}
          {urgent ? 'URGENT SAFETY WARNING' : 'SAFETY ASSISTANT'}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggleMute}
            className="rounded-lg p-2 hover:bg-white/15"
            aria-label={muted ? 'Enable voice' : 'Mute voice'}
            title={muted ? 'Enable voice' : 'Mute voice'}
          >
            {muted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </button>

          <button
            type="button"
            onClick={minimize}
            className="rounded-lg p-2 hover:bg-white/15"
            aria-label="Minimize assistant"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div
        className={`flex items-start gap-3 p-4 ${
          urgent ? 'bg-red-50' : 'bg-blue-50'
        }`}
      >
        <div
          className={`relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl text-5xl ${
            urgent
              ? 'animate-pulse bg-red-100 ring-2 ring-red-300'
              : 'bg-blue-100'
          }`}
          aria-hidden="true"
        >
          👷‍♀️
          <span className="absolute -bottom-1 -right-1 rounded-full border-2 border-white bg-emerald-500 p-1">
            <Check className="h-3 w-3 text-white" />
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <p
            className={`mb-2 text-sm font-bold ${
              urgent ? 'text-red-800' : 'text-blue-900'
            }`}
          >
            {severity === 'critical'
              ? '🚨 Critical emergency!'
              : severity === 'high'
                ? '⚠️ Urgent safety warning!'
                : '👋 Safety alert detected'}
          </p>

          <p className="text-xs leading-5 text-slate-700">
            {message}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={muted}
              onClick={() => speak(message, urgent)}
              className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-50 ${
                urgent
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-blue-700 hover:bg-blue-800'
              }`}
            >
              <Volume2 className="h-4 w-4" />
              Speak alert
            </button>

            <button
              type="button"
              onClick={minimize}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              <Eye className="h-4 w-4" />
              Minimize
            </button>
          </div>
        </div>
      </div>

      <footer className="flex items-center justify-between gap-2 border-t border-slate-100 bg-white px-4 py-3 text-[10px] text-slate-500">
        <span className="min-w-0 truncate">
          {alert.cameraLabel ||
            (alert.cameraId
              ? `Camera ${alert.cameraId}`
              : 'Safety monitoring')}
        </span>

        <span
          className={`shrink-0 font-bold uppercase ${
            urgent ? 'text-red-600' : 'text-blue-700'
          }`}
        >
          {severity} severity
        </span>
      </footer>
    </aside>
  )
}
