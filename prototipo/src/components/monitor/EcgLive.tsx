// La onda del ECG del equipo, en vivo: GET /monitoring/:device/waveform (SSE). Como el flujo de alertas
// (src/api/alertStream.ts), con fetch y no con EventSource, para mandar el token en `Authorization` y no en la URL.
// El backend reparte un lote por segundo; aquí se reproduce a su ritmo (hz muestras por segundo) con un barrido
// como el de un monitor. Sin equipo, o si en 5 s no llega ningún lote: "Sin señal de ECG" sobre una línea plana.
// Una conexión por equipo: se usa en las pantallas de un paciente, no en la central (6 conexiones por host en HTTP/1.1;
// pedido 29 de CONEXION-BACKEND.md).
import { useEffect, useRef, useState } from 'react';
import { apiFetch, getToken } from '../../api/http';
import { cn } from '../../lib/cn';

const SIN_SENAL_MS = 5_000;
const REINTENTO_MS = 3_000;
/** Segundos de onda a lo ancho. */
const VENTANA_S = 4;
/** Hueco que deja el barrido delante de lo que va escribiendo (fracción del ancho). */
const HUECO = 0.04;
/** Rango vertical en mV. */
const MIN_MV = -0.45;
const MAX_MV = 1.25;

type Estado = 'conectando' | 'en-vivo' | 'sin-senal';

