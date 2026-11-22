// Pantalla "med-dispositivos-monitores" (Figma node 265:4) — generada desde el diseño original de Figma.
import { Link } from 'react-router-dom';
import imgAvatar22Png from '../../assets/avatar-22.png';
import imgDoctorFooterLine2 from '../../assets/doctor-footer-line-2.svg';
import imgDropdownBadgeEllipse2 from '../../assets/dropdown-badge-ellipse-2.svg';
import imgFiltersRowFrame from '../../assets/filters-row-frame.svg';
import imgHelpIconEllipse from '../../assets/help-icon-ellipse.svg';
import imgIconWrapper2 from '../../assets/icon-wrapper-2.svg';
import imgIconWrapper3 from '../../assets/icon-wrapper-3.svg';
import imgIconWrapper4 from '../../assets/icon-wrapper-4.svg';
import imgIconWrapper5 from '../../assets/icon-wrapper-5.svg';
import imgIconWrapper6 from '../../assets/icon-wrapper-6.svg';
import imgIconWrapper7 from '../../assets/icon-wrapper-7.svg';
import imgIconwrapper16 from '../../assets/iconwrapper-16.svg';
import imgKpiRowFrame from '../../assets/kpi-row-frame.svg';
import imgKpiRowFrame2 from '../../assets/kpi-row-frame-2.svg';
import imgKpiRowFrame3 from '../../assets/kpi-row-frame-3.svg';
import imgKpiRowFrame4 from '../../assets/kpi-row-frame-4.svg';
import imgLogout2 from '../../assets/logout-2.svg';
import imgRowC01Vector from '../../assets/row-c-01-vector.svg';
import imgRowC06Vector from '../../assets/row-c-06-vector.svg';
import imgRowC07Vector from '../../assets/row-c-07-vector.svg';
import imgSearchFieldVector from '../../assets/search-field-vector.svg';
import imgSearchVector from '../../assets/search-vector.svg';

