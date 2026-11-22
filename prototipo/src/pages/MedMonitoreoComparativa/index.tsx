// Pantalla "med/monitoreo/comparativa" (Figma node 245:895) — generada desde el diseño original de Figma.
import { Link } from 'react-router-dom';
import imgActivity6 from '../../assets/activity-6.svg';
import imgAlertTextEllipse from '../../assets/alert-text-ellipse.svg';
import imgAlertTextEllipse2 from '../../assets/alert-text-ellipse-2.svg';
import imgAvatar21Png from '../../assets/avatar-21.png';
import imgAvatarBPng from '../../assets/avatar-b.png';
import imgBell from '../../assets/bell.svg';
import imgBell3 from '../../assets/bell-3.svg';
import imgChevronDown3 from '../../assets/chevron-down-3.svg';
import imgColumnALine from '../../assets/column-a-line.svg';
import imgCpu from '../../assets/cpu.svg';
import imgDoctorFooterLine5 from '../../assets/doctor-footer-line-5.svg';
import imgDownload from '../../assets/download.svg';
import imgDropdownBadgeEllipse2 from '../../assets/dropdown-badge-ellipse-2.svg';
import imgFileText from '../../assets/file-text.svg';
import imgHelpIconEllipse from '../../assets/help-icon-ellipse.svg';
import imgLayoutDashboard from '../../assets/layout-dashboard.svg';
import imgPatientAvatar7Png from '../../assets/patient-avatar-7.png';
import imgSearch2 from '../../assets/search-2.svg';
import imgSegment0 from '../../assets/segment-0.svg';
import imgSegment1 from '../../assets/segment-1.svg';
import imgSegment2 from '../../assets/segment-2.svg';
import imgSegment3 from '../../assets/segment-3.svg';
import imgSegment4 from '../../assets/segment-4.svg';
import imgSegment5 from '../../assets/segment-5.svg';
import imgSparklineChart from '../../assets/sparkline-chart.svg';
import imgSparklineChart2 from '../../assets/sparkline-chart-2.svg';
import imgSparklineChart3 from '../../assets/sparkline-chart-3.svg';
import imgSparklineChart4 from '../../assets/sparkline-chart-4.svg';
import imgSparklineChart5 from '../../assets/sparkline-chart-5.svg';
import imgSparklineChart6 from '../../assets/sparkline-chart-6.svg';
import imgSparklineChart7 from '../../assets/sparkline-chart-7.svg';
import imgThresholdLinePng from '../../assets/threshold-line.png';
import imgUsers2 from '../../assets/users-2.svg';

