// No viene de Figma (PR de conexión 2 y 3): lo que el backend sí tiene de reportes. El resto del panel son reportes
// clínicos por paciente, que el backend no tiene (pedido 14) y siguen simulados.
// - Actividad clínica en CSV: GET /reports/actividad-clinica.csv?desde&hasta (procedimiento sp_rep_*, backend/db/extra.sql).
//   El nombre del archivo lo pone el servidor.
// - Bitácora del ETL: GET /reports. Cada fila es una corrida de un proceso de backend/etl/.
import { useState } from 'react';
import { descargarActividadClinica } from '../../api/exportCsv';
import { useEtlReports } from '../../api/queries';
import type { ReportStatus } from '../../api/types/reports';
import { Badge, Button, Card, DateField, Table, useToast } from '../../components';
import { fmtDateTime } from '../../lib/clinical';
import { cn } from '../../lib/cn';

const ESTADO: Record<ReportStatus, [string, 'success' | 'warning' | 'danger']> = {
  ready: ['Completada', 'success'],
  running: ['En curso', 'warning'],
  failed: ['Falló', 'danger'],
};

/** "2026-11-24" de la fecha local, `dias` atrás. */
const fecha = (dias: number) => {
  const d = new Date(Date.now() - dias * 86_400_000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const headRow = 'flex w-full items-center gap-3 border-b border-line bg-surface px-4 py-3 font-jakarta text-[12px] font-bold leading-[normal] text-muted';
const bodyRow = 'flex w-full items-center gap-3 border-b border-line px-4 py-[14px] font-jakarta text-[13px] leading-[normal] last:border-b-0';

export function InformesSistema() {
  const toast = useToast();
  const [desde, setDesde] = useState(fecha(7));
  const [hasta, setHasta] = useState(fecha(0));
  const [bajando, setBajando] = useState(false);
  const etl = useEtlReports();
  const rangoMalo = !desde || !hasta || desde > hasta;

  const descargar = async () => {
    if (rangoMalo) return;
    setBajando(true);
    try {
      await descargarActividadClinica(desde, hasta);
      toast('Informe de actividad clínica descargado');
    } catch (e) {
      toast(e instanceof Error ? `No se pudo descargar: ${e.message}` : 'No se pudo descargar el informe', 'danger');
    } finally {
      setBajando(false);
    }
  };

  return (
    <>
      <section className="flex w-full flex-col gap-3">
        <div className="flex w-full flex-col gap-1 leading-[normal]">
          <h2 className="font-jakarta text-[18px] font-bold text-ink">Actividad Clínica</h2>
          <p className="font-jakarta text-[13px] font-normal text-muted">Informe del hospital en CSV (se abre en Excel), por rango de fechas.</p>
        </div>
        <Card className="flex w-full flex-col gap-4 sm:flex-row sm:items-end">
          <div className="grid w-full grid-cols-1 gap-4 sm:max-w-[440px] sm:grid-cols-2">
            <DateField id="informe-desde" label="Desde" value={desde} max={hasta || undefined} onChange={setDesde} />
            <DateField id="informe-hasta" label="Hasta" value={hasta} min={desde || undefined} max={fecha(0)} onChange={setHasta} error={desde > hasta ? 'La fecha final es anterior a la inicial' : undefined} />
          </div>
          <Button onClick={() => void descargar()} disabled={bajando || rangoMalo}>
            {bajando ? 'Descargando…' : 'Descargar CSV'}
          </Button>
        </Card>
      </section>

      <section className="flex w-full flex-col gap-3">
        <div className="flex w-full flex-col gap-1 leading-[normal]">
          <h2 className="font-jakarta text-[18px] font-bold text-ink">Procesos de Datos (ETL)</h2>
          <p className="font-jakarta text-[13px] font-normal text-muted">Últimas corridas de los procesos que alimentan los reportes.</p>
        </div>
        <div className="w-full overflow-hidden rounded-xl border border-line bg-white shadow-[0px_2px_10px_0px_rgba(15,23,42,0.05)]">
          <Table minWidth={760}>
            <div className={headRow}>
              <p className="min-w-[200px] flex-1">PROCESO</p>
              <p className="w-[120px] shrink-0">ESTADO</p>
              <p className="w-[160px] shrink-0">ÚLTIMA CORRIDA</p>
              <p className="w-[150px] shrink-0 text-right">FILAS LEÍDAS / ESCRITAS</p>
            </div>
            {(etl.data ?? []).map((r) => {
              const [texto, tono] = ESTADO[r.status] ?? ['—', 'warning'];
              return (
                <div key={r.id} className={bodyRow}>
                  <div className="flex min-w-[200px] flex-1 flex-col gap-0.5">
                    <p className="font-semibold text-ink">{r.name}</p>
                    <p className={cn('text-[12px]', r.error ? 'text-danger' : 'text-muted')}>{r.error ?? r.source}</p>
                  </div>
                  <div className="w-[120px] shrink-0">
                    <Badge tone={tono} size="sm">
                      {texto}
                    </Badge>
                  </div>
                  <p className="w-[160px] shrink-0 text-ink">{fmtDateTime(r.updatedAt)}</p>
                  <p className="w-[150px] shrink-0 text-right text-ink">{`${r.rowsRead.toLocaleString('es')} / ${r.rowsWritten.toLocaleString('es')}`}</p>
                </div>
              );
            })}
            {etl.isPending && <p className={cn(bodyRow, 'text-muted')}>Cargando…</p>}
            {etl.isError && <p className={cn(bodyRow, 'text-danger')}>No se pudo cargar la bitácora del ETL.</p>}
            {etl.isSuccess && etl.data.length === 0 && <p className={cn(bodyRow, 'text-muted')}>Todavía no hay corridas registradas.</p>}
          </Table>
        </div>
      </section>
    </>
  );
}