export default function MedDispositivosMonitores() {
  return (
    <div className="bg-[#f8fafc] content-stretch flex items-start min-h-[900px] relative shrink-0 w-[1440px]" data-name="med-dispositivos-monitores">
      <div className="bg-[#0f172a] border-[#1e293b] border-r border-solid content-stretch flex flex-col items-start justify-between px-[16px] py-[24px] relative self-stretch shrink-0 w-[240px]" data-name="sidebar">
        <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-full" data-name="top-group">
          <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="brand">
            <div className="bg-[#2563eb] content-stretch flex flex-col items-center justify-center relative rounded-[8px] shrink-0 size-[32px]" data-name="logo-mark">
              <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[16px] text-white whitespace-nowrap">S</p>
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px relative whitespace-nowrap" data-name="wordmark">
              <p className="font-jakarta font-extrabold relative shrink-0 text-[16px] text-white">SIAPPC</p>
              <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[10px] uppercase">CUIDADO CRÍTICO</p>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="menu">
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Dashboard" to="/MedDashboardPrincipal">
              <div className="relative shrink-0 size-[18px]" data-name="icon-wrapper">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgIconWrapper2} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Dashboard</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Pacientes" to="/MedPacientesLista">
              <div className="relative shrink-0 size-[18px]" data-name="icon-wrapper">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgIconWrapper3} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Pacientes</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Monitoreo" to="/MedMonitoreoGridUci">
              <div className="relative shrink-0 size-[18px]" data-name="icon-wrapper">
                <div className="absolute inset-[-5.56%]">
                  <img className="block max-w-none size-full" alt="" src={imgIconWrapper4} />
                </div>
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Monitoreo</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Alertas" to="/MedAlertasCentro">
              <div className="relative shrink-0 size-[18px]" data-name="icon-wrapper">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgIconWrapper5} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Alertas</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Reportes" to="/MedReportesPanel">
              <div className="relative shrink-0 size-[18px]" data-name="icon-wrapper">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgIconWrapper6} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Reportes</p>
            </Link>
            <Link className="bg-[rgba(37,99,235,0.15)] content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Dispositivos" to="/MedDispositivosMonitores">
              <div className="relative shrink-0 size-[18px]" data-name="icon-wrapper">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgIconWrapper7} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">Dispositivos</p>
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
              <img className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[20px] size-full" alt="" src={imgAvatar22Png} />
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px relative whitespace-nowrap" data-name="user-info">
              <p className="font-jakarta font-bold overflow-hidden relative shrink-0 text-[13px] text-ellipsis text-white">Dr. Carlos Méndez</p>
              <p className="font-jakarta font-medium overflow-hidden relative shrink-0 text-[#64748b] text-[11px] text-ellipsis">Médico Intensivista</p>
            </div>
            <div className="relative shrink-0 size-[18px]" data-name="logout">
              <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgLogout2} />
            </div>
          </Link>
        </div>
      </div>
      <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative self-stretch" data-name="main-container">
        <div className="bg-white border-[#e2e8f0] border-b border-solid content-stretch flex h-[72px] items-center justify-between px-[32px] relative shrink-0 w-full" data-name="top-bar">
          <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] relative shrink-0 whitespace-nowrap" data-name="title-breadcrumb">
            <p className="font-jakarta font-medium relative shrink-0 text-[#64748b] text-[12px]">{`SIAPPC > Dispositivos`}</p>
            <p className="font-jakarta font-extrabold relative shrink-0 text-[#0f172a] text-[20px]">Dispositivos — Monitores UCI</p>
          </div>
          <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="right-actions">
            <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative rounded-[8px] shrink-0 w-[260px]" data-name="search">
              <div className="relative shrink-0 size-[14px]" data-name="Vector">
                <div className="absolute inset-[0_11.11%_11.11%_0]">
                  <img className="block max-w-none size-full" alt="" src={imgSearchVector} />
                </div>
              </div>
              <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Buscar por serie/ID...</p>
            </div>
            <Link className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex items-center justify-center relative rounded-[18px] shrink-0 size-[36px]" data-name="notification-bell" to="/MedNotificacionesCentro">
              <div className="relative shrink-0 size-[18px]" data-name="IconWrapper">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgIconwrapper16} />
              </div>
              <div className="absolute bg-[#ef4444] content-stretch flex items-center justify-center right-[-3px] rounded-[8px] size-[16px] top-[-3px]" data-name="red-badge">
                <p className="[word-break:break-word] font-inter font-extrabold leading-[normal] not-italic relative shrink-0 text-[10px] text-white whitespace-nowrap">3</p>
              </div>
            </Link>
          </div>
        </div>
        <div className="content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-start min-h-px p-[32px] relative w-full" data-name="page-body">
          <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="kpi-row">
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch drop-shadow-[0px_4px_6px_rgba(0,0,0,0.02)] flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px p-[20px] relative rounded-[12px]" data-name="Frame">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Frame">
                <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[13px] uppercase whitespace-nowrap">Total Dispositivos</p>
                <div className="relative shrink-0 size-[28px]" data-name="Frame">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgKpiRowFrame} />
                </div>
              </div>
              <div className="[word-break:break-word] content-stretch flex items-baseline justify-between leading-[normal] relative shrink-0 w-full whitespace-nowrap" data-name="Frame">
                <p className="font-jakarta font-extrabold relative shrink-0 text-[#0f172a] text-[28px]">12</p>
                <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[12px]">Monitorización central</p>
              </div>
            </div>
            <div className="bg-[#ecfdf5] border border-[#e2e8f0] border-solid content-stretch drop-shadow-[0px_4px_6px_rgba(0,0,0,0.02)] flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px p-[20px] relative rounded-[12px]" data-name="Frame">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Frame">
                <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[13px] uppercase whitespace-nowrap">Activos</p>
                <div className="relative shrink-0 size-[28px]" data-name="Frame">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgKpiRowFrame2} />
                </div>
              </div>
              <div className="[word-break:break-word] content-stretch flex items-baseline justify-between leading-[normal] relative shrink-0 w-full whitespace-nowrap" data-name="Frame">
                <p className="font-jakarta font-extrabold relative shrink-0 text-[#10b981] text-[28px]">10</p>
                <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[12px]">En transmisiones</p>
              </div>
            </div>
            <div className="bg-[#fef2f2] border border-[#e2e8f0] border-solid content-stretch drop-shadow-[0px_4px_6px_rgba(0,0,0,0.02)] flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px p-[20px] relative rounded-[12px]" data-name="Frame">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Frame">
                <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[13px] uppercase whitespace-nowrap">En Falla</p>
                <div className="relative shrink-0 size-[28px]" data-name="Frame">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgKpiRowFrame3} />
                </div>
              </div>
              <div className="[word-break:break-word] content-stretch flex items-baseline justify-between leading-[normal] relative shrink-0 w-full whitespace-nowrap" data-name="Frame">
                <p className="font-jakarta font-extrabold relative shrink-0 text-[#ef4444] text-[28px]">1</p>
                <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[12px]">Soporte requerido</p>
              </div>
            </div>
            <div className="bg-[#fef3c7] border border-[#e2e8f0] border-solid content-stretch drop-shadow-[0px_4px_6px_rgba(0,0,0,0.02)] flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px p-[20px] relative rounded-[12px]" data-name="Frame">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Frame">
                <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[13px] uppercase whitespace-nowrap">Pendiente Calibración</p>
                <div className="relative shrink-0 size-[28px]" data-name="Frame">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgKpiRowFrame4} />
                </div>
              </div>
              <div className="[word-break:break-word] content-stretch flex items-baseline justify-between leading-[normal] relative shrink-0 w-full whitespace-nowrap" data-name="Frame">
                <p className="font-jakarta font-extrabold relative shrink-0 text-[#f59e0b] text-[28px]">2</p>
                <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[12px]">Próximos 7 días</p>
              </div>
            </div>
          </div>
          <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="filters-row">
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex gap-[12px] items-center px-[12px] py-[8px] relative rounded-[8px] shrink-0" data-name="Frame">
              <div className="[word-break:break-word] content-stretch flex flex-col font-jakarta font-semibold gap-[2px] items-start leading-[normal] relative shrink-0 whitespace-nowrap" data-name="Frame">
                <p className="relative shrink-0 text-[#64748b] text-[10px] uppercase">Estado</p>
                <p className="relative shrink-0 text-[#0f172a] text-[13px]">Todos</p>
              </div>
              <div className="relative shrink-0 size-[14px]" data-name="Frame">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgFiltersRowFrame} />
              </div>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex gap-[12px] items-center px-[12px] py-[8px] relative rounded-[8px] shrink-0" data-name="Frame">
              <div className="[word-break:break-word] content-stretch flex flex-col font-jakarta font-semibold gap-[2px] items-start leading-[normal] relative shrink-0 whitespace-nowrap" data-name="Frame">
                <p className="relative shrink-0 text-[#64748b] text-[10px] uppercase">Cama</p>
                <p className="relative shrink-0 text-[#0f172a] text-[13px]">Todas las UCI</p>
              </div>
              <div className="relative shrink-0 size-[14px]" data-name="Frame">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgFiltersRowFrame} />
              </div>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-[1_0_0] gap-[10px] items-center min-w-px px-[14px] py-[10px] relative rounded-[8px]" data-name="search-field">
              <div className="relative shrink-0 size-[14px]" data-name="Vector">
                <div className="absolute inset-[0_11.11%_11.11%_0]">
                  <img className="block max-w-none size-full" alt="" src={imgSearchFieldVector} />
                </div>
              </div>
              <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-normal leading-[normal] min-w-px relative text-[#64748b] text-[13px]">Filtrar pacientes o modelo de equipo...</p>
            </div>
          </div>
          <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[12px] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.01)] shrink-0 w-full" data-name="table-container">
            <div className="[word-break:break-word] bg-[#f8fafc] border-[#e2e8f0] border-b border-solid content-stretch flex font-jakarta font-bold gap-[16px] items-center leading-[normal] px-[24px] py-[14px] relative shrink-0 text-[#64748b] text-[11px] w-full" data-name="table-header">
              <p className="relative shrink-0 w-[60px]">CAMA</p>
              <p className="relative shrink-0 w-[160px]">PACIENTE</p>
              <p className="relative shrink-0 w-[180px]">MODELO MONITOR</p>
              <p className="relative shrink-0 w-[100px]">ESTADO</p>
              <p className="relative shrink-0 w-[100px]">BATERÍA</p>
              <p className="relative shrink-0 w-[130px]">ÚLTIMA CALIBRACIÓN</p>
              <p className="relative shrink-0 w-[180px]">SEÑALES</p>
              <p className="flex-[1_0_0] min-w-px relative text-right">ACCIÓN</p>
            </div>
            <div className="bg-white border-[#e2e8f0] border-b border-solid content-stretch flex gap-[16px] items-center px-[24px] py-[12px] relative shrink-0 w-full" data-name="row-C-01">
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-[60px]" data-name="Frame">
                <div className="relative shrink-0 size-[16px]" data-name="Vector">
                  <div className="absolute bottom-[18.75%] left-0 right-0 top-1/4">
                    <img className="block max-w-none size-full" alt="" src={imgRowC01Vector} />
                  </div>
                </div>
                <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[12px] whitespace-nowrap">C-01</p>
              </div>
              <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[160px] whitespace-nowrap" data-name="Frame">
                <p className="font-jakarta font-bold overflow-hidden relative shrink-0 text-[#0f172a] text-[12px] text-ellipsis">María González</p>
                <p className="font-jakarta font-medium relative shrink-0 text-[#64748b] text-[11px]">64 años</p>
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] overflow-hidden relative shrink-0 text-[#0f172a] text-[13px] text-ellipsis w-[180px] whitespace-nowrap">Philips IntelliVue MX800</p>
              <div className="content-stretch flex items-start relative shrink-0 w-[100px]" data-name="Frame">
                <div className="bg-[#ecfdf5] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#10b981] text-[11px] whitespace-nowrap">ACTIVO</p>
                </div>
              </div>
              <div className="content-stretch flex items-start relative shrink-0 w-[100px]" data-name="Frame">
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Frame">
                  <div className="border border-[#64748b] border-solid content-stretch flex h-[12px] items-center overflow-clip p-px relative rounded-[2px] shrink-0 w-[24px]" data-name="Frame">
                    <div className="bg-[#10b981] h-full relative rounded-[1px] shrink-0 w-[17px]" data-name="Rectangle" />
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">92%</p>
                </div>
              </div>
              <div className="content-stretch flex items-center relative shrink-0 w-[130px]" data-name="Frame">
                <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">15 Jul 2026</p>
              </div>
              <div className="content-start flex flex-wrap gap-[4px] items-start relative shrink-0 w-[180px]" data-name="Frame">
                <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex items-start px-[6px] py-[2px] relative rounded-[4px] shrink-0" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">ECG</p>
                </div>
                <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex items-start px-[6px] py-[2px] relative rounded-[4px] shrink-0" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">SpO2</p>
                </div>
                <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex items-start px-[6px] py-[2px] relative rounded-[4px] shrink-0" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">PA</p>
                </div>
              </div>
              <div className="content-stretch flex flex-[1_0_0] items-start justify-end min-w-px relative" data-name="Frame">
                <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-start px-[12px] py-[6px] relative rounded-[6px] shrink-0" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[12px] whitespace-nowrap">Ver Detalle</p>
                </div>
              </div>
            </div>
            <div className="bg-white border-[#e2e8f0] border-b border-solid content-stretch flex gap-[16px] items-center px-[24px] py-[12px] relative shrink-0 w-full" data-name="row-C-02">
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-[60px]" data-name="Frame">
                <div className="relative shrink-0 size-[16px]" data-name="Vector">
                  <div className="absolute bottom-[18.75%] left-0 right-0 top-1/4">
                    <img className="block max-w-none size-full" alt="" src={imgRowC01Vector} />
                  </div>
                </div>
                <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[12px] whitespace-nowrap">C-02</p>
              </div>
              <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[160px] whitespace-nowrap" data-name="Frame">
                <p className="font-jakarta font-bold overflow-hidden relative shrink-0 text-[#0f172a] text-[12px] text-ellipsis">Juan García</p>
                <p className="font-jakarta font-medium relative shrink-0 text-[#64748b] text-[11px]">72 años</p>
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] overflow-hidden relative shrink-0 text-[#0f172a] text-[13px] text-ellipsis w-[180px] whitespace-nowrap">GE CARESCAPE B650</p>
              <div className="content-stretch flex items-start relative shrink-0 w-[100px]" data-name="Frame">
                <div className="bg-[#ecfdf5] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#10b981] text-[11px] whitespace-nowrap">ACTIVO</p>
                </div>
              </div>
              <div className="content-stretch flex items-start relative shrink-0 w-[100px]" data-name="Frame">
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Frame">
                  <div className="border border-[#64748b] border-solid content-stretch flex h-[12px] items-center overflow-clip p-px relative rounded-[2px] shrink-0 w-[24px]" data-name="Frame">
                    <div className="bg-[#10b981] h-full relative rounded-[1px] shrink-0 w-[16px]" data-name="Rectangle" />
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">87%</p>
                </div>
              </div>
              <div className="content-stretch flex items-center relative shrink-0 w-[130px]" data-name="Frame">
                <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">20 Jul 2026</p>
              </div>
              <div className="content-start flex flex-wrap gap-[4px] items-start relative shrink-0 w-[180px]" data-name="Frame">
                <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex items-start px-[6px] py-[2px] relative rounded-[4px] shrink-0" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">ECG</p>
                </div>
                <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex items-start px-[6px] py-[2px] relative rounded-[4px] shrink-0" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">SpO2</p>
                </div>
                <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex items-start px-[6px] py-[2px] relative rounded-[4px] shrink-0" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">PA</p>
                </div>
                <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex items-start px-[6px] py-[2px] relative rounded-[4px] shrink-0" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">FR</p>
                </div>
              </div>
              <div className="content-stretch flex flex-[1_0_0] items-start justify-end min-w-px relative" data-name="Frame">
                <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-start px-[12px] py-[6px] relative rounded-[6px] shrink-0" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[12px] whitespace-nowrap">Ver Detalle</p>
                </div>
              </div>
            </div>
            <div className="bg-white border-[#e2e8f0] border-b border-solid content-stretch flex gap-[16px] items-center px-[24px] py-[12px] relative shrink-0 w-full" data-name="row-C-03">
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-[60px]" data-name="Frame">
                <div className="relative shrink-0 size-[16px]" data-name="Vector">
                  <div className="absolute bottom-[18.75%] left-0 right-0 top-1/4">
                    <img className="block max-w-none size-full" alt="" src={imgRowC01Vector} />
                  </div>
                </div>
                <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[12px] whitespace-nowrap">C-03</p>
              </div>
              <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[160px] whitespace-nowrap" data-name="Frame">
                <p className="font-jakarta font-bold overflow-hidden relative shrink-0 text-[#0f172a] text-[12px] text-ellipsis">Carlos Rodríguez</p>
                <p className="font-jakarta font-medium relative shrink-0 text-[#64748b] text-[11px]">58 años</p>
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] overflow-hidden relative shrink-0 text-[#0f172a] text-[13px] text-ellipsis w-[180px] whitespace-nowrap">Philips IntelliVue MX800</p>
              <div className="content-stretch flex items-start relative shrink-0 w-[100px]" data-name="Frame">
                <div className="bg-[#ecfdf5] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#10b981] text-[11px] whitespace-nowrap">ACTIVO</p>
                </div>
              </div>
              <div className="content-stretch flex items-start relative shrink-0 w-[100px]" data-name="Frame">
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Frame">
                  <div className="border border-[#64748b] border-solid content-stretch flex h-[12px] items-center overflow-clip p-px relative rounded-[2px] shrink-0 w-[24px]" data-name="Frame">
                    <div className="bg-[#10b981] h-full relative rounded-[1px] shrink-0 w-[17px]" data-name="Rectangle" />
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">95%</p>
                </div>
              </div>
              <div className="content-stretch flex items-center relative shrink-0 w-[130px]" data-name="Frame">
                <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">01 Ago 2026</p>
              </div>
              <div className="content-start flex flex-wrap gap-[4px] items-start relative shrink-0 w-[180px]" data-name="Frame">
                <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex items-start px-[6px] py-[2px] relative rounded-[4px] shrink-0" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">ECG</p>
                </div>
                <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex items-start px-[6px] py-[2px] relative rounded-[4px] shrink-0" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">SpO2</p>
                </div>
                <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex items-start px-[6px] py-[2px] relative rounded-[4px] shrink-0" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">PA</p>
                </div>
              </div>
              <div className="content-stretch flex flex-[1_0_0] items-start justify-end min-w-px relative" data-name="Frame">
                <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-start px-[12px] py-[6px] relative rounded-[6px] shrink-0" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[12px] whitespace-nowrap">Ver Detalle</p>
                </div>
              </div>
            </div>
            <div className="bg-white border-[#e2e8f0] border-b border-solid content-stretch flex gap-[16px] items-center px-[24px] py-[12px] relative shrink-0 w-full" data-name="row-C-05">
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-[60px]" data-name="Frame">
                <div className="relative shrink-0 size-[16px]" data-name="Vector">
                  <div className="absolute bottom-[18.75%] left-0 right-0 top-1/4">
                    <img className="block max-w-none size-full" alt="" src={imgRowC01Vector} />
                  </div>
                </div>
                <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[12px] whitespace-nowrap">C-05</p>
              </div>
              <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[160px] whitespace-nowrap" data-name="Frame">
                <p className="font-jakarta font-bold overflow-hidden relative shrink-0 text-[#0f172a] text-[12px] text-ellipsis">Laura Torres</p>
                <p className="font-jakarta font-medium relative shrink-0 text-[#64748b] text-[11px]">49 años</p>
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] overflow-hidden relative shrink-0 text-[#0f172a] text-[13px] text-ellipsis w-[180px] whitespace-nowrap">Mindray BeneVision N22</p>
              <div className="content-stretch flex items-start relative shrink-0 w-[100px]" data-name="Frame">
                <div className="bg-[#ecfdf5] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#10b981] text-[11px] whitespace-nowrap">ACTIVO</p>
                </div>
              </div>
              <div className="content-stretch flex items-start relative shrink-0 w-[100px]" data-name="Frame">
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Frame">
                  <div className="border border-[#64748b] border-solid content-stretch flex h-[12px] items-center overflow-clip p-px relative rounded-[2px] shrink-0 w-[24px]" data-name="Frame">
                    <div className="bg-[#10b981] h-full relative rounded-[1px] shrink-0 w-[14px]" data-name="Rectangle" />
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">78%</p>
                </div>
              </div>
              <div className="content-stretch flex items-center relative shrink-0 w-[130px]" data-name="Frame">
                <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">10 Jul 2026</p>
              </div>
              <div className="content-start flex flex-wrap gap-[4px] items-start relative shrink-0 w-[180px]" data-name="Frame">
                <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex items-start px-[6px] py-[2px] relative rounded-[4px] shrink-0" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">ECG</p>
                </div>
                <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex items-start px-[6px] py-[2px] relative rounded-[4px] shrink-0" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">SpO2</p>
                </div>
                <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex items-start px-[6px] py-[2px] relative rounded-[4px] shrink-0" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">PA</p>
                </div>
                <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex items-start px-[6px] py-[2px] relative rounded-[4px] shrink-0" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">Temp</p>
                </div>
              </div>
              <div className="content-stretch flex flex-[1_0_0] items-start justify-end min-w-px relative" data-name="Frame">
                <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-start px-[12px] py-[6px] relative rounded-[6px] shrink-0" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[12px] whitespace-nowrap">Ver Detalle</p>
                </div>
              </div>
            </div>
            <div className="bg-[#fef2f2] border-[#e2e8f0] border-b border-solid content-stretch flex gap-[16px] items-center px-[24px] py-[12px] relative shrink-0 w-full" data-name="row-C-06">
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-[60px]" data-name="Frame">
                <div className="relative shrink-0 size-[16px]" data-name="Vector">
                  <div className="absolute bottom-[18.75%] left-0 right-0 top-1/4">
                    <img className="block max-w-none size-full" alt="" src={imgRowC06Vector} />
                  </div>
                </div>
                <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[12px] whitespace-nowrap">C-06</p>
              </div>
              <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[160px] whitespace-nowrap" data-name="Frame">
                <p className="font-jakarta font-bold overflow-hidden relative shrink-0 text-[#0f172a] text-[12px] text-ellipsis">Francisco Díaz</p>
                <p className="font-jakarta font-medium relative shrink-0 text-[#64748b] text-[11px]">81 años</p>
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] overflow-hidden relative shrink-0 text-[#0f172a] text-[13px] text-ellipsis w-[180px] whitespace-nowrap">GE CARESCAPE B650</p>
              <div className="content-stretch flex items-start relative shrink-0 w-[100px]" data-name="Frame">
                <div className="bg-[#fef2f2] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#ef4444] text-[11px] whitespace-nowrap">FALLA</p>
                </div>
              </div>
              <div className="content-stretch flex items-start relative shrink-0 w-[100px]" data-name="Frame">
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Frame">
                  <div className="border border-[#64748b] border-solid content-stretch flex h-[12px] items-center overflow-clip p-px relative rounded-[2px] shrink-0 w-[24px]" data-name="Frame">
                    <div className="bg-[#ef4444] h-full relative rounded-[1px] shrink-0 w-[3px]" data-name="Rectangle" />
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#ef4444] text-[13px] whitespace-nowrap">15%</p>
                </div>
              </div>
              <div className="content-stretch flex items-center relative shrink-0 w-[130px]" data-name="Frame">
                <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">05 Jul 2026</p>
              </div>
              <div className="content-start flex flex-wrap gap-y-[4px] items-start relative shrink-0 w-[180px]" data-name="Frame">
                <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex items-start px-[6px] py-[2px] relative rounded-[4px] shrink-0" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">ECG (intermitente)</p>
                </div>
              </div>
              <div className="content-stretch flex flex-[1_0_0] items-start justify-end min-w-px relative" data-name="Frame">
                <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-start px-[12px] py-[6px] relative rounded-[6px] shrink-0" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[12px] whitespace-nowrap">Ver Detalle</p>
                </div>
              </div>
            </div>
            <div className="bg-[rgba(248,250,252,0.7)] border-[#e2e8f0] border-b border-solid content-stretch flex gap-[16px] items-center opacity-70 px-[24px] py-[12px] relative shrink-0 w-full" data-name="row-C-07">
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-[60px]" data-name="Frame">
                <div className="relative shrink-0 size-[16px]" data-name="Vector">
                  <div className="absolute bottom-[18.75%] left-0 right-0 top-1/4">
                    <img className="block max-w-none size-full" alt="" src={imgRowC07Vector} />
                  </div>
                </div>
                <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[12px] whitespace-nowrap">C-07</p>
              </div>
              <div className="content-stretch flex flex-col items-start relative shrink-0 w-[160px]" data-name="Frame">
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] overflow-hidden relative shrink-0 text-[#64748b] text-[12px] text-ellipsis whitespace-nowrap">— Disponible —</p>
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] overflow-hidden relative shrink-0 text-[#0f172a] text-[13px] text-ellipsis w-[180px] whitespace-nowrap">Philips IntelliVue MX550</p>
              <div className="content-stretch flex items-start relative shrink-0 w-[100px]" data-name="Frame">
                <div className="bg-[#f1f5f9] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#64748b] text-[11px] whitespace-nowrap">INACTIVO</p>
                </div>
              </div>
              <div className="content-stretch flex items-start relative shrink-0 w-[100px]" data-name="Frame">
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Frame">
                  <div className="border border-[#64748b] border-solid content-stretch flex h-[12px] items-center overflow-clip p-px relative rounded-[2px] shrink-0 w-[24px]" data-name="Frame">
                    <div className="bg-[#10b981] h-full relative rounded-[1px] shrink-0 w-[18px]" data-name="Rectangle" />
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">100%</p>
                </div>
              </div>
              <div className="content-stretch flex items-center relative shrink-0 w-[130px]" data-name="Frame">
                <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">28 Jul 2026</p>
              </div>
              <div className="content-start flex flex-wrap gap-y-[4px] items-start relative shrink-0 w-[180px]" data-name="Frame">
                <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex items-start px-[6px] py-[2px] relative rounded-[4px] shrink-0" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">—</p>
                </div>
              </div>
              <div className="content-stretch flex flex-[1_0_0] items-start justify-end min-w-px relative" data-name="Frame">
                <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-start px-[12px] py-[6px] relative rounded-[6px] shrink-0" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[12px] whitespace-nowrap">Ver Detalle</p>
                </div>
              </div>
            </div>
            <div className="bg-white border-[#e2e8f0] border-b border-solid content-stretch flex gap-[16px] items-center px-[24px] py-[12px] relative shrink-0 w-full" data-name="row-C-09">
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-[60px]" data-name="Frame">
                <div className="relative shrink-0 size-[16px]" data-name="Vector">
                  <div className="absolute bottom-[18.75%] left-0 right-0 top-1/4">
                    <img className="block max-w-none size-full" alt="" src={imgRowC01Vector} />
                  </div>
                </div>
                <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[12px] whitespace-nowrap">C-09</p>
              </div>
              <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[160px] whitespace-nowrap" data-name="Frame">
                <p className="font-jakarta font-bold overflow-hidden relative shrink-0 text-[#0f172a] text-[12px] text-ellipsis">Ana Morales</p>
                <p className="font-jakarta font-medium relative shrink-0 text-[#64748b] text-[11px]">35 años</p>
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] overflow-hidden relative shrink-0 text-[#0f172a] text-[13px] text-ellipsis w-[180px] whitespace-nowrap">Mindray BeneVision N22</p>
              <div className="content-stretch flex items-start relative shrink-0 w-[100px]" data-name="Frame">
                <div className="bg-[#ecfdf5] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#10b981] text-[11px] whitespace-nowrap">ACTIVO</p>
                </div>
              </div>
              <div className="content-stretch flex items-start relative shrink-0 w-[100px]" data-name="Frame">
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Frame">
                  <div className="border border-[#64748b] border-solid content-stretch flex h-[12px] items-center overflow-clip p-px relative rounded-[2px] shrink-0 w-[24px]" data-name="Frame">
                    <div className="bg-[#10b981] h-full relative rounded-[1px] shrink-0 w-[12px]" data-name="Rectangle" />
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">65%</p>
                </div>
              </div>
              <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-[130px]" data-name="Frame">
                <div className="relative shrink-0 size-[6px]" data-name="Ellipse">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgDropdownBadgeEllipse2} />
                </div>
                <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#f59e0b] text-[13px] whitespace-nowrap">25 Jun 2026</p>
              </div>
              <div className="content-start flex flex-wrap gap-[4px] items-start relative shrink-0 w-[180px]" data-name="Frame">
                <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex items-start px-[6px] py-[2px] relative rounded-[4px] shrink-0" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">ECG</p>
                </div>
                <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex items-start px-[6px] py-[2px] relative rounded-[4px] shrink-0" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">SpO2</p>
                </div>
                <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex items-start px-[6px] py-[2px] relative rounded-[4px] shrink-0" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">PA</p>
                </div>
              </div>
              <div className="content-stretch flex flex-[1_0_0] items-start justify-end min-w-px relative" data-name="Frame">
                <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-start px-[12px] py-[6px] relative rounded-[6px] shrink-0" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[12px] whitespace-nowrap">Ver Detalle</p>
                </div>
              </div>
            </div>
            <div className="bg-white border-[#e2e8f0] border-b border-solid content-stretch flex gap-[16px] items-center px-[24px] py-[12px] relative shrink-0 w-full" data-name="row-C-11">
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-[60px]" data-name="Frame">
                <div className="relative shrink-0 size-[16px]" data-name="Vector">
                  <div className="absolute bottom-[18.75%] left-0 right-0 top-1/4">
                    <img className="block max-w-none size-full" alt="" src={imgRowC01Vector} />
                  </div>
                </div>
                <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[12px] whitespace-nowrap">C-11</p>
              </div>
              <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[160px] whitespace-nowrap" data-name="Frame">
                <p className="font-jakarta font-bold overflow-hidden relative shrink-0 text-[#0f172a] text-[12px] text-ellipsis">Pedro Sánchez</p>
                <p className="font-jakarta font-medium relative shrink-0 text-[#64748b] text-[11px]">53 años</p>
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] overflow-hidden relative shrink-0 text-[#0f172a] text-[13px] text-ellipsis w-[180px] whitespace-nowrap">Philips IntelliVue MX800</p>
              <div className="content-stretch flex items-start relative shrink-0 w-[100px]" data-name="Frame">
                <div className="bg-[#ecfdf5] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#10b981] text-[11px] whitespace-nowrap">ACTIVO</p>
                </div>
              </div>
              <div className="content-stretch flex items-start relative shrink-0 w-[100px]" data-name="Frame">
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Frame">
                  <div className="border border-[#64748b] border-solid content-stretch flex h-[12px] items-center overflow-clip p-px relative rounded-[2px] shrink-0 w-[24px]" data-name="Frame">
                    <div className="bg-[#10b981] h-full relative rounded-[1px] shrink-0 w-[16px]" data-name="Rectangle" />
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">88%</p>
                </div>
              </div>
              <div className="content-stretch flex items-center relative shrink-0 w-[130px]" data-name="Frame">
                <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">30 Jul 2026</p>
              </div>
              <div className="content-start flex flex-wrap gap-[4px] items-start relative shrink-0 w-[180px]" data-name="Frame">
                <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex items-start px-[6px] py-[2px] relative rounded-[4px] shrink-0" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">ECG</p>
                </div>
                <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex items-start px-[6px] py-[2px] relative rounded-[4px] shrink-0" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">SpO2</p>
                </div>
                <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex items-start px-[6px] py-[2px] relative rounded-[4px] shrink-0" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">PA</p>
                </div>
                <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex items-start px-[6px] py-[2px] relative rounded-[4px] shrink-0" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">FR</p>
                </div>
              </div>
              <div className="content-stretch flex flex-[1_0_0] items-start justify-end min-w-px relative" data-name="Frame">
                <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-start px-[12px] py-[6px] relative rounded-[6px] shrink-0" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[12px] whitespace-nowrap">Ver Detalle</p>
                </div>
              </div>
            </div>
          </div>
          <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Frame">
            <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Mostrando 8 de 12 monitores UCI activos.</p>
            <div className="content-stretch flex gap-[10px] items-center relative shrink-0" data-name="Frame">
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-start px-[12px] py-[8px] relative rounded-[8px] shrink-0" data-name="Frame">
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">Anterior</p>
              </div>
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-start px-[12px] py-[8px] relative rounded-[8px] shrink-0" data-name="Frame">
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">Siguiente</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
