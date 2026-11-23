import { useState } from 'react';
import { Button } from '../ui/Button';
import { Modal, ModalHeader } from '../ui/Modal';
import { Select } from '../ui/Select';

/** Pacientes de ejemplo que esperan cama en UCI. */
export const WAITING_PATIENTS = ['Andrés Castro (Urgencias)', 'Gabriela Ruiz (Urgencias)', 'Pedro Sánchez (Quirófano)'];

type AssignBedModalProps = {
  open: boolean;
  bed: string;
  onClose: () => void;
  /** Recibe el nombre del paciente elegido (sin la procedencia). */
  onAssign: (patient: string) => void;
};

/** Ventana para asignar un paciente en espera a una cama libre. */
export function AssignBedModal({ open, bed, onClose, onAssign }: AssignBedModalProps) {
  const [patient, setPatient] = useState(WAITING_PATIENTS[0]);
  return (
    <Modal labelledBy="asignar-cama-titulo" open={open} onClose={onClose} width={440} className="gap-4 p-5 shadow-xl sm:p-6">
      <ModalHeader id="asignar-cama-titulo" title={`Asignar paciente a ${bed}`} onClose={onClose} />
      <p className="font-jakarta text-[14px] font-normal leading-[1.5] text-muted">Elige un paciente en espera de cama en UCI.</p>
      <Select variant="input" fieldLabel="Paciente" options={WAITING_PATIENTS} value={patient} onChange={setPatient} />
      <div className="flex w-full flex-wrap justify-end gap-3 pt-1">
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={() => onAssign(patient.replace(/ \(.*\)$/, ''))}>Asignar cama</Button>
      </div>
    </Modal>
  );
}
