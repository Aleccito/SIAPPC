// Pantalla "med/dashboard/principal" (Figma node 245:22) — generada desde el diseño original de Figma.
import { Link } from 'react-router-dom';
import imgActivity from '../../assets/activity.svg';
import imgAlertTriangle2 from '../../assets/alert-triangle-2.svg';
import imgAvatar7Png from '../../assets/avatar-7.png';
import imgBell from '../../assets/bell.svg';
import imgBell3 from '../../assets/bell-3.svg';
import imgCheckSquare from '../../assets/check-square.svg';
import imgCpu from '../../assets/cpu.svg';
import imgDoctorFooterLine4 from '../../assets/doctor-footer-line-4.svg';
import imgEye from '../../assets/eye.svg';
import imgFileText from '../../assets/file-text.svg';
import imgFileText4 from '../../assets/file-text-4.svg';
import imgFolder from '../../assets/folder.svg';
import imgHeart2 from '../../assets/heart-2.svg';
import imgHeart3 from '../../assets/heart-3.svg';
import imgHelpIconEllipse from '../../assets/help-icon-ellipse.svg';
import imgLayoutDashboard2 from '../../assets/layout-dashboard-2.svg';
import imgLogOut2 from '../../assets/log-out-2.svg';
import imgSearch from '../../assets/search.svg';
import imgSparklineContainer from '../../assets/sparkline-container.svg';
import imgSparklineContainer2 from '../../assets/sparkline-container-2.svg';
import imgSparklineContainer3 from '../../assets/sparkline-container-3.svg';
import imgSparklineContainer4 from '../../assets/sparkline-container-4.svg';
import imgUsers2 from '../../assets/users-2.svg';
import imgUsers3 from '../../assets/users-3.svg';

