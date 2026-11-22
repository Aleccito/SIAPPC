// Pantalla "med/turno/resumen-recibido" (Figma node 245:729) — generada desde el diseño original de Figma.
import { Link } from 'react-router-dom';
import imgAvatar27Png from '../../assets/avatar-27.png';
import imgBell3 from '../../assets/bell-3.svg';
import imgDoctorFooterLine5 from '../../assets/doctor-footer-line-5.svg';
import imgHelpIconEllipse from '../../assets/help-icon-ellipse.svg';
import imgLayoutDashboard from '../../assets/layout-dashboard.svg';
import imgLogOut from '../../assets/log-out.svg';
import imgMenuItemAlertasFrame from '../../assets/menu-item-alertas-frame.svg';
import imgMenuItemDispositivosFrame from '../../assets/menu-item-dispositivos-frame.svg';
import imgMenuItemMonitoreoFrame from '../../assets/menu-item-monitoreo-frame.svg';
import imgMenuItemPacientesFrame from '../../assets/menu-item-pacientes-frame.svg';
import imgMenuItemReportesFrame from '../../assets/menu-item-reportes-frame.svg';
import imgSearch2 from '../../assets/search-2.svg';

export default function MedTurnoResumenRecibido() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="med/turno/resumen-recibido">
      <div className="bg-[#f8fafc] content-stretch flex h-[920px] items-start overflow-clip relative shrink-0 w-[1440px]" data-name="med-turno-resumen-recibido">
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
              <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Alertas" to="/MedAlertasCentro">
                <div className="relative shrink-0 size-[18px]" data-name="Frame">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgMenuItemAlertasFrame} />
                </div>
                <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Alertas</p>
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
                <img className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[20px] size-full" alt="" src={imgAvatar27Png} />
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
        <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start min-w-px relative" data-name="main-container">
          <div className="bg-white border-[#e2e8f0] border-b border-solid content-stretch flex h-[72px] items-center justify-between px-[32px] relative shrink-0 w-full" data-name="top-bar">
            <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] relative shrink-0 whitespace-nowrap" data-name="title-breadcrumb">
              <p className="font-jakarta font-medium relative shrink-0 text-[#64748b] text-[11px]">{`SIAPPC > Turno > Resumen Recibido`}</p>
              <p className="font-jakarta font-extrabold relative shrink-0 text-[#0f172a] text-[20px]">Entrega de Turno</p>
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
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-start min-h-px p-[32px] relative w-full" data-name="scrollable-body">
            <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="screen-header">
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[11px] whitespace-nowrap">{`SIAPPC > Dashboard > Resumen de Turno`}</p>
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="title-row">
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="title-left">
                  <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[22px] whitespace-nowrap">Resumen de Turno Recibido</p>
                  <div className="bg-[#fef3c7] content-stretch flex items-start px-[10px] py-[4px] relative rounded-[6px] shrink-0" data-name="badge-estado">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#92400e] text-[12px] whitespace-nowrap">En revisión</p>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-end leading-[normal] relative shrink-0 text-[12px] whitespace-nowrap" data-name="metadata">
                  <p className="font-jakarta font-semibold relative shrink-0 text-[#0f172a]">Turno Nocturno 23:00-07:00</p>
                  <p className="font-jakarta font-normal relative shrink-0 text-[#64748b]">Fecha: 14 Ago 2026, 06:55 hrs</p>
                  <p className="font-jakarta font-normal relative shrink-0 text-[#64748b]">3 pacientes incluidos</p>
                </div>
              </div>
              <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] min-w-full relative shrink-0 text-[#64748b] text-[13px] w-[min-content]">Entregado por: Dra. Laura Sánchez - Médico de Guardia Nocturna</p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] gap-[20px] items-start min-h-px relative w-full" data-name="content-split">
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-start min-w-px relative" data-name="col-left">
                <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[14px] items-start p-[20px] relative rounded-[12px] shrink-0 w-full" data-name="card-pacientes-del-turno">
                  <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="card-header">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap">Pacientes Incluidos en la Entrega</p>
                    <div className="bg-[#f1f5f9] content-stretch flex items-start px-[10px] py-[4px] relative rounded-[6px] shrink-0" data-name="badge-pacientes">
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap">3 pacientes</p>
                    </div>
                  </div>
                  <div className="border border-[#e2e8f0] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[8px] shrink-0 w-full" data-name="patients-table">
                    <div className="[word-break:break-word] bg-[#f8fafc] border-[#e2e8f0] border-b border-solid content-stretch flex font-jakarta font-bold items-center leading-[normal] px-[12px] py-[10px] relative shrink-0 text-[#64748b] text-[11px] uppercase" data-name="table-head">
                      <p className="relative shrink-0 w-[220px]">Paciente</p>
                      <p className="relative shrink-0 w-[110px]">Estado</p>
                      <p className="relative shrink-0 w-[180px]">Ubicación</p>
                      <p className="relative shrink-0 w-[220px]">Signos Vitales Clave</p>
                      <p className="relative shrink-0 w-[260px]">Eventos del Turno</p>
                      <p className="relative shrink-0 w-[220px]">Pendientes</p>
                      <p className="relative shrink-0 w-[120px]">Acción</p>
                    </div>
                    <div className="border-[#e2e8f0] border-b border-solid content-stretch flex items-center p-[12px] relative shrink-0 w-full" data-name="row-1">
                      <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[220px] whitespace-nowrap" data-name="Frame">
                        <p className="font-jakarta font-bold relative shrink-0 text-[#0f172a] text-[13px]">María González</p>
                        <p className="font-jakarta font-normal relative shrink-0 text-[#64748b] text-[11px]">HC: PT-8821</p>
                      </div>
                      <div className="content-stretch flex items-center relative shrink-0 w-[110px]" data-name="Frame">
                        <div className="bg-[#fef2f2] content-stretch flex items-start px-[8px] py-[3px] relative rounded-[6px] shrink-0" data-name="Frame">
                          <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#ef4444] text-[11px] whitespace-nowrap">Crítico</p>
                        </div>
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[180px]">UCI Cama D3</p>
                      <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[220px]">FC:112 SpO2:89% PA:85/50</p>
                      <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[260px]">Desaturación 03:00, ajuste FiO2 exitoso</p>
                      <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#2563eb] text-[13px] w-[220px]">TAC control urgente</p>
                      <div className="content-stretch flex items-center relative shrink-0 w-[120px]" data-name="Frame">
                        <Link className="bg-[#2563eb] content-stretch flex items-center justify-center px-[12px] py-[8px] relative rounded-[8px] shrink-0" data-name="btn-ver-paciente" to="/MedPacienteResumen">
                          <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[13px] text-white whitespace-nowrap">Ver Paciente</p>
                        </Link>
                      </div>
                    </div>
                    <div className="border-[#e2e8f0] border-b border-solid content-stretch flex items-center p-[12px] relative shrink-0 w-full" data-name="row-2">
                      <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[220px] whitespace-nowrap" data-name="Frame">
                        <p className="font-jakarta font-bold relative shrink-0 text-[#0f172a] text-[13px]">Juan García</p>
                        <p className="font-jakarta font-normal relative shrink-0 text-[#64748b] text-[11px]">HC: PT-3991</p>
                      </div>
                      <div className="content-stretch flex items-center relative shrink-0 w-[110px]" data-name="Frame">
                        <div className="bg-[#fef3c7] content-stretch flex items-start px-[8px] py-[3px] relative rounded-[6px] shrink-0" data-name="Frame">
                          <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#f59e0b] text-[11px] whitespace-nowrap">Atención</p>
                        </div>
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[180px]">UCI Cama C5</p>
                      <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[220px]">FC:88 SpO2:94% PA:110/70</p>
                      <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[260px]">Glasgow mejoró 9→11, estable toda la noche</p>
                      <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[220px]">Evaluar retiro sedación</p>
                      <div className="content-stretch flex items-center relative shrink-0 w-[120px]" data-name="Frame">
                        <Link className="bg-[#2563eb] content-stretch flex items-center justify-center px-[12px] py-[8px] relative rounded-[8px] shrink-0" data-name="btn-ver-paciente" to="/MedPacienteResumen">
                          <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[13px] text-white whitespace-nowrap">Ver Paciente</p>
                        </Link>
                      </div>
                    </div>
                    <div className="content-stretch flex items-center p-[12px] relative shrink-0 w-full" data-name="row-3">
                      <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[220px] whitespace-nowrap" data-name="Frame">
                        <p className="font-jakarta font-bold relative shrink-0 text-[#0f172a] text-[13px]">Carlos Rodríguez</p>
                        <p className="font-jakarta font-normal relative shrink-0 text-[#64748b] text-[11px]">HC: PT-1102</p>
                      </div>
                      <div className="content-stretch flex items-center relative shrink-0 w-[110px]" data-name="Frame">
                        <div className="bg-[#fef2f2] content-stretch flex items-start px-[8px] py-[3px] relative rounded-[6px] shrink-0" data-name="Frame">
                          <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#ef4444] text-[11px] whitespace-nowrap">Crítico</p>
                        </div>
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[180px]">UCI Cama D1</p>
                      <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[220px]">FC:105 SpO2:91% PA:95/55</p>
                      <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[260px]">Ingreso 02:15, politrauma, estabilizado</p>
                      <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[220px]">Completar nota ingreso</p>
                      <div className="content-stretch flex items-center relative shrink-0 w-[120px]" data-name="Frame">
                        <Link className="bg-[#2563eb] content-stretch flex items-center justify-center px-[12px] py-[8px] relative rounded-[8px] shrink-0" data-name="btn-ver-paciente" to="/MedPacienteResumen">
                          <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[13px] text-white whitespace-nowrap">Ver Paciente</p>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[14px] items-start p-[20px] relative rounded-[12px] shrink-0 w-full" data-name="card-alertas-del-turno">
                  <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="card-header">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap">Alertas del Turno Anterior</p>
                    <div className="bg-[#f1f5f9] content-stretch flex items-start px-[10px] py-[4px] relative rounded-[6px] shrink-0" data-name="badge-alertas">
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap">4 alertas</p>
                    </div>
                  </div>
                  <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="alertas-list">
                    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="alerta-1">
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[13px] w-[80px]">02:15 hrs</p>
                      <div className="content-stretch flex flex-[1_0_0] gap-[10px] items-center min-w-px relative" data-name="alerta-content">
                        <div className="bg-[#ef4444] relative rounded-[5px] shrink-0 size-[10px]" data-name="Frame" />
                        <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-normal leading-[normal] min-w-px relative text-[#0f172a] text-[13px]">Ingreso paciente politrauma Rodríguez - estabilización inmediata requerida</p>
                      </div>
                    </div>
                    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="alerta-2">
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[13px] w-[80px]">03:00 hrs</p>
                      <div className="content-stretch flex flex-[1_0_0] gap-[10px] items-center min-w-px relative" data-name="alerta-content">
                        <div className="bg-[#ef4444] relative rounded-[5px] shrink-0 size-[10px]" data-name="Frame" />
                        <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-normal leading-[normal] min-w-px relative text-[#0f172a] text-[13px]">Desaturación crítica González (SpO2: 84%) - Intervención: ajuste FiO2 a 50%</p>
                      </div>
                    </div>
                    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="alerta-3">
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[13px] w-[80px]">04:20 hrs</p>
                      <div className="content-stretch flex flex-[1_0_0] gap-[10px] items-center min-w-px relative" data-name="alerta-content">
                        <div className="bg-[#f59e0b] relative rounded-[5px] shrink-0 size-[10px]" data-name="Frame" />
                        <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-normal leading-[normal] min-w-px relative text-[#0f172a] text-[13px]">FC elevada García (102 bpm) - Autoresuelta en 15 min</p>
                      </div>
                    </div>
                    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="alerta-4">
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[13px] w-[80px]">05:30 hrs</p>
                      <div className="content-stretch flex flex-[1_0_0] gap-[10px] items-center min-w-px relative" data-name="alerta-content">
                        <div className="bg-[#10b981] relative rounded-[5px] shrink-0 size-[10px]" data-name="Frame" />
                        <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-normal leading-[normal] min-w-px relative text-[#0f172a] text-[13px]">Laboratorios de control procesados - sin valores críticos</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-[420px]" data-name="col-right">
                <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[14px] items-start p-[20px] relative rounded-[12px] shrink-0 w-full" data-name="card-pendientes">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap">Pendientes para Este Turno</p>
                  <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full" data-name="checklist">
                    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="task-1">
                      <div className="border-2 border-[#64748b] border-solid relative rounded-[4px] shrink-0 size-[18px]" data-name="Frame" />
                      <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-normal leading-[normal] min-w-px relative text-[#0f172a] text-[13px]">TAC control urgente - María González</p>
                    </div>
                    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="task-2">
                      <div className="border-2 border-[#64748b] border-solid relative rounded-[4px] shrink-0 size-[18px]" data-name="Frame" />
                      <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-normal leading-[normal] min-w-px relative text-[#0f172a] text-[13px]">Evaluar retiro de sedación - Juan García</p>
                    </div>
                    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="task-3">
                      <div className="border-2 border-[#64748b] border-solid relative rounded-[4px] shrink-0 size-[18px]" data-name="Frame" />
                      <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-normal leading-[normal] min-w-px relative text-[#0f172a] text-[13px]">Completar nota de ingreso - Carlos Rodríguez</p>
                    </div>
                    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="task-4">
                      <div className="border-2 border-[#64748b] border-solid relative rounded-[4px] shrink-0 size-[18px]" data-name="Frame" />
                      <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-normal leading-[normal] min-w-px relative text-[#0f172a] text-[13px]">Revisión de laboratorios de control (4 pacientes)</p>
                    </div>
                    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="task-5">
                      <div className="border-2 border-[#64748b] border-solid relative rounded-[4px] shrink-0 size-[18px]" data-name="Frame" />
                      <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-normal leading-[normal] min-w-px relative text-[#0f172a] text-[13px]">Contactar familiar González (actualización estado)</p>
                    </div>
                  </div>
                </div>
                <div className="bg-[#fffbeb] border border-[#fde68a] border-solid content-stretch flex flex-col gap-[12px] items-start p-[20px] relative rounded-[12px] shrink-0 w-full" data-name="card-indicaciones">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap">Indicaciones Importantes</p>
                  <div className="content-stretch flex gap-[10px] items-start relative shrink-0 w-full" data-name="indicacion-1">
                    <div className="bg-[#f59e0b] relative rounded-[4px] shrink-0 size-[8px]" data-name="Frame" />
                    <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-normal leading-[1.5] min-w-px relative text-[#92400e] text-[13px]">González: NO reducir FiO2 sin gasometría previa</p>
                  </div>
                  <div className="content-stretch flex gap-[10px] items-start relative shrink-0 w-full" data-name="indicacion-2">
                    <div className="bg-[#f59e0b] relative rounded-[4px] shrink-0 size-[8px]" data-name="Frame" />
                    <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-normal leading-[1.5] min-w-px relative text-[#92400e] text-[13px]">García: Suspender propofol solo si GCS ≥ 12 sostenido por 2h</p>
                  </div>
                  <div className="content-stretch flex gap-[10px] items-start relative shrink-0 w-full" data-name="indicacion-3">
                    <div className="bg-[#f59e0b] relative rounded-[4px] shrink-0 size-[8px]" data-name="Frame" />
                    <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-normal leading-[1.5] min-w-px relative text-[#92400e] text-[13px]">Rodríguez: Pendiente consentimiento quirúrgico</p>
                  </div>
                </div>
                <div className="[word-break:break-word] bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[12px] items-start p-[20px] relative rounded-[12px] shrink-0 w-full" data-name="card-notas">
                  <p className="font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap">Notas del Turno Anterior</p>
                  <p className="font-jakarta font-normal leading-[1.5] min-w-full relative shrink-0 text-[#64748b] text-[13px] w-[min-content]">Noche con un ingreso nuevo y un episodio de desaturación resuelto. González fue el caso más delicado - responde bien al ajuste. García muestra mejoría neurológica sostenida. Rodríguez estable post-estabilización.</p>
                </div>
                <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full" data-name="footer">
                  <div className="bg-[#2563eb] content-stretch flex items-center justify-center p-[14px] relative rounded-[8px] shrink-0 w-full" data-name="btn-read-confirm">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">Marcar como Leído ✓</p>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[11px] w-full">Al marcar como leído confirmas que revisaste la entrega de turno</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
