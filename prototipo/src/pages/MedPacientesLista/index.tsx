// Pantalla "med/pacientes/lista" (Figma node 45:79) — generada desde el diseño original de Figma.
import { Link } from 'react-router-dom';
import imgActivity from '../../assets/activity.svg';
import imgAlertTriangle from '../../assets/alert-triangle.svg';
import imgAlertsSidebarLine from '../../assets/alerts-sidebar-line.svg';
import imgArrowLeft from '../../assets/arrow-left.svg';
import imgArrowRight from '../../assets/arrow-right.svg';
import imgArrowUpRight from '../../assets/arrow-up-right.svg';
import imgAvatarPng from '../../assets/avatar.png';
import imgBell from '../../assets/bell.svg';
import imgCalendar from '../../assets/calendar.svg';
import imgCheck from '../../assets/check.svg';
import imgChevronDown from '../../assets/chevron-down.svg';
import imgCpu from '../../assets/cpu.svg';
import imgDoctorFooterLine from '../../assets/doctor-footer-line.svg';
import imgFileText from '../../assets/file-text.svg';
import imgHelpIconEllipse from '../../assets/help-icon-ellipse.svg';
import imgIconwrapper from '../../assets/iconwrapper.svg';
import imgLayoutDashboard from '../../assets/layout-dashboard.svg';
import imgLogOut from '../../assets/log-out.svg';
import imgMoreHorizontal from '../../assets/more-horizontal.svg';
import imgPlus from '../../assets/plus.svg';
import imgSearch from '../../assets/search.svg';
import imgStateIndicator from '../../assets/state-indicator.svg';
import imgStateIndicator2 from '../../assets/state-indicator-2.svg';
import imgUsers from '../../assets/users.svg';

