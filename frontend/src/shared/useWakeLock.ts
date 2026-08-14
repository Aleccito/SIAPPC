import { useEffect, useState } from 'react'

/**
 * Impide que la pantalla se apague sola mientras esta vista esté abierta.
 *
 * Para qué: una tablet de ronda se deja en un soporte a pie de cama o en la
 * mano entre paciente y paciente, y el apagado automático del sistema llega a
 * los dos o tres minutos. Sin esto, la pantalla que existe para vigilar se pasa
 * la mayor parte del turno negra, y hay que despertarla —y a veces
 * desbloquearla— justo cuando salta una alerta.
 *
 * Se suelta al desmontar. El bloqueo es de ESTA pantalla y no de la aplicación:
 * mantener encendida la tablet en la lista de usuarios no tiene defensa, y una
 * pantalla que nunca se apaga se queda sin batería a media noche.
 *
 * El sistema retira el bloqueo por su cuenta cuando la pestaña deja de verse
 * —cambiar de aplicación, bloquear el aparato—, y NO lo devuelve solo al
 * volver. Por eso se vuelve a pedir en `visibilitychange`: sin eso funciona una
 * vez y deja de funcionar en cuanto alguien atiende un mensaje.
 *
 * Necesita contexto seguro (HTTPS o localhost). Safari lo trae desde 16.4 y
 * Firefox no lo tiene: se comprueba antes de usarlo y, si no está, no pasa nada
 * —la pantalla se apaga como siempre—. Por eso se devuelve si está activo o no,
 * para poder decirlo en la interfaz en vez de prometer algo que no ocurre.
 */
export function useWakeLock(enabled: boolean): boolean {
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (!enabled || !('wakeLock' in navigator)) return

    // `cancelado` es la guarda contra la carrera del propio efecto: `request` es
    // asíncrono, y si el componente se desmonta mientras está en vuelo, la
    // promesa resuelve con un bloqueo que ya no tiene quien lo suelte.
    let cancelado = false
    let lock: WakeLockSentinel | null = null

    async function pedir() {
      try {
        const nuevo = await navigator.wakeLock.request('screen')
        if (cancelado) {
          await nuevo.release()
          return
        }
        lock = nuevo
        setActive(true)
        // El sistema puede retirarlo sin avisarnos —batería baja, ahorro de
        // energía—. Enterarse importa: la interfaz dice si está activo.
        nuevo.addEventListener('release', () => setActive(false))
      } catch {
        // Denegado o no permitido en este contexto. No es un fallo que haya que
        // enseñar: la pantalla se apagará como se apagaría sin esta función.
        setActive(false)
      }
    }

    function alVolver() {
      if (document.visibilityState === 'visible' && !cancelado) void pedir()
    }

    void pedir()
    document.addEventListener('visibilitychange', alVolver)

    return () => {
      cancelado = true
      document.removeEventListener('visibilitychange', alVolver)
      void lock?.release()
      setActive(false)
    }
  }, [enabled])

  return active
}
