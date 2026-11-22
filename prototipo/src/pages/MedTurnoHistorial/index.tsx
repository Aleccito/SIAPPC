// Pantalla "med-turno-historial" (Figma node 259:15) — generada desde el diseño original de Figma.
import { Link } from 'react-router-dom';
import imgActivity from '../../assets/activity.svg';
import imgAvatar26Png from '../../assets/avatar-26.png';
import imgBell from '../../assets/bell.svg';
import imgChevronDown5 from '../../assets/chevron-down-5.svg';
import imgCpu from '../../assets/cpu.svg';
import imgDoctorFooterLine2 from '../../assets/doctor-footer-line-2.svg';
import imgFileText11 from '../../assets/file-text-11.svg';
import imgHelpIconEllipse from '../../assets/help-icon-ellipse.svg';
import imgLayoutDashboard from '../../assets/layout-dashboard.svg';
import imgNotificationBellVector from '../../assets/notification-bell-vector.svg';
import imgSearchMimicVector from '../../assets/search-mimic-vector.svg';
import imgTabsLine2 from '../../assets/tabs-line-2.svg';
import imgUsers2 from '../../assets/users-2.svg';
import imgVacio from '../../assets/vacio.svg';

export default function MedTurnoHistorial() {
  return (
    <div className="bg-[#f8fafc] content-stretch flex items-start min-h-[900px] overflow-clip relative shrink-0 w-[1440px]" data-name="med-turno-historial">
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
            <div className="relative shrink-0 size-[18px]" data-name="Vector">
              <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgVacio} />
            </div>
          </Link>
        </div>
      </div>
      <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative self-stretch" data-name="main-container">
        <div className="bg-white border-[#e2e8f0] border-b border-solid content-stretch flex h-[72px] items-center justify-between px-[32px] relative shrink-0 w-full" data-name="top-bar">
          <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] relative shrink-0 whitespace-nowrap" data-name="title-breadcrumb">
            <p className="font-jakarta font-medium relative shrink-0 text-[#64748b] text-[11px]">{`SIAPPC > Resumen de Turno`}</p>
            <p className="font-jakarta font-extrabold relative shrink-0 text-[#0f172a] text-[20px]">Entrega de Turno — Historial</p>
          </div>
          <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="right-actions">
            <Link className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative rounded-[8px] shrink-0 w-[280px]" data-name="search-mimic" to="/MedBusquedaGlobal">
              <div className="relative shrink-0 size-[14px]" data-name="Vector">
                <div className="absolute inset-[0_11.11%_11.11%_0]">
                  <img className="block max-w-none size-full" alt="" src={imgSearchMimicVector} />
                </div>
              </div>
              <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-normal leading-[normal] min-w-px relative text-[#94a3b8] text-[13px]">Buscar entrega, médico, cama...</p>
            </Link>
            <Link className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex items-center justify-center relative rounded-[18px] shrink-0 size-[36px]" data-name="notification-bell" to="/MedNotificacionesCentro">
              <div className="relative shrink-0 size-[18px]" data-name="Vector">
                <div className="absolute bottom-1/4 left-0 right-0 top-0">
                  <img className="block max-w-none size-full" alt="" src={imgNotificationBellVector} />
                </div>
              </div>
              <div className="absolute bg-[#ef4444] content-stretch flex items-center justify-center right-[-3px] rounded-[8px] size-[16px] top-[-3px]" data-name="red-badge">
                <p className="[word-break:break-word] font-inter font-extrabold leading-[normal] not-italic relative shrink-0 text-[10px] text-white whitespace-nowrap">3</p>
              </div>
            </Link>
          </div>
        </div>
        <div className="content-stretch flex flex-col items-start pt-[16px] px-[32px] relative shrink-0 w-full" data-name="tabs">
          <div className="content-stretch flex gap-[24px] items-end relative shrink-0 w-full" data-name="tabs-row">
            <div className="content-stretch flex flex-col gap-[10px] items-start pb-[8px] relative shrink-0" data-name="tab-nueva-entrega">
              <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Nueva Entrega</p>
              <div className="bg-[rgba(0,0,0,0)] h-[2px] relative shrink-0 w-full" data-name="inactive-indicator" />
            </div>
            <div className="content-stretch flex flex-col gap-[10px] items-start pb-[8px] relative shrink-0" data-name="tab-historial">
              <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[13px] whitespace-nowrap">Historial de Entregas</p>
              <div className="bg-[#2563eb] h-[2px] relative rounded-[1px] shrink-0 w-full" data-name="active-indicator" />
            </div>
          </div>
          <div className="h-0 relative shrink-0 w-full" data-name="Line">
            <div className="absolute inset-[-1px_0_0_0]">
              <img className="block max-w-none size-full" alt="" src={imgTabsLine2} />
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px p-[32px] relative w-full" data-name="page-body">
          <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[20px] items-start p-[24px] relative rounded-[12px] shrink-0 w-full" data-name="history-table-card">
            <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="table-filters">
              <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="left-filters">
                <div className="border border-[#e2e8f0] border-solid content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative rounded-[6px] shrink-0" data-name="filter-date">
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Fecha:</p>
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">Últimos 7 días</p>
                  <div className="h-[6px] relative shrink-0 w-[10px]" data-name="chevron-down">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChevronDown5} />
                  </div>
                </div>
                <div className="border border-[#e2e8f0] border-solid content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative rounded-[6px] shrink-0" data-name="filter-turno">
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Turno:</p>
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">Todos los turnos</p>
                  <div className="h-[6px] relative shrink-0 w-[10px]" data-name="chevron-down">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChevronDown5} />
                  </div>
                </div>
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Mostrando registros auditados de la UCI</p>
            </div>
            <div className="border border-[#e2e8f0] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[8px] shrink-0 w-full" data-name="handoff-table">
              <div className="[word-break:break-word] bg-[#f8fafc] border-[#e2e8f0] border-b border-solid content-stretch flex font-jakarta font-bold gap-[8px] items-start leading-[normal] p-[12px] relative shrink-0 text-[#64748b] text-[11px] uppercase w-full" data-name="thead">
                <p className="relative shrink-0 w-[160px]">Fecha</p>
                <p className="relative shrink-0 w-[200px]">Turno</p>
                <p className="relative shrink-0 w-[180px]">Entregó</p>
                <p className="relative shrink-0 w-[180px]">Recibió</p>
                <p className="relative shrink-0 w-[100px]">Pacientes</p>
                <p className="relative shrink-0 w-[120px]">Estado</p>
                <p className="flex-[1_0_0] min-w-px relative text-right">Acción</p>
              </div>
              <div className="border-[#e2e8f0] border-b border-solid content-stretch flex gap-[8px] items-center p-[14px] relative shrink-0 w-full" data-name="tr-0">
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[160px]">14 Ago 2026, 06:55</p>
                <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[200px]">Nocturno (23:00 - 07:00)</p>
                <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[13px] w-[180px]">Dra. Laura Sánchez</p>
                <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[13px] w-[180px]">Dr. Carlos Méndez</p>
                <div className="content-stretch flex items-start relative shrink-0 w-[100px]" data-name="pax-count">
                  <div className="bg-[#f1f5f9] content-stretch flex items-start px-[10px] py-[2px] relative rounded-[6px] shrink-0" data-name="Frame">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap">3 pax</p>
                  </div>
                </div>
                <div className="content-stretch flex items-start relative shrink-0 w-[120px]" data-name="status-col">
                  <div className="bg-[#ecfdf5] content-stretch flex items-start justify-center px-[10px] py-[4px] relative rounded-[6px] shrink-0 w-[90px]" data-name="Frame">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#10b981] text-[11px] whitespace-nowrap">Leído</p>
                  </div>
                </div>
                <div className="content-stretch flex flex-[1_0_0] items-start justify-end min-w-px relative" data-name="action-col">
                  <div className="border border-[#e2e8f0] border-solid content-stretch flex items-start px-[14px] py-[6px] relative rounded-[8px] shrink-0" data-name="btn-ver-resumen">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[13px] whitespace-nowrap">Ver Resumen</p>
                  </div>
                </div>
              </div>
              <div className="border-[#e2e8f0] border-b border-solid content-stretch flex gap-[8px] items-center p-[14px] relative shrink-0 w-full" data-name="tr-1">
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[160px]">13 Ago 2026, 22:50</p>
                <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[200px]">Vespertino (15:00 - 23:00)</p>
                <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[13px] w-[180px]">Dra. Ana Gómez</p>
                <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[13px] w-[180px]">Dra. Laura Sánchez</p>
                <div className="content-stretch flex items-start relative shrink-0 w-[100px]" data-name="pax-count">
                  <div className="bg-[#f1f5f9] content-stretch flex items-start px-[10px] py-[2px] relative rounded-[6px] shrink-0" data-name="Frame">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap">7 pax</p>
                  </div>
                </div>
                <div className="content-stretch flex items-start relative shrink-0 w-[120px]" data-name="status-col">
                  <div className="bg-[#ecfdf5] content-stretch flex items-start justify-center px-[10px] py-[4px] relative rounded-[6px] shrink-0 w-[90px]" data-name="Frame">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#10b981] text-[11px] whitespace-nowrap">Leído</p>
                  </div>
                </div>
                <div className="content-stretch flex flex-[1_0_0] items-start justify-end min-w-px relative" data-name="action-col">
                  <div className="border border-[#e2e8f0] border-solid content-stretch flex items-start px-[14px] py-[6px] relative rounded-[8px] shrink-0" data-name="btn-ver-resumen">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[13px] whitespace-nowrap">Ver Resumen</p>
                  </div>
                </div>
              </div>
              <div className="border-[#e2e8f0] border-b border-solid content-stretch flex gap-[8px] items-center p-[14px] relative shrink-0 w-full" data-name="tr-2">
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[160px]">13 Ago 2026, 14:45</p>
                <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[200px]">Matutino (07:00 - 15:00)</p>
                <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[13px] w-[180px]">Dr. Carlos Méndez</p>
                <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[13px] w-[180px]">Dra. Ana Gómez</p>
                <div className="content-stretch flex items-start relative shrink-0 w-[100px]" data-name="pax-count">
                  <div className="bg-[#f1f5f9] content-stretch flex items-start px-[10px] py-[2px] relative rounded-[6px] shrink-0" data-name="Frame">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap">7 pax</p>
                  </div>
                </div>
                <div className="content-stretch flex items-start relative shrink-0 w-[120px]" data-name="status-col">
                  <div className="bg-[#fffbeb] content-stretch flex items-start justify-center px-[10px] py-[4px] relative rounded-[6px] shrink-0 w-[90px]" data-name="Frame">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#d97706] text-[11px] whitespace-nowrap">Pendiente</p>
                  </div>
                </div>
                <div className="content-stretch flex flex-[1_0_0] items-start justify-end min-w-px relative" data-name="action-col">
                  <div className="border border-[#e2e8f0] border-solid content-stretch flex items-start px-[14px] py-[6px] relative rounded-[8px] shrink-0" data-name="btn-ver-resumen">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[13px] whitespace-nowrap">Ver Resumen</p>
                  </div>
                </div>
              </div>
              <div className="border-[#e2e8f0] border-b border-solid content-stretch flex gap-[8px] items-center p-[14px] relative shrink-0 w-full" data-name="tr-3">
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[160px]">13 Ago 2026, 06:50</p>
                <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[200px]">Nocturno (23:00 - 07:00)</p>
                <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[13px] w-[180px]">Dr. Roberto Silva</p>
                <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[13px] w-[180px]">Dr. Carlos Méndez</p>
                <div className="content-stretch flex items-start relative shrink-0 w-[100px]" data-name="pax-count">
                  <div className="bg-[#f1f5f9] content-stretch flex items-start px-[10px] py-[2px] relative rounded-[6px] shrink-0" data-name="Frame">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap">4 pax</p>
                  </div>
                </div>
                <div className="content-stretch flex items-start relative shrink-0 w-[120px]" data-name="status-col">
                  <div className="bg-[#ecfdf5] content-stretch flex items-start justify-center px-[10px] py-[4px] relative rounded-[6px] shrink-0 w-[90px]" data-name="Frame">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#10b981] text-[11px] whitespace-nowrap">Leído</p>
                  </div>
                </div>
                <div className="content-stretch flex flex-[1_0_0] items-start justify-end min-w-px relative" data-name="action-col">
                  <div className="border border-[#e2e8f0] border-solid content-stretch flex items-start px-[14px] py-[6px] relative rounded-[8px] shrink-0" data-name="btn-ver-resumen">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[13px] whitespace-nowrap">Ver Resumen</p>
                  </div>
                </div>
              </div>
              <div className="border-[#e2e8f0] border-b border-solid content-stretch flex gap-[8px] items-center p-[14px] relative shrink-0 w-full" data-name="tr-4">
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[160px]">12 Ago 2026, 22:45</p>
                <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[200px]">Vespertino (15:00 - 23:00)</p>
                <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[13px] w-[180px]">Dra. Ana Gómez</p>
                <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[13px] w-[180px]">Dr. Roberto Silva</p>
                <div className="content-stretch flex items-start relative shrink-0 w-[100px]" data-name="pax-count">
                  <div className="bg-[#f1f5f9] content-stretch flex items-start px-[10px] py-[2px] relative rounded-[6px] shrink-0" data-name="Frame">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap">6 pax</p>
                  </div>
                </div>
                <div className="content-stretch flex items-start relative shrink-0 w-[120px]" data-name="status-col">
                  <div className="bg-[#ecfdf5] content-stretch flex items-start justify-center px-[10px] py-[4px] relative rounded-[6px] shrink-0 w-[90px]" data-name="Frame">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#10b981] text-[11px] whitespace-nowrap">Leído</p>
                  </div>
                </div>
                <div className="content-stretch flex flex-[1_0_0] items-start justify-end min-w-px relative" data-name="action-col">
                  <div className="border border-[#e2e8f0] border-solid content-stretch flex items-start px-[14px] py-[6px] relative rounded-[8px] shrink-0" data-name="btn-ver-resumen">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[13px] whitespace-nowrap">Ver Resumen</p>
                  </div>
                </div>
              </div>
              <div className="border-0 border-[#e2e8f0] border-solid content-stretch flex gap-[8px] items-center p-[14px] relative shrink-0 w-full" data-name="tr-5">
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[160px]">12 Ago 2026, 14:55</p>
                <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[200px]">Matutino (07:00 - 15:00)</p>
                <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[13px] w-[180px]">Dr. Carlos Méndez</p>
                <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[13px] w-[180px]">Dra. Ana Gómez</p>
                <div className="content-stretch flex items-start relative shrink-0 w-[100px]" data-name="pax-count">
                  <div className="bg-[#f1f5f9] content-stretch flex items-start px-[10px] py-[2px] relative rounded-[6px] shrink-0" data-name="Frame">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap">6 pax</p>
                  </div>
                </div>
                <div className="content-stretch flex items-start relative shrink-0 w-[120px]" data-name="status-col">
                  <div className="bg-[#ecfdf5] content-stretch flex items-start justify-center px-[10px] py-[4px] relative rounded-[6px] shrink-0 w-[90px]" data-name="Frame">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#10b981] text-[11px] whitespace-nowrap">Leído</p>
                  </div>
                </div>
                <div className="content-stretch flex flex-[1_0_0] items-start justify-end min-w-px relative" data-name="action-col">
                  <div className="border border-[#e2e8f0] border-solid content-stretch flex items-start px-[14px] py-[6px] relative rounded-[8px] shrink-0" data-name="btn-ver-resumen">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[13px] whitespace-nowrap">Ver Resumen</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="content-stretch flex items-center justify-between pt-[12px] relative shrink-0 w-full" data-name="pagination">
              <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Mostrando 1-6 de 24 entregas</p>
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="page-pills">
                <div className="border border-[#e2e8f0] border-solid content-stretch flex items-start px-[10px] py-[6px] relative rounded-[6px] shrink-0" data-name="btn-prev">
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap">Anterior</p>
                </div>
                <div className="bg-[#2563eb] content-stretch flex items-start px-[12px] py-[6px] relative rounded-[6px] shrink-0" data-name="page-active">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[12px] text-white whitespace-nowrap">1</p>
                </div>
                <div className="border border-[#e2e8f0] border-solid content-stretch flex items-start px-[12px] py-[6px] relative rounded-[6px] shrink-0" data-name="page-2">
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap">2</p>
                </div>
                <div className="border border-[#e2e8f0] border-solid content-stretch flex items-start px-[12px] py-[6px] relative rounded-[6px] shrink-0" data-name="page-3">
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap">3</p>
                </div>
                <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap">...</p>
                <div className="border border-[#e2e8f0] border-solid content-stretch flex items-start px-[12px] py-[6px] relative rounded-[6px] shrink-0" data-name="page-last">
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap">4</p>
                </div>
                <div className="border border-[#e2e8f0] border-solid content-stretch flex items-start px-[10px] py-[6px] relative rounded-[6px] shrink-0" data-name="btn-next">
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap">Siguiente</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
