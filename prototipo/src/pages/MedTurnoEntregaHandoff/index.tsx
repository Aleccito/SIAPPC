// Pantalla "med/turno/entrega-handoff" (Figma node 137:356) — generada desde el diseño original de Figma.
import { Link } from 'react-router-dom';
import imgActivity from '../../assets/activity.svg';
import imgAvatar26Png from '../../assets/avatar-26.png';
import imgBell from '../../assets/bell.svg';
import imgCpu from '../../assets/cpu.svg';
import imgDoctorFooterLine2 from '../../assets/doctor-footer-line-2.svg';
import imgFileText11 from '../../assets/file-text-11.svg';
import imgHelpIconEllipse from '../../assets/help-icon-ellipse.svg';
import imgIconwrapper from '../../assets/iconwrapper.svg';
import imgInfo from '../../assets/info.svg';
import imgLayoutDashboard from '../../assets/layout-dashboard.svg';
import imgLogOut from '../../assets/log-out.svg';
import imgRecAvatarPng from '../../assets/rec-avatar.png';
import imgRecipientCardLine from '../../assets/recipient-card-line.svg';
import imgSummaryRowLine from '../../assets/summary-row-line.svg';
import imgTabsLine from '../../assets/tabs-line.svg';
import imgUsers2 from '../../assets/users-2.svg';