export default function MedDashboardPrincipal() {
  return (
    <div className="bg-[#f8fafc] content-stretch flex items-start min-h-[920px] overflow-clip relative shrink-0 w-[1440px]" data-name="med/dashboard/principal">
      <div className="bg-[#0f172a] border-[#1e293b] border-r border-solid content-stretch flex flex-col items-start justify-between p-[20px] relative self-stretch shrink-0 w-[220px]" data-name="sidebar">
        <div className="content-stretch flex flex-col gap-[28px] items-start relative shrink-0 w-full" data-name="top-group">
          <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="brand">
            <div className="bg-[#2563eb] content-stretch flex flex-col items-center justify-center relative rounded-[8px] shrink-0 size-[32px]" data-name="logo-mark">
              <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[16px] text-white whitespace-nowrap">S</p>
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-px items-start leading-[normal] min-w-px relative whitespace-nowrap" data-name="wordmark">
              <p className="font-jakarta font-extrabold relative shrink-0 text-[16px] text-white">SIAPPC</p>
              <p className="font-jakarta font-bold relative shrink-0 text-[#64748b] text-[9px] uppercase">ATLS MONITOREO</p>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="menu">
            <Link className="bg-[rgba(37,99,235,0.15)] content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Dashboard" to="/MedDashboardPrincipal">
              <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[18px]" data-name="icon-wrapper">
                <div className="relative shrink-0 size-[18px]" data-name="layout-dashboard">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgLayoutDashboard2} />
                </div>
              </div>
              <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">Dashboard</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Pacientes" to="/MedPacientesLista">
              <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[18px]" data-name="icon-wrapper">
                <div className="relative shrink-0 size-[18px]" data-name="users">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgUsers2} />
                </div>
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#94a3b8] text-[14px] whitespace-nowrap">Pacientes</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Monitoreo" to="/MedMonitoreoGridUci">
              <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[18px]" data-name="icon-wrapper">
                <div className="relative shrink-0 size-[18px]" data-name="activity">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgActivity} />
                </div>
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#94a3b8] text-[14px] whitespace-nowrap">Monitoreo</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Alertas" to="/MedAlertasCentro">
              <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[18px]" data-name="icon-wrapper">
                <div className="relative shrink-0 size-[18px]" data-name="bell">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBell} />
                </div>
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#94a3b8] text-[14px] whitespace-nowrap">Alertas</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Reportes" to="/MedReportesPanel">
              <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[18px]" data-name="icon-wrapper">
                <div className="relative shrink-0 size-[18px]" data-name="file-text">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgFileText} />
                </div>
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#94a3b8] text-[14px] whitespace-nowrap">Reportes</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Dispositivos" to="/MedDispositivosMonitores">
              <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[18px]" data-name="icon-wrapper">
                <div className="relative shrink-0 size-[18px]" data-name="cpu">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgCpu} />
                </div>
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#94a3b8] text-[14px] whitespace-nowrap">Dispositivos</p>
            </Link>
          </div>
        </div>
        <Link className="absolute left-[20px] opacity-25 size-[18px] top-[822px]" data-name="help-icon" to="/MedAyudaSoporte">
          <div className="absolute left-0 size-[18px] top-0" data-name="Ellipse">
            <div className="absolute inset-[-4.17%]">
              <img className="block max-w-none size-full" alt="" src={imgHelpIconEllipse} />
            </div>
          </div>
          <p className="[word-break:break-word] absolute font-geist font-bold leading-[normal] left-[5.5px] text-[#64748b] text-[11px] top-[1.5px] whitespace-nowrap">?</p>
        </Link>
        <div className="content-stretch flex flex-col gap-[14px] items-start relative shrink-0 w-full" data-name="doctor-footer">
          <div className="h-0 relative shrink-0 w-full" data-name="Line">
            <div className="absolute inset-[-1px_0_0_0]">
              <img className="block max-w-none size-full" alt="" src={imgDoctorFooterLine4} />
            </div>
          </div>
          <Link className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="user-profile" to="/MedPerfilMiPerfil">
            <div className="relative rounded-[18px] shrink-0 size-[36px]" data-name="avatar">
              <img className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[18px] size-full" alt="" src={imgAvatar7Png} />
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px relative whitespace-nowrap" data-name="user-info">
              <p className="font-jakarta font-bold overflow-hidden relative shrink-0 text-[13px] text-ellipsis text-white">Dr. Carlos Méndez</p>
              <p className="font-jakarta font-medium overflow-hidden relative shrink-0 text-[#64748b] text-[11px] text-ellipsis">Médico Especialista</p>
            </div>
            <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="icon-wrapper">
              <div className="relative shrink-0 size-[16px]" data-name="log-out">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgLogOut2} />
              </div>
            </div>
          </Link>
        </div>
      </div>
      <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative self-stretch" data-name="main-container">
        <div className="bg-white border-[#e2e8f0] border-b border-solid content-stretch flex h-[56px] items-center justify-between px-[32px] relative shrink-0 w-full" data-name="header">
          <div className="bg-[#f1f5f9] content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative rounded-[8px] shrink-0 w-[380px]" data-name="search-bar">
            <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="icon-wrapper">
              <div className="relative shrink-0 size-[16px]" data-name="search">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgSearch} />
              </div>
            </div>
            <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Buscar paciente por nombre o HC...</p>
          </div>
          <div className="content-stretch flex items-center relative shrink-0" data-name="header-right">
            <Link className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex items-start p-[8px] relative rounded-[999px] shrink-0" data-name="bell-wrapper" to="/MedNotificacionesCentro">
              <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[18px]" data-name="icon-wrapper">
                <div className="relative shrink-0 size-[18px]" data-name="bell">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBell3} />
                </div>
              </div>
              <div className="absolute bg-[#ef4444] content-stretch flex items-center justify-center right-[-3px] rounded-[8px] size-[16px] top-[-3px]" data-name="badge">
                <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[9px] text-white whitespace-nowrap">3</p>
              </div>
            </Link>
          </div>
        </div>
        <div className="content-stretch flex flex-[1_0_0] gap-[20px] items-start min-h-px overflow-clip p-[24px] relative w-full" data-name="page-body">
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-start min-w-px relative" data-name="left-content-area">
            <div className="content-stretch flex gap-[14px] items-center relative shrink-0 w-full" data-name="kpi-row">
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch drop-shadow-[0px_4px_6px_rgba(0,0,0,0.02)] flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px p-[18px] relative rounded-[12px]" data-name="kpi-pacientes-asignados">
                <div className="absolute bg-[#2563eb] bottom-[-1px] left-[-1px] rounded-bl-[12px] rounded-tl-[12px] top-[-1px] w-[4px]" data-name="Rectangle" />
                <div className="content-stretch flex items-center justify-between pl-[6px] relative shrink-0 w-full" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Pacientes Asignados</p>
                  <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[20px]" data-name="icon-wrapper">
                    <div className="relative shrink-0 size-[20px]" data-name="users">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgUsers3} />
                    </div>
                  </div>
                </div>
                <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[28px] whitespace-nowrap">12</p>
              </div>
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch drop-shadow-[0px_4px_6px_rgba(0,0,0,0.02)] flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px p-[18px] relative rounded-[12px]" data-name="kpi-alertas-críticas">
                <div className="absolute bg-[#ef4444] bottom-[-1px] left-[-1px] rounded-bl-[12px] rounded-tl-[12px] top-[-1px] w-[4px]" data-name="Rectangle" />
                <div className="content-stretch flex items-center justify-between pl-[6px] relative shrink-0 w-full" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Alertas Críticas</p>
                  <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[20px]" data-name="icon-wrapper">
                    <div className="relative shrink-0 size-[20px]" data-name="alert-triangle">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgAlertTriangle2} />
                    </div>
                  </div>
                </div>
                <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#ef4444] text-[28px] whitespace-nowrap">3</p>
              </div>
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch drop-shadow-[0px_4px_6px_rgba(0,0,0,0.02)] flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px p-[18px] relative rounded-[12px]" data-name="kpi-pendientes-evaluación">
                <div className="absolute bg-[#10b981] bottom-[-1px] left-[-1px] rounded-bl-[12px] rounded-tl-[12px] top-[-1px] w-[4px]" data-name="Rectangle" />
                <div className="content-stretch flex items-center justify-between pl-[6px] relative shrink-0 w-full" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Pendientes Evaluación</p>
                  <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[20px]" data-name="icon-wrapper">
                    <div className="relative shrink-0 size-[20px]" data-name="check-square">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgCheckSquare} />
                    </div>
                  </div>
                </div>
                <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[28px] whitespace-nowrap">2</p>
              </div>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[16px] items-start p-[20px] relative rounded-[12px] shrink-0 w-full" data-name="patients-table-section">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="table-meta-header">
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="title-group">
                  <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[16px] whitespace-nowrap">Monitoreo de Pacientes Politraumatizados (ATLS)</p>
                  <div className="bg-[#fef2f2] content-stretch flex items-start px-[10px] py-[4px] relative rounded-[6px] shrink-0" data-name="badge-high-priority">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#ef4444] text-[11px] whitespace-nowrap">Alta Prioridad de Atención</p>
                  </div>
                </div>
                <div className="content-stretch flex gap-[10px] items-center relative shrink-0" data-name="filters-inline">
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap">Unidad:</p>
                  <div className="bg-[#f1f5f9] content-stretch flex items-start px-[10px] py-[6px] relative rounded-[6px] shrink-0" data-name="Frame">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[12px] whitespace-nowrap">UCI</p>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap">Estado:</p>
                  <div className="bg-[#f1f5f9] content-stretch flex items-start px-[10px] py-[6px] relative rounded-[6px] shrink-0" data-name="Frame">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[12px] whitespace-nowrap">Todos</p>
                  </div>
                </div>
              </div>
              <div className="border border-[#e2e8f0] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[8px] shrink-0 w-full" data-name="patients-table">
                <div className="[word-break:break-word] bg-[#f8fafc] border-[#e2e8f0] border-b border-solid content-stretch flex font-jakarta font-bold items-center leading-[normal] px-[16px] py-[12px] relative shrink-0 text-[#64748b] text-[11px] uppercase w-[972px]" data-name="table-head">
                  <p className="relative shrink-0 w-[180px]">Nombre / HC</p>
                  <p className="relative shrink-0 w-[100px]">Estado</p>
                  <p className="relative shrink-0 w-[100px]">Ubicación</p>
                  <p className="relative shrink-0 w-[250px]">Signos Vitales</p>
                  <p className="relative shrink-0 w-[130px]">Glasgow / TR</p>
                  <p className="relative shrink-0 w-[120px]">Alerta Activa</p>
                  <p className="flex-[1_0_0] min-w-px relative text-right">Acciones</p>
                </div>
                <div className="bg-[#fef2f2] border-[#e2e8f0] border-b border-solid content-stretch flex items-center px-[16px] py-[12px] relative shrink-0 w-[912px]" data-name="row-1">
                  <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[180px] whitespace-nowrap" data-name="Frame">
                    <p className="font-jakarta font-bold relative shrink-0 text-[#0f172a] text-[13px]">García López, Juan</p>
                    <p className="font-jakarta font-normal relative shrink-0 text-[#64748b] text-[11px]">HC-49521</p>
                  </div>
                  <div className="content-stretch flex items-start relative shrink-0 w-[100px]" data-name="Frame">
                    <div className="bg-[#fee2e2] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-name="Frame">
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#ef4444] text-[11px] whitespace-nowrap">CRÍTICO</p>
                    </div>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[100px]">UCI Cama 3</p>
                  <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[250px] whitespace-nowrap" data-name="Frame">
                    <p className="font-jakarta font-bold relative shrink-0 text-[#ef4444] text-[13px]">FC: 112↑ SpO2: 89%↓</p>
                    <p className="font-jakarta font-normal relative shrink-0 text-[#64748b] text-[11px]">PA: 85/50 (Hipotensión)</p>
                  </div>
                  <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[130px] whitespace-nowrap" data-name="Frame">
                    <p className="font-jakarta font-bold relative shrink-0 text-[#0f172a] text-[13px]">GCS: 9/15</p>
                    <p className="font-jakarta font-semibold relative shrink-0 text-[#ef4444] text-[11px]">TRIAGE: T1</p>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#ef4444] text-[12px] w-[120px]">⚠️ Hace 4 min</p>
                  <div className="content-stretch flex flex-[1_0_0] gap-[4px] items-start justify-end min-w-px relative" data-name="Frame">
                    <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-center justify-center p-[8px] relative rounded-[8px] shrink-0" data-name="action-btn-perfil">
                      <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[14px]" data-name="icon-wrapper">
                        <div className="relative shrink-0 size-[14px]" data-name="eye">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgEye} />
                        </div>
                      </div>
                    </div>
                    <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-center justify-center p-[8px] relative rounded-[8px] shrink-0" data-name="action-btn-monitoreo">
                      <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[14px]" data-name="icon-wrapper">
                        <div className="relative shrink-0 size-[14px]" data-name="heart">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgHeart2} />
                        </div>
                      </div>
                    </div>
                    <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-center justify-center p-[8px] relative rounded-[8px] shrink-0" data-name="action-btn-soap">
                      <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[14px]" data-name="icon-wrapper">
                        <div className="relative shrink-0 size-[14px]" data-name="file-text">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgFileText4} />
                        </div>
                      </div>
                    </div>
                    <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-center justify-center p-[8px] relative rounded-[8px] shrink-0" data-name="action-btn-historia">
                      <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[14px]" data-name="icon-wrapper">
                        <div className="relative shrink-0 size-[14px]" data-name="folder">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgFolder} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-[#fef2f2] border-[#e2e8f0] border-b border-solid content-stretch flex items-center px-[16px] py-[12px] relative shrink-0 w-[912px]" data-name="row-2">
                  <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[180px] whitespace-nowrap" data-name="Frame">
                    <p className="font-jakarta font-bold relative shrink-0 text-[#0f172a] text-[13px]">Rojas Méndez, Ana</p>
                    <p className="font-jakarta font-normal relative shrink-0 text-[#64748b] text-[11px]">HC-98232</p>
                  </div>
                  <div className="content-stretch flex items-start relative shrink-0 w-[100px]" data-name="Frame">
                    <div className="bg-[#fee2e2] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-name="Frame">
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#ef4444] text-[11px] whitespace-nowrap">CRÍTICO</p>
                    </div>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[100px]">UCI Cama 7</p>
                  <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[250px] whitespace-nowrap" data-name="Frame">
                    <p className="font-jakarta font-bold relative shrink-0 text-[#ef4444] text-[13px]">FC: 98 SpO2: 91%↓</p>
                    <p className="font-jakarta font-normal relative shrink-0 text-[#64748b] text-[11px]">PA: 90/60 (Baja)</p>
                  </div>
                  <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[130px] whitespace-nowrap" data-name="Frame">
                    <p className="font-jakarta font-bold relative shrink-0 text-[#0f172a] text-[13px]">GCS: 11/15</p>
                    <p className="font-jakarta font-semibold relative shrink-0 text-[#ef4444] text-[11px]">TRIAGE: T1</p>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#ef4444] text-[12px] w-[120px]">⚠️ Hace 3 min</p>
                  <div className="content-stretch flex flex-[1_0_0] gap-[4px] items-start justify-end min-w-px relative" data-name="Frame">
                    <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-center justify-center p-[8px] relative rounded-[8px] shrink-0" data-name="action-btn-perfil">
                      <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[14px]" data-name="icon-wrapper">
                        <div className="relative shrink-0 size-[14px]" data-name="eye">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgEye} />
                        </div>
                      </div>
                    </div>
                    <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-center justify-center p-[8px] relative rounded-[8px] shrink-0" data-name="action-btn-monitoreo">
                      <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[14px]" data-name="icon-wrapper">
                        <div className="relative shrink-0 size-[14px]" data-name="heart">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgHeart2} />
                        </div>
                      </div>
                    </div>
                    <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-center justify-center p-[8px] relative rounded-[8px] shrink-0" data-name="action-btn-soap">
                      <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[14px]" data-name="icon-wrapper">
                        <div className="relative shrink-0 size-[14px]" data-name="file-text">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgFileText4} />
                        </div>
                      </div>
                    </div>
                    <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-center justify-center p-[8px] relative rounded-[8px] shrink-0" data-name="action-btn-historia">
                      <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[14px]" data-name="icon-wrapper">
                        <div className="relative shrink-0 size-[14px]" data-name="folder">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgFolder} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white border-[#e2e8f0] border-b border-solid content-stretch flex items-center px-[16px] py-[12px] relative shrink-0 w-[912px]" data-name="row-3">
                  <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[180px] whitespace-nowrap" data-name="Frame">
                    <p className="font-jakarta font-bold relative shrink-0 text-[#0f172a] text-[13px]">Pérez Díaz, Carlos</p>
                    <p className="font-jakarta font-normal relative shrink-0 text-[#64748b] text-[11px]">HC-44923</p>
                  </div>
                  <div className="content-stretch flex items-start relative shrink-0 w-[100px]" data-name="Frame">
                    <div className="bg-[#fffbeb] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-name="Frame">
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#f59e0b] text-[11px] whitespace-nowrap">ATENCIÓN</p>
                    </div>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[100px]">UCI Cama 2</p>
                  <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[250px] whitespace-nowrap" data-name="Frame">
                    <p className="font-jakarta font-bold relative shrink-0 text-[#0f172a] text-[13px]">FC: 88↑ SpO2: 94%</p>
                    <p className="font-jakarta font-normal relative shrink-0 text-[#64748b] text-[11px]">PA: 110/70</p>
                  </div>
                  <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[130px] whitespace-nowrap" data-name="Frame">
                    <p className="font-jakarta font-bold relative shrink-0 text-[#0f172a] text-[13px]">GCS: 13/15</p>
                    <p className="font-jakarta font-semibold relative shrink-0 text-[#f59e0b] text-[11px]">TRIAGE: T2</p>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[12px] w-[120px]">Ninguna</p>
                  <div className="content-stretch flex flex-[1_0_0] gap-[4px] items-start justify-end min-w-px relative" data-name="Frame">
                    <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-center justify-center p-[8px] relative rounded-[8px] shrink-0" data-name="action-btn-perfil">
                      <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[14px]" data-name="icon-wrapper">
                        <div className="relative shrink-0 size-[14px]" data-name="eye">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgEye} />
                        </div>
                      </div>
                    </div>
                    <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-center justify-center p-[8px] relative rounded-[8px] shrink-0" data-name="action-btn-monitoreo">
                      <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[14px]" data-name="icon-wrapper">
                        <div className="relative shrink-0 size-[14px]" data-name="heart">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgHeart3} />
                        </div>
                      </div>
                    </div>
                    <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-center justify-center p-[8px] relative rounded-[8px] shrink-0" data-name="action-btn-soap">
                      <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[14px]" data-name="icon-wrapper">
                        <div className="relative shrink-0 size-[14px]" data-name="file-text">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgFileText4} />
                        </div>
                      </div>
                    </div>
                    <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-center justify-center p-[8px] relative rounded-[8px] shrink-0" data-name="action-btn-historia">
                      <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[14px]" data-name="icon-wrapper">
                        <div className="relative shrink-0 size-[14px]" data-name="folder">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgFolder} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white border-[#e2e8f0] border-b border-solid content-stretch flex items-center px-[16px] py-[12px] relative shrink-0 w-[912px]" data-name="row-4">
                  <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[180px] whitespace-nowrap" data-name="Frame">
                    <p className="font-jakarta font-bold relative shrink-0 text-[#0f172a] text-[13px]">Morales Vega, Luis</p>
                    <p className="font-jakarta font-normal relative shrink-0 text-[#64748b] text-[11px]">HC-49822</p>
                  </div>
                  <div className="content-stretch flex items-start relative shrink-0 w-[100px]" data-name="Frame">
                    <div className="bg-[#fffbeb] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-name="Frame">
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#f59e0b] text-[11px] whitespace-nowrap">ATENCIÓN</p>
                    </div>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[100px]">UCI Cama 5</p>
                  <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[250px] whitespace-nowrap" data-name="Frame">
                    <p className="font-jakarta font-bold relative shrink-0 text-[#0f172a] text-[13px]">FC: 92↑ SpO2: 93%</p>
                    <p className="font-jakarta font-normal relative shrink-0 text-[#64748b] text-[11px]">PA: 105/65</p>
                  </div>
                  <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[130px] whitespace-nowrap" data-name="Frame">
                    <p className="font-jakarta font-bold relative shrink-0 text-[#0f172a] text-[13px]">GCS: 12/15</p>
                    <p className="font-jakarta font-semibold relative shrink-0 text-[#f59e0b] text-[11px]">TRIAGE: T2</p>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[12px] w-[120px]">Ninguna</p>
                  <div className="content-stretch flex flex-[1_0_0] gap-[4px] items-start justify-end min-w-px relative" data-name="Frame">
                    <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-center justify-center p-[8px] relative rounded-[8px] shrink-0" data-name="action-btn-perfil">
                      <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[14px]" data-name="icon-wrapper">
                        <div className="relative shrink-0 size-[14px]" data-name="eye">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgEye} />
                        </div>
                      </div>
                    </div>
                    <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-center justify-center p-[8px] relative rounded-[8px] shrink-0" data-name="action-btn-monitoreo">
                      <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[14px]" data-name="icon-wrapper">
                        <div className="relative shrink-0 size-[14px]" data-name="heart">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgHeart3} />
                        </div>
                      </div>
                    </div>
                    <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-center justify-center p-[8px] relative rounded-[8px] shrink-0" data-name="action-btn-soap">
                      <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[14px]" data-name="icon-wrapper">
                        <div className="relative shrink-0 size-[14px]" data-name="file-text">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgFileText4} />
                        </div>
                      </div>
                    </div>
                    <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-center justify-center p-[8px] relative rounded-[8px] shrink-0" data-name="action-btn-historia">
                      <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[14px]" data-name="icon-wrapper">
                        <div className="relative shrink-0 size-[14px]" data-name="folder">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgFolder} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white border-[#e2e8f0] border-b border-solid content-stretch flex items-center px-[16px] py-[12px] relative shrink-0 w-[912px]" data-name="row-5">
                  <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[180px] whitespace-nowrap" data-name="Frame">
                    <p className="font-jakarta font-bold relative shrink-0 text-[#0f172a] text-[13px]">Fernández R., María</p>
                    <p className="font-jakarta font-normal relative shrink-0 text-[#64748b] text-[11px]">HC-86521</p>
                  </div>
                  <div className="content-stretch flex items-start relative shrink-0 w-[100px]" data-name="Frame">
                    <div className="bg-[#ecfdf5] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-name="Frame">
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#10b981] text-[11px] whitespace-nowrap">ESTABLE</p>
                    </div>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[100px]">UCI Cama 12</p>
                  <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[13px] w-[250px]">-</p>
                  <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[130px] whitespace-nowrap" data-name="Frame">
                    <p className="font-jakarta font-bold relative shrink-0 text-[#0f172a] text-[13px]">GCS: 15/15</p>
                    <p className="font-jakarta font-semibold relative shrink-0 text-[#10b981] text-[11px]">TRIAGE: T3</p>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[12px] w-[120px]">Ninguna</p>
                  <div className="content-stretch flex flex-[1_0_0] gap-[4px] items-start justify-end min-w-px relative" data-name="Frame">
                    <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-center justify-center p-[8px] relative rounded-[8px] shrink-0" data-name="action-btn-perfil">
                      <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[14px]" data-name="icon-wrapper">
                        <div className="relative shrink-0 size-[14px]" data-name="eye">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgEye} />
                        </div>
                      </div>
                    </div>
                    <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-center justify-center p-[8px] relative rounded-[8px] shrink-0" data-name="action-btn-monitoreo">
                      <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[14px]" data-name="icon-wrapper">
                        <div className="relative shrink-0 size-[14px]" data-name="heart">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgHeart3} />
                        </div>
                      </div>
                    </div>
                    <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-center justify-center p-[8px] relative rounded-[8px] shrink-0" data-name="action-btn-soap">
                      <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[14px]" data-name="icon-wrapper">
                        <div className="relative shrink-0 size-[14px]" data-name="file-text">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgFileText4} />
                        </div>
                      </div>
                    </div>
                    <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-center justify-center p-[8px] relative rounded-[8px] shrink-0" data-name="action-btn-historia">
                      <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[14px]" data-name="icon-wrapper">
                        <div className="relative shrink-0 size-[14px]" data-name="folder">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgFolder} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white content-stretch flex items-center px-[16px] py-[12px] relative shrink-0 w-[912px]" data-name="row-6">
                  <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[180px] whitespace-nowrap" data-name="Frame">
                    <p className="font-jakarta font-bold relative shrink-0 text-[#0f172a] text-[13px]">Torres G., Diego</p>
                    <p className="font-jakarta font-normal relative shrink-0 text-[#64748b] text-[11px]">HC-19235</p>
                  </div>
                  <div className="content-stretch flex items-start relative shrink-0 w-[100px]" data-name="Frame">
                    <div className="bg-[#ecfdf5] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-name="Frame">
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#10b981] text-[11px] whitespace-nowrap">ESTABLE</p>
                    </div>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[100px]">UCI Cama 8</p>
                  <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[13px] w-[250px]">-</p>
                  <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[130px] whitespace-nowrap" data-name="Frame">
                    <p className="font-jakarta font-bold relative shrink-0 text-[#0f172a] text-[13px]">GCS: 15/15</p>
                    <p className="font-jakarta font-semibold relative shrink-0 text-[#10b981] text-[11px]">TRIAGE: T3</p>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[12px] w-[120px]">Ninguna</p>
                  <div className="content-stretch flex flex-[1_0_0] gap-[4px] items-start justify-end min-w-px relative" data-name="Frame">
                    <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-center justify-center p-[8px] relative rounded-[8px] shrink-0" data-name="action-btn-perfil">
                      <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[14px]" data-name="icon-wrapper">
                        <div className="relative shrink-0 size-[14px]" data-name="eye">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgEye} />
                        </div>
                      </div>
                    </div>
                    <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-center justify-center p-[8px] relative rounded-[8px] shrink-0" data-name="action-btn-monitoreo">
                      <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[14px]" data-name="icon-wrapper">
                        <div className="relative shrink-0 size-[14px]" data-name="heart">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgHeart3} />
                        </div>
                      </div>
                    </div>
                    <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-center justify-center p-[8px] relative rounded-[8px] shrink-0" data-name="action-btn-soap">
                      <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[14px]" data-name="icon-wrapper">
                        <div className="relative shrink-0 size-[14px]" data-name="file-text">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgFileText4} />
                        </div>
                      </div>
                    </div>
                    <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-center justify-center p-[8px] relative rounded-[8px] shrink-0" data-name="action-btn-historia">
                      <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[14px]" data-name="icon-wrapper">
                        <div className="relative shrink-0 size-[14px]" data-name="folder">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgFolder} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="[word-break:break-word] content-stretch flex items-center justify-between leading-[normal] relative shrink-0 text-[13px] w-full whitespace-nowrap" data-name="table-footer">
                <p className="font-jakarta font-normal relative shrink-0 text-[#64748b]">Mostrando 6 de 12 pacientes</p>
                <p className="font-jakarta font-bold relative shrink-0 text-[#2563eb]">Ver todos →</p>
              </div>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[14px] items-start p-[20px] relative rounded-[12px] shrink-0 w-full" data-name="widget-tendencias">
              <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 whitespace-nowrap" data-name="trends-header">
                <p className="font-jakarta font-extrabold relative shrink-0 text-[#0f172a] text-[15px]">📈 Tendencias de Pacientes Críticos (Últimas 4 Horas)</p>
                <p className="font-jakarta font-normal relative shrink-0 text-[#64748b] text-[12px]">Lecturas en tiempo real</p>
              </div>
              <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="trend-sparklines-row">
                <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex flex-[1_0_0] gap-[16px] items-center min-w-px p-[12px] relative rounded-[8px]" data-name="patient-1-trend">
                  <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[120px] whitespace-nowrap" data-name="Frame">
                    <p className="font-jakarta font-bold overflow-hidden relative shrink-0 text-[#0f172a] text-[13px] text-ellipsis">García López Juan</p>
                    <p className="font-jakarta font-normal relative shrink-0 text-[#64748b] text-[11px]">UCI Cama 3</p>
                  </div>
                  <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Frame">
                    <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0" data-name="Frame">
                      <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#ef4444] text-[11px] whitespace-nowrap">FC (112 bpm)</p>
                      <div className="h-[32px] relative shrink-0 w-[110px]" data-name="sparkline-container">
                        <div className="absolute inset-[-4.31%_0_0_-0.33%]">
                          <img className="block max-w-none size-full" alt="" src={imgSparklineContainer} />
                        </div>
                      </div>
                    </div>
                    <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0" data-name="Frame">
                      <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#2563eb] text-[11px] whitespace-nowrap">SpO2 (89%)</p>
                      <div className="h-[32px] relative shrink-0 w-[110px]" data-name="sparkline-container">
                        <div className="absolute inset-[-4.36%_0_0_0]">
                          <img className="block max-w-none size-full" alt="" src={imgSparklineContainer2} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex flex-[1_0_0] gap-[16px] items-center min-w-px p-[12px] relative rounded-[8px]" data-name="patient-2-trend">
                  <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[120px] whitespace-nowrap" data-name="Frame">
                    <p className="font-jakarta font-bold overflow-hidden relative shrink-0 text-[#0f172a] text-[13px] text-ellipsis">Rojas Méndez Ana</p>
                    <p className="font-jakarta font-normal relative shrink-0 text-[#64748b] text-[11px]">UCI Cama 7</p>
                  </div>
                  <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Frame">
                    <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0" data-name="Frame">
                      <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#f59e0b] text-[11px] whitespace-nowrap">FC (98 bpm)</p>
                      <div className="h-[32px] relative shrink-0 w-[110px]" data-name="sparkline-container">
                        <div className="absolute inset-[-4.64%_-0.2%_0_-0.5%]">
                          <img className="block max-w-none size-full" alt="" src={imgSparklineContainer3} />
                        </div>
                      </div>
                    </div>
                    <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0" data-name="Frame">
                      <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#2563eb] text-[11px] whitespace-nowrap">SpO2 (91%)</p>
                      <div className="h-[32px] relative shrink-0 w-[110px]" data-name="sparkline-container">
                        <div className="absolute inset-[-4.51%_0_0_0]">
                          <img className="block max-w-none size-full" alt="" src={imgSparklineContainer4} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[16px] h-full items-start overflow-clip p-[16px] relative rounded-[12px] shrink-0 w-[340px]" data-name="right-panel">
            <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[15px] w-full">Requiere tu atención ahora</p>
            <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="alert-items">
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[8px] items-start p-[14px] relative rounded-[8px] shrink-0 w-full" data-name="Frame">
                <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Frame">
                  <div className="bg-[#fef2f2] content-stretch flex items-start px-[6px] py-[2px] relative rounded-[4px] shrink-0" data-name="Frame">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#ef4444] text-[10px] whitespace-nowrap">GCS Crítico</p>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[11px] whitespace-nowrap">Hace 2 min</p>
                </div>
                <p className="[word-break:break-word] font-jakarta font-semibold leading-[17px] min-w-full relative shrink-0 text-[#0f172a] text-[12px] w-[min-content]">García: Glasgow bajó abruptamente de 13→9 en los últimos 20 minutos</p>
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#ef4444] text-[11px] whitespace-nowrap">UCI Cama 3</p>
              </div>
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[8px] items-start p-[14px] relative rounded-[8px] shrink-0 w-full" data-name="Frame">
                <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Frame">
                  <div className="bg-[#fef2f2] content-stretch flex items-start px-[6px] py-[2px] relative rounded-[4px] shrink-0" data-name="Frame">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#ef4444] text-[10px] whitespace-nowrap">SpO2 Bajo</p>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[11px] whitespace-nowrap">Hace 3 min</p>
                </div>
                <p className="[word-break:break-word] font-jakarta font-semibold leading-[17px] min-w-full relative shrink-0 text-[#0f172a] text-[12px] w-[min-content]">Rojas: SpO2 por debajo de umbral hace 3 minutos sin confirmación médica</p>
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#ef4444] text-[11px] whitespace-nowrap">UCI Cama 7</p>
              </div>
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[8px] items-start p-[14px] relative rounded-[8px] shrink-0 w-full" data-name="Frame">
                <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Frame">
                  <div className="bg-[#fffbeb] content-stretch flex items-start px-[6px] py-[2px] relative rounded-[4px] shrink-0" data-name="Frame">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#f59e0b] text-[10px] whitespace-nowrap">Evaluación</p>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[11px] whitespace-nowrap">Hace 12 min</p>
                </div>
                <p className="[word-break:break-word] font-jakarta font-semibold leading-[17px] min-w-full relative shrink-0 text-[#0f172a] text-[12px] w-[min-content]">Méndez: Evaluación primaria ABCDE lleva 45 minutos sin completarse</p>
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#f59e0b] text-[11px] whitespace-nowrap">Cama 6</p>
              </div>
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[8px] items-start p-[14px] relative rounded-[8px] shrink-0 w-full" data-name="Frame">
                <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Frame">
                  <div className="bg-[#f1f5f9] content-stretch flex items-start px-[6px] py-[2px] relative rounded-[4px] shrink-0" data-name="Frame">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">Pendiente</p>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[11px] whitespace-nowrap">Hace 20 min</p>
                </div>
                <p className="[word-break:break-word] font-jakarta font-semibold leading-[17px] min-w-full relative shrink-0 text-[#0f172a] text-[12px] w-[min-content]">Pérez: Pendiente registrar nota SOAP tras pase de guardia de trauma</p>
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[11px] whitespace-nowrap">UCI Cama 2</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
