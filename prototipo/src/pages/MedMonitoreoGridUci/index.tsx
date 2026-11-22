// Pantalla "med/monitoreo/grid-uci" (Figma node 45:984) — generada desde el diseño original de Figma.
import { Link } from 'react-router-dom';
import imgActivity10 from '../../assets/activity-10.svg';
import imgActivity6 from '../../assets/activity-6.svg';
import imgActivity8 from '../../assets/activity-8.svg';
import imgActivity9 from '../../assets/activity-9.svg';
import imgAlertTextEllipse from '../../assets/alert-text-ellipse.svg';
import imgAlertTextEllipse2 from '../../assets/alert-text-ellipse-2.svg';
import imgArmchair from '../../assets/armchair.svg';
import imgArmchair2 from '../../assets/armchair-2.svg';
import imgArmchair3 from '../../assets/armchair-3.svg';
import imgAvatar20Png from '../../assets/avatar-20.png';
import imgBed from '../../assets/bed.svg';
import imgBed2 from '../../assets/bed-2.svg';
import imgBed3 from '../../assets/bed-3.svg';
import imgBell from '../../assets/bell.svg';
import imgBrain2 from '../../assets/brain-2.svg';
import imgBrain3 from '../../assets/brain-3.svg';
import imgBrain4 from '../../assets/brain-4.svg';
import imgBrain5 from '../../assets/brain-5.svg';
import imgCpu from '../../assets/cpu.svg';
import imgDoctorFooterLine from '../../assets/doctor-footer-line.svg';
import imgEcgSeg0 from '../../assets/ecg-seg-0.svg';
import imgEcgSeg02 from '../../assets/ecg-seg-0-2.svg';
import imgEcgSeg03 from '../../assets/ecg-seg-0-3.svg';
import imgEcgSeg1 from '../../assets/ecg-seg-1.svg';
import imgEcgSeg12 from '../../assets/ecg-seg-1-2.svg';
import imgEcgSeg13 from '../../assets/ecg-seg-1-3.svg';
import imgEcgSeg2 from '../../assets/ecg-seg-2.svg';
import imgEcgSeg22 from '../../assets/ecg-seg-2-2.svg';
import imgEcgSeg23 from '../../assets/ecg-seg-2-3.svg';
import imgEcgSeg3 from '../../assets/ecg-seg-3.svg';
import imgEcgSeg32 from '../../assets/ecg-seg-3-2.svg';
import imgEcgSeg33 from '../../assets/ecg-seg-3-3.svg';
import imgEcgSeg4 from '../../assets/ecg-seg-4.svg';
import imgEcgSeg42 from '../../assets/ecg-seg-4-2.svg';
import imgEcgSeg43 from '../../assets/ecg-seg-4-3.svg';
import imgFileText from '../../assets/file-text.svg';
import imgHeart6 from '../../assets/heart-6.svg';
import imgHeart7 from '../../assets/heart-7.svg';
import imgHeart8 from '../../assets/heart-8.svg';
import imgHeart9 from '../../assets/heart-9.svg';
import imgHelpIconEllipse from '../../assets/help-icon-ellipse.svg';
import imgIconwrapper from '../../assets/iconwrapper.svg';
import imgLayoutDashboard from '../../assets/layout-dashboard.svg';
import imgLogOut from '../../assets/log-out.svg';
import imgStatusPillEllipse from '../../assets/status-pill-ellipse.svg';
import imgThermometer2 from '../../assets/thermometer-2.svg';
import imgThermometer3 from '../../assets/thermometer-3.svg';
import imgUsers2 from '../../assets/users-2.svg';
import imgWind2 from '../../assets/wind-2.svg';
import imgWind3 from '../../assets/wind-3.svg';
import imgWind4 from '../../assets/wind-4.svg';
import imgWind5 from '../../assets/wind-5.svg';

