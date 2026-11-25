// La onda del ECG del equipo, en vivo: GET /monitoring/:device/waveform (SSE). Como el flujo de alertas
// (src/api/alertStream.ts), con fetch y no con EventSource, para mandar el token en `Authorization` y no en la URL.
// El backend reparte un lote por segundo; aquí se reproduce a su ritmo (hz muestras por segundo), desplazándose: lo
// último a la derecha. El recuadro se llena desde el primer lote (la ventana crece de 1 a 3 s) y la escala vertical
// sigue a la señal, para que ocupe el alto. Sin equipo, o si en 5 s no llega ningún lote: "Sin señal de ECG".
// Una conexión por equipo: se usa en las pantallas de un paciente, no en la central (6 conexiones por host en HTTP/1.1;
// pedido 29 de CONEXION-BACKEND.md). Si el backend responde 429, espera lo que diga `Retry-After` o cada vez más.
import { useEffect, useRef, useState } from 'react';
import { apiFetch, getToken } from '../../api/http';
import { esperaTras429 } from '../../api/alertStream';
import { cn } from '../../lib/cn';

const SIN_SENAL_MS = 5_000;
const REINTENTO_MS = 3_000;
/** Segundos de onda a lo ancho, una vez que hay suficientes. */
const VENTANA_S = 3;

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
    let espera = REINTENTO_MS;
    let estadoActual: Estado = 'conectando';
    const cambiar = (e: Estado) => {
      if (e !== estadoActual) setEstado((estadoActual = e));
    };
    cambiar('conectando');

    // Muestras recibidas y aún sin dibujar, y las que están en pantalla (de la más vieja a la más nueva).
    let hz = 125;
    let cola: number[] = [];
    let pantalla: number[] = [];
    let deuda = 0;
    let ultimoLote = 0;
    // Escala vertical que sigue a la señal, suavizada para que no salte de un cuadro a otro.
    let bajo = -0.4;
    let alto = 1.2;
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
          pantalla = [];
          cola = [];
        }
        const muestras = lote.samples ?? [];
        // El primer lote va directo a la pantalla: el recuadro se llena enseguida en vez de dibujarse desde cero.
        if (pantalla.length === 0) pantalla = muestras.slice();
        else cola.push(...muestras);
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
        if (r.status === 429) {
          espera = esperaTras429(r, espera);
          throw new Error('429');
        }
        if (!r.ok || !r.body) throw new Error(String(r.status));
        espera = REINTENTO_MS;
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
        // Corte de red, 429 o desmontaje: abajo se decide si se reintenta.
      }
      if (activo) reintento = setTimeout(() => void conectar(), espera);
    };
    void conectar();

    let cuadro = 0;
    let anterior = performance.now();
    const dibujar = (ahora: number) => {
      cuadro = requestAnimationFrame(dibujar);
      const dt = Math.min(0.25, (ahora - anterior) / 1000);
      anterior = ahora;

      // Las muestras pasan de la cola a la pantalla a su ritmo real (hz por segundo).
      deuda += dt * hz;
      let n = Math.floor(deuda);
      deuda -= n;
      while (n-- > 0 && cola.length) pantalla.push(cola.shift()!);
      if (pantalla.length > hz * VENTANA_S) pantalla = pantalla.slice(-hz * VENTANA_S);

      const c = lienzo.current;
      if (!c) return;
      const dpr = window.devicePixelRatio || 1;
      const ancho = c.clientWidth;
      const altoPx = c.clientHeight;
      if (c.width !== Math.round(ancho * dpr) || c.height !== Math.round(altoPx * dpr)) {
        c.width = Math.round(ancho * dpr);
        c.height = Math.round(altoPx * dpr);
      }
      const ctx = c.getContext('2d');
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, ancho, altoPx);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.6;
      ctx.lineJoin = 'round';
      if (estadoActual === 'sin-senal' || pantalla.length < 2) {
        ctx.globalAlpha = 0.45;
        ctx.beginPath();
        ctx.moveTo(0, altoPx * 0.7);
        ctx.lineTo(ancho, altoPx * 0.7);
        ctx.stroke();
        ctx.globalAlpha = 1;
        return;
      }
      // La escala sigue al mínimo y al máximo de lo que se ve, con un poco de margen.
      let min = Infinity;
      let max = -Infinity;
      for (const v of pantalla) {
        if (v < min) min = v;
        if (v > max) max = v;
      }
      const margen = Math.max(0.1, (max - min) * 0.12);
      bajo += (min - margen - bajo) * 0.15;
      alto += (max + margen - alto) * 0.15;
      const y = (mv: number) => altoPx - ((mv - bajo) / Math.max(0.2, alto - bajo)) * altoPx;
      // La ventana crece de 1 a 3 s con la señal: el recuadro siempre lleno, lo último a la derecha.
      const ventana = Math.min(hz * VENTANA_S, Math.max(hz, pantalla.length));
      const desplazamiento = ventana - pantalla.length;
      ctx.beginPath();
      pantalla.forEach((v, i) => {
        const px = ((i + desplazamiento) / (ventana - 1)) * ancho;
        if (i === 0) ctx.moveTo(px, y(v));
        else ctx.lineTo(px, y(v));
      });
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