export function EcgLive({ device, color = '#22c55e', className }: { device: string | null | undefined; color?: string; className?: string }) {
  const lienzo = useRef<HTMLCanvasElement>(null);
  const [estado, setEstado] = useState<Estado>(device ? 'conectando' : 'sin-senal');

  useEffect(() => {
    if (!device) {
      setEstado('sin-senal');
      return;
    }
    let activo = true;
    let control: AbortController | null = null;
    let reintento: ReturnType<typeof setTimeout> | undefined;
    let estadoActual: Estado = 'conectando';
    const cambiar = (e: Estado) => {
      if (e !== estadoActual) setEstado((estadoActual = e));
    };
    cambiar('conectando');

    // Muestras recibidas y aún sin dibujar, y la pantalla (un anillo que el barrido va sobrescribiendo).
    let hz = 125;
    let cola: number[] = [];
    let pantalla = new Float32Array(hz * VENTANA_S).fill(Number.NaN);
    let escritura = 0;
    let deuda = 0;
    let reproduciendo = false;
    let ultimoLote = 0;
    const inicio = Date.now();

    const procesar = (marco: string) => {
      const evento = marco.split('\n').find((l) => l.startsWith('event: '))?.slice(7).trim();
      const datos = marco.split('\n').find((l) => l.startsWith('data: '))?.slice(6);
      if (evento !== 'onda' || !datos) return;
      try {
        const lote = JSON.parse(datos) as { variable?: string; hz?: number; samples?: number[] };
        if (lote.variable && lote.variable !== 'ecg') return;
        if (lote.hz && lote.hz !== hz) {
          hz = lote.hz;
          pantalla = new Float32Array(hz * VENTANA_S).fill(Number.NaN);
          escritura = 0;
          cola = [];
        }
        cola.push(...(lote.samples ?? []));
        // Si la pestaña estuvo oculta no se acumulan segundos de atraso: se queda lo último.
        if (cola.length > hz * 3) cola = cola.slice(-hz);
        ultimoLote = Date.now();
        cambiar('en-vivo');
      } catch {
        // Un marco ilegible no corta la onda: el siguiente llega en un segundo.
      }
    };

    const conectar = async () => {
      control = new AbortController();
      try {
        const token = getToken();
        const r = await apiFetch(`/monitoring/${encodeURIComponent(device)}/waveform`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          signal: control.signal,
        });
        // Sin permiso, sin sesión o equipo que no existe: no hay nada que reintentar.
        if ([401, 403, 404].includes(r.status)) {
          cambiar('sin-senal');
          return;
        }
        if (!r.ok || !r.body) throw new Error(String(r.status));
        const lector = r.body.getReader();
        const decodificador = new TextDecoder();
        let resto = '';
        while (activo) {
          const { done, value } = await lector.read();
          if (done) break;
          resto += decodificador.decode(value, { stream: true });
          const marcos = resto.split('\n\n');
          resto = marcos.pop() ?? '';
          marcos.forEach(procesar);
        }
      } catch {
        // Corte de red o desmontaje: abajo se decide si se reintenta.
      }
      if (activo) reintento = setTimeout(() => void conectar(), REINTENTO_MS);
    };
    void conectar();

    let cuadro = 0;
    let anterior = performance.now();
    const dibujar = (ahora: number) => {
      cuadro = requestAnimationFrame(dibujar);
      const dt = Math.min(0.25, (ahora - anterior) / 1000);
      anterior = ahora;

      // Arranca cuando hay medio segundo guardado, así un lote que llega un poco tarde no deja la línea a saltos.
      if (!reproduciendo && cola.length >= hz * 0.5) reproduciendo = true;
      if (reproduciendo) {
        deuda += dt * hz;
        let n = Math.floor(deuda);
        deuda -= n;
        while (n-- > 0 && cola.length) {
          pantalla[escritura] = cola.shift()!;
          escritura = (escritura + 1) % pantalla.length;
        }
        if (!cola.length) reproduciendo = false;
      }

      const c = lienzo.current;
      if (!c) return;
      const dpr = window.devicePixelRatio || 1;
      const ancho = c.clientWidth;
      const alto = c.clientHeight;
      if (c.width !== Math.round(ancho * dpr) || c.height !== Math.round(alto * dpr)) {
        c.width = Math.round(ancho * dpr);
        c.height = Math.round(alto * dpr);
      }
      const ctx = c.getContext('2d');
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, ancho, alto);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.6;
      ctx.lineJoin = 'round';
      const y = (mv: number) => alto - ((mv - MIN_MV) / (MAX_MV - MIN_MV)) * alto;
      if (estadoActual === 'sin-senal') {
        ctx.globalAlpha = 0.45;
        ctx.beginPath();
        ctx.moveTo(0, y(0));
        ctx.lineTo(ancho, y(0));
        ctx.stroke();
        ctx.globalAlpha = 1;
        return;
      }
      const n = pantalla.length;
      const hueco = Math.round(n * HUECO);
      ctx.beginPath();
      let trazando = false;
      for (let i = 0; i < n; i++) {
        // Delante del barrido queda un hueco, como en el monitor: ahí está la muestra más vieja.
        const distancia = (i - escritura + n) % n;
        const v = pantalla[i];
        if (distancia < hueco || Number.isNaN(v)) {
          trazando = false;
          continue;
        }
        const x = (i / (n - 1)) * ancho;
        if (trazando) ctx.lineTo(x, y(v));
        else ctx.moveTo(x, y(v));
        trazando = true;
      }
      ctx.stroke();
    };
    cuadro = requestAnimationFrame(dibujar);
    // Aparte del dibujo: con la pestaña oculta no corre requestAnimationFrame, y el estado tiene que seguir al día.
    const revisar = setInterval(() => {
      if (Date.now() - (ultimoLote || inicio) > SIN_SENAL_MS) cambiar('sin-senal');
    }, 1000);

    return () => {
      activo = false;
      cancelAnimationFrame(cuadro);
      clearInterval(revisar);
      clearTimeout(reintento);
      control?.abort();
    };
  }, [device, color]);

  return (
    <div
      className={cn('relative h-full w-full', className)}
      role="img"
      aria-label={estado === 'en-vivo' ? `Onda de ECG en vivo del equipo ${device}` : estado === 'conectando' ? 'Conectando la onda de ECG' : 'Sin señal de ECG'}
    >
      <canvas ref={lienzo} className="absolute inset-0 h-full w-full" aria-hidden="true" />
      {estado === 'sin-senal' && (
        <p className="absolute inset-0 flex items-center justify-center font-jakarta text-[12px] font-bold leading-[normal] text-subtle">Sin señal de ECG</p>
      )}
    </div>
  );
}
