// SIMULADO: un ECG sintético (derivación II) para el modo sin backend. Es el mismo modelo que usa el publicador de
// demo (tools/telemetria-demo/publicador.mjs): cada latido es una suma de gaussianas P, Q, R, S y T, y los latidos
// se suceden a la FC del momento. Con el backend, la onda es la que publica el equipo.

const gauss = (x: number, centro: number, ancho: number, alto: number) => alto * Math.exp(-((x - centro) ** 2) / (2 * ancho ** 2));

/** El voltaje (mV) en una fracción `fase` (0 a 1) de un latido. Sin onda P: fibrilación auricular. */
export function latidoEcg(fase: number, conP = true): number {
  return (
    (conP ? gauss(fase, 0.2, 0.025, 0.12) : 0) +
    gauss(fase, 0.36, 0.01, -0.12) +
    gauss(fase, 0.4, 0.012, 1.1) +
    gauss(fase, 0.44, 0.012, -0.25) +
    gauss(fase, 0.65, 0.045, 0.3)
  );
}

/** Genera muestras seguidas, latido tras latido, a `hz` muestras por segundo. */
export function generadorEcg(hz: number) {
  let fase = 0;
  let rr = 0.8;
  let t = 0;
  return (fc: number, n: number): number[] => {
    const out: number[] = [];
    for (let i = 0; i < n; i++) {
      t += 1 / hz;
      fase += 1 / hz / rr;
      if (fase >= 1) {
        fase -= 1;
        rr = (60 / Math.max(30, fc)) * (0.97 + Math.random() * 0.06);
      }
      const linea = 0.05 * Math.sin(2 * Math.PI * 0.25 * t);
      out.push(Math.round((latidoEcg(fase) + linea + (Math.random() - 0.5) * 0.02) * 1000) / 1000);
    }
    return out;
  };
}