export default function MedTurnoEntregaHandoff() {
  return (
    <div className="bg-[#f8fafc] content-stretch flex items-start min-h-[900px] relative shrink-0 w-[1440px]" data-name="med/turno/entrega-handoff">
      <div className="bg-[#0f172a] border-[#1e293b] border-r border-solid content-stretch flex flex-col items-start justify-between px-[16px] py-[24px] relative self-stretch shrink-0 w-[240px]" data-name="sidebar">
        <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-full" data-name="top-group">
          <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="brand">
            <div className="bg-[#2563eb] content-stretch flex flex-col items-center justify-center relative rounded-[8px] shrink-0 size-[32px]" data-name="logo-mark">
              <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">S</p>
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px relative whitespace-nowrap" data-name="wordmark">
              <p className="font-jakarta font-extrabold relative shrink-0 text-[16px] text-white">SIAPPC</p>
              <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[10px] uppercase">CUIDADO CRÍTICO</p>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="menu">
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Dashboard" to="/MedDashboardPrincipal">
              <div className="relative shrink-0 size-[18px]" data-name="layout-dashboard">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgLayoutDashboard} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Dashboard</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Pacientes" to="/MedPacientesLista">
              <div className="relative shrink-0 size-[18px]" data-name="users">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgUsers2} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Pacientes</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Monitoreo" to="/MedMonitoreoGridUci">
              <div className="relative shrink-0 size-[18px]" data-name="activity">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgActivity} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Monitoreo</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Alertas" to="/MedAlertasCentro">
              <div className="relative shrink-0 size-[18px]" data-name="bell">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBell} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Alertas</p>
            </Link>
            <Link className="bg-[rgba(37,99,235,0.15)] content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Reportes" to="/MedReportesPanel">
              <div className="relative shrink-0 size-[18px]" data-name="file-text">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgFileText11} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">Reportes</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Dispositivos" to="/MedDispositivosMonitores">
              <div className="relative shrink-0 size-[18px]" data-name="cpu">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgCpu} />
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
              <img className="block max-w-none size-full" alt="" src={imgDoctorFooterLine2} />
            </div>
          </div>
          <Link className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="user-profile" to="/MedPerfilMiPerfil">
            <div className="relative rounded-[20px] shrink-0 size-[40px]" data-name="avatar">
              <img className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[20px] size-full" alt="" src={imgAvatar26Png} />
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px relative whitespace-nowrap" data-name="user-info">
              <p className="font-jakarta font-bold overflow-hidden relative shrink-0 text-[13px] text-ellipsis text-white">Dr. Carlos Méndez</p>
              <p className="font-jakarta font-medium overflow-hidden relative shrink-0 text-[#64748b] text-[11px] text-ellipsis">Médico Intensivista</p>
            </div>
            <div className="relative shrink-0 size-[18px]" data-name="log-out">
              <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgLogOut} />
            </div>
          </Link>
        </div>
      </div>
      <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative self-stretch" data-name="main-container">
        <div className="bg-white border-[#e2e8f0] border-b border-solid content-stretch flex h-[72px] items-center justify-between px-[32px] relative shrink-0 w-full" data-name="top-bar">
          <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] relative shrink-0 whitespace-nowrap" data-name="title-breadcrumb">
            <p className="font-jakarta font-medium relative shrink-0 text-[#64748b] text-[12px]">{`SIAPPC > Resumen de Turno`}</p>
            <p className="font-jakarta font-extrabold relative shrink-0 text-[#0f172a] text-[20px]">Entrega de Turno — Matutino</p>
          </div>
          <div className="content-stretch flex gap-[20px] items-center overflow-clip relative shrink-0" data-name="right-actions">
            <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="actions">
              <div className="bg-[#f1f5f9] content-stretch flex items-start px-[12px] py-[6px] relative rounded-[6px] shrink-0" data-name="shift-badge">
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap">Turno: 07:00 - 15:00</p>
              </div>
              <div className="bg-[#2563eb] content-stretch flex items-start px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="btn-generate">
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[13px] text-white whitespace-nowrap">Generar Reporte</p>
              </div>
            </div>
            <Link className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex items-center justify-center relative rounded-[18px] shrink-0 size-[36px]" data-name="notification-bell" to="/MedNotificacionesCentro">
              <div className="relative shrink-0 size-[18px]" data-name="IconWrapper">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgIconwrapper} />
              </div>
              <div className="absolute bg-[#ef4444] content-stretch flex items-center justify-center right-[-3px] rounded-[8px] size-[16px] top-[-3px]" data-name="red-badge">
                <p className="[word-break:break-word] font-geist font-extrabold leading-[normal] relative shrink-0 text-[10px] text-white whitespace-nowrap">3</p>
              </div>
            </Link>
          </div>
        </div>
        <div className="content-stretch flex flex-col items-start px-[32px] relative shrink-0 w-full" data-name="tabs">
          <div className="content-stretch flex flex-col items-start pt-[16px] px-[32px] relative shrink-0 w-full" data-name="tabs">
            <div className="content-stretch flex gap-[24px] items-end relative shrink-0 w-full" data-name="tabs-row">
              <div className="content-stretch flex flex-col gap-[10px] items-start pb-[8px] relative shrink-0" data-name="tab-nueva-entrega">
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[13px] whitespace-nowrap">Nueva Entrega</p>
                <div className="bg-[#2563eb] h-[2px] relative shrink-0 w-full" data-name="inactive-indicator" />
              </div>
              <div className="content-stretch flex flex-col gap-[10px] items-start pb-[8px] relative shrink-0" data-name="tab-historial">
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Historial de Entregas</p>
                <div className="bg-[rgba(0,0,0,0)] h-[2px] relative rounded-[1px] shrink-0 w-full" data-name="active-indicator" />
              </div>
            </div>
            <div className="h-0 relative shrink-0 w-full" data-name="Line">
              <div className="absolute inset-[-1px_0_0_0]">
                <img className="block max-w-none size-full" alt="" src={imgTabsLine} />
              </div>
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-[1_0_0] gap-[20px] items-start min-h-px p-[24px] relative w-full" data-name="page-body">
          <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-[740px]" data-name="left-content">
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex gap-[12px] items-center p-[16px] relative rounded-[12px] shrink-0 w-full" data-name="summary-row">
              <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap">7 pacientes a cargo</p>
              <div className="flex h-[16px] items-center justify-center relative shrink-0 w-0">
                <div className="flex-none rotate-90">
                  <div className="h-0 relative w-[16px]" data-name="Line">
                    <div className="absolute inset-[-1px_0_0_0]">
                      <img className="block max-w-none size-full" alt="" src={imgSummaryRowLine} />
                    </div>
                  </div>
                </div>
              </div>
              <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#ef4444] text-[14px] whitespace-nowrap">2 críticos</p>
              <div className="flex h-[16px] items-center justify-center relative shrink-0 w-0">
                <div className="flex-none rotate-90">
                  <div className="h-0 relative w-[16px]" data-name="Line">
                    <div className="absolute inset-[-1px_0_0_0]">
                      <img className="block max-w-none size-full" alt="" src={imgSummaryRowLine} />
                    </div>
                  </div>
                </div>
              </div>
              <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[14px] whitespace-nowrap">3 en monitoreo</p>
              <div className="flex h-[16px] items-center justify-center relative shrink-0 w-0">
                <div className="flex-none rotate-90">
                  <div className="h-0 relative w-[16px]" data-name="Line">
                    <div className="absolute inset-[-1px_0_0_0]">
                      <img className="block max-w-none size-full" alt="" src={imgSummaryRowLine} />
                    </div>
                  </div>
                </div>
              </div>
              <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#10b981] text-[14px] whitespace-nowrap">2 estables</p>
              <div className="flex h-[16px] items-center justify-center relative shrink-0 w-0">
                <div className="flex-none rotate-90">
                  <div className="h-0 relative w-[16px]" data-name="Line">
                    <div className="absolute inset-[-1px_0_0_0]">
                      <img className="block max-w-none size-full" alt="" src={imgSummaryRowLine} />
                    </div>
                  </div>
                </div>
              </div>
              <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#f59e0b] text-[14px] whitespace-nowrap">4 tareas pendientes</p>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[12px] items-start p-[20px] relative rounded-[12px] shrink-0 w-full" data-name="table-card">
              <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap">Pacientes de Entrega Directa</p>
              <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="handoff-table">
                <div className="[word-break:break-word] bg-[#f1f5f9] content-stretch flex font-jakarta font-bold gap-[8px] items-start leading-[normal] p-[10px] relative shrink-0 text-[#64748b] text-[11px] w-full" data-name="thead">
                  <p className="relative shrink-0 w-[60px]">CAMA</p>
                  <p className="relative shrink-0 w-[130px]">PACIENTE</p>
                  <p className="relative shrink-0 w-[90px]">ESTADO</p>
                  <p className="relative shrink-0 w-[220px]">NOVEDADES DEL TURNO</p>
                  <p className="flex-[1_0_0] min-w-px relative">PENDIENTES</p>
                </div>
                <div className="border-[#e2e8f0] border-b border-solid content-stretch flex gap-[8px] items-center p-[10px] relative shrink-0 w-full" data-name="tr">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[60px]">C-02</p>
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] overflow-hidden relative shrink-0 text-[#0f172a] text-[13px] text-ellipsis w-[130px] whitespace-nowrap">Mercedes García</p>
                  <div className="bg-[#fef2f2] content-stretch flex items-start justify-center px-[6px] py-[2px] relative rounded-[4px] shrink-0 w-[90px]" data-name="est-badge">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#ef4444] text-[11px] whitespace-nowrap">Crítico</p>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] overflow-hidden relative shrink-0 text-[#64748b] text-[12px] text-ellipsis w-[220px] whitespace-nowrap">Disminución leve de SatO2 temporal</p>
                  <div className="bg-[#fffbeb] content-stretch flex flex-[1_0_0] items-start min-w-px px-[8px] py-[2px] relative rounded-[6px]" data-name="pend-chip">
                    <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] overflow-hidden relative shrink-0 text-[#f59e0b] text-[11px] text-ellipsis whitespace-nowrap">Chequear gasometría 16:00</p>
                  </div>
                </div>
                <div className="border-[#e2e8f0] border-b border-solid content-stretch flex gap-[8px] items-center p-[10px] relative shrink-0 w-full" data-name="tr">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[60px]">C-03</p>
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] overflow-hidden relative shrink-0 text-[#0f172a] text-[13px] text-ellipsis w-[130px] whitespace-nowrap">María González</p>
                  <div className="bg-[#fef2f2] content-stretch flex items-start justify-center px-[6px] py-[2px] relative rounded-[4px] shrink-0 w-[90px]" data-name="est-badge">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#ef4444] text-[11px] whitespace-nowrap">Crítico</p>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] overflow-hidden relative shrink-0 text-[#64748b] text-[12px] text-ellipsis w-[220px] whitespace-nowrap">Inestabilidad hemodinámica, noradrenalina ↑</p>
                  <div className="bg-[#fef2f2] content-stretch flex flex-[1_0_0] items-start min-w-px px-[8px] py-[2px] relative rounded-[6px]" data-name="pend-chip">
                    <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] overflow-hidden relative shrink-0 text-[#ef4444] text-[11px] text-ellipsis whitespace-nowrap">{`Ajustar dosis PAM > 65`}</p>
                  </div>
                </div>
                <div className="border-[#e2e8f0] border-b border-solid content-stretch flex gap-[8px] items-center p-[10px] relative shrink-0 w-full" data-name="tr">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[60px]">C-05</p>
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] overflow-hidden relative shrink-0 text-[#0f172a] text-[13px] text-ellipsis w-[130px] whitespace-nowrap">Juan Pérez</p>
                  <div className="bg-[rgba(37,99,235,0.15)] content-stretch flex items-start justify-center px-[6px] py-[2px] relative rounded-[4px] shrink-0 w-[90px]" data-name="est-badge">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[11px] whitespace-nowrap">Monitoreo</p>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] overflow-hidden relative shrink-0 text-[#64748b] text-[12px] text-ellipsis w-[220px] whitespace-nowrap">Extubación exitosa 09:15 AM</p>
                  <div className="bg-[#ecfdf5] content-stretch flex flex-[1_0_0] items-start min-w-px px-[8px] py-[2px] relative rounded-[6px]" data-name="pend-chip">
                    <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] overflow-hidden relative shrink-0 text-[#10b981] text-[11px] text-ellipsis whitespace-nowrap">Monitorear patrón resp.</p>
                  </div>
                </div>
                <div className="border-[#e2e8f0] border-b border-solid content-stretch flex gap-[8px] items-center p-[10px] relative shrink-0 w-full" data-name="tr">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[60px]">C-09</p>
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] overflow-hidden relative shrink-0 text-[#0f172a] text-[13px] text-ellipsis w-[130px] whitespace-nowrap">Francisco Díaz</p>
                  <div className="bg-[#fef2f2] content-stretch flex items-start justify-center px-[6px] py-[2px] relative rounded-[4px] shrink-0 w-[90px]" data-name="est-badge">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#ef4444] text-[11px] whitespace-nowrap">Crítico</p>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] overflow-hidden relative shrink-0 text-[#64748b] text-[12px] text-ellipsis w-[220px] whitespace-nowrap">Taquicardia persistente</p>
                  <div className="bg-[#fef2f2] content-stretch flex flex-[1_0_0] items-start min-w-px px-[8px] py-[2px] relative rounded-[6px]" data-name="pend-chip">
                    <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] overflow-hidden relative shrink-0 text-[#ef4444] text-[11px] text-ellipsis whitespace-nowrap">Revisar ECG continuo</p>
                  </div>
                </div>
                <div className="border-[#e2e8f0] border-b border-solid content-stretch flex gap-[8px] items-center p-[10px] relative shrink-0 w-full" data-name="tr">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[60px]">C-11</p>
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] overflow-hidden relative shrink-0 text-[#0f172a] text-[13px] text-ellipsis w-[130px] whitespace-nowrap">Sofía Martínez</p>
                  <div className="bg-[#ecfdf5] content-stretch flex items-start justify-center px-[6px] py-[2px] relative rounded-[4px] shrink-0 w-[90px]" data-name="est-badge">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#10b981] text-[11px] whitespace-nowrap">Estable</p>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] overflow-hidden relative shrink-0 text-[#64748b] text-[12px] text-ellipsis w-[220px] whitespace-nowrap">Sonda vesical reinstalada</p>
                  <div className="bg-[#ecfdf5] content-stretch flex flex-[1_0_0] items-start min-w-px px-[8px] py-[2px] relative rounded-[6px]" data-name="pend-chip">
                    <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] overflow-hidden relative shrink-0 text-[#10b981] text-[11px] text-ellipsis whitespace-nowrap">Control de diuresis cada 2h</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[12px] items-start p-[20px] relative rounded-[12px] shrink-0 w-full" data-name="notes-card">
              <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap">Notas Generales de Entrega</p>
              <div className="bg-[#f1f5f9] border border-[#e2e8f0] border-solid content-stretch flex h-[100px] items-start p-[12px] relative rounded-[8px] shrink-0 w-full" data-name="textarea">
                <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-normal leading-[1.5] min-w-px relative text-[#0f172a] text-[13px]">Se entrega guardia con 7 pacientes. Cama 3 (María González) se mantiene con soporte vasopresor ajustado. Se sugiere evaluar diuresis acumulada en turno vespertino y valorar retiro de sedación progresivo si PAM se mantiene estable.</p>
              </div>
              <div className="content-stretch flex gap-[12px] items-start justify-end relative shrink-0 w-full" data-name="actions">
                <div className="border border-[#e2e8f0] border-solid content-stretch flex items-start px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="btn-save">
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Guardar Borrador</p>
                </div>
                <div className="bg-[#10b981] content-stretch flex items-start px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="btn-confirm">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[13px] text-white whitespace-nowrap">Confirmar Entrega de Turno</p>
                </div>
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-col items-start relative shrink-0 w-[360px]" data-name="right-content">
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[16px] items-start p-[24px] relative rounded-[12px] shrink-0 w-full" data-name="recipient-card">
              <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap">Médico Receptor Designado</p>
              <div className="h-0 relative shrink-0 w-full" data-name="Line">
                <div className="absolute inset-[-1px_0_0_0]">
                  <img className="block max-w-none size-full" alt="" src={imgRecipientCardLine} />
                </div>
              </div>
              <div className="bg-[#f1f5f9] content-stretch flex gap-[12px] items-center p-[12px] relative rounded-[8px] shrink-0 w-full" data-name="recipient-info">
                <div className="relative rounded-[24px] shrink-0 size-[48px]" data-name="rec-avatar">
                  <img className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[24px] size-full" alt="" src={imgRecAvatarPng} />
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 whitespace-nowrap" data-name="rec-meta">
                  <p className="font-jakarta font-bold relative shrink-0 text-[#0f172a] text-[14px]">Dra. Ana Gómez</p>
                  <p className="font-jakarta font-normal relative shrink-0 text-[#64748b] text-[12px]">Turno Vespertino (15:00 - 23:00)</p>
                </div>
              </div>
              <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full" data-name="disclaimer-info">
                <div className="relative shrink-0 size-[16px]" data-name="info">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgInfo} />
                </div>
                <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-normal leading-[1.4] min-w-px relative text-[#64748b] text-[12px]">Al confirmar, el sistema notificará automáticamente a la Dra. Ana Gómez para la recepción de expediente clínico y firma digital.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