export default function MedMonitoreoGridUci() {
  return (
    <div className="bg-[#f8fafc] content-stretch flex h-[941px] items-start overflow-clip relative shrink-0 w-[1440px]" data-name="med/monitoreo/grid-uci">
      <div className="bg-[#0f172a] border-[#1e293b] border-r border-solid content-stretch flex flex-col h-full items-start justify-between px-[16px] py-[24px] relative shrink-0 w-[240px]" data-name="sidebar">
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
            <Link className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Dashboard" to="/MedDashboardPrincipal">
              <div className="relative shrink-0 size-[18px]" data-name="layout-dashboard">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgLayoutDashboard} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#94a3b8] text-[14px] whitespace-nowrap">Dashboard</p>
            </Link>
            <Link className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Pacientes" to="/MedPacientesLista">
              <div className="relative shrink-0 size-[18px]" data-name="users">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgUsers2} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#94a3b8] text-[14px] whitespace-nowrap">Pacientes</p>
            </Link>
            <Link className="bg-[rgba(37,99,235,0.15)] content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Monitoreo" to="/MedMonitoreoGridUci">
              <div className="relative shrink-0 size-[18px]" data-name="activity">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgActivity6} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">Monitoreo</p>
            </Link>
            <Link className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Alertas" to="/MedAlertasCentro">
              <div className="relative shrink-0 size-[18px]" data-name="bell">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBell} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#94a3b8] text-[14px] whitespace-nowrap">Alertas</p>
            </Link>
            <Link className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Reportes" to="/MedReportesPanel">
              <div className="relative shrink-0 size-[18px]" data-name="file-text">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgFileText} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#94a3b8] text-[14px] whitespace-nowrap">Reportes</p>
            </Link>
            <Link className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Dispositivos" to="/MedDispositivosMonitores">
              <div className="relative shrink-0 size-[18px]" data-name="cpu">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgCpu} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#94a3b8] text-[14px] whitespace-nowrap">Dispositivos</p>
            </Link>
          </div>
        </div>
        <Link className="absolute left-[20px] opacity-25 size-[18px] top-[833px]" data-name="help-icon" to="/MedAyudaSoporte">
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
              <img className="block max-w-none size-full" alt="" src={imgDoctorFooterLine} />
            </div>
          </div>
          <Link className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="user-profile" to="/MedPerfilMiPerfil">
            <div className="relative rounded-[20px] shrink-0 size-[40px]" data-name="avatar">
              <img className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[20px] size-full" alt="" src={imgAvatar20Png} />
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px relative whitespace-nowrap" data-name="user-info">
              <p className="font-jakarta font-bold overflow-hidden relative shrink-0 text-[13px] text-ellipsis text-white">Dr. Roberto Silva</p>
              <p className="font-jakarta font-medium overflow-hidden relative shrink-0 text-[#64748b] text-[11px] text-ellipsis">Médico Intensivista</p>
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
            <p className="font-jakarta font-medium relative shrink-0 text-[#64748b] text-[12px]">{`SIAPPC > Monitoreo`}</p>
            <p className="font-jakarta font-extrabold relative shrink-0 text-[#0f172a] text-[20px]">Central de Monitoreo - UCI</p>
          </div>
          <div className="content-stretch flex gap-[20px] items-center overflow-clip relative shrink-0" data-name="right-actions">
            <div className="content-stretch flex items-center relative shrink-0" data-name="controls-group">
              <div className="bg-[#f1f5f9] content-stretch flex gap-[2px] items-center p-[4px] relative rounded-[8px] shrink-0" data-name="view-toggle">
                <div className="bg-white content-stretch flex items-start px-[12px] py-[6px] relative rounded-[6px] shrink-0" data-name="toggle-active">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[12px] whitespace-nowrap">Vista: Grid</p>
                </div>
                <Link className="content-stretch cursor-pointer flex items-start px-[12px] py-[6px] relative rounded-[6px] shrink-0" data-name="toggle-inactive" to="/MedMonitoreoListaUci">
                  <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[12px] text-left whitespace-nowrap">Lista</p>
                </Link>
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
        <div className="bg-white content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-start min-h-px overflow-clip p-[32px] relative w-full" data-name="page-body">
          <div className="bg-white border border-[#e5e7eb] border-solid content-stretch flex items-center justify-between px-[20px] py-[16px] relative rounded-[12px] shrink-0 w-full" data-name="overview-ribbon">
            <p className="[word-break:break-word] font-jakarta font-semibold leading-[0] relative shrink-0 text-[#374151] text-[15px] whitespace-nowrap"><span className="leading-[normal]">{`Monitoreo activo para `}</span><span className="font-jakarta font-extrabold leading-[normal]">6 pacientes críticos en UCI</span><span className="leading-[normal]">{` • 2 Estable • 1 Monitoreo • 3 Crítico`}</span></p>
            <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="indicators">
              <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="ind-stable">
                <div className="relative shrink-0 size-[8px]" data-name="Ellipse">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgStatusPillEllipse} />
                </div>
                <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#94a3b8] text-[12px] whitespace-nowrap">Estable</p>
              </div>
              <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="ind-warning">
                <div className="relative shrink-0 size-[8px]" data-name="Ellipse">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgAlertTextEllipse} />
                </div>
                <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#94a3b8] text-[12px] whitespace-nowrap">Monitoreo</p>
              </div>
              <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="ind-crit">
                <div className="relative shrink-0 size-[8px]" data-name="Ellipse">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgAlertTextEllipse2} />
                </div>
                <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#94a3b8] text-[12px] whitespace-nowrap">Crítico</p>
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="beds-grid">
            <div className="content-stretch flex gap-[16px] h-[360px] items-start relative shrink-0 w-full" data-name="row-1">
              <div className="bg-white border-[#1e3a8a] border-b border-l-4 border-r border-solid border-t content-stretch flex flex-col gap-[12px] h-[360px] items-start overflow-clip p-[16px] relative rounded-[12px] shrink-0 w-[373px]" data-name="bed-card-C-01">
                <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="card-header">
                  <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="bed-id">
                    <div className="relative shrink-0 size-[18px]" data-name="bed">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBed} />
                    </div>
                    <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#111827] text-[16px] whitespace-nowrap">C-01</p>
                  </div>
                  <div className="bg-[#d1fae5] content-stretch flex items-start px-[8px] py-[2px] relative rounded-[4px] shrink-0" data-name="status-badge">
                    <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#10b981] text-[10px] whitespace-nowrap">ESTABLE</p>
                  </div>
                </div>
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#111827] text-[15px] w-full">R. López</p>
                <div className="bg-[#0b1220] content-stretch flex flex-col gap-[16px] items-start p-[16px] relative rounded-[8px] shrink-0 w-full" data-name="monitor-panel">
                  <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="vital-row-primary">
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="heart">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgHeart6} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">FC</p>
                        <div className="bg-[#10b981] relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-[#10b981] text-[0px] whitespace-nowrap"><span className="leading-[normal] text-[22px]">{`78 `}</span><span className="font-jakarta font-medium leading-[normal] text-[#64748b] text-[12px]">bpm</span></p>
                    </div>
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="activity">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgActivity8} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">SpO₂</p>
                        <div className="bg-[#10b981] relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-[#10b981] text-[0px] whitespace-nowrap"><span className="leading-[normal] text-[22px]">{`98 `}</span><span className="font-jakarta font-medium leading-[normal] text-[#64748b] text-[12px]">%</span></p>
                    </div>
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="armchair">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgArmchair} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">PA</p>
                        <div className="bg-[#10b981] relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-[#10b981] text-[0px] whitespace-nowrap"><span className="leading-[normal] text-[18px]">{`120/80 `}</span><span className="font-jakarta font-medium leading-[normal] text-[#64748b] text-[12px]">mmHg</span></p>
                      <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] min-w-full relative shrink-0 text-[#64748b] text-[12px] w-[min-content]">PAM: 93 mmHg</p>
                    </div>
                  </div>
                  <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="vital-row-secondary">
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="wind">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgWind2} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">FR</p>
                        <div className="bg-[#10b981] relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-[#10b981] text-[0px] whitespace-nowrap"><span className="leading-[normal] text-[18px]">{`16 `}</span><span className="font-jakarta font-medium leading-[normal] text-[#64748b] text-[12px]">rpm</span></p>
                    </div>
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="thermometer">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgThermometer2} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">TEMP</p>
                        <div className="bg-[#10b981] relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-[#10b981] text-[0px] whitespace-nowrap"><span className="leading-[normal] text-[18px]">{`36.5 `}</span><span className="font-jakarta font-medium leading-[normal] text-[#64748b] text-[12px]">°C</span></p>
                    </div>
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="brain">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBrain2} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">GCS</p>
                        <div className="bg-[#10b981] relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-[#10b981] text-[0px] whitespace-nowrap"><span className="leading-[normal] text-[18px]">{`15 `}</span><span className="font-jakarta font-medium leading-[normal] text-[#64748b] text-[12px]">pts</span></p>
                    </div>
                  </div>
                  <div className="bg-[#0b1220] border border-[#1f2937] border-solid content-stretch flex flex-col h-[44px] items-start overflow-clip relative rounded-[8px] shrink-0 w-full" data-name="ecg-waveform">
                    <div className="bg-[#0b1220] flex-[1_0_0] min-h-px relative w-full" data-name="ecg-canvas">
                      <div className="absolute flex h-[45.003px] items-center justify-center left-[35px] top-[7px] w-[5px]">
                        <div className="flex-none rotate-[83.66deg]">
                          <div className="h-0 relative w-[45.28px]" data-name="ecg-seg-2">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg2} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[14.552px] items-center justify-center left-[30px] top-[7.45px] w-[3.639px]">
                        <div className="flex-none rotate-[-75.96deg]">
                          <div className="h-0 relative w-[15px]" data-name="ecg-seg-1">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg1} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[35.005px] items-center justify-center left-[40px] top-[17px] w-[5.001px]">
                        <div className="flex-none rotate-[-81.87deg]">
                          <div className="h-0 relative w-[35.36px]" data-name="ecg-seg-3">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg3} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[45.003px] items-center justify-center left-[85px] top-[12px] w-[5px]">
                        <div className="flex-none rotate-[83.66deg]">
                          <div className="h-0 relative w-[45.28px]" data-name="ecg-seg-7">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg2} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[9.999px] items-center justify-center left-[45px] top-[17px] w-[5.001px]">
                        <div className="flex-none rotate-[63.43deg]">
                          <div className="h-0 relative w-[11.18px]" data-name="ecg-seg-4">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg4} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[14.552px] items-center justify-center left-[80px] top-[12.45px] w-[3.639px]">
                        <div className="flex-none rotate-[-75.96deg]">
                          <div className="h-0 relative w-[15px]" data-name="ecg-seg-6">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg1} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[14.552px] items-center justify-center left-[130px] top-[17.45px] w-[3.639px]">
                        <div className="flex-none rotate-[-75.96deg]">
                          <div className="h-0 relative w-[15px]" data-name="ecg-seg-11">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg1} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[45.003px] items-center justify-center left-[135px] top-[17px] w-[5px]">
                        <div className="flex-none rotate-[83.66deg]">
                          <div className="h-0 relative w-[45.28px]" data-name="ecg-seg-12">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg2} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute h-0 left-0 top-[22px] w-[30px]" data-name="ecg-seg-0">
                        <div className="absolute inset-[-2px_0_0_0]">
                          <img className="block max-w-none size-full" alt="" src={imgEcgSeg0} />
                        </div>
                      </div>
                      <div className="absolute flex h-[35.005px] items-center justify-center left-[90px] top-[22px] w-[5.001px]">
                        <div className="flex-none rotate-[-81.87deg]">
                          <div className="h-0 relative w-[35.36px]" data-name="ecg-seg-8">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg3} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[9.999px] items-center justify-center left-[95px] top-[22px] w-[5.001px]">
                        <div className="flex-none rotate-[63.43deg]">
                          <div className="h-0 relative w-[11.18px]" data-name="ecg-seg-9">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg4} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[14.552px] items-center justify-center left-[180px] top-[22.45px] w-[3.639px]">
                        <div className="flex-none rotate-[-75.96deg]">
                          <div className="h-0 relative w-[15px]" data-name="ecg-seg-16">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg1} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[45.003px] items-center justify-center left-[185px] top-[22px] w-[5px]">
                        <div className="flex-none rotate-[83.66deg]">
                          <div className="h-0 relative w-[45.28px]" data-name="ecg-seg-17">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg2} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute h-0 left-[50px] top-[27px] w-[30px]" data-name="ecg-seg-5">
                        <div className="absolute inset-[-2px_0_0_0]">
                          <img className="block max-w-none size-full" alt="" src={imgEcgSeg0} />
                        </div>
                      </div>
                      <div className="absolute flex h-[35.005px] items-center justify-center left-[140px] top-[27px] w-[5.001px]">
                        <div className="flex-none rotate-[-81.87deg]">
                          <div className="h-0 relative w-[35.36px]" data-name="ecg-seg-13">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg3} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[9.999px] items-center justify-center left-[145px] top-[27px] w-[5.001px]">
                        <div className="flex-none rotate-[63.43deg]">
                          <div className="h-0 relative w-[11.18px]" data-name="ecg-seg-14">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg4} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[14.552px] items-center justify-center left-[230px] top-[27.45px] w-[3.639px]">
                        <div className="flex-none rotate-[-75.96deg]">
                          <div className="h-0 relative w-[15px]" data-name="ecg-seg-21">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg1} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[45.003px] items-center justify-center left-[235px] top-[27px] w-[5px]">
                        <div className="flex-none rotate-[83.66deg]">
                          <div className="h-0 relative w-[45.28px]" data-name="ecg-seg-22">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg2} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute h-0 left-[100px] top-[32px] w-[30px]" data-name="ecg-seg-10">
                        <div className="absolute inset-[-2px_0_0_0]">
                          <img className="block max-w-none size-full" alt="" src={imgEcgSeg0} />
                        </div>
                      </div>
                      <div className="absolute flex h-[35.005px] items-center justify-center left-[190px] top-[32px] w-[5.001px]">
                        <div className="flex-none rotate-[-81.87deg]">
                          <div className="h-0 relative w-[35.36px]" data-name="ecg-seg-18">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg3} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[9.999px] items-center justify-center left-[195px] top-[32px] w-[5.001px]">
                        <div className="flex-none rotate-[63.43deg]">
                          <div className="h-0 relative w-[11.18px]" data-name="ecg-seg-19">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg4} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[14.552px] items-center justify-center left-[280px] top-[32.45px] w-[3.639px]">
                        <div className="flex-none rotate-[-75.96deg]">
                          <div className="h-0 relative w-[15px]" data-name="ecg-seg-26">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg1} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[45.003px] items-center justify-center left-[285px] top-[32px] w-[5px]">
                        <div className="flex-none rotate-[83.66deg]">
                          <div className="h-0 relative w-[45.28px]" data-name="ecg-seg-27">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg2} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute h-0 left-[150px] top-[37px] w-[30px]" data-name="ecg-seg-15">
                        <div className="absolute inset-[-2px_0_0_0]">
                          <img className="block max-w-none size-full" alt="" src={imgEcgSeg0} />
                        </div>
                      </div>
                      <div className="absolute flex h-[35.005px] items-center justify-center left-[240px] top-[37px] w-[5.001px]">
                        <div className="flex-none rotate-[-81.87deg]">
                          <div className="h-0 relative w-[35.36px]" data-name="ecg-seg-23">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg3} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[9.999px] items-center justify-center left-[245px] top-[37px] w-[5.001px]">
                        <div className="flex-none rotate-[63.43deg]">
                          <div className="h-0 relative w-[11.18px]" data-name="ecg-seg-24">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg4} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[45.003px] items-center justify-center left-[335px] top-[37px] w-[5px]">
                        <div className="flex-none rotate-[83.66deg]">
                          <div className="h-0 relative w-[45.28px]" data-name="ecg-seg-32">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg2} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[14.552px] items-center justify-center left-[330px] top-[37.45px] w-[3.639px]">
                        <div className="flex-none rotate-[-75.96deg]">
                          <div className="h-0 relative w-[15px]" data-name="ecg-seg-31">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg1} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute h-0 left-[200px] top-[42px] w-[30px]" data-name="ecg-seg-20">
                        <div className="absolute inset-[-2px_0_0_0]">
                          <img className="block max-w-none size-full" alt="" src={imgEcgSeg0} />
                        </div>
                      </div>
                      <div className="absolute flex h-[35.005px] items-center justify-center left-[290px] top-[42px] w-[5.001px]">
                        <div className="flex-none rotate-[-81.87deg]">
                          <div className="h-0 relative w-[35.36px]" data-name="ecg-seg-28">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg3} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[9.999px] items-center justify-center left-[295px] top-[42px] w-[5.001px]">
                        <div className="flex-none rotate-[63.43deg]">
                          <div className="h-0 relative w-[11.18px]" data-name="ecg-seg-29">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg4} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute h-0 left-[250px] top-[47px] w-[30px]" data-name="ecg-seg-25">
                        <div className="absolute inset-[-2px_0_0_0]">
                          <img className="block max-w-none size-full" alt="" src={imgEcgSeg0} />
                        </div>
                      </div>
                      <div className="absolute h-0 left-[300px] top-[52px] w-[30px]" data-name="ecg-seg-30">
                        <div className="absolute inset-[-2px_0_0_0]">
                          <img className="block max-w-none size-full" alt="" src={imgEcgSeg0} />
                        </div>
                      </div>
                      <div className="absolute flex h-[35.005px] items-center justify-center left-[340px] top-[47px] w-[5.001px]">
                        <div className="flex-none rotate-[-81.87deg]">
                          <div className="h-0 relative w-[35.36px]" data-name="ecg-seg-33">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg3} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[9.999px] items-center justify-center left-[345px] top-[47px] w-[5.001px]">
                        <div className="flex-none rotate-[63.43deg]">
                          <div className="h-0 relative w-[11.18px]" data-name="ecg-seg-34">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg4} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute h-0 left-[350px] top-[57px] w-[30px]" data-name="ecg-seg-35">
                        <div className="absolute inset-[-2px_0_0_0]">
                          <img className="block max-w-none size-full" alt="" src={imgEcgSeg0} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white border-[#dc2626] border-b border-l-4 border-r border-solid border-t content-stretch flex flex-[1_0_0] flex-col gap-[12px] h-full items-start min-w-px overflow-clip p-[16px] relative rounded-[12px]" data-name="bed-card-C-02">
                <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="card-header">
                  <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="bed-id">
                    <div className="relative shrink-0 size-[18px]" data-name="bed">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBed2} />
                    </div>
                    <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#111827] text-[16px] whitespace-nowrap">C-02</p>
                  </div>
                  <div className="bg-[#fee2e2] content-stretch flex items-start px-[8px] py-[2px] relative rounded-[4px] shrink-0" data-name="status-badge">
                    <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#dc2626] text-[10px] whitespace-nowrap">CRÍTICO</p>
                  </div>
                </div>
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#111827] text-[15px] w-full">M. García</p>
                <div className="bg-[#0b1220] content-stretch flex flex-col gap-[16px] items-start p-[16px] relative rounded-[8px] shrink-0 w-full" data-name="monitor-panel">
                  <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="vital-row-primary">
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="heart">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgHeart7} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">FC</p>
                        <div className="bg-[#ef4444] relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-[#ef4444] text-[0px] whitespace-nowrap"><span className="leading-[normal] text-[22px]">{`125 `}</span><span className="font-jakarta font-medium leading-[normal] text-[#64748b] text-[12px]">bpm</span></p>
                    </div>
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="activity">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgActivity9} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">SpO₂</p>
                        <div className="bg-[#ef4444] relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-[#ef4444] text-[0px] whitespace-nowrap"><span className="leading-[normal] text-[22px]">{`89 `}</span><span className="font-jakarta font-medium leading-[normal] text-[#64748b] text-[12px]">%</span></p>
                    </div>
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="armchair">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgArmchair2} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">PA</p>
                        <div className="bg-[#ef4444] relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-[#ef4444] text-[0px] whitespace-nowrap"><span className="leading-[normal] text-[18px]">{`90/60 `}</span><span className="font-jakarta font-medium leading-[normal] text-[#64748b] text-[12px]">mmHg</span></p>
                      <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] min-w-full relative shrink-0 text-[#64748b] text-[12px] w-[min-content]">PAM: 70 mmHg</p>
                    </div>
                  </div>
                  <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="vital-row-secondary">
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="wind">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgWind3} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">FR</p>
                        <div className="bg-[#f59e0b] relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-[#f59e0b] text-[0px] whitespace-nowrap"><span className="leading-[normal] text-[18px]">{`28 `}</span><span className="font-jakarta font-medium leading-[normal] text-[#64748b] text-[12px]">rpm</span></p>
                    </div>
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="thermometer">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgThermometer3} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">TEMP</p>
                        <div className="bg-[#f59e0b] relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-[#f59e0b] text-[0px] whitespace-nowrap"><span className="leading-[normal] text-[18px]">{`38.2 `}</span><span className="font-jakarta font-medium leading-[normal] text-[#64748b] text-[12px]">°C</span></p>
                    </div>
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="brain">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBrain3} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">GCS</p>
                        <div className="bg-[#ef4444] relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-[#ef4444] text-[0px] whitespace-nowrap"><span className="leading-[normal] text-[18px]">{`10 `}</span><span className="font-jakarta font-medium leading-[normal] text-[#64748b] text-[12px]">pts</span></p>
                    </div>
                  </div>
                  <div className="bg-[#0b1220] border border-[#1f2937] border-solid content-stretch flex flex-col h-[44px] items-start overflow-clip relative rounded-[8px] shrink-0 w-full" data-name="ecg-waveform">
                    <div className="bg-[#0b1220] flex-[1_0_0] min-h-px relative w-full" data-name="ecg-canvas">
                      <div className="absolute flex h-[45.003px] items-center justify-center left-[35px] top-[7px] w-[5px]">
                        <div className="flex-none rotate-[83.66deg]">
                          <div className="h-0 relative w-[45.28px]" data-name="ecg-seg-2">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg22} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[14.552px] items-center justify-center left-[30px] top-[7.45px] w-[3.639px]">
                        <div className="flex-none rotate-[-75.96deg]">
                          <div className="h-0 relative w-[15px]" data-name="ecg-seg-1">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg12} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[45.003px] items-center justify-center left-[85px] top-[12px] w-[5px]">
                        <div className="flex-none rotate-[83.66deg]">
                          <div className="h-0 relative w-[45.28px]" data-name="ecg-seg-7">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg22} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[14.552px] items-center justify-center left-[80px] top-[12.45px] w-[3.639px]">
                        <div className="flex-none rotate-[-75.96deg]">
                          <div className="h-0 relative w-[15px]" data-name="ecg-seg-6">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg12} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[35.005px] items-center justify-center left-[40px] top-[17px] w-[5.001px]">
                        <div className="flex-none rotate-[-81.87deg]">
                          <div className="h-0 relative w-[35.36px]" data-name="ecg-seg-3">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg32} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[9.999px] items-center justify-center left-[45px] top-[17px] w-[5.001px]">
                        <div className="flex-none rotate-[63.43deg]">
                          <div className="h-0 relative w-[11.18px]" data-name="ecg-seg-4">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg42} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[45.003px] items-center justify-center left-[135px] top-[17px] w-[5px]">
                        <div className="flex-none rotate-[83.66deg]">
                          <div className="h-0 relative w-[45.28px]" data-name="ecg-seg-12">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg22} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[14.552px] items-center justify-center left-[130px] top-[17.45px] w-[3.639px]">
                        <div className="flex-none rotate-[-75.96deg]">
                          <div className="h-0 relative w-[15px]" data-name="ecg-seg-11">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg12} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute h-0 left-0 top-[22px] w-[30px]" data-name="ecg-seg-0">
                        <div className="absolute inset-[-2px_0_0_0]">
                          <img className="block max-w-none size-full" alt="" src={imgEcgSeg02} />
                        </div>
                      </div>
                      <div className="absolute flex h-[35.005px] items-center justify-center left-[90px] top-[22px] w-[5.001px]">
                        <div className="flex-none rotate-[-81.87deg]">
                          <div className="h-0 relative w-[35.36px]" data-name="ecg-seg-8">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg32} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[9.999px] items-center justify-center left-[95px] top-[22px] w-[5.001px]">
                        <div className="flex-none rotate-[63.43deg]">
                          <div className="h-0 relative w-[11.18px]" data-name="ecg-seg-9">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg42} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[45.003px] items-center justify-center left-[185px] top-[22px] w-[5px]">
                        <div className="flex-none rotate-[83.66deg]">
                          <div className="h-0 relative w-[45.28px]" data-name="ecg-seg-17">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg22} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[14.552px] items-center justify-center left-[180px] top-[22.45px] w-[3.639px]">
                        <div className="flex-none rotate-[-75.96deg]">
                          <div className="h-0 relative w-[15px]" data-name="ecg-seg-16">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg12} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute h-0 left-[50px] top-[27px] w-[30px]" data-name="ecg-seg-5">
                        <div className="absolute inset-[-2px_0_0_0]">
                          <img className="block max-w-none size-full" alt="" src={imgEcgSeg02} />
                        </div>
                      </div>
                      <div className="absolute flex h-[35.005px] items-center justify-center left-[140px] top-[27px] w-[5.001px]">
                        <div className="flex-none rotate-[-81.87deg]">
                          <div className="h-0 relative w-[35.36px]" data-name="ecg-seg-13">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg32} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[9.999px] items-center justify-center left-[145px] top-[27px] w-[5.001px]">
                        <div className="flex-none rotate-[63.43deg]">
                          <div className="h-0 relative w-[11.18px]" data-name="ecg-seg-14">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg42} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[45.003px] items-center justify-center left-[235px] top-[27px] w-[5px]">
                        <div className="flex-none rotate-[83.66deg]">
                          <div className="h-0 relative w-[45.28px]" data-name="ecg-seg-22">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg22} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[14.552px] items-center justify-center left-[230px] top-[27.45px] w-[3.639px]">
                        <div className="flex-none rotate-[-75.96deg]">
                          <div className="h-0 relative w-[15px]" data-name="ecg-seg-21">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg12} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute h-0 left-[100px] top-[32px] w-[30px]" data-name="ecg-seg-10">
                        <div className="absolute inset-[-2px_0_0_0]">
                          <img className="block max-w-none size-full" alt="" src={imgEcgSeg02} />
                        </div>
                      </div>
                      <div className="absolute flex h-[35.005px] items-center justify-center left-[190px] top-[32px] w-[5.001px]">
                        <div className="flex-none rotate-[-81.87deg]">
                          <div className="h-0 relative w-[35.36px]" data-name="ecg-seg-18">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg32} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[9.999px] items-center justify-center left-[195px] top-[32px] w-[5.001px]">
                        <div className="flex-none rotate-[63.43deg]">
                          <div className="h-0 relative w-[11.18px]" data-name="ecg-seg-19">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg42} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[45.003px] items-center justify-center left-[285px] top-[32px] w-[5px]">
                        <div className="flex-none rotate-[83.66deg]">
                          <div className="h-0 relative w-[45.28px]" data-name="ecg-seg-27">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg22} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[14.552px] items-center justify-center left-[280px] top-[32.45px] w-[3.639px]">
                        <div className="flex-none rotate-[-75.96deg]">
                          <div className="h-0 relative w-[15px]" data-name="ecg-seg-26">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg12} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute h-0 left-[150px] top-[37px] w-[30px]" data-name="ecg-seg-15">
                        <div className="absolute inset-[-2px_0_0_0]">
                          <img className="block max-w-none size-full" alt="" src={imgEcgSeg02} />
                        </div>
                      </div>
                      <div className="absolute flex h-[35.005px] items-center justify-center left-[240px] top-[37px] w-[5.001px]">
                        <div className="flex-none rotate-[-81.87deg]">
                          <div className="h-0 relative w-[35.36px]" data-name="ecg-seg-23">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg32} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[9.999px] items-center justify-center left-[245px] top-[37px] w-[5.001px]">
                        <div className="flex-none rotate-[63.43deg]">
                          <div className="h-0 relative w-[11.18px]" data-name="ecg-seg-24">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg42} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[45.003px] items-center justify-center left-[335px] top-[37px] w-[5px]">
                        <div className="flex-none rotate-[83.66deg]">
                          <div className="h-0 relative w-[45.28px]" data-name="ecg-seg-32">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg22} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[14.552px] items-center justify-center left-[330px] top-[37.45px] w-[3.639px]">
                        <div className="flex-none rotate-[-75.96deg]">
                          <div className="h-0 relative w-[15px]" data-name="ecg-seg-31">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg12} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute h-0 left-[200px] top-[42px] w-[30px]" data-name="ecg-seg-20">
                        <div className="absolute inset-[-2px_0_0_0]">
                          <img className="block max-w-none size-full" alt="" src={imgEcgSeg02} />
                        </div>
                      </div>
                      <div className="absolute flex h-[35.005px] items-center justify-center left-[290px] top-[42px] w-[5.001px]">
                        <div className="flex-none rotate-[-81.87deg]">
                          <div className="h-0 relative w-[35.36px]" data-name="ecg-seg-28">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg32} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[9.999px] items-center justify-center left-[295px] top-[42px] w-[5.001px]">
                        <div className="flex-none rotate-[63.43deg]">
                          <div className="h-0 relative w-[11.18px]" data-name="ecg-seg-29">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg42} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute h-0 left-[250px] top-[47px] w-[30px]" data-name="ecg-seg-25">
                        <div className="absolute inset-[-2px_0_0_0]">
                          <img className="block max-w-none size-full" alt="" src={imgEcgSeg02} />
                        </div>
                      </div>
                      <div className="absolute flex h-[35.005px] items-center justify-center left-[340px] top-[47px] w-[5.001px]">
                        <div className="flex-none rotate-[-81.87deg]">
                          <div className="h-0 relative w-[35.36px]" data-name="ecg-seg-33">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg32} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[9.999px] items-center justify-center left-[345px] top-[47px] w-[5.001px]">
                        <div className="flex-none rotate-[63.43deg]">
                          <div className="h-0 relative w-[11.18px]" data-name="ecg-seg-34">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg42} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute h-0 left-[300px] top-[52px] w-[30px]" data-name="ecg-seg-30">
                        <div className="absolute inset-[-2px_0_0_0]">
                          <img className="block max-w-none size-full" alt="" src={imgEcgSeg02} />
                        </div>
                      </div>
                      <div className="absolute h-0 left-[350px] top-[57px] w-[30px]" data-name="ecg-seg-35">
                        <div className="absolute inset-[-2px_0_0_0]">
                          <img className="block max-w-none size-full" alt="" src={imgEcgSeg02} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Link className="bg-white border-[#dc2626] border-b border-l-4 border-r border-solid border-t content-stretch cursor-pointer flex flex-[1_0_0] flex-col gap-[12px] h-full items-start min-w-px overflow-clip p-[16px] relative rounded-[12px]" data-name="bed-card-C-03" to="/MedPacienteResumen">
                <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="card-header">
                  <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="bed-id">
                    <div className="relative shrink-0 size-[18px]" data-name="bed">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBed2} />
                    </div>
                    <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#111827] text-[16px] text-left whitespace-nowrap">C-03</p>
                  </div>
                  <div className="bg-[#fee2e2] content-stretch flex items-start px-[8px] py-[2px] relative rounded-[4px] shrink-0" data-name="status-badge">
                    <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#dc2626] text-[10px] text-left whitespace-nowrap">CRÍTICO</p>
                  </div>
                </div>
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#111827] text-[15px] text-left w-full">M. González</p>
                <div className="bg-[#0b1220] content-stretch flex flex-col gap-[16px] items-start p-[16px] relative rounded-[8px] shrink-0 w-full" data-name="monitor-panel">
                  <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="vital-row-primary">
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="heart">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgHeart8} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] text-left whitespace-nowrap">FC</p>
                        <div className="bg-[#f59e0b] relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-[#f59e0b] text-[0px] text-left whitespace-nowrap"><span className="leading-[normal] text-[22px]">{`112 `}</span><span className="font-jakarta font-medium leading-[normal] text-[#64748b] text-[12px]">bpm</span></p>
                    </div>
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="activity">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgActivity10} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] text-left whitespace-nowrap">SpO₂</p>
                        <div className="bg-[#f59e0b] relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-[#f59e0b] text-[0px] text-left whitespace-nowrap"><span className="leading-[normal] text-[22px]">{`93 `}</span><span className="font-jakarta font-medium leading-[normal] text-[#64748b] text-[12px]">%</span></p>
                    </div>
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="armchair">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgArmchair3} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] text-left whitespace-nowrap">PA</p>
                        <div className="bg-[#f59e0b] relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-[#f59e0b] text-[0px] text-left whitespace-nowrap"><span className="leading-[normal] text-[18px]">{`145/92 `}</span><span className="font-jakarta font-medium leading-[normal] text-[#64748b] text-[12px]">mmHg</span></p>
                      <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] min-w-full relative shrink-0 text-[#64748b] text-[12px] text-left w-[min-content]">PAM: 110 mmHg</p>
                    </div>
                  </div>
                  <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="vital-row-secondary">
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="wind">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgWind3} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] text-left whitespace-nowrap">FR</p>
                        <div className="bg-[#f59e0b] relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-[#f59e0b] text-[0px] text-left whitespace-nowrap"><span className="leading-[normal] text-[18px]">{`22 `}</span><span className="font-jakarta font-medium leading-[normal] text-[#64748b] text-[12px]">rpm</span></p>
                    </div>
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="thermometer">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgThermometer3} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] text-left whitespace-nowrap">TEMP</p>
                        <div className="bg-[#f59e0b] relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-[#f59e0b] text-[0px] text-left whitespace-nowrap"><span className="leading-[normal] text-[18px]">{`37.8 `}</span><span className="font-jakarta font-medium leading-[normal] text-[#64748b] text-[12px]">°C</span></p>
                    </div>
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="brain">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBrain4} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] text-left whitespace-nowrap">GCS</p>
                        <div className="bg-[#f59e0b] relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-[#f59e0b] text-[0px] text-left whitespace-nowrap"><span className="leading-[normal] text-[18px]">{`12 `}</span><span className="font-jakarta font-medium leading-[normal] text-[#64748b] text-[12px]">pts</span></p>
                    </div>
                  </div>
                  <div className="bg-[#0b1220] border border-[#1f2937] border-solid content-stretch flex flex-col h-[44px] items-start overflow-clip relative rounded-[8px] shrink-0 w-full" data-name="ecg-waveform">
                    <div className="bg-[#0b1220] flex-[1_0_0] min-h-px relative w-full" data-name="ecg-canvas">
                      <div className="absolute flex h-[45.003px] items-center justify-center left-[35px] top-[7px] w-[5px]">
                        <div className="flex-none rotate-[83.66deg]">
                          <div className="h-0 relative w-[45.28px]" data-name="ecg-seg-2">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg23} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[14.552px] items-center justify-center left-[30px] top-[7.45px] w-[3.639px]">
                        <div className="flex-none rotate-[-75.96deg]">
                          <div className="h-0 relative w-[15px]" data-name="ecg-seg-1">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg13} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[45.003px] items-center justify-center left-[85px] top-[12px] w-[5px]">
                        <div className="flex-none rotate-[83.66deg]">
                          <div className="h-0 relative w-[45.28px]" data-name="ecg-seg-7">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg23} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[14.552px] items-center justify-center left-[80px] top-[12.45px] w-[3.639px]">
                        <div className="flex-none rotate-[-75.96deg]">
                          <div className="h-0 relative w-[15px]" data-name="ecg-seg-6">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg13} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[35.005px] items-center justify-center left-[40px] top-[17px] w-[5.001px]">
                        <div className="flex-none rotate-[-81.87deg]">
                          <div className="h-0 relative w-[35.36px]" data-name="ecg-seg-3">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg33} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[9.999px] items-center justify-center left-[45px] top-[17px] w-[5.001px]">
                        <div className="flex-none rotate-[63.43deg]">
                          <div className="h-0 relative w-[11.18px]" data-name="ecg-seg-4">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg43} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[45.003px] items-center justify-center left-[135px] top-[17px] w-[5px]">
                        <div className="flex-none rotate-[83.66deg]">
                          <div className="h-0 relative w-[45.28px]" data-name="ecg-seg-12">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg23} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[14.552px] items-center justify-center left-[130px] top-[17.45px] w-[3.639px]">
                        <div className="flex-none rotate-[-75.96deg]">
                          <div className="h-0 relative w-[15px]" data-name="ecg-seg-11">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg13} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute h-0 left-0 top-[22px] w-[30px]" data-name="ecg-seg-0">
                        <div className="absolute inset-[-2px_0_0_0]">
                          <img className="block max-w-none size-full" alt="" src={imgEcgSeg03} />
                        </div>
                      </div>
                      <div className="absolute flex h-[35.005px] items-center justify-center left-[90px] top-[22px] w-[5.001px]">
                        <div className="flex-none rotate-[-81.87deg]">
                          <div className="h-0 relative w-[35.36px]" data-name="ecg-seg-8">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg33} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[9.999px] items-center justify-center left-[95px] top-[22px] w-[5.001px]">
                        <div className="flex-none rotate-[63.43deg]">
                          <div className="h-0 relative w-[11.18px]" data-name="ecg-seg-9">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg43} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[45.003px] items-center justify-center left-[185px] top-[22px] w-[5px]">
                        <div className="flex-none rotate-[83.66deg]">
                          <div className="h-0 relative w-[45.28px]" data-name="ecg-seg-17">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg23} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[14.552px] items-center justify-center left-[180px] top-[22.45px] w-[3.639px]">
                        <div className="flex-none rotate-[-75.96deg]">
                          <div className="h-0 relative w-[15px]" data-name="ecg-seg-16">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg13} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute h-0 left-[50px] top-[27px] w-[30px]" data-name="ecg-seg-5">
                        <div className="absolute inset-[-2px_0_0_0]">
                          <img className="block max-w-none size-full" alt="" src={imgEcgSeg03} />
                        </div>
                      </div>
                      <div className="absolute flex h-[35.005px] items-center justify-center left-[140px] top-[27px] w-[5.001px]">
                        <div className="flex-none rotate-[-81.87deg]">
                          <div className="h-0 relative w-[35.36px]" data-name="ecg-seg-13">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg33} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[9.999px] items-center justify-center left-[145px] top-[27px] w-[5.001px]">
                        <div className="flex-none rotate-[63.43deg]">
                          <div className="h-0 relative w-[11.18px]" data-name="ecg-seg-14">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg43} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[45.003px] items-center justify-center left-[235px] top-[27px] w-[5px]">
                        <div className="flex-none rotate-[83.66deg]">
                          <div className="h-0 relative w-[45.28px]" data-name="ecg-seg-22">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg23} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[14.552px] items-center justify-center left-[230px] top-[27.45px] w-[3.639px]">
                        <div className="flex-none rotate-[-75.96deg]">
                          <div className="h-0 relative w-[15px]" data-name="ecg-seg-21">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg13} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute h-0 left-[100px] top-[32px] w-[30px]" data-name="ecg-seg-10">
                        <div className="absolute inset-[-2px_0_0_0]">
                          <img className="block max-w-none size-full" alt="" src={imgEcgSeg03} />
                        </div>
                      </div>
                      <div className="absolute flex h-[35.005px] items-center justify-center left-[190px] top-[32px] w-[5.001px]">
                        <div className="flex-none rotate-[-81.87deg]">
                          <div className="h-0 relative w-[35.36px]" data-name="ecg-seg-18">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg33} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[9.999px] items-center justify-center left-[195px] top-[32px] w-[5.001px]">
                        <div className="flex-none rotate-[63.43deg]">
                          <div className="h-0 relative w-[11.18px]" data-name="ecg-seg-19">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg43} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[45.003px] items-center justify-center left-[285px] top-[32px] w-[5px]">
                        <div className="flex-none rotate-[83.66deg]">
                          <div className="h-0 relative w-[45.28px]" data-name="ecg-seg-27">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg23} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[14.552px] items-center justify-center left-[280px] top-[32.45px] w-[3.639px]">
                        <div className="flex-none rotate-[-75.96deg]">
                          <div className="h-0 relative w-[15px]" data-name="ecg-seg-26">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg13} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute h-0 left-[150px] top-[37px] w-[30px]" data-name="ecg-seg-15">
                        <div className="absolute inset-[-2px_0_0_0]">
                          <img className="block max-w-none size-full" alt="" src={imgEcgSeg03} />
                        </div>
                      </div>
                      <div className="absolute flex h-[35.005px] items-center justify-center left-[240px] top-[37px] w-[5.001px]">
                        <div className="flex-none rotate-[-81.87deg]">
                          <div className="h-0 relative w-[35.36px]" data-name="ecg-seg-23">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg33} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[9.999px] items-center justify-center left-[245px] top-[37px] w-[5.001px]">
                        <div className="flex-none rotate-[63.43deg]">
                          <div className="h-0 relative w-[11.18px]" data-name="ecg-seg-24">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg43} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[45.003px] items-center justify-center left-[335px] top-[37px] w-[5px]">
                        <div className="flex-none rotate-[83.66deg]">
                          <div className="h-0 relative w-[45.28px]" data-name="ecg-seg-32">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg23} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[14.552px] items-center justify-center left-[330px] top-[37.45px] w-[3.639px]">
                        <div className="flex-none rotate-[-75.96deg]">
                          <div className="h-0 relative w-[15px]" data-name="ecg-seg-31">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg13} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute h-0 left-[200px] top-[42px] w-[30px]" data-name="ecg-seg-20">
                        <div className="absolute inset-[-2px_0_0_0]">
                          <img className="block max-w-none size-full" alt="" src={imgEcgSeg03} />
                        </div>
                      </div>
                      <div className="absolute flex h-[35.005px] items-center justify-center left-[290px] top-[42px] w-[5.001px]">
                        <div className="flex-none rotate-[-81.87deg]">
                          <div className="h-0 relative w-[35.36px]" data-name="ecg-seg-28">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg33} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[9.999px] items-center justify-center left-[295px] top-[42px] w-[5.001px]">
                        <div className="flex-none rotate-[63.43deg]">
                          <div className="h-0 relative w-[11.18px]" data-name="ecg-seg-29">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg43} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute h-0 left-[250px] top-[47px] w-[30px]" data-name="ecg-seg-25">
                        <div className="absolute inset-[-2px_0_0_0]">
                          <img className="block max-w-none size-full" alt="" src={imgEcgSeg03} />
                        </div>
                      </div>
                      <div className="absolute flex h-[35.005px] items-center justify-center left-[340px] top-[47px] w-[5.001px]">
                        <div className="flex-none rotate-[-81.87deg]">
                          <div className="h-0 relative w-[35.36px]" data-name="ecg-seg-33">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg33} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[9.999px] items-center justify-center left-[345px] top-[47px] w-[5.001px]">
                        <div className="flex-none rotate-[63.43deg]">
                          <div className="h-0 relative w-[11.18px]" data-name="ecg-seg-34">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg43} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute h-0 left-[300px] top-[52px] w-[30px]" data-name="ecg-seg-30">
                        <div className="absolute inset-[-2px_0_0_0]">
                          <img className="block max-w-none size-full" alt="" src={imgEcgSeg03} />
                        </div>
                      </div>
                      <div className="absolute h-0 left-[350px] top-[57px] w-[30px]" data-name="ecg-seg-35">
                        <div className="absolute inset-[-2px_0_0_0]">
                          <img className="block max-w-none size-full" alt="" src={imgEcgSeg03} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="content-stretch flex gap-[16px] h-[360px] items-start relative shrink-0 w-full" data-name="row-2">
              <div className="bg-white border-[#d97706] border-b border-l-4 border-r border-solid border-t content-stretch flex flex-[1_0_0] flex-col gap-[12px] h-full items-start min-w-px overflow-clip p-[16px] relative rounded-[12px]" data-name="bed-card-C-05">
                <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="card-header">
                  <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="bed-id">
                    <div className="relative shrink-0 size-[18px]" data-name="bed">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBed3} />
                    </div>
                    <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#111827] text-[16px] whitespace-nowrap">C-05</p>
                  </div>
                  <div className="bg-[#fffbeb] content-stretch flex items-start px-[8px] py-[2px] relative rounded-[4px] shrink-0" data-name="status-badge">
                    <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#d97706] text-[10px] whitespace-nowrap">MONITOREO</p>
                  </div>
                </div>
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#111827] text-[15px] w-full">L. Torres</p>
                <div className="bg-[#0b1220] content-stretch flex flex-col gap-[16px] items-start p-[16px] relative rounded-[8px] shrink-0 w-full" data-name="monitor-panel">
                  <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="vital-row-primary">
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="heart">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgHeart9} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">FC</p>
                        <div className="bg-[#10b981] relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-[#10b981] text-[0px] whitespace-nowrap"><span className="leading-[normal] text-[22px]">{`95 `}</span><span className="font-jakarta font-medium leading-[normal] text-[#64748b] text-[12px]">bpm</span></p>
                    </div>
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="activity">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgActivity10} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">SpO₂</p>
                        <div className="bg-[#f59e0b] relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-[#f59e0b] text-[0px] whitespace-nowrap"><span className="leading-[normal] text-[22px]">{`95 `}</span><span className="font-jakarta font-medium leading-[normal] text-[#64748b] text-[12px]">%</span></p>
                    </div>
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="armchair">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgArmchair3} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">PA</p>
                        <div className="bg-[#f59e0b] relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-[#f59e0b] text-[0px] whitespace-nowrap"><span className="leading-[normal] text-[18px]">{`135/88 `}</span><span className="font-jakarta font-medium leading-[normal] text-[#64748b] text-[12px]">mmHg</span></p>
                      <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] min-w-full relative shrink-0 text-[#64748b] text-[12px] w-[min-content]">PAM: 104 mmHg</p>
                    </div>
                  </div>
                  <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="vital-row-secondary">
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="wind">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgWind4} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">FR</p>
                        <div className="bg-[#10b981] relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-[#10b981] text-[0px] whitespace-nowrap"><span className="leading-[normal] text-[18px]">{`18 `}</span><span className="font-jakarta font-medium leading-[normal] text-[#64748b] text-[12px]">rpm</span></p>
                    </div>
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="thermometer">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgThermometer2} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">TEMP</p>
                        <div className="bg-[#10b981] relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-[#10b981] text-[0px] whitespace-nowrap"><span className="leading-[normal] text-[18px]">{`37.1 `}</span><span className="font-jakarta font-medium leading-[normal] text-[#64748b] text-[12px]">°C</span></p>
                    </div>
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="brain">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBrain5} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">GCS</p>
                        <div className="bg-[#10b981] relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-[#10b981] text-[0px] whitespace-nowrap"><span className="leading-[normal] text-[18px]">{`14 `}</span><span className="font-jakarta font-medium leading-[normal] text-[#64748b] text-[12px]">pts</span></p>
                    </div>
                  </div>
                  <div className="bg-[#0b1220] border border-[#1f2937] border-solid content-stretch flex flex-col h-[44px] items-start overflow-clip relative rounded-[8px] shrink-0 w-full" data-name="ecg-waveform">
                    <div className="bg-[#0b1220] flex-[1_0_0] min-h-px relative w-full" data-name="ecg-canvas">
                      <div className="absolute flex h-[45.003px] items-center justify-center left-[35px] top-[7px] w-[5px]">
                        <div className="flex-none rotate-[83.66deg]">
                          <div className="h-0 relative w-[45.28px]" data-name="ecg-seg-2">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg23} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[14.552px] items-center justify-center left-[30px] top-[7.45px] w-[3.639px]">
                        <div className="flex-none rotate-[-75.96deg]">
                          <div className="h-0 relative w-[15px]" data-name="ecg-seg-1">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg13} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[45.003px] items-center justify-center left-[85px] top-[12px] w-[5px]">
                        <div className="flex-none rotate-[83.66deg]">
                          <div className="h-0 relative w-[45.28px]" data-name="ecg-seg-7">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg23} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[14.552px] items-center justify-center left-[80px] top-[12.45px] w-[3.639px]">
                        <div className="flex-none rotate-[-75.96deg]">
                          <div className="h-0 relative w-[15px]" data-name="ecg-seg-6">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg13} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[35.005px] items-center justify-center left-[40px] top-[17px] w-[5.001px]">
                        <div className="flex-none rotate-[-81.87deg]">
                          <div className="h-0 relative w-[35.36px]" data-name="ecg-seg-3">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg33} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[9.999px] items-center justify-center left-[45px] top-[17px] w-[5.001px]">
                        <div className="flex-none rotate-[63.43deg]">
                          <div className="h-0 relative w-[11.18px]" data-name="ecg-seg-4">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg43} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[45.003px] items-center justify-center left-[135px] top-[17px] w-[5px]">
                        <div className="flex-none rotate-[83.66deg]">
                          <div className="h-0 relative w-[45.28px]" data-name="ecg-seg-12">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg23} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[14.552px] items-center justify-center left-[130px] top-[17.45px] w-[3.639px]">
                        <div className="flex-none rotate-[-75.96deg]">
                          <div className="h-0 relative w-[15px]" data-name="ecg-seg-11">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg13} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute h-0 left-0 top-[22px] w-[30px]" data-name="ecg-seg-0">
                        <div className="absolute inset-[-2px_0_0_0]">
                          <img className="block max-w-none size-full" alt="" src={imgEcgSeg03} />
                        </div>
                      </div>
                      <div className="absolute flex h-[35.005px] items-center justify-center left-[90px] top-[22px] w-[5.001px]">
                        <div className="flex-none rotate-[-81.87deg]">
                          <div className="h-0 relative w-[35.36px]" data-name="ecg-seg-8">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg33} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[9.999px] items-center justify-center left-[95px] top-[22px] w-[5.001px]">
                        <div className="flex-none rotate-[63.43deg]">
                          <div className="h-0 relative w-[11.18px]" data-name="ecg-seg-9">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg43} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[45.003px] items-center justify-center left-[185px] top-[22px] w-[5px]">
                        <div className="flex-none rotate-[83.66deg]">
                          <div className="h-0 relative w-[45.28px]" data-name="ecg-seg-17">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg23} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[14.552px] items-center justify-center left-[180px] top-[22.45px] w-[3.639px]">
                        <div className="flex-none rotate-[-75.96deg]">
                          <div className="h-0 relative w-[15px]" data-name="ecg-seg-16">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg13} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute h-0 left-[50px] top-[27px] w-[30px]" data-name="ecg-seg-5">
                        <div className="absolute inset-[-2px_0_0_0]">
                          <img className="block max-w-none size-full" alt="" src={imgEcgSeg03} />
                        </div>
                      </div>
                      <div className="absolute flex h-[35.005px] items-center justify-center left-[140px] top-[27px] w-[5.001px]">
                        <div className="flex-none rotate-[-81.87deg]">
                          <div className="h-0 relative w-[35.36px]" data-name="ecg-seg-13">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg33} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[9.999px] items-center justify-center left-[145px] top-[27px] w-[5.001px]">
                        <div className="flex-none rotate-[63.43deg]">
                          <div className="h-0 relative w-[11.18px]" data-name="ecg-seg-14">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg43} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[45.003px] items-center justify-center left-[235px] top-[27px] w-[5px]">
                        <div className="flex-none rotate-[83.66deg]">
                          <div className="h-0 relative w-[45.28px]" data-name="ecg-seg-22">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg23} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[14.552px] items-center justify-center left-[230px] top-[27.45px] w-[3.639px]">
                        <div className="flex-none rotate-[-75.96deg]">
                          <div className="h-0 relative w-[15px]" data-name="ecg-seg-21">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg13} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute h-0 left-[100px] top-[32px] w-[30px]" data-name="ecg-seg-10">
                        <div className="absolute inset-[-2px_0_0_0]">
                          <img className="block max-w-none size-full" alt="" src={imgEcgSeg03} />
                        </div>
                      </div>
                      <div className="absolute flex h-[35.005px] items-center justify-center left-[190px] top-[32px] w-[5.001px]">
                        <div className="flex-none rotate-[-81.87deg]">
                          <div className="h-0 relative w-[35.36px]" data-name="ecg-seg-18">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg33} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[9.999px] items-center justify-center left-[195px] top-[32px] w-[5.001px]">
                        <div className="flex-none rotate-[63.43deg]">
                          <div className="h-0 relative w-[11.18px]" data-name="ecg-seg-19">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg43} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[45.003px] items-center justify-center left-[285px] top-[32px] w-[5px]">
                        <div className="flex-none rotate-[83.66deg]">
                          <div className="h-0 relative w-[45.28px]" data-name="ecg-seg-27">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg23} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[14.552px] items-center justify-center left-[280px] top-[32.45px] w-[3.639px]">
                        <div className="flex-none rotate-[-75.96deg]">
                          <div className="h-0 relative w-[15px]" data-name="ecg-seg-26">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg13} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute h-0 left-[150px] top-[37px] w-[30px]" data-name="ecg-seg-15">
                        <div className="absolute inset-[-2px_0_0_0]">
                          <img className="block max-w-none size-full" alt="" src={imgEcgSeg03} />
                        </div>
                      </div>
                      <div className="absolute flex h-[35.005px] items-center justify-center left-[240px] top-[37px] w-[5.001px]">
                        <div className="flex-none rotate-[-81.87deg]">
                          <div className="h-0 relative w-[35.36px]" data-name="ecg-seg-23">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg33} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[9.999px] items-center justify-center left-[245px] top-[37px] w-[5.001px]">
                        <div className="flex-none rotate-[63.43deg]">
                          <div className="h-0 relative w-[11.18px]" data-name="ecg-seg-24">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg43} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[45.003px] items-center justify-center left-[335px] top-[37px] w-[5px]">
                        <div className="flex-none rotate-[83.66deg]">
                          <div className="h-0 relative w-[45.28px]" data-name="ecg-seg-32">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg23} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[14.552px] items-center justify-center left-[330px] top-[37.45px] w-[3.639px]">
                        <div className="flex-none rotate-[-75.96deg]">
                          <div className="h-0 relative w-[15px]" data-name="ecg-seg-31">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg13} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute h-0 left-[200px] top-[42px] w-[30px]" data-name="ecg-seg-20">
                        <div className="absolute inset-[-2px_0_0_0]">
                          <img className="block max-w-none size-full" alt="" src={imgEcgSeg03} />
                        </div>
                      </div>
                      <div className="absolute flex h-[35.005px] items-center justify-center left-[290px] top-[42px] w-[5.001px]">
                        <div className="flex-none rotate-[-81.87deg]">
                          <div className="h-0 relative w-[35.36px]" data-name="ecg-seg-28">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg33} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[9.999px] items-center justify-center left-[295px] top-[42px] w-[5.001px]">
                        <div className="flex-none rotate-[63.43deg]">
                          <div className="h-0 relative w-[11.18px]" data-name="ecg-seg-29">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg43} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute h-0 left-[250px] top-[47px] w-[30px]" data-name="ecg-seg-25">
                        <div className="absolute inset-[-2px_0_0_0]">
                          <img className="block max-w-none size-full" alt="" src={imgEcgSeg03} />
                        </div>
                      </div>
                      <div className="absolute flex h-[35.005px] items-center justify-center left-[340px] top-[47px] w-[5.001px]">
                        <div className="flex-none rotate-[-81.87deg]">
                          <div className="h-0 relative w-[35.36px]" data-name="ecg-seg-33">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg33} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[9.999px] items-center justify-center left-[345px] top-[47px] w-[5.001px]">
                        <div className="flex-none rotate-[63.43deg]">
                          <div className="h-0 relative w-[11.18px]" data-name="ecg-seg-34">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg43} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute h-0 left-[300px] top-[52px] w-[30px]" data-name="ecg-seg-30">
                        <div className="absolute inset-[-2px_0_0_0]">
                          <img className="block max-w-none size-full" alt="" src={imgEcgSeg03} />
                        </div>
                      </div>
                      <div className="absolute h-0 left-[350px] top-[57px] w-[30px]" data-name="ecg-seg-35">
                        <div className="absolute inset-[-2px_0_0_0]">
                          <img className="block max-w-none size-full" alt="" src={imgEcgSeg03} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white border-[#dc2626] border-b border-l-4 border-r border-solid border-t content-stretch flex flex-[1_0_0] flex-col gap-[12px] h-full items-start min-w-px overflow-clip p-[16px] relative rounded-[12px]" data-name="bed-card-C-06">
                <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="card-header">
                  <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="bed-id">
                    <div className="relative shrink-0 size-[18px]" data-name="bed">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBed2} />
                    </div>
                    <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#111827] text-[16px] whitespace-nowrap">C-06</p>
                  </div>
                  <div className="bg-[#fee2e2] content-stretch flex items-start px-[8px] py-[2px] relative rounded-[4px] shrink-0" data-name="status-badge">
                    <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#dc2626] text-[10px] whitespace-nowrap">CRÍTICO</p>
                  </div>
                </div>
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#111827] text-[15px] w-full">F. Díaz</p>
                <div className="bg-[#0b1220] content-stretch flex flex-col gap-[16px] items-start p-[16px] relative rounded-[8px] shrink-0 w-full" data-name="monitor-panel">
                  <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="vital-row-primary">
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="heart">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgHeart7} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">FC</p>
                        <div className="bg-[#ef4444] relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-[#ef4444] text-[0px] whitespace-nowrap"><span className="leading-[normal] text-[22px]">{`130 `}</span><span className="font-jakarta font-medium leading-[normal] text-[#64748b] text-[12px]">bpm</span></p>
                    </div>
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="activity">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgActivity9} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">SpO₂</p>
                        <div className="bg-[#ef4444] relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-[#ef4444] text-[0px] whitespace-nowrap"><span className="leading-[normal] text-[22px]">{`88 `}</span><span className="font-jakarta font-medium leading-[normal] text-[#64748b] text-[12px]">%</span></p>
                    </div>
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="armchair">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgArmchair2} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">PA</p>
                        <div className="bg-[#ef4444] relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-[#ef4444] text-[0px] whitespace-nowrap"><span className="leading-[normal] text-[18px]">{`85/55 `}</span><span className="font-jakarta font-medium leading-[normal] text-[#64748b] text-[12px]">mmHg</span></p>
                      <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] min-w-full relative shrink-0 text-[#64748b] text-[12px] w-[min-content]">PAM: 65 mmHg</p>
                    </div>
                  </div>
                  <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="vital-row-secondary">
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="wind">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgWind5} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">FR</p>
                        <div className="bg-[#ef4444] relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-[#ef4444] text-[0px] whitespace-nowrap"><span className="leading-[normal] text-[18px]">{`32 `}</span><span className="font-jakarta font-medium leading-[normal] text-[#64748b] text-[12px]">rpm</span></p>
                    </div>
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="thermometer">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgThermometer3} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">TEMP</p>
                        <div className="bg-[#f59e0b] relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-[#f59e0b] text-[0px] whitespace-nowrap"><span className="leading-[normal] text-[18px]">{`38.5 `}</span><span className="font-jakarta font-medium leading-[normal] text-[#64748b] text-[12px]">°C</span></p>
                    </div>
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="brain">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBrain3} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">GCS</p>
                        <div className="bg-[#ef4444] relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-[#ef4444] text-[0px] whitespace-nowrap"><span className="leading-[normal] text-[18px]">{`8 `}</span><span className="font-jakarta font-medium leading-[normal] text-[#64748b] text-[12px]">pts</span></p>
                    </div>
                  </div>
                  <div className="bg-[#0b1220] border border-[#1f2937] border-solid content-stretch flex flex-col h-[44px] items-start overflow-clip relative rounded-[8px] shrink-0 w-full" data-name="ecg-waveform">
                    <div className="bg-[#0b1220] flex-[1_0_0] min-h-px relative w-full" data-name="ecg-canvas">
                      <div className="absolute flex h-[45.003px] items-center justify-center left-[35px] top-[7px] w-[5px]">
                        <div className="flex-none rotate-[83.66deg]">
                          <div className="h-0 relative w-[45.28px]" data-name="ecg-seg-2">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg22} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[14.552px] items-center justify-center left-[30px] top-[7.45px] w-[3.639px]">
                        <div className="flex-none rotate-[-75.96deg]">
                          <div className="h-0 relative w-[15px]" data-name="ecg-seg-1">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg12} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[45.003px] items-center justify-center left-[85px] top-[12px] w-[5px]">
                        <div className="flex-none rotate-[83.66deg]">
                          <div className="h-0 relative w-[45.28px]" data-name="ecg-seg-7">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg22} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[14.552px] items-center justify-center left-[80px] top-[12.45px] w-[3.639px]">
                        <div className="flex-none rotate-[-75.96deg]">
                          <div className="h-0 relative w-[15px]" data-name="ecg-seg-6">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg12} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[35.005px] items-center justify-center left-[40px] top-[17px] w-[5.001px]">
                        <div className="flex-none rotate-[-81.87deg]">
                          <div className="h-0 relative w-[35.36px]" data-name="ecg-seg-3">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg32} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[9.999px] items-center justify-center left-[45px] top-[17px] w-[5.001px]">
                        <div className="flex-none rotate-[63.43deg]">
                          <div className="h-0 relative w-[11.18px]" data-name="ecg-seg-4">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg42} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[45.003px] items-center justify-center left-[135px] top-[17px] w-[5px]">
                        <div className="flex-none rotate-[83.66deg]">
                          <div className="h-0 relative w-[45.28px]" data-name="ecg-seg-12">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg22} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[14.552px] items-center justify-center left-[130px] top-[17.45px] w-[3.639px]">
                        <div className="flex-none rotate-[-75.96deg]">
                          <div className="h-0 relative w-[15px]" data-name="ecg-seg-11">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg12} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute h-0 left-0 top-[22px] w-[30px]" data-name="ecg-seg-0">
                        <div className="absolute inset-[-2px_0_0_0]">
                          <img className="block max-w-none size-full" alt="" src={imgEcgSeg02} />
                        </div>
                      </div>
                      <div className="absolute flex h-[35.005px] items-center justify-center left-[90px] top-[22px] w-[5.001px]">
                        <div className="flex-none rotate-[-81.87deg]">
                          <div className="h-0 relative w-[35.36px]" data-name="ecg-seg-8">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg32} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[9.999px] items-center justify-center left-[95px] top-[22px] w-[5.001px]">
                        <div className="flex-none rotate-[63.43deg]">
                          <div className="h-0 relative w-[11.18px]" data-name="ecg-seg-9">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg42} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[45.003px] items-center justify-center left-[185px] top-[22px] w-[5px]">
                        <div className="flex-none rotate-[83.66deg]">
                          <div className="h-0 relative w-[45.28px]" data-name="ecg-seg-17">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg22} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[14.552px] items-center justify-center left-[180px] top-[22.45px] w-[3.639px]">
                        <div className="flex-none rotate-[-75.96deg]">
                          <div className="h-0 relative w-[15px]" data-name="ecg-seg-16">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg12} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute h-0 left-[50px] top-[27px] w-[30px]" data-name="ecg-seg-5">
                        <div className="absolute inset-[-2px_0_0_0]">
                          <img className="block max-w-none size-full" alt="" src={imgEcgSeg02} />
                        </div>
                      </div>
                      <div className="absolute flex h-[35.005px] items-center justify-center left-[140px] top-[27px] w-[5.001px]">
                        <div className="flex-none rotate-[-81.87deg]">
                          <div className="h-0 relative w-[35.36px]" data-name="ecg-seg-13">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg32} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[9.999px] items-center justify-center left-[145px] top-[27px] w-[5.001px]">
                        <div className="flex-none rotate-[63.43deg]">
                          <div className="h-0 relative w-[11.18px]" data-name="ecg-seg-14">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg42} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[45.003px] items-center justify-center left-[235px] top-[27px] w-[5px]">
                        <div className="flex-none rotate-[83.66deg]">
                          <div className="h-0 relative w-[45.28px]" data-name="ecg-seg-22">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg22} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[14.552px] items-center justify-center left-[230px] top-[27.45px] w-[3.639px]">
                        <div className="flex-none rotate-[-75.96deg]">
                          <div className="h-0 relative w-[15px]" data-name="ecg-seg-21">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg12} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute h-0 left-[100px] top-[32px] w-[30px]" data-name="ecg-seg-10">
                        <div className="absolute inset-[-2px_0_0_0]">
                          <img className="block max-w-none size-full" alt="" src={imgEcgSeg02} />
                        </div>
                      </div>
                      <div className="absolute flex h-[35.005px] items-center justify-center left-[190px] top-[32px] w-[5.001px]">
                        <div className="flex-none rotate-[-81.87deg]">
                          <div className="h-0 relative w-[35.36px]" data-name="ecg-seg-18">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg32} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[9.999px] items-center justify-center left-[195px] top-[32px] w-[5.001px]">
                        <div className="flex-none rotate-[63.43deg]">
                          <div className="h-0 relative w-[11.18px]" data-name="ecg-seg-19">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg42} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[45.003px] items-center justify-center left-[285px] top-[32px] w-[5px]">
                        <div className="flex-none rotate-[83.66deg]">
                          <div className="h-0 relative w-[45.28px]" data-name="ecg-seg-27">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg22} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[14.552px] items-center justify-center left-[280px] top-[32.45px] w-[3.639px]">
                        <div className="flex-none rotate-[-75.96deg]">
                          <div className="h-0 relative w-[15px]" data-name="ecg-seg-26">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg12} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute h-0 left-[150px] top-[37px] w-[30px]" data-name="ecg-seg-15">
                        <div className="absolute inset-[-2px_0_0_0]">
                          <img className="block max-w-none size-full" alt="" src={imgEcgSeg02} />
                        </div>
                      </div>
                      <div className="absolute flex h-[35.005px] items-center justify-center left-[240px] top-[37px] w-[5.001px]">
                        <div className="flex-none rotate-[-81.87deg]">
                          <div className="h-0 relative w-[35.36px]" data-name="ecg-seg-23">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg32} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[9.999px] items-center justify-center left-[245px] top-[37px] w-[5.001px]">
                        <div className="flex-none rotate-[63.43deg]">
                          <div className="h-0 relative w-[11.18px]" data-name="ecg-seg-24">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg42} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[45.003px] items-center justify-center left-[335px] top-[37px] w-[5px]">
                        <div className="flex-none rotate-[83.66deg]">
                          <div className="h-0 relative w-[45.28px]" data-name="ecg-seg-32">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg22} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[14.552px] items-center justify-center left-[330px] top-[37.45px] w-[3.639px]">
                        <div className="flex-none rotate-[-75.96deg]">
                          <div className="h-0 relative w-[15px]" data-name="ecg-seg-31">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg12} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute h-0 left-[200px] top-[42px] w-[30px]" data-name="ecg-seg-20">
                        <div className="absolute inset-[-2px_0_0_0]">
                          <img className="block max-w-none size-full" alt="" src={imgEcgSeg02} />
                        </div>
                      </div>
                      <div className="absolute flex h-[35.005px] items-center justify-center left-[290px] top-[42px] w-[5.001px]">
                        <div className="flex-none rotate-[-81.87deg]">
                          <div className="h-0 relative w-[35.36px]" data-name="ecg-seg-28">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg32} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[9.999px] items-center justify-center left-[295px] top-[42px] w-[5.001px]">
                        <div className="flex-none rotate-[63.43deg]">
                          <div className="h-0 relative w-[11.18px]" data-name="ecg-seg-29">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg42} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute h-0 left-[250px] top-[47px] w-[30px]" data-name="ecg-seg-25">
                        <div className="absolute inset-[-2px_0_0_0]">
                          <img className="block max-w-none size-full" alt="" src={imgEcgSeg02} />
                        </div>
                      </div>
                      <div className="absolute flex h-[35.005px] items-center justify-center left-[340px] top-[47px] w-[5.001px]">
                        <div className="flex-none rotate-[-81.87deg]">
                          <div className="h-0 relative w-[35.36px]" data-name="ecg-seg-33">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg32} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute flex h-[9.999px] items-center justify-center left-[345px] top-[47px] w-[5.001px]">
                        <div className="flex-none rotate-[63.43deg]">
                          <div className="h-0 relative w-[11.18px]" data-name="ecg-seg-34">
                            <div className="absolute inset-[-2px_0_0_0]">
                              <img className="block max-w-none size-full" alt="" src={imgEcgSeg42} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute h-0 left-[300px] top-[52px] w-[30px]" data-name="ecg-seg-30">
                        <div className="absolute inset-[-2px_0_0_0]">
                          <img className="block max-w-none size-full" alt="" src={imgEcgSeg02} />
                        </div>
                      </div>
                      <div className="absolute h-0 left-[350px] top-[57px] w-[30px]" data-name="ecg-seg-35">
                        <div className="absolute inset-[-2px_0_0_0]">
                          <img className="block max-w-none size-full" alt="" src={imgEcgSeg02} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-[#f3f4f6] border-[#1e3a8a] border-b border-l-4 border-r border-solid border-t content-stretch flex flex-[1_0_0] flex-col gap-[12px] h-full items-start min-w-px overflow-clip p-[16px] relative rounded-[12px]" data-name="bed-card-C-07">
                <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="card-header">
                  <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="bed-id">
                    <div className="relative shrink-0 size-[18px]" data-name="bed">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBed} />
                    </div>
                    <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#111827] text-[16px] whitespace-nowrap">C-07</p>
                  </div>
                  <div className="bg-[#eff6ff] content-stretch flex items-start px-[8px] py-[2px] relative rounded-[4px] shrink-0" data-name="status-badge">
                    <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#1e3a8a] text-[10px] whitespace-nowrap">DISPONIBLE</p>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[6px] items-center justify-center leading-[normal] py-[12px] relative shrink-0 text-center w-full" data-name="empty-content">
                  <p className="font-jakarta font-bold relative shrink-0 text-[#111827] text-[15px] whitespace-nowrap">Disponible</p>
                  <p className="font-jakarta font-semibold min-w-full relative shrink-0 text-[#6b7280] text-[12px] w-[min-content]">Sin paciente asignado</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