export default function MedPacientesLista() {
  return (
    <div className="bg-[#f8fafc] content-stretch flex items-start min-h-[900px] relative shrink-0 w-[1440px]" data-name="med/pacientes/lista">
      <div className="bg-[#0f172a] border-[#1e293b] border-r border-solid content-stretch flex flex-col items-start justify-between px-[16px] py-[24px] relative self-stretch shrink-0 w-[240px]" data-name="sidebar">
        <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-full" data-name="top-group">
          <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="brand">
            <div className="bg-[#2563eb] content-stretch flex flex-col items-center justify-center relative rounded-[8px] shrink-0 size-[32px]" data-name="logo-mark">
              <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">S</p>
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px relative whitespace-nowrap" data-name="wordmark">
              <p className="font-jakarta font-extrabold relative shrink-0 text-[16px] text-white">SIAPPC</p>
              <p className="font-jakarta font-semibold overflow-hidden relative shrink-0 text-[#64748b] text-[10px] text-ellipsis uppercase">CUIDADO CRÍTICO</p>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="menu">
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Dashboard" to="/MedDashboardPrincipal">
              <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[18px]" data-name="icon-Dashboard">
                <div className="relative shrink-0 size-[18px]" data-name="layout-dashboard">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgLayoutDashboard} />
                </div>
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Dashboard</p>
            </Link>
            <Link className="bg-[rgba(37,99,235,0.15)] content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Pacientes" to="/MedPacientesLista">
              <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[18px]" data-name="icon-Pacientes">
                <div className="relative shrink-0 size-[18px]" data-name="users">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgUsers} />
                </div>
              </div>
              <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">Pacientes</p>
            </Link>
            <Link className="content-stretch cursor-pointer flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Monitoreo" to="/MedMonitoreoGridUci">
              <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[18px]" data-name="icon-Monitoreo">
                <div className="relative shrink-0 size-[18px]" data-name="activity">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgActivity} />
                </div>
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] text-left whitespace-nowrap">Monitoreo</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Alertas" to="/MedAlertasCentro">
              <div className="relative shrink-0 size-[18px]" data-name="bell">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBell} />
              </div>
              <p className="[word-break:break-word] font-geist font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Alertas</p>
            </Link>
            <Link className="content-stretch cursor-pointer flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Reportes" to="/MedReportesPanel">
              <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[18px]" data-name="icon-Reportes">
                <div className="relative shrink-0 size-[18px]" data-name="file-text">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgFileText} />
                </div>
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] text-left whitespace-nowrap">Reportes</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Dispositivos" to="/MedDispositivosMonitores">
              <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[18px]" data-name="icon-Dispositivos">
                <div className="relative shrink-0 size-[18px]" data-name="cpu">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgCpu} />
                </div>
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
        <Link className="content-stretch cursor-pointer flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="doctor-footer" to="/MedPerfilMiPerfil">
          <div className="h-0 relative shrink-0 w-full" data-name="Line">
            <div className="absolute inset-[-1px_0_0_0]">
              <img className="block max-w-none size-full" alt="" src={imgDoctorFooterLine} />
            </div>
          </div>
          <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="user-profile">
            <div className="relative rounded-[20px] shrink-0 size-[40px]" data-name="avatar">
              <img className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[20px] size-full" alt="" src={imgAvatarPng} />
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px relative text-left whitespace-nowrap" data-name="user-info">
              <p className="font-jakarta font-bold overflow-hidden relative shrink-0 text-[13px] text-ellipsis text-white">Dr. Roberto Silva</p>
              <p className="font-jakarta font-medium overflow-hidden relative shrink-0 text-[#64748b] text-[11px] text-ellipsis">Médico Especialista</p>
            </div>
            <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[18px]" data-name="logout">
              <div className="relative shrink-0 size-[18px]" data-name="log-out">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgLogOut} />
              </div>
            </div>
          </div>
        </Link>
      </div>
      <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative self-stretch" data-name="main-container">
        <div className="bg-white border-[#e2e8f0] border-b border-solid content-stretch flex h-[72px] items-center justify-between px-[32px] relative shrink-0 w-full" data-name="top-bar">
          <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] relative shrink-0 whitespace-nowrap" data-name="title-breadcrumb">
            <p className="font-jakarta font-medium relative shrink-0 text-[#64748b] text-[12px]">{`SIAPPC > Pacientes`}</p>
            <p className="font-jakarta font-extrabold relative shrink-0 text-[#0f172a] text-[20px]">Gestión de Pacientes</p>
          </div>
          <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="right-actions">
            <div className="bg-[#2563eb] content-stretch flex gap-[8px] items-center px-[16px] py-[10px] relative rounded-[8px] shrink-0" data-name="new-patient-btn">
              <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[14px]" data-name="plus-icon">
                <div className="relative shrink-0 size-[14px]" data-name="plus">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgPlus} />
                </div>
              </div>
              <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[13px] text-white whitespace-nowrap">Nuevo Paciente</p>
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
        <div className="content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-start min-h-px p-[32px] relative w-full" data-name="page-body">
          <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="filters-row">
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex gap-[12px] items-center px-[12px] py-[8px] relative rounded-[8px] shrink-0" data-name="dropdown-unidad">
              <div className="[word-break:break-word] content-stretch flex flex-col font-jakarta font-semibold gap-[2px] items-start leading-[normal] relative shrink-0 whitespace-nowrap" data-name="label-container">
                <p className="relative shrink-0 text-[#64748b] text-[10px] uppercase">Unidad</p>
                <p className="relative shrink-0 text-[#0f172a] text-[13px]">Todas</p>
              </div>
              <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[14px]" data-name="chevron">
                <div className="relative shrink-0 size-[14px]" data-name="chevron-down">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChevronDown} />
                </div>
              </div>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex gap-[12px] items-center px-[12px] py-[8px] relative rounded-[8px] shrink-0" data-name="dropdown-estado">
              <div className="[word-break:break-word] content-stretch flex flex-col font-jakarta font-semibold gap-[2px] items-start leading-[normal] relative shrink-0 whitespace-nowrap" data-name="label-container">
                <p className="relative shrink-0 text-[#64748b] text-[10px] uppercase">Estado</p>
                <p className="relative shrink-0 text-[#0f172a] text-[13px]">Todos</p>
              </div>
              <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[14px]" data-name="chevron">
                <div className="relative shrink-0 size-[14px]" data-name="chevron-down">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChevronDown} />
                </div>
              </div>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-[1_0_0] gap-[12px] items-center min-w-px px-[12px] py-[8px] relative rounded-[8px]" data-name="datepicker">
              <div className="[word-break:break-word] content-stretch flex flex-col font-jakarta font-semibold gap-[2px] items-start leading-[normal] relative shrink-0 whitespace-nowrap" data-name="label-container">
                <p className="relative shrink-0 text-[#64748b] text-[10px] uppercase">Rango de Admisión</p>
                <p className="relative shrink-0 text-[#0f172a] text-[13px]">Cualquier fecha</p>
              </div>
              <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[14px]" data-name="calendar">
                <div className="relative shrink-0 size-[14px]" data-name="calendar">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgCalendar} />
                </div>
              </div>
            </div>
          </div>
          <div className="[word-break:break-word] content-stretch flex gap-[16px] items-start leading-[normal] relative shrink-0 w-full whitespace-nowrap" data-name="kpi-row">
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch drop-shadow-[0px_4px_6px_rgba(0,0,0,0.02)] flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px p-[20px] relative rounded-[12px]" data-name="kpi-card">
              <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[13px] uppercase">Pacientes Activos</p>
              <div className="content-stretch flex items-baseline justify-between relative shrink-0 w-full" data-name="value-trend">
                <p className="font-jakarta font-extrabold relative shrink-0 text-[#0f172a] text-[32px]">8</p>
                <p className="font-jakarta font-bold relative shrink-0 text-[#64748b] text-[12px]">Cupo: 12 camas</p>
              </div>
            </div>
            <div className="bg-[#fef2f2] border border-[#e2e8f0] border-solid content-stretch drop-shadow-[0px_4px_6px_rgba(0,0,0,0.02)] flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px p-[20px] relative rounded-[12px]" data-name="kpi-card">
              <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[13px] uppercase">Estado Crítico</p>
              <div className="content-stretch flex items-baseline justify-between relative shrink-0 w-full" data-name="value-trend">
                <p className="font-jakarta font-extrabold relative shrink-0 text-[#ef4444] text-[32px]">2</p>
                <p className="font-jakarta font-bold relative shrink-0 text-[#64748b] text-[12px]">Acción inmediata</p>
              </div>
            </div>
            <div className="bg-[#fef3c7] border border-[#e2e8f0] border-solid content-stretch drop-shadow-[0px_4px_6px_rgba(0,0,0,0.02)] flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px p-[20px] relative rounded-[12px]" data-name="kpi-card">
              <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[13px] uppercase">Alertas Activas</p>
              <div className="content-stretch flex items-baseline justify-between relative shrink-0 w-full" data-name="value-trend">
                <p className="font-jakarta font-extrabold relative shrink-0 text-[#f59e0b] text-[32px]">5</p>
                <p className="font-jakarta font-bold relative shrink-0 text-[#64748b] text-[12px]">Últimos 15 min</p>
              </div>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch drop-shadow-[0px_4px_6px_rgba(0,0,0,0.02)] flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px p-[20px] relative rounded-[12px]" data-name="kpi-card">
              <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[13px] uppercase">Camas Disponibles</p>
              <div className="content-stretch flex items-baseline justify-between relative shrink-0 w-full" data-name="value-trend">
                <p className="font-jakarta font-extrabold relative shrink-0 text-[#0f172a] text-[32px]">4 / 12</p>
                <p className="font-jakarta font-bold relative shrink-0 text-[#64748b] text-[12px]">33% libre</p>
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-[1_0_0] gap-[24px] items-start min-h-px relative w-full" data-name="content-layout">
            <div className="content-stretch flex flex-[1_0_0] flex-col gap-[12px] h-full items-start min-w-px relative" data-name="patients-table-container">
              <div className="[word-break:break-word] content-stretch flex flex-col gap-[6px] items-start leading-[normal] relative shrink-0 w-full" data-name="patients-header">
                <p className="font-jakarta font-extrabold relative shrink-0 text-[#0f172a] text-[16px] whitespace-nowrap">Lista de Pacientes Asignados</p>
                <p className="font-jakarta font-normal min-w-full relative shrink-0 text-[#64748b] text-[13px] w-[min-content]">Resumen de estado de salud actual para su supervisión.</p>
              </div>
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="patients-controls">
                <div className="flex-[1_0_0] h-px min-w-px opacity-0 relative" data-name="spacer" />
                <div className="content-stretch flex gap-[10px] items-center relative shrink-0" data-name="filter-search">
                  <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex gap-[8px] items-center px-[10px] py-[8px] relative rounded-[8px] shrink-0" data-name="filter-chip">
                    <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Todos</p>
                    <div className="relative shrink-0 size-[14px]" data-name="chevron-down">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChevronDown} />
                    </div>
                  </div>
                  <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative rounded-[8px] shrink-0 w-[320px]" data-name="search">
                    <div className="relative shrink-0 size-[16px]" data-name="search">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgSearch} />
                    </div>
                    <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-normal leading-[normal] min-w-px relative text-[#64748b] text-[13px]">Filtrar por nombre o ID...</p>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[12px] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.01)] shrink-0 w-full" data-name="patients-table">
                <div className="[word-break:break-word] bg-[#f8fafc] border-[#e2e8f0] border-b border-solid content-stretch flex font-jakarta font-bold gap-[12px] items-center leading-[normal] px-[16px] py-[12px] relative shrink-0 text-[#64748b] text-[11px] w-[932px]" data-name="table-header">
                  <p className="relative shrink-0 uppercase w-[200px]">PACIENTE</p>
                  <p className="relative shrink-0 uppercase w-[100px]">ESTADO</p>
                  <p className="relative shrink-0 uppercase w-[110px]">TRASLADO UCI</p>
                  <p className="h-[14px] relative shrink-0 w-[85px]">CAMA</p>
                  <p className="relative shrink-0 uppercase w-[70px]">FC (LPM)</p>
                  <p className="relative shrink-0 uppercase w-[70px]">SPO2 (%)</p>
                  <p className="relative shrink-0 uppercase w-[70px]">TEMP (°C)</p>
                  <p className="relative shrink-0 text-right uppercase w-[30px]">•••</p>
                </div>
                <div className="bg-white border-[#e2e8f0] border-b border-solid content-stretch flex gap-[12px] items-center p-[16px] relative shrink-0 w-[932px]" data-name="row">
                  <div className="content-stretch flex gap-[10px] h-[35px] items-center relative shrink-0 w-[200px]" data-name="patient">
                    <div className="bg-[#e2e8f0] content-stretch flex flex-col items-center justify-center relative rounded-[16px] shrink-0 size-[32px]" data-name="avatar">
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[12px] whitespace-nowrap">ER</p>
                    </div>
                    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px relative" data-name="patient-meta">
                      <p className="font-jakarta font-bold overflow-hidden relative shrink-0 text-[#0f172a] text-[14px] text-ellipsis w-full whitespace-nowrap">Elena Rodríguez</p>
                      <p className="font-jakarta font-normal relative shrink-0 text-[#64748b] text-[12px] w-full">PT-8821 • 64 años</p>
                    </div>
                  </div>
                  <div className="content-stretch flex items-center relative shrink-0 w-[100px]" data-name="state">
                    <div className="bg-[#fef2f2] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[999px] shrink-0" data-name="badge">
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#ef4444] text-[11px] whitespace-nowrap">CRÍTICO</p>
                    </div>
                  </div>
                  <div className="content-stretch flex gap-[6px] h-[16px] items-center relative shrink-0 w-[110px]" data-name="transfer-status">
                    <div className="relative shrink-0 size-[12px]" data-name="arrow-right">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgArrowRight} />
                    </div>
                    <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-bold leading-[normal] min-w-px relative text-[#64748b] text-[11px]">Ingreso</p>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-semibold h-[16px] leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[85px]">Cama C-03</p>
                  <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#ef4444] text-[13px] w-[70px]">112</p>
                  <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#ef4444] text-[13px] w-[70px]">89</p>
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[70px]">38.2°</p>
                  <div className="content-stretch flex items-center justify-end relative shrink-0 w-[30px]" data-name="action">
                    <div className="relative shrink-0 size-[18px]" data-name="more-horizontal">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgMoreHorizontal} />
                    </div>
                  </div>
                </div>
                <Link className="bg-[#eff6ff] border-[#e2e8f0] border-b border-solid content-stretch cursor-pointer flex gap-[12px] h-[67px] items-center p-[16px] relative shrink-0 w-full" data-name="row-selected" to="/MedPacienteResumen">
                  <div className="absolute bg-[#2563eb] bottom-[-1px] left-0 top-0 w-[3px]" data-name="selected-indicator" />
                  <div className="content-stretch flex gap-[10px] h-[43px] items-center relative shrink-0 w-[200px]" data-name="patient">
                    <div className="bg-[#e2e8f0] content-stretch flex flex-col items-center justify-center relative rounded-[16px] shrink-0 size-[32px]" data-name="avatar">
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[12px] text-left whitespace-nowrap">JM</p>
                    </div>
                    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px relative text-left" data-name="patient-meta">
                      <p className="font-jakarta font-bold overflow-hidden relative shrink-0 text-[#0f172a] text-[14px] text-ellipsis w-full whitespace-nowrap">Javier Mendoza</p>
                      <p className="font-jakarta font-normal relative shrink-0 text-[#64748b] text-[12px] w-full">PT-8822 • 45 años</p>
                    </div>
                  </div>
                  <div className="content-stretch flex items-center relative shrink-0 w-[100px]" data-name="state">
                    <div className="bg-[#fef3c7] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[999px] shrink-0" data-name="badge">
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#f59e0b] text-[11px] text-left whitespace-nowrap">MONITOREO</p>
                    </div>
                  </div>
                  <div className="content-stretch flex gap-[6px] h-[16px] items-center relative shrink-0 w-[110px]" data-name="transfer-status">
                    <div className="relative shrink-0 size-[12px]" data-name="arrow-left">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgArrowLeft} />
                    </div>
                    <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-bold leading-[normal] min-w-px relative text-[#64748b] text-[11px] text-left">Salida</p>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-semibold h-[16px] leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] text-left w-[85px]">Cama C-07</p>
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] text-left w-[70px]">88</p>
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] text-left w-[70px]">96</p>
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] text-left w-[70px]">37.1°</p>
                  <div className="content-stretch flex items-center justify-end relative shrink-0 w-[30px]" data-name="action">
                    <div className="relative shrink-0 size-[18px]" data-name="more-horizontal">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgMoreHorizontal} />
                    </div>
                  </div>
                </Link>
                <div className="bg-white border-[#e2e8f0] border-b border-solid content-stretch flex gap-[12px] items-center p-[16px] relative shrink-0 w-[932px]" data-name="row">
                  <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-[200px]" data-name="patient">
                    <div className="bg-[#e2e8f0] content-stretch flex flex-col items-center justify-center relative rounded-[16px] shrink-0 size-[32px]" data-name="avatar">
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[12px] whitespace-nowrap">SM</p>
                    </div>
                    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px relative" data-name="patient-meta">
                      <p className="font-jakarta font-bold overflow-hidden relative shrink-0 text-[#0f172a] text-[14px] text-ellipsis w-full whitespace-nowrap">Sofía Martínez</p>
                      <p className="font-jakarta font-normal relative shrink-0 text-[#64748b] text-[12px] w-full">PT-8823 • 29 años</p>
                    </div>
                  </div>
                  <div className="content-stretch flex items-center relative shrink-0 w-[100px]" data-name="state">
                    <div className="bg-[#ecfdf5] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[999px] shrink-0" data-name="badge">
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#10b981] text-[11px] whitespace-nowrap">ESTABLE</p>
                    </div>
                  </div>
                  <div className="content-stretch flex gap-[6px] h-[16px] items-center relative shrink-0 w-[110px]" data-name="transfer-status">
                    <div className="relative shrink-0 size-[12px]" data-name="check">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgCheck} />
                    </div>
                    <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-bold leading-[normal] min-w-px relative text-[#64748b] text-[11px]">Alta</p>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-semibold h-[16px] leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[85px]">Cama C-02</p>
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[70px]">72</p>
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[70px]">99</p>
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[70px]">36.6°</p>
                  <div className="content-stretch flex items-center justify-end relative shrink-0 w-[30px]" data-name="action">
                    <div className="relative shrink-0 size-[18px]" data-name="more-horizontal">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgMoreHorizontal} />
                    </div>
                  </div>
                </div>
                <div className="bg-white border-[#e2e8f0] border-b border-solid content-stretch flex gap-[12px] items-center p-[16px] relative shrink-0 w-[932px]" data-name="row">
                  <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-[200px]" data-name="patient">
                    <div className="bg-[#e2e8f0] content-stretch flex flex-col items-center justify-center relative rounded-[16px] shrink-0 size-[32px]" data-name="avatar">
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[12px] whitespace-nowrap">RG</p>
                    </div>
                    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px relative" data-name="patient-meta">
                      <p className="font-jakarta font-bold overflow-hidden relative shrink-0 text-[#0f172a] text-[14px] text-ellipsis w-full whitespace-nowrap">Ricardo Gómez</p>
                      <p className="font-jakarta font-normal relative shrink-0 text-[#64748b] text-[12px] w-full">PT-8824 • 72 años</p>
                    </div>
                  </div>
                  <div className="content-stretch flex items-center relative shrink-0 w-[100px]" data-name="state">
                    <div className="bg-[#fef2f2] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[999px] shrink-0" data-name="badge">
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#ef4444] text-[11px] whitespace-nowrap">CRÍTICO</p>
                    </div>
                  </div>
                  <div className="content-stretch flex gap-[6px] h-[16px] items-center relative shrink-0 w-[110px]" data-name="transfer-status">
                    <div className="relative shrink-0 size-[12px]" data-name="alert-triangle">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgAlertTriangle} />
                    </div>
                    <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-bold leading-[normal] min-w-px relative text-[#64748b] text-[11px]">Urgente</p>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-semibold h-[16px] leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[85px]">Cama C-01</p>
                  <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#ef4444] text-[13px] w-[70px]">105</p>
                  <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#ef4444] text-[13px] w-[70px]">91</p>
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[70px]">37.8°</p>
                  <div className="content-stretch flex items-center justify-end relative shrink-0 w-[30px]" data-name="action">
                    <div className="relative shrink-0 size-[18px]" data-name="more-horizontal">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgMoreHorizontal} />
                    </div>
                  </div>
                </div>
                <div className="bg-white content-stretch flex gap-[12px] items-center p-[16px] relative shrink-0 w-[932px]" data-name="row">
                  <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-[200px]" data-name="patient">
                    <div className="bg-[#e2e8f0] content-stretch flex flex-col items-center justify-center relative rounded-[16px] shrink-0 size-[32px]" data-name="avatar">
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[12px] whitespace-nowrap">LF</p>
                    </div>
                    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px relative" data-name="patient-meta">
                      <p className="font-jakarta font-bold overflow-hidden relative shrink-0 text-[#0f172a] text-[14px] text-ellipsis w-full whitespace-nowrap">Lucía Fernández</p>
                      <p className="font-jakarta font-normal relative shrink-0 text-[#64748b] text-[12px] w-full">PT-8825 • 53 años</p>
                    </div>
                  </div>
                  <div className="content-stretch flex items-center relative shrink-0 w-[100px]" data-name="state">
                    <div className="bg-[#ecfdf5] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[999px] shrink-0" data-name="badge">
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#10b981] text-[11px] whitespace-nowrap">ESTABLE</p>
                    </div>
                  </div>
                  <div className="content-stretch flex gap-[6px] h-[16px] items-center relative shrink-0 w-[110px]" data-name="transfer-status">
                    <div className="relative shrink-0 size-[12px]" data-name="arrow-up-right">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgArrowUpRight} />
                    </div>
                    <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-bold leading-[normal] min-w-px relative text-[#64748b] text-[11px]">Traslado</p>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-semibold h-[16px] leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[85px]">Cama C-05</p>
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[70px]">68</p>
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[70px]">98</p>
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[70px]">36.8°</p>
                  <div className="content-stretch flex items-center justify-end relative shrink-0 w-[30px]" data-name="action">
                    <div className="relative shrink-0 size-[18px]" data-name="more-horizontal">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgMoreHorizontal} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="table-footer">
                <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Mostrando 5 de 12 pacientes bajo su cuidado.</p>
                <div className="content-stretch flex gap-[10px] items-center relative shrink-0" data-name="pagination">
                  <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-center px-[12px] py-[8px] relative rounded-[8px] shrink-0" data-name="btn-prev">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">Anterior</p>
                  </div>
                  <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-center px-[12px] py-[8px] relative rounded-[8px] shrink-0" data-name="btn-next">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">Siguiente</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch drop-shadow-[0px_4px_4px_rgba(0,0,0,0.01)] flex flex-col gap-[16px] h-full items-start p-[16px] relative rounded-[12px] shrink-0 w-[280px]" data-name="alerts-sidebar">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="header">
                <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap">Alertas Recientes</p>
                <div className="bg-[#fef2f2] content-stretch flex items-start px-[6px] py-[2px] relative rounded-[4px] shrink-0" data-name="badge">
                  <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#ef4444] text-[11px] whitespace-nowrap">Hoy</p>
                </div>
              </div>
              <div className="h-0 relative shrink-0 w-full" data-name="Line">
                <div className="absolute inset-[-1px_0_0_0]">
                  <img className="block max-w-none size-full" alt="" src={imgAlertsSidebarLine} />
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="alerts-list">
                <div className="content-stretch flex gap-[10px] items-start relative shrink-0 w-full" data-name="alert-item">
                  <div className="h-[14px] relative shrink-0 w-[8px]" data-name="state-indicator">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgStateIndicator} />
                  </div>
                  <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-px items-start leading-[normal] min-w-px relative whitespace-nowrap" data-name="alert-content">
                    <p className="font-jakarta font-bold min-w-full overflow-hidden relative shrink-0 text-[#0f172a] text-[12px] text-ellipsis w-[min-content]">{`Caída severa de SpO2 < 89%`}</p>
                    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 text-[10px]" data-name="meta">
                      <p className="font-jakarta font-bold relative shrink-0 text-[#2563eb]">Cama 03</p>
                      <p className="font-jakarta font-normal relative shrink-0 text-[#64748b]">Hace 2 min</p>
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex gap-[10px] items-start relative shrink-0 w-full" data-name="alert-item">
                  <div className="h-[14px] relative shrink-0 w-[8px]" data-name="state-indicator">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgStateIndicator} />
                  </div>
                  <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-px items-start leading-[normal] min-w-px relative whitespace-nowrap" data-name="alert-content">
                    <p className="font-jakarta font-bold min-w-full overflow-hidden relative shrink-0 text-[#0f172a] text-[12px] text-ellipsis w-[min-content]">Taquicardia ventricular detectada</p>
                    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 text-[10px]" data-name="meta">
                      <p className="font-jakarta font-bold relative shrink-0 text-[#2563eb]">Cama 06</p>
                      <p className="font-jakarta font-normal relative shrink-0 text-[#64748b]">Hace 5 min</p>
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex gap-[10px] items-start relative shrink-0 w-full" data-name="alert-item">
                  <div className="h-[14px] relative shrink-0 w-[8px]" data-name="state-indicator">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgStateIndicator2} />
                  </div>
                  <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-px items-start leading-[normal] min-w-px relative whitespace-nowrap" data-name="alert-content">
                    <p className="font-jakarta font-bold min-w-full overflow-hidden relative shrink-0 text-[#0f172a] text-[12px] text-ellipsis w-[min-content]">Fiebre alta registrada 39.1°C</p>
                    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 text-[10px]" data-name="meta">
                      <p className="font-jakarta font-bold relative shrink-0 text-[#2563eb]">Cama 06</p>
                      <p className="font-jakarta font-normal relative shrink-0 text-[#64748b]">Hace 12 min</p>
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex gap-[10px] items-start relative shrink-0 w-full" data-name="alert-item">
                  <div className="h-[14px] relative shrink-0 w-[8px]" data-name="state-indicator">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgStateIndicator2} />
                  </div>
                  <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-px items-start leading-[normal] min-w-px relative whitespace-nowrap" data-name="alert-content">
                    <p className="font-jakarta font-bold min-w-full overflow-hidden relative shrink-0 text-[#0f172a] text-[12px] text-ellipsis w-[min-content]">Presión arterial en límites (140/90)</p>
                    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 text-[10px]" data-name="meta">
                      <p className="font-jakarta font-bold relative shrink-0 text-[#2563eb]">Cama 02</p>
                      <p className="font-jakarta font-normal relative shrink-0 text-[#64748b]">Hace 20 min</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
