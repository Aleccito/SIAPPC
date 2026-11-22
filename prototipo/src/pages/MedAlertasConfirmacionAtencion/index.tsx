// Pantalla "med/alertas/confirmacion-atencion" (Figma node 245:631) — generada desde el diseño original de Figma.
import { Link } from 'react-router-dom';
import imgAvatar24Png from '../../assets/avatar-24.png';
import imgBell3 from '../../assets/bell-3.svg';
import imgBell4 from '../../assets/bell-4.svg';
import imgChevronDown from '../../assets/chevron-down.svg';
import imgDoctorFooterLine5 from '../../assets/doctor-footer-line-5.svg';
import imgHelpIconEllipse from '../../assets/help-icon-ellipse.svg';
import imgLayoutDashboard from '../../assets/layout-dashboard.svg';
import imgLogOut from '../../assets/log-out.svg';
import imgMenuItemAlertasFrame2 from '../../assets/menu-item-alertas-frame-2.svg';
import imgMenuItemDispositivosFrame from '../../assets/menu-item-dispositivos-frame.svg';
import imgMenuItemMonitoreoFrame from '../../assets/menu-item-monitoreo-frame.svg';
import imgMenuItemPacientesFrame from '../../assets/menu-item-pacientes-frame.svg';
import imgMenuItemReportesFrame from '../../assets/menu-item-reportes-frame.svg';
import imgMockAlertRowEllipse from '../../assets/mock-alert-row-ellipse.svg';
import imgModalCardLine from '../../assets/modal-card-line.svg';
import imgSearch2 from '../../assets/search-2.svg';
import imgX2 from '../../assets/x-2.svg';

