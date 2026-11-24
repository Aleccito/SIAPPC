// Pantalla nueva del PR 3: no viene de Figma (en Figma no hay diseño de IA). Consulta libre a la IA
// (REVISION-IA.md, sección 3; C1 a C3 de la sección 10): a la izquierda el paciente, las preguntas rápidas, la
// pregunta y la respuesta; a la derecha "Lo que verá la IA". La consulta exige paciente (`?paciente=` opcional:
// si no viene, se pide elegirlo). Sin acceso a la IA (enfermería, admin) se ve el aviso del 403 y nada más.
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AiConsult, AiContext, AI_TEXT, AppLayout, Card, IconSparkles, useAiAccess } from '../../components';
import { usePatientRows } from '../../data/patients';
import { PATIENT_PARAM } from '../../lib/patientLink';

export default function MedAsistenteIa() {
  const aiAccess = useAiAccess();
  const [params, setParams] = useSearchParams();
  const cedula = params.get(PATIENT_PARAM) ?? '';
  const [question, setQuestion] = useState('');
  const { rows } = usePatientRows();
  const row = rows.find((r) => r.document === cedula);
  const setCedula = (c: string) => setParams(c ? { [PATIENT_PARAM]: c } : {}, { replace: true });

  return (
    <AppLayout breadcrumb="SIAPPC > Asistente IA" title="Asistente IA">
      <div className="flex w-full min-w-0 flex-1 flex-col gap-5 p-4 md:p-8">
        <div className="flex flex-col gap-1">
          <h2 className="flex items-center gap-2 font-jakarta text-[22px] font-extrabold leading-[normal] text-ink">
            <IconSparkles size={20} className="text-primary" />
            Consulta a la IA
          </h2>
          <p className="font-jakarta text-[13px] leading-[1.5] text-muted">Apoyo a la decisión clínica con el modelo local. No guarda nada en el expediente: si adopta una sugerencia, la escribe usted en una nota SOAP.</p>
        </div>

        {aiAccess ? (
          <div className="flex w-full min-w-0 flex-col items-start gap-5 xl:flex-row">
            <Card className="w-full min-w-0 xl:flex-1">
              <AiConsult variant="page" cedula={cedula} onCedulaChange={setCedula} onQuestionChange={setQuestion} />
            </Card>
            <Card className="flex w-full min-w-0 flex-col gap-3 xl:w-[380px] xl:shrink-0">
              <div className="flex flex-col gap-1">
                <h2 className="font-jakarta text-[15px] font-extrabold leading-[normal] text-ink">Lo que verá la IA</h2>
                <p className="font-jakarta text-[12px] leading-[1.45] text-muted">Es lo que el servidor le manda al modelo con esta pregunta: lo mínimo de seguridad siempre y el resto según de qué trate.</p>
              </div>
              <AiContext row={row} question={question} />
            </Card>
          </div>
        ) : (
          <Card>
            <p role="alert" className="font-jakarta text-[14px] font-semibold leading-[1.5] text-ink">
              {AI_TEXT.forbidden}
            </p>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