export default function MedMonitoreoComparativa() {
  return (
    <div className="bg-[#f8fafc] content-stretch flex items-start min-h-[1000px] relative shrink-0 w-[1440px]" data-name="med/monitoreo/comparativa">
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
            <Link className="bg-[rgba(37,99,235,0.15)] content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Monitoreo" to="/MedMonitoreoGridUci">
              <div className="relative shrink-0 size-[18px]" data-name="activity">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgActivity6} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">Monitoreo</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Alertas" to="/MedAlertasCentro">
              <div className="relative shrink-0 size-[18px]" data-name="bell">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBell} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Alertas</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Reportes" to="/MedReportesPanel">
              <div className="relative shrink-0 size-[18px]" data-name="file-text">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgFileText} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Reportes</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Dispositivos" to="/MedDispositivosMonitores">
              <div className="relative shrink-0 size-[18px]" data-name="cpu">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgCpu} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Dispositivos</p>
            </Link>
          </div>
        </div>
        <Link className="absolute left-[20px] opacity-25 size-[18px] top-[1146px]" data-name="help-icon" to="/MedAyudaSoporte">
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
              <img className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[20px] size-full" alt="" src={imgAvatar21Png} />
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px relative whitespace-nowrap" data-name="user-info">
              <p className="font-jakarta font-bold overflow-hidden relative shrink-0 text-[13px] text-ellipsis text-white">Dr. Roberto Silva</p>
              <p className="font-jakarta font-medium overflow-hidden relative shrink-0 text-[#64748b] text-[11px] text-ellipsis">Médico Especialista</p>
            </div>
          </Link>
        </div>
      </div>
      <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative self-stretch" data-name="main-container">
        <div className="bg-white border-[#e2e8f0] border-b border-solid content-stretch flex h-[72px] items-center justify-between px-[32px] relative shrink-0 w-full" data-name="top-bar">
          <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] relative shrink-0 whitespace-nowrap" data-name="title-breadcrumb">
            <p className="font-jakarta font-medium relative shrink-0 text-[#64748b] text-[11px]">{`SIAPPC > Monitoreo > Comparativa de Pacientes`}</p>
            <p className="font-jakarta font-extrabold relative shrink-0 text-[#0f172a] text-[20px]">Comparativa de Pacientes</p>
          </div>
          <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="right-actions">
            <div className="border border-[#e2e8f0] border-solid content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative rounded-[8px] shrink-0 w-[240px]" data-name="search-bar">
              <div className="relative shrink-0 size-[14px]" data-name="search">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgSearch2} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Buscar paciente, cama o HC...</p>
            </div>
            <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex items-start p-[8px] relative rounded-[999px] shrink-0" data-name="alert-icon-wrapper">
              <div className="relative shrink-0 size-[18px]" data-name="bell">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBell3} />
              </div>
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[24px] items-start p-[32px] relative shrink-0 w-full" data-name="page-body">
          <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-center justify-between p-[16px] relative rounded-[12px] shrink-0 w-full" data-name="controls-bar">
            <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="left-selectors">
              <div className="border border-[#e2e8f0] border-solid content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative rounded-[8px] shrink-0" data-name="dropdown-a">
                <div className="relative shrink-0 size-[8px]" data-name="Ellipse">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgAlertTextEllipse2} />
                </div>
                <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">Paciente A: María González</p>
                <div className="relative shrink-0 size-[12px]" data-name="chevron-down">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChevronDown3} />
                </div>
              </div>
              <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">vs</p>
              <div className="border border-[#e2e8f0] border-solid content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative rounded-[8px] shrink-0" data-name="dropdown-b">
                <div className="relative shrink-0 size-[8px]" data-name="Ellipse">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgAlertTextEllipse} />
                </div>
                <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">Paciente B: Juan García</p>
                <div className="relative shrink-0 size-[12px]" data-name="chevron-down">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChevronDown3} />
                </div>
              </div>
              <div className="border border-[#2563eb] border-solid content-stretch flex items-start px-[12px] py-[8px] relative rounded-[8px] shrink-0" data-name="btn-add-patient">
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[13px] whitespace-nowrap">+ Agregar Paciente</p>
              </div>
            </div>
            <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="right-controls">
              <div className="bg-[#f8fafc] content-stretch flex gap-[2px] items-start p-[4px] relative rounded-[8px] shrink-0" data-name="period-pill">
                <div className="bg-white content-stretch flex items-start px-[12px] py-[6px] relative rounded-[6px] shrink-0" data-name="period-active">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[12px] whitespace-nowrap">Últimas 4h</p>
                </div>
                <div className="content-stretch flex items-start px-[12px] py-[6px] relative shrink-0" data-name="period-item">
                  <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap">12h</p>
                </div>
                <div className="content-stretch flex items-start px-[12px] py-[6px] relative shrink-0" data-name="period-item">
                  <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap">24h</p>
                </div>
              </div>
              <div className="border border-[#e2e8f0] border-solid content-stretch flex gap-[6px] items-center px-[12px] py-[8px] relative rounded-[8px] shrink-0" data-name="btn-export">
                <div className="relative shrink-0 size-[14px]" data-name="download">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgDownload} />
                </div>
                <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">Exportar</p>
              </div>
            </div>
          </div>
          <div className="content-stretch flex gap-[20px] items-start relative shrink-0 w-full" data-name="comparison-columns">
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-start min-w-px p-[20px] relative rounded-[16px]" data-name="column-a">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="patient-header">
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="profile-identity">
                  <div className="relative rounded-[24px] shrink-0 size-[48px]" data-name="avatar-a">
                    <img className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[24px] size-full" alt="" src={imgPatientAvatar7Png} />
                  </div>
                  <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 whitespace-nowrap" data-name="meta">
                    <p className="font-jakarta font-extrabold relative shrink-0 text-[#0f172a] text-[16px]">María González</p>
                    <p className="font-jakarta font-normal relative shrink-0 text-[#64748b] text-[12px]">HC: PT-8821 • UCI Cama D3</p>
                  </div>
                </div>
                <div className="bg-[#fef2f2] content-stretch flex items-start px-[10px] py-[4px] relative rounded-[6px] shrink-0" data-name="badge-critical">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#ef4444] text-[12px] whitespace-nowrap">Crítico</p>
                </div>
              </div>
              <div className="[word-break:break-word] content-stretch flex gap-[8px] items-start leading-[normal] relative shrink-0 w-full whitespace-nowrap" data-name="vitals-kpis">
                <div className="bg-[#fef2f2] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px p-[12px] relative rounded-[8px] text-[#ef4444]" data-name="kpi-fc">
                  <p className="font-jakarta font-semibold relative shrink-0 text-[11px]">FC (LPM)</p>
                  <p className="font-jakarta font-extrabold relative shrink-0 text-[20px]">112 ↑</p>
                </div>
                <div className="bg-[#fef2f2] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px p-[12px] relative rounded-[8px] text-[#ef4444]" data-name="kpi-spo2">
                  <p className="font-jakarta font-semibold relative shrink-0 text-[11px]">SpO2 (%)</p>
                  <p className="font-jakarta font-extrabold relative shrink-0 text-[20px]">89% ↓</p>
                </div>
                <div className="bg-[#fef2f2] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px p-[12px] relative rounded-[8px] text-[#ef4444]" data-name="kpi-pa">
                  <p className="font-jakarta font-semibold relative shrink-0 text-[11px]">PA (mmHg)</p>
                  <p className="font-jakarta font-extrabold relative shrink-0 text-[20px]">85/50</p>
                </div>
                <div className="bg-[#f8fafc] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px p-[12px] relative rounded-[8px]" data-name="kpi-temp">
                  <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[11px]">Temp</p>
                  <p className="font-jakarta font-extrabold relative shrink-0 text-[#0f172a] text-[20px]">37.8°C</p>
                </div>
                <div className="bg-[#f8fafc] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px p-[12px] relative rounded-[8px]" data-name="kpi-gcs">
                  <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[11px]">Glasgow</p>
                  <p className="font-jakarta font-extrabold relative shrink-0 text-[#0f172a] text-[20px]">9/15</p>
                </div>
              </div>
              <div className="h-0 relative shrink-0 w-full" data-name="Line">
                <div className="absolute inset-[-1px_0_0_0]">
                  <img className="block max-w-none size-full" alt="" src={imgColumnALine} />
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="chart-fc-group">
                <div className="[word-break:break-word] content-stretch flex items-center justify-between leading-[normal] relative shrink-0 w-full whitespace-nowrap" data-name="chart-header">
                  <p className="font-jakarta font-bold relative shrink-0 text-[#0f172a] text-[13px]">Frecuencia Cardíaca (Últimas 4h)</p>
                  <p className="font-jakarta font-semibold relative shrink-0 text-[#ef4444] text-[12px]">Rango: 98 - 128 bpm</p>
                </div>
                <div className="bg-[#f8fafc] content-stretch flex items-start p-[12px] relative rounded-[8px] shrink-0 w-full" data-name="sparkline-container">
                  <div className="h-[70px] relative shrink-0 w-[480px]" data-name="sparkline-chart">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgSparklineChart} />
                  </div>
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="chart-spo2-group">
                <div className="[word-break:break-word] content-stretch flex items-center justify-between leading-[normal] relative shrink-0 w-full whitespace-nowrap" data-name="chart-header">
                  <p className="font-jakarta font-bold relative shrink-0 text-[#0f172a] text-[13px]">Saturación Oxígeno (SpO2%)</p>
                  <p className="font-jakarta font-semibold relative shrink-0 text-[#ef4444] text-[12px]">{`Alarma < 90%`}</p>
                </div>
                <div className="bg-[#f8fafc] content-stretch flex items-start p-[12px] relative rounded-[8px] shrink-0 w-full" data-name="sparkline-container">
                  <div className="content-stretch flex flex-col h-[70px] items-start relative shrink-0 w-[480px]" data-name="sparkline-chart">
                    <div className="absolute h-0 left-0 top-[35px] w-[480px]" data-name="threshold-line">
                      <div className="absolute inset-[-1px_0_0_0]">
                        <img className="block max-w-none size-full" alt="" src={imgThresholdLinePng} width="480" height="1" />
                      </div>
                    </div>
                    <div className="absolute flex h-[3.004px] items-center justify-center left-[10px] top-[12px] w-[80.004px]">
                      <div className="flex-none rotate-[2.15deg]">
                        <div className="h-0 relative w-[80.06px]" data-name="segment-0">
                          <div className="absolute inset-[-2px_0_0_0]">
                            <img className="block max-w-none size-full" alt="" src={imgSegment0} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute flex h-[9.001px] items-center justify-center left-[90px] top-[15px] w-[79.995px]">
                      <div className="flex-none rotate-[6.42deg]">
                        <div className="h-0 relative w-[80.5px]" data-name="segment-1">
                          <div className="absolute inset-[-2px_0_0_0]">
                            <img className="block max-w-none size-full" alt="" src={imgSegment1} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute flex h-[7.999px] items-center justify-center left-[170px] top-[24px] w-[80.001px]">
                      <div className="flex-none rotate-[5.71deg]">
                        <div className="h-0 relative w-[80.4px]" data-name="segment-2">
                          <div className="absolute inset-[-2px_0_0_0]">
                            <img className="block max-w-none size-full" alt="" src={imgSegment2} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute flex h-[15.999px] items-center justify-center left-[250px] top-[32px] w-[79.996px]">
                      <div className="flex-none rotate-[11.31deg]">
                        <div className="h-0 relative w-[81.58px]" data-name="segment-3">
                          <div className="absolute inset-[-2px_0_0_0]">
                            <img className="block max-w-none size-full" alt="" src={imgSegment3} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute flex h-[3.997px] items-center justify-center left-[330px] top-[48px] w-[80px]">
                      <div className="flex-none rotate-[2.86deg]">
                        <div className="h-0 relative w-[80.1px]" data-name="segment-4">
                          <div className="absolute inset-[-2px_0_0_0]">
                            <img className="block max-w-none size-full" alt="" src={imgSegment4} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute flex h-[7.995px] items-center justify-center left-[410px] top-[52px] w-[60px]">
                      <div className="flex-none rotate-[7.59deg]">
                        <div className="h-0 relative w-[60.53px]" data-name="segment-5">
                          <div className="absolute inset-[-2px_0_0_0]">
                            <img className="block max-w-none size-full" alt="" src={imgSegment5} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute left-[7px] size-[6px] top-[9px]" data-name="Ellipse">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgDropdownBadgeEllipse2} />
                    </div>
                    <div className="absolute left-[87px] size-[6px] top-[12px]" data-name="Ellipse">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgDropdownBadgeEllipse2} />
                    </div>
                    <div className="absolute left-[167px] size-[6px] top-[21px]" data-name="Ellipse">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgDropdownBadgeEllipse2} />
                    </div>
                    <div className="absolute left-[247px] size-[6px] top-[29px]" data-name="Ellipse">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgDropdownBadgeEllipse2} />
                    </div>
                    <div className="absolute left-[327px] size-[6px] top-[45px]" data-name="Ellipse">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgDropdownBadgeEllipse2} />
                    </div>
                    <div className="absolute left-[407px] size-[6px] top-[49px]" data-name="Ellipse">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgDropdownBadgeEllipse2} />
                    </div>
                    <div className="absolute left-[467px] size-[6px] top-[57px]" data-name="Ellipse">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgDropdownBadgeEllipse2} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="chart-pa-group">
                <div className="[word-break:break-word] content-stretch flex items-center justify-between leading-[normal] relative shrink-0 w-full whitespace-nowrap" data-name="chart-header">
                  <p className="font-jakarta font-bold relative shrink-0 text-[#0f172a] text-[13px]">Presión Arterial (Sistólica/Diastólica)</p>
                  <p className="font-jakarta font-semibold relative shrink-0 text-[#ef4444] text-[12px]">Hipotensión activa</p>
                </div>
                <div className="h-[70px] relative shrink-0 w-[480px]" data-name="pa-chart-frame">
                  <div className="absolute bg-[#f8fafc] content-stretch flex h-[70px] items-start left-0 p-[12px] rounded-[8px] top-0 w-[480px]" data-name="chart-sys">
                    <div className="h-[46px] relative shrink-0 w-[456px]" data-name="sparkline-chart">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgSparklineChart2} />
                    </div>
                  </div>
                  <div className="absolute content-stretch flex h-[70px] items-start left-0 p-[12px] top-0 w-[480px]" data-name="chart-dia">
                    <div className="h-[46px] relative shrink-0 w-[456px]" data-name="sparkline-chart">
                      <div className="absolute inset-[0_0_-4.35%_0]">
                        <img className="block max-w-none size-full" alt="" src={imgSparklineChart3} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-0 relative shrink-0 w-full" data-name="Line">
                <div className="absolute inset-[-1px_0_0_0]">
                  <img className="block max-w-none size-full" alt="" src={imgColumnALine} />
                </div>
              </div>
              <div className="[word-break:break-word] bg-[#f8fafc] content-stretch flex flex-col gap-[6px] items-start leading-[normal] p-[12px] relative rounded-[8px] shrink-0 w-full" data-name="medical-note">
                <div className="content-stretch flex items-center justify-between relative shrink-0 text-[#64748b] text-[11px] w-full whitespace-nowrap" data-name="note-meta">
                  <p className="font-jakarta font-bold relative shrink-0">ÚLTIMA NOTA SOAP</p>
                  <p className="font-jakarta font-semibold relative shrink-0">14:30 hrs</p>
                </div>
                <p className="font-jakarta font-semibold relative shrink-0 text-[#0f172a] text-[13px] w-full">"Deterioro hemodinámico progresivo. Se inició vasopresores."</p>
              </div>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-start min-w-px p-[20px] relative rounded-[16px]" data-name="column-b">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="patient-header">
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="profile-identity">
                  <div className="relative rounded-[24px] shrink-0 size-[48px]" data-name="avatar-b">
                    <img className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[24px] size-full" alt="" src={imgAvatarBPng} />
                  </div>
                  <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 whitespace-nowrap" data-name="meta">
                    <p className="font-jakarta font-extrabold relative shrink-0 text-[#0f172a] text-[16px]">Juan García</p>
                    <p className="font-jakarta font-normal relative shrink-0 text-[#64748b] text-[12px]">HC: PT-6632 • UCI Cama C5</p>
                  </div>
                </div>
                <div className="bg-[#fef3c7] content-stretch flex items-start px-[10px] py-[4px] relative rounded-[6px] shrink-0" data-name="badge-caution">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#f59e0b] text-[12px] whitespace-nowrap">Atención</p>
                </div>
              </div>
              <div className="[word-break:break-word] content-stretch flex gap-[8px] items-start leading-[normal] relative shrink-0 w-full whitespace-nowrap" data-name="vitals-kpis">
                <div className="bg-[#f8fafc] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px p-[12px] relative rounded-[8px]" data-name="kpi-fc">
                  <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[11px]">FC (LPM)</p>
                  <p className="font-jakarta font-extrabold relative shrink-0 text-[#0f172a] text-[20px]">88</p>
                </div>
                <div className="bg-[#fef3c7] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px p-[12px] relative rounded-[8px] text-[#f59e0b]" data-name="kpi-spo2">
                  <p className="font-jakarta font-semibold relative shrink-0 text-[11px]">SpO2 (%)</p>
                  <p className="font-jakarta font-extrabold relative shrink-0 text-[20px]">94%</p>
                </div>
                <div className="bg-[#f8fafc] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px p-[12px] relative rounded-[8px]" data-name="kpi-pa">
                  <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[11px]">PA (mmHg)</p>
                  <p className="font-jakarta font-extrabold relative shrink-0 text-[#0f172a] text-[20px]">110/70</p>
                </div>
                <div className="bg-[#f8fafc] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px p-[12px] relative rounded-[8px]" data-name="kpi-temp">
                  <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[11px]">Temp</p>
                  <p className="font-jakarta font-extrabold relative shrink-0 text-[#0f172a] text-[20px]">36.5°C</p>
                </div>
                <div className="bg-[#f8fafc] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px p-[12px] relative rounded-[8px]" data-name="kpi-gcs">
                  <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[11px]">Glasgow</p>
                  <p className="font-jakarta font-extrabold relative shrink-0 text-[#0f172a] text-[20px]">11/15</p>
                </div>
              </div>
              <div className="h-0 relative shrink-0 w-full" data-name="Line">
                <div className="absolute inset-[-1px_0_0_0]">
                  <img className="block max-w-none size-full" alt="" src={imgColumnALine} />
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="chart-fc-group">
                <div className="[word-break:break-word] content-stretch flex items-center justify-between leading-[normal] relative shrink-0 w-full whitespace-nowrap" data-name="chart-header">
                  <p className="font-jakarta font-bold relative shrink-0 text-[#0f172a] text-[13px]">Frecuencia Cardíaca (Últimas 4h)</p>
                  <p className="font-jakarta font-semibold relative shrink-0 text-[#10b981] text-[12px]">Estable ~85-90</p>
                </div>
                <div className="bg-[#f8fafc] content-stretch flex items-start p-[12px] relative rounded-[8px] shrink-0 w-full" data-name="sparkline-container">
                  <div className="h-[70px] relative shrink-0 w-[480px]" data-name="sparkline-chart">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgSparklineChart4} />
                  </div>
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="chart-spo2-group">
                <div className="[word-break:break-word] content-stretch flex items-center justify-between leading-[normal] relative shrink-0 w-full whitespace-nowrap" data-name="chart-header">
                  <p className="font-jakarta font-bold relative shrink-0 text-[#0f172a] text-[13px]">Saturación Oxígeno (SpO2%)</p>
                  <p className="font-jakarta font-semibold relative shrink-0 text-[#10b981] text-[12px]">Fijado: 92-95%</p>
                </div>
                <div className="bg-[#f8fafc] content-stretch flex items-start p-[12px] relative rounded-[8px] shrink-0 w-full" data-name="sparkline-container">
                  <div className="h-[70px] relative shrink-0 w-[480px]" data-name="sparkline-chart">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgSparklineChart5} />
                  </div>
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="chart-pa-group">
                <div className="[word-break:break-word] content-stretch flex items-center justify-between leading-[normal] relative shrink-0 w-full whitespace-nowrap" data-name="chart-header">
                  <p className="font-jakarta font-bold relative shrink-0 text-[#0f172a] text-[13px]">Presión Arterial (Sistólica/Diastólica)</p>
                  <p className="font-jakarta font-semibold relative shrink-0 text-[#10b981] text-[12px]">Parámetros estables</p>
                </div>
                <div className="h-[70px] relative shrink-0 w-[480px]" data-name="pa-chart-frame">
                  <div className="absolute bg-[#f8fafc] content-stretch flex h-[70px] items-start left-0 p-[12px] rounded-[8px] top-0 w-[480px]" data-name="chart-sys">
                    <div className="h-[46px] relative shrink-0 w-[456px]" data-name="sparkline-chart">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgSparklineChart6} />
                    </div>
                  </div>
                  <div className="absolute content-stretch flex h-[70px] items-start left-0 p-[12px] top-0 w-[480px]" data-name="chart-dia">
                    <div className="h-[46px] relative shrink-0 w-[456px]" data-name="sparkline-chart">
                      <div className="absolute inset-[0_0_-6.52%_0]">
                        <img className="block max-w-none size-full" alt="" src={imgSparklineChart7} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-0 relative shrink-0 w-full" data-name="Line">
                <div className="absolute inset-[-1px_0_0_0]">
                  <img className="block max-w-none size-full" alt="" src={imgColumnALine} />
                </div>
              </div>
              <div className="[word-break:break-word] bg-[#f8fafc] content-stretch flex flex-col gap-[6px] items-start leading-[normal] p-[12px] relative rounded-[8px] shrink-0 w-full" data-name="medical-note">
                <div className="content-stretch flex items-center justify-between relative shrink-0 text-[#64748b] text-[11px] w-full whitespace-nowrap" data-name="note-meta">
                  <p className="font-jakarta font-bold relative shrink-0">ÚLTIMA NOTA SOAP</p>
                  <p className="font-jakarta font-semibold relative shrink-0">06:20 hrs</p>
                </div>
                <p className="font-jakarta font-semibold relative shrink-0 text-[#0f172a] text-[13px] w-full">"Glasgow mejoró de 9 a 11. Evaluando retiro de sedación."</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[16px] items-start p-[20px] relative rounded-[16px] shrink-0 w-full" data-name="comparison-table-section">
            <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[16px] whitespace-nowrap">Resumen Métrico Comparativo</p>
            <div className="border border-[#e2e8f0] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[8px] shrink-0 w-full" data-name="summary-table">
              <div className="[word-break:break-word] bg-[#f8fafc] border-[#e2e8f0] border-b border-solid content-stretch flex font-jakarta font-bold items-center leading-[normal] px-[16px] py-[12px] relative shrink-0 text-[#64748b] text-[11px] uppercase w-full" data-name="table-head">
                <p className="relative shrink-0 w-[280px]">PARÁMETRO</p>
                <p className="relative shrink-0 w-[280px]">PACIENTE A (MARÍA G.)</p>
                <p className="relative shrink-0 w-[280px]">PACIENTE B (JUAN G.)</p>
                <p className="flex-[1_0_0] min-w-px relative">DIFERENCIA / DELTA</p>
              </div>
              <div className="border-[#e2e8f0] border-b border-solid content-stretch flex items-center px-[16px] py-[14px] relative shrink-0 w-full" data-name="row-1">
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[280px]">FC promedio</p>
                <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[280px]">108 LPM</p>
                <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[280px]">86 LPM</p>
                <div className="bg-[#fef2f2] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-name="delta-pill">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#ef4444] text-[12px] whitespace-nowrap">+22 LPM</p>
                </div>
              </div>
              <div className="border-[#e2e8f0] border-b border-solid content-stretch flex items-center px-[16px] py-[14px] relative shrink-0 w-full" data-name="row-2">
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[280px]">SpO2 mínimo</p>
                <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[280px]">87%</p>
                <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[280px]">92%</p>
                <div className="bg-[#fef2f2] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-name="delta-pill">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#ef4444] text-[12px] whitespace-nowrap">-5%</p>
                </div>
              </div>
              <div className="border-[#e2e8f0] border-b border-solid content-stretch flex items-center px-[16px] py-[14px] relative shrink-0 w-full" data-name="row-3">
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[280px]">Eventos de alerta (últimas 24h)</p>
                <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[280px]">4 alertas críticas</p>
                <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[280px]">1 alerta preventiva</p>
                <div className="bg-[#fef3c7] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-name="delta-pill">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#f59e0b] text-[12px] whitespace-nowrap">+3 eventos</p>
                </div>
              </div>
              <div className="content-stretch flex items-center px-[16px] py-[14px] relative shrink-0 w-full" data-name="row-4">
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[280px]">Intervenciones médicas</p>
                <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[280px]">3 indicadas</p>
                <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[280px]">1 indicada</p>
                <div className="bg-[#ecfdf5] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-name="delta-pill">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#10b981] text-[12px] whitespace-nowrap">+2 interv.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