export default function MedAlertasConfirmacionAtencion() {
  return (
    <div className="content-stretch flex h-[900px] items-start relative shrink-0 w-[1440px]" data-name="med/alertas/confirmacion-atencion">
      <div className="absolute bg-[#f8fafc] content-stretch flex h-[900px] items-start left-0 overflow-clip top-0 w-[1440px]" data-name="med-alertas-confirmacion-atencion">
        <div className="bg-[#0f172a] border-[#1e293b] border-r border-solid content-stretch flex flex-col h-full items-start justify-between px-[16px] py-[24px] relative shrink-0 w-[240px]" data-name="sidebar">
          <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-full" data-name="top-group">
            <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="brand">
              <div className="bg-[#2563eb] content-stretch flex flex-col items-center justify-center relative rounded-[8px] shrink-0 size-[32px]" data-name="logo-mark">
                <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">S</p>
              </div>
              <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px relative whitespace-nowrap" data-name="wordmark">
                <p className="font-jakarta font-extrabold relative shrink-0 text-[16px] text-white">SIAPPC</p>
                <p className="font-jakarta font-semibold overflow-hidden relative shrink-0 text-[#94a3b8] text-[10px] text-ellipsis uppercase">CUIDADO CRÍTICO</p>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="menu">
              <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Dashboard" to="/MedDashboardPrincipal">
                <div className="relative shrink-0 size-[18px]" data-name="Frame">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgLayoutDashboard} />
                </div>
                <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Dashboard</p>
              </Link>
              <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Pacientes" to="/MedPacientesLista">
                <div className="relative shrink-0 size-[18px]" data-name="Frame">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgMenuItemPacientesFrame} />
                </div>
                <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Pacientes</p>
              </Link>
              <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Monitoreo" to="/MedMonitoreoGridUci">
                <div className="relative shrink-0 size-[18px]" data-name="Frame">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgMenuItemMonitoreoFrame} />
                </div>
                <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Monitoreo</p>
              </Link>
              <Link className="bg-[rgba(37,99,235,0.15)] content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Alertas" to="/MedAlertasCentro">
                <div className="relative shrink-0 size-[18px]" data-name="Frame">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgMenuItemAlertasFrame2} />
                </div>
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">Alertas</p>
              </Link>
              <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Reportes" to="/MedReportesPanel">
                <div className="relative shrink-0 size-[18px]" data-name="Frame">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgMenuItemReportesFrame} />
                </div>
                <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Reportes</p>
              </Link>
              <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Dispositivos" to="/MedDispositivosMonitores">
                <div className="relative shrink-0 size-[18px]" data-name="Frame">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgMenuItemDispositivosFrame} />
                </div>
                <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Dispositivos</p>
              </Link>
            </div>
          </div>
          <Link className="absolute left-[20px] opacity-25 size-[18px] top-[790px]" data-name="help-icon" to="/MedAyudaSoporte">
            <div className="absolute left-0 size-[18px] top-0" data-name="Ellipse">
              <div className="absolute inset-[-4.17%]">
                <img className="block max-w-none size-full" alt="" src={imgHelpIconEllipse} />
              </div>
            </div>
            <p className="[word-break:break-word] absolute font-geist font-bold leading-[normal] left-[5.5px] text-[#64748b] text-[11px] top-[1.5px] whitespace-nowrap">?</p>
          </Link>
          <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="doctor-footer">
            <div className="h-0 relative shrink-0 w-full" data-name="Line">
              <div className="absolute inset-[-1px_0_0_0]">
                <img className="block max-w-none size-full" alt="" src={imgDoctorFooterLine5} />
              </div>
            </div>
            <Link className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="user-profile" to="/MedPerfilMiPerfil">
              <div className="relative rounded-[20px] shrink-0 size-[40px]" data-name="avatar">
                <img className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[20px] size-full" alt="" src={imgAvatar24Png} />
              </div>
              <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px relative whitespace-nowrap" data-name="user-info">
                <p className="font-jakarta font-bold overflow-hidden relative shrink-0 text-[13px] text-ellipsis text-white">Dr. Roberto Silva</p>
                <p className="font-jakarta font-medium overflow-hidden relative shrink-0 text-[#64748b] text-[11px] text-ellipsis">Médico Especialista</p>
              </div>
              <div className="relative shrink-0 size-[18px]" data-name="log-out">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgLogOut} />
              </div>
            </Link>
          </div>
        </div>
        <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start min-w-px relative" data-name="main-container-bg">
          <div className="bg-white border-[#e2e8f0] border-b border-solid content-stretch flex h-[72px] items-center justify-between px-[32px] relative shrink-0 w-full" data-name="top-bar">
            <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] relative shrink-0 whitespace-nowrap" data-name="title-breadcrumb">
              <p className="font-jakarta font-medium relative shrink-0 text-[#64748b] text-[11px]">{`SIAPPC > Alertas`}</p>
              <p className="font-jakarta font-extrabold relative shrink-0 text-[#0f172a] text-[20px]">Centro de Control de Alertas</p>
            </div>
            <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="right-actions-custom">
              <Link className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative rounded-[8px] shrink-0 w-[280px]" data-name="search-mimic" to="/MedBusquedaGlobal">
                <div className="relative shrink-0 size-[14px]" data-name="search">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgSearch2} />
                </div>
                <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-normal leading-[normal] min-w-px relative text-[#94a3b8] text-[13px]">Buscar paciente, HC...</p>
              </Link>
              <Link className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex items-start p-[8px] relative rounded-[999px] shrink-0" data-name="bell-icon-wrapper" to="/MedNotificacionesCentro">
                <div className="relative shrink-0 size-[18px]" data-name="bell">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBell3} />
                </div>
                <div className="absolute bg-[#ef4444] content-stretch flex items-center justify-center right-[-3px] rounded-[8px] size-[16px] top-[-3px]" data-name="unread-badge">
                  <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[9px] text-white whitespace-nowrap">3</p>
                </div>
              </Link>
            </div>
          </div>
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-start min-h-px p-[32px] relative w-full" data-name="mock-alerts-body">
            <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[18px] whitespace-nowrap">Monitoreo Crítico Activo</p>
            <div className="bg-white border border-[#ef4444] border-solid content-stretch flex gap-[12px] items-start p-[16px] relative rounded-[8px] shrink-0 w-full" data-name="mock-alert-row">
              <div className="relative shrink-0 size-[10px]" data-name="Ellipse">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgMockAlertRowEllipse} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap">SpO2 por debajo de umbral de seguridad en Cama D3</p>
            </div>
          </div>
        </div>
        <div className="absolute bg-[rgba(0,0,0,0.4)] content-stretch flex h-[900px] items-center justify-center left-0 top-0 w-[1440px]" data-name="modal-backdrop">
          <div className="bg-white content-stretch drop-shadow-[0px_16px_16px_rgba(0,0,0,0.25)] flex flex-col gap-[20px] items-start p-[24px] relative rounded-[12px] shrink-0 w-[480px]" data-name="modal-card">
            <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="modal-header">
              <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="title-with-icon">
                <div className="bg-[#fef2f2] content-stretch flex flex-col items-center justify-center relative rounded-[16px] shrink-0 size-[32px]" data-name="alert-icon-red">
                  <div className="relative shrink-0 size-[16px]" data-name="bell">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBell4} />
                  </div>
                </div>
                <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[16px] whitespace-nowrap">Confirmar Atención de Alerta</p>
              </div>
              <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Frame">
                <div className="absolute left-0 size-[12px] top-0" data-name="x">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgX2} />
                </div>
              </div>
            </div>
            <div className="[word-break:break-word] bg-[#fef2f2] content-stretch flex flex-col gap-[8px] items-start p-[16px] relative rounded-[8px] shrink-0 w-full whitespace-nowrap" data-name="alert-summary-box">
              <p className="font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#ef4444] text-[14px]">Alerta Crítica — SpO2 por debajo de umbral (86%)</p>
              <div className="content-stretch flex flex-col font-jakarta font-normal gap-[4px] items-start relative shrink-0 w-full" data-name="Frame">
                <p className="leading-[0] relative shrink-0 text-[#0f172a] text-[13px]"><span className="font-jakarta font-bold leading-[normal]">Paciente:</span><span className="leading-[normal]">{` María González — UCI Cama D3`}</span></p>
                <p className="leading-[normal] relative shrink-0 text-[#64748b] text-[12px]">Activada hace 8 minutos (14:32 hrs)</p>
              </div>
            </div>
            <div className="h-0 relative shrink-0 w-full" data-name="Line">
              <div className="absolute inset-[-1px_0_0_0]">
                <img className="block max-w-none size-full" alt="" src={imgModalCardLine} />
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="attention-form">
              <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-name="form-group-action">
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">Acción tomada *</p>
                <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex flex-col h-[80px] items-start p-[12px] relative rounded-[8px] shrink-0 w-full" data-name="textarea-action">
                  <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#94a3b8] text-[13px] w-full">Describa la acción clínica realizada...</p>
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-name="form-group-classification">
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">Clasificación de Alerta</p>
                <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-center justify-between px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="dropdown-selector">
                  <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">Alerta verdadera atendida</p>
                  <div className="relative shrink-0 size-[14px]" data-name="chevron-down">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChevronDown} />
                  </div>
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-name="form-group-notes">
                <p className="[word-break:break-word] font-jakarta font-bold leading-[0] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap"><span className="leading-[normal]">{`Notas adicionales `}</span><span className="font-jakarta font-medium leading-[normal] text-[#64748b]">(Opcional)</span></p>
                <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex flex-col h-[50px] items-start p-[12px] relative rounded-[8px] shrink-0 w-full" data-name="textarea-notes">
                  <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#94a3b8] text-[12px] w-full">Observaciones secundarias...</p>
                </div>
              </div>
            </div>
            <div className="content-stretch flex gap-[12px] items-start justify-end relative shrink-0 w-full" data-name="modal-footer">
              <div className="border border-[#e2e8f0] border-solid content-stretch flex items-start px-[16px] py-[10px] relative rounded-[8px] shrink-0" data-name="btn-cancelar">
                <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">Cancelar</p>
              </div>
              <div className="bg-[#2563eb] content-stretch flex items-start px-[16px] py-[10px] relative rounded-[8px] shrink-0" data-name="btn-confirmar">
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[13px] text-white whitespace-nowrap">Confirmar Atención</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
