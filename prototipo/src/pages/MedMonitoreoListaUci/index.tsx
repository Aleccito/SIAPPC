// Pantalla "med/monitoreo/lista-uci" (Figma node 127:11) — generada desde el diseño original de Figma.
import { Link } from 'react-router-dom';
import imgAlertTextEllipse from '../../assets/alert-text-ellipse.svg';
import imgAlertTextEllipse2 from '../../assets/alert-text-ellipse-2.svg';
import imgAvatar19Png from '../../assets/avatar-19.png';
import imgBedIcon from '../../assets/bed-icon.svg';
import imgBedIcon2 from '../../assets/bed-icon-2.svg';
import imgBedIcon3 from '../../assets/bed-icon-3.svg';
import imgBedIcon4 from '../../assets/bed-icon-4.svg';
import imgDoctorFooterLine2 from '../../assets/doctor-footer-line-2.svg';
import imgHelpIconEllipse from '../../assets/help-icon-ellipse.svg';
import imgIconwrapper from '../../assets/iconwrapper.svg';
import imgLogOut from '../../assets/log-out.svg';
import imgMenuItemAlertasIcon from '../../assets/menu-item-alertas-icon.svg';
import imgMenuItemDashboardIcon from '../../assets/menu-item-dashboard-icon.svg';
import imgMenuItemDispositivosIcon from '../../assets/menu-item-dispositivos-icon.svg';
import imgMenuItemMonitoreoIcon from '../../assets/menu-item-monitoreo-icon.svg';
import imgMenuItemPacientesIcon from '../../assets/menu-item-pacientes-icon.svg';
import imgMenuItemReportesIcon from '../../assets/menu-item-reportes-icon.svg';
import imgStatusPillEllipse from '../../assets/status-pill-ellipse.svg';

export default function MedMonitoreoListaUci() {
  return (
    <div className="bg-[#f8fafc] content-stretch flex h-[900px] items-start overflow-clip relative shrink-0 w-[1440px]" data-name="med/monitoreo/lista-uci">
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
              <div className="relative shrink-0 size-[18px]" data-name="icon">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgMenuItemDashboardIcon} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#94a3b8] text-[14px] whitespace-nowrap">Dashboard</p>
            </Link>
            <Link className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Pacientes" to="/MedPacientesLista">
              <div className="relative shrink-0 size-[18px]" data-name="icon">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgMenuItemPacientesIcon} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#94a3b8] text-[14px] whitespace-nowrap">Pacientes</p>
            </Link>
            <Link className="bg-[rgba(37,99,235,0.15)] content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Monitoreo" to="/MedMonitoreoGridUci">
              <div className="relative shrink-0 size-[18px]" data-name="icon">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgMenuItemMonitoreoIcon} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">Monitoreo</p>
            </Link>
            <Link className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Alertas" to="/MedAlertasCentro">
              <div className="relative shrink-0 size-[18px]" data-name="icon">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgMenuItemAlertasIcon} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#94a3b8] text-[14px] whitespace-nowrap">Alertas</p>
            </Link>
            <Link className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Reportes" to="/MedReportesPanel">
              <div className="relative shrink-0 size-[18px]" data-name="icon">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgMenuItemReportesIcon} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#94a3b8] text-[14px] whitespace-nowrap">Reportes</p>
            </Link>
            <Link className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Dispositivos" to="/MedDispositivosMonitores">
              <div className="relative shrink-0 size-[18px]" data-name="icon">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgMenuItemDispositivosIcon} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#94a3b8] text-[14px] whitespace-nowrap">Dispositivos</p>
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
              <img className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[20px] size-full" alt="" src={imgAvatar19Png} />
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
      <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start min-w-px relative" data-name="main-container">
        <div className="bg-white border-[#e2e8f0] border-b border-solid content-stretch flex h-[72px] items-center justify-between px-[32px] relative shrink-0 w-full" data-name="top-bar">
          <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] relative shrink-0 whitespace-nowrap" data-name="title-breadcrumb">
            <p className="font-jakarta font-medium relative shrink-0 text-[#64748b] text-[12px]">{`SIAPPC > Monitoreo`}</p>
            <p className="font-jakarta font-extrabold relative shrink-0 text-[#0f172a] text-[20px]">Central de Monitoreo – UCI</p>
          </div>
          <div className="content-stretch flex gap-[20px] items-center overflow-clip relative shrink-0" data-name="right-actions">
            <div className="content-stretch flex items-center relative shrink-0" data-name="controls-group">
              <div className="bg-[#f1f5f9] content-stretch flex gap-[2px] items-center p-[4px] relative rounded-[8px] shrink-0" data-name="view-toggle">
                <div className="content-stretch flex items-start px-[12px] py-[6px] relative rounded-[6px] shrink-0" data-name="toggle-inactive">
                  <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Grid</p>
                </div>
                <div className="bg-white content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex items-start px-[12px] py-[6px] relative rounded-[6px] shrink-0" data-name="toggle-active">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">Vista: Lista</p>
                </div>
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
        <div className="bg-white content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-start min-h-px p-[32px] relative w-full" data-name="page-body">
          <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-center justify-between px-[20px] py-[16px] relative rounded-[12px] shrink-0 w-full" data-name="overview-ribbon">
            <p className="[word-break:break-word] font-jakarta font-semibold leading-[0] relative shrink-0 text-[#374151] text-[15px] whitespace-nowrap"><span className="leading-[normal]">{`Monitoreo activo para `}</span><span className="font-jakarta font-extrabold leading-[normal] text-[#2563eb]">6 pacientes críticos en UCI</span><span className="leading-[normal]">{` • 2 Estable • 1 Monitoreo • 3 Crítico`}</span></p>
            <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="indicators">
              <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="ind-stable">
                <div className="relative shrink-0 size-[8px]" data-name="Ellipse">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgStatusPillEllipse} />
                </div>
                <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap">Estable</p>
              </div>
              <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="ind-stable">
                <div className="relative shrink-0 size-[8px]" data-name="Ellipse">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgAlertTextEllipse} />
                </div>
                <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap">Monitoreo</p>
              </div>
              <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="ind-stable">
                <div className="relative shrink-0 size-[8px]" data-name="Ellipse">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgAlertTextEllipse2} />
                </div>
                <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap">Crítico</p>
              </div>
            </div>
          </div>
          <div className="border border-[#e2e8f0] border-solid content-stretch flex flex-[1_0_0] flex-col items-start min-h-px relative rounded-[12px] w-full" data-name="patients-table-container">
            <div className="[word-break:break-word] bg-[#f8fafc] border-[#e2e8f0] border-b border-solid content-stretch flex gap-[16px] h-[55px] items-center leading-[normal] px-[24px] py-[12px] relative shrink-0 text-[#64748b] w-full" data-name="table-header">
              <p className="font-jakarta font-bold relative shrink-0 text-[11px] text-center w-[60px]">CAMA</p>
              <p className="font-jakarta font-bold relative shrink-0 text-[11px] w-[140px]">PACIENTE</p>
              <p className="font-jakarta font-bold relative shrink-0 text-[11px] w-[90px]">ESTADO</p>
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] h-[55px] items-center min-w-px relative" data-name="vitals-header-group">
                <p className="font-jakarta font-bold relative shrink-0 text-[11px] text-center w-full">SIGNOS VITALES / TELEMETRÍA EN TIEMPO REAL</p>
                <div className="content-stretch flex gap-[16px] h-[13px] items-center relative shrink-0 text-[10px] w-full" data-name="vitals-sub-headers">
                  <p className="font-jakarta font-bold relative shrink-0 text-center w-[70px]">FC</p>
                  <p className="font-jakarta font-bold relative shrink-0 text-center w-[70px]">SpO2</p>
                  <p className="font-jakarta font-bold relative shrink-0 text-center w-[110px]">P. ARTERIAL</p>
                  <p className="font-jakarta font-bold relative shrink-0 text-center w-[70px]">TEMP</p>
                  <p className="font-jakarta font-bold relative shrink-0 text-center w-[70px]">FR</p>
                  <p className="font-jakarta font-bold relative shrink-0 text-center w-[60px]">GCS</p>
                  <p className="font-jakarta font-semibold relative shrink-0 w-[84px]">ACTUALIZADO</p>
                </div>
              </div>
            </div>
            <div className="bg-white border-[#e2e8f0] border-b border-solid content-stretch flex gap-[16px] h-[72px] items-center px-[24px] py-[12px] relative shrink-0 w-full" data-name="bed-row-C-01">
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-[60px]" data-name="Frame">
                <div className="relative shrink-0 size-[18px]" data-name="bed-icon">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBedIcon} />
                </div>
                <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[12px] whitespace-nowrap">C-01</p>
              </div>
              <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[140px] whitespace-nowrap" data-name="Frame">
                <p className="font-jakarta font-bold relative shrink-0 text-[#0f172a] text-[12px]">R. López</p>
                <p className="font-jakarta font-medium relative shrink-0 text-[#64748b] text-[11px]">64 años</p>
              </div>
              <div className="content-stretch flex items-start relative shrink-0 w-[90px]" data-name="Frame">
                <div className="bg-[#ecfdf5] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#10b981] text-[11px] whitespace-nowrap">ESTABLE</p>
                </div>
              </div>
              <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-w-px relative" data-name="Frame">
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[70px] whitespace-nowrap" data-name="Frame">
                  <p className="font-jakarta font-bold relative shrink-0 text-[#64748b] text-[10px]">FC</p>
                  <div className="content-stretch flex gap-[4px] items-baseline relative shrink-0" data-name="Frame">
                    <p className="font-jakarta font-extrabold relative shrink-0 text-[#10b981] text-[12px]">78</p>
                    <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[10px]">bpm</p>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[70px] whitespace-nowrap" data-name="Frame">
                  <p className="font-jakarta font-bold relative shrink-0 text-[#64748b] text-[10px]">SpO2</p>
                  <div className="content-stretch flex gap-[4px] items-baseline relative shrink-0" data-name="Frame">
                    <p className="font-jakarta font-extrabold relative shrink-0 text-[#10b981] text-[12px]">98</p>
                    <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[10px]">%</p>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[110px] whitespace-nowrap" data-name="Frame">
                  <p className="font-jakarta font-bold relative shrink-0 text-[#64748b] text-[10px]">P. ARTERIAL</p>
                  <div className="content-stretch flex gap-[4px] items-baseline relative shrink-0" data-name="Frame">
                    <p className="font-jakarta font-extrabold relative shrink-0 text-[#10b981] text-[12px]">120/80</p>
                    <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[10px]">mmHg</p>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[70px] whitespace-nowrap" data-name="Frame">
                  <p className="font-jakarta font-bold relative shrink-0 text-[#64748b] text-[10px]">TEMP</p>
                  <div className="content-stretch flex gap-[4px] items-baseline relative shrink-0" data-name="Frame">
                    <p className="font-jakarta font-extrabold relative shrink-0 text-[#10b981] text-[12px]">36.5</p>
                    <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[10px]">°C</p>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[70px] whitespace-nowrap" data-name="Frame">
                  <p className="font-jakarta font-bold relative shrink-0 text-[#64748b] text-[10px]">FR</p>
                  <div className="content-stretch flex gap-[4px] items-baseline relative shrink-0" data-name="Frame">
                    <p className="font-jakarta font-extrabold relative shrink-0 text-[#10b981] text-[12px]">16</p>
                    <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[10px]">rpm</p>
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 w-[60px]" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">GCS</p>
                  <div className="content-stretch flex items-baseline relative shrink-0" data-name="Frame">
                    <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#10b981] text-[12px] whitespace-nowrap">15</p>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col font-jakarta font-semibold gap-[2px] items-end leading-[normal] relative shrink-0 text-right w-[84px]" data-name="Frame">
                  <p className="relative shrink-0 text-[#94a3b8] text-[10px] w-full">ACTUALIZADO</p>
                  <p className="relative shrink-0 text-[#64748b] text-[11px] w-full">hace 5min</p>
                </div>
              </div>
            </div>
            <div className="bg-[#f1f5f9] border-[#2563eb] border-b border-l-4 border-r border-solid border-t content-stretch flex gap-[16px] h-[72px] items-center px-[24px] py-[12px] relative shrink-0 w-full" data-name="bed-row-C-02">
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-[60px]" data-name="Frame">
                <div className="relative shrink-0 size-[18px]" data-name="bed-icon">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBedIcon2} />
                </div>
                <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[12px] whitespace-nowrap">C-02</p>
              </div>
              <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[140px] whitespace-nowrap" data-name="Frame">
                <p className="font-jakarta font-bold relative shrink-0 text-[#0f172a] text-[12px]">M. García</p>
                <p className="font-jakarta font-medium relative shrink-0 text-[#64748b] text-[11px]">72 años</p>
              </div>
              <div className="content-stretch flex items-start relative shrink-0 w-[90px]" data-name="Frame">
                <div className="bg-[#fef2f2] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#ef4444] text-[11px] whitespace-nowrap">CRÍTICO</p>
                </div>
              </div>
              <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-w-px relative" data-name="Frame">
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[70px] whitespace-nowrap" data-name="Frame">
                  <p className="font-jakarta font-bold relative shrink-0 text-[#64748b] text-[10px]">FC</p>
                  <div className="content-stretch flex gap-[4px] items-baseline relative shrink-0" data-name="Frame">
                    <p className="font-jakarta font-extrabold relative shrink-0 text-[#ef4444] text-[12px]">125</p>
                    <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[10px]">bpm</p>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[70px] whitespace-nowrap" data-name="Frame">
                  <p className="font-jakarta font-bold relative shrink-0 text-[#64748b] text-[10px]">SpO2</p>
                  <div className="content-stretch flex gap-[4px] items-baseline relative shrink-0" data-name="Frame">
                    <p className="font-jakarta font-extrabold relative shrink-0 text-[#ef4444] text-[12px]">89</p>
                    <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[10px]">%</p>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[110px] whitespace-nowrap" data-name="Frame">
                  <p className="font-jakarta font-bold relative shrink-0 text-[#64748b] text-[10px]">P. ARTERIAL</p>
                  <div className="content-stretch flex gap-[4px] items-baseline relative shrink-0" data-name="Frame">
                    <p className="font-jakarta font-extrabold relative shrink-0 text-[#ef4444] text-[12px]">90/60</p>
                    <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[10px]">mmHg</p>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[70px] whitespace-nowrap" data-name="Frame">
                  <p className="font-jakarta font-bold relative shrink-0 text-[#64748b] text-[10px]">TEMP</p>
                  <div className="content-stretch flex gap-[4px] items-baseline relative shrink-0" data-name="Frame">
                    <p className="font-jakarta font-extrabold relative shrink-0 text-[#f59e0b] text-[12px]">38.2</p>
                    <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[10px]">°C</p>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[70px] whitespace-nowrap" data-name="Frame">
                  <p className="font-jakarta font-bold relative shrink-0 text-[#64748b] text-[10px]">FR</p>
                  <div className="content-stretch flex gap-[4px] items-baseline relative shrink-0" data-name="Frame">
                    <p className="font-jakarta font-extrabold relative shrink-0 text-[#ef4444] text-[12px]">28</p>
                    <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[10px]">rpm</p>
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 w-[60px]" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">GCS</p>
                  <div className="content-stretch flex items-baseline relative shrink-0" data-name="Frame">
                    <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#ef4444] text-[12px] whitespace-nowrap">10</p>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col font-jakarta font-semibold gap-[2px] items-end leading-[normal] relative shrink-0 text-right w-[84px]" data-name="Frame">
                  <p className="relative shrink-0 text-[#94a3b8] text-[10px] w-full">ACTUALIZADO</p>
                  <p className="relative shrink-0 text-[#64748b] text-[11px] w-full">hace 12min</p>
                </div>
              </div>
            </div>
            <div className="bg-[#f8fafc] border-[#e2e8f0] border-b border-solid content-stretch flex gap-[16px] h-[72px] items-center px-[24px] py-[12px] relative shrink-0 w-full" data-name="bed-row-C-03">
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-[60px]" data-name="Frame">
                <div className="relative shrink-0 size-[18px]" data-name="bed-icon">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBedIcon2} />
                </div>
                <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[12px] whitespace-nowrap">C-03</p>
              </div>
              <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[140px] whitespace-nowrap" data-name="Frame">
                <p className="font-jakarta font-bold relative shrink-0 text-[#0f172a] text-[12px]">M. González</p>
                <p className="font-jakarta font-medium relative shrink-0 text-[#64748b] text-[11px]">67 años</p>
              </div>
              <div className="content-stretch flex items-start relative shrink-0 w-[90px]" data-name="Frame">
                <div className="bg-[#fef2f2] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#ef4444] text-[11px] whitespace-nowrap">CRÍTICO</p>
                </div>
              </div>
              <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-w-px relative" data-name="Frame">
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[70px] whitespace-nowrap" data-name="Frame">
                  <p className="font-jakarta font-bold relative shrink-0 text-[#64748b] text-[10px]">FC</p>
                  <div className="content-stretch flex gap-[4px] items-baseline relative shrink-0" data-name="Frame">
                    <p className="font-jakarta font-extrabold relative shrink-0 text-[#f59e0b] text-[12px]">112</p>
                    <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[10px]">bpm</p>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[70px] whitespace-nowrap" data-name="Frame">
                  <p className="font-jakarta font-bold relative shrink-0 text-[#64748b] text-[10px]">SpO2</p>
                  <div className="content-stretch flex gap-[4px] items-baseline relative shrink-0" data-name="Frame">
                    <p className="font-jakarta font-extrabold relative shrink-0 text-[#f59e0b] text-[12px]">93</p>
                    <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[10px]">%</p>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[110px] whitespace-nowrap" data-name="Frame">
                  <p className="font-jakarta font-bold relative shrink-0 text-[#64748b] text-[10px]">P. ARTERIAL</p>
                  <div className="content-stretch flex gap-[4px] items-baseline relative shrink-0" data-name="Frame">
                    <p className="font-jakarta font-extrabold relative shrink-0 text-[#f59e0b] text-[12px]">145/92</p>
                    <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[10px]">mmHg</p>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[70px] whitespace-nowrap" data-name="Frame">
                  <p className="font-jakarta font-bold relative shrink-0 text-[#64748b] text-[10px]">TEMP</p>
                  <div className="content-stretch flex gap-[4px] items-baseline relative shrink-0" data-name="Frame">
                    <p className="font-jakarta font-extrabold relative shrink-0 text-[#f59e0b] text-[12px]">37.8</p>
                    <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[10px]">°C</p>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[70px] whitespace-nowrap" data-name="Frame">
                  <p className="font-jakarta font-bold relative shrink-0 text-[#64748b] text-[10px]">FR</p>
                  <div className="content-stretch flex gap-[4px] items-baseline relative shrink-0" data-name="Frame">
                    <p className="font-jakarta font-extrabold relative shrink-0 text-[#f59e0b] text-[12px]">22</p>
                    <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[10px]">rpm</p>
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 w-[60px]" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">GCS</p>
                  <div className="content-stretch flex items-baseline relative shrink-0" data-name="Frame">
                    <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#f59e0b] text-[12px] whitespace-nowrap">12</p>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col font-jakarta font-semibold gap-[2px] items-end leading-[normal] relative shrink-0 text-right w-[84px]" data-name="Frame">
                  <p className="relative shrink-0 text-[#94a3b8] text-[10px] w-full">ACTUALIZADO</p>
                  <p className="relative shrink-0 text-[#64748b] text-[11px] w-full">hace 3seg</p>
                </div>
              </div>
            </div>
            <div className="bg-white border-[#e2e8f0] border-b border-solid content-stretch flex gap-[16px] h-[72px] items-center px-[24px] py-[12px] relative shrink-0 w-full" data-name="bed-row-C-04">
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-[60px]" data-name="Frame">
                <div className="relative shrink-0 size-[18px]" data-name="bed-icon">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBedIcon} />
                </div>
                <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[12px] whitespace-nowrap">C-04</p>
              </div>
              <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[140px] whitespace-nowrap" data-name="Frame">
                <p className="font-jakarta font-bold relative shrink-0 text-[#0f172a] text-[12px]">A. Ruiz</p>
                <p className="font-jakarta font-medium relative shrink-0 text-[#64748b] text-[11px]">45 años</p>
              </div>
              <div className="content-stretch flex items-start relative shrink-0 w-[90px]" data-name="Frame">
                <div className="bg-[#ecfdf5] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#10b981] text-[11px] whitespace-nowrap">ESTABLE</p>
                </div>
              </div>
              <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-w-px relative" data-name="Frame">
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[70px] whitespace-nowrap" data-name="Frame">
                  <p className="font-jakarta font-bold relative shrink-0 text-[#64748b] text-[10px]">FC</p>
                  <div className="content-stretch flex gap-[4px] items-baseline relative shrink-0" data-name="Frame">
                    <p className="font-jakarta font-extrabold relative shrink-0 text-[#10b981] text-[12px]">72</p>
                    <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[10px]">bpm</p>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[70px] whitespace-nowrap" data-name="Frame">
                  <p className="font-jakarta font-bold relative shrink-0 text-[#64748b] text-[10px]">SpO2</p>
                  <div className="content-stretch flex gap-[4px] items-baseline relative shrink-0" data-name="Frame">
                    <p className="font-jakarta font-extrabold relative shrink-0 text-[#10b981] text-[12px]">97</p>
                    <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[10px]">%</p>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[110px] whitespace-nowrap" data-name="Frame">
                  <p className="font-jakarta font-bold relative shrink-0 text-[#64748b] text-[10px]">P. ARTERIAL</p>
                  <div className="content-stretch flex gap-[4px] items-baseline relative shrink-0" data-name="Frame">
                    <p className="font-jakarta font-extrabold relative shrink-0 text-[#10b981] text-[12px]">118/75</p>
                    <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[10px]">mmHg</p>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[70px] whitespace-nowrap" data-name="Frame">
                  <p className="font-jakarta font-bold relative shrink-0 text-[#64748b] text-[10px]">TEMP</p>
                  <div className="content-stretch flex gap-[4px] items-baseline relative shrink-0" data-name="Frame">
                    <p className="font-jakarta font-extrabold relative shrink-0 text-[#10b981] text-[12px]">36.8</p>
                    <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[10px]">°C</p>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[70px] whitespace-nowrap" data-name="Frame">
                  <p className="font-jakarta font-bold relative shrink-0 text-[#64748b] text-[10px]">FR</p>
                  <div className="content-stretch flex gap-[4px] items-baseline relative shrink-0" data-name="Frame">
                    <p className="font-jakarta font-extrabold relative shrink-0 text-[#10b981] text-[12px]">14</p>
                    <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[10px]">rpm</p>
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 w-[60px]" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">GCS</p>
                  <div className="content-stretch flex items-baseline relative shrink-0" data-name="Frame">
                    <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#10b981] text-[12px] whitespace-nowrap">15</p>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col font-jakarta font-semibold gap-[2px] items-end leading-[normal] relative shrink-0 text-right w-[84px]" data-name="Frame">
                  <p className="relative shrink-0 text-[#94a3b8] text-[10px] w-full">ACTUALIZADO</p>
                  <p className="relative shrink-0 text-[#64748b] text-[11px] w-full">hace 8min</p>
                </div>
              </div>
            </div>
            <div className="bg-[#f8fafc] border-[#e2e8f0] border-b border-solid content-stretch flex gap-[16px] h-[72px] items-center px-[24px] py-[12px] relative shrink-0 w-full" data-name="bed-row-C-05">
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-[60px]" data-name="Frame">
                <div className="relative shrink-0 size-[18px]" data-name="bed-icon">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBedIcon3} />
                </div>
                <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[12px] whitespace-nowrap">C-05</p>
              </div>
              <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[140px] whitespace-nowrap" data-name="Frame">
                <p className="font-jakarta font-bold relative shrink-0 text-[#0f172a] text-[12px]">L. Torres</p>
                <p className="font-jakarta font-medium relative shrink-0 text-[#64748b] text-[11px]">58 años</p>
              </div>
              <div className="content-stretch flex items-start relative shrink-0 w-[90px]" data-name="Frame">
                <div className="bg-[#fef3c7] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#f59e0b] text-[11px] whitespace-nowrap">MONITOREO</p>
                </div>
              </div>
              <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-w-px relative" data-name="Frame">
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[70px] whitespace-nowrap" data-name="Frame">
                  <p className="font-jakarta font-bold relative shrink-0 text-[#64748b] text-[10px]">FC</p>
                  <div className="content-stretch flex gap-[4px] items-baseline relative shrink-0" data-name="Frame">
                    <p className="font-jakarta font-extrabold relative shrink-0 text-[#10b981] text-[12px]">95</p>
                    <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[10px]">bpm</p>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[70px] whitespace-nowrap" data-name="Frame">
                  <p className="font-jakarta font-bold relative shrink-0 text-[#64748b] text-[10px]">SpO2</p>
                  <div className="content-stretch flex gap-[4px] items-baseline relative shrink-0" data-name="Frame">
                    <p className="font-jakarta font-extrabold relative shrink-0 text-[#f59e0b] text-[12px]">95</p>
                    <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[10px]">%</p>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[110px] whitespace-nowrap" data-name="Frame">
                  <p className="font-jakarta font-bold relative shrink-0 text-[#64748b] text-[10px]">P. ARTERIAL</p>
                  <div className="content-stretch flex gap-[4px] items-baseline relative shrink-0" data-name="Frame">
                    <p className="font-jakarta font-extrabold relative shrink-0 text-[#f59e0b] text-[12px]">135/88</p>
                    <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[10px]">mmHg</p>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[70px] whitespace-nowrap" data-name="Frame">
                  <p className="font-jakarta font-bold relative shrink-0 text-[#64748b] text-[10px]">TEMP</p>
                  <div className="content-stretch flex gap-[4px] items-baseline relative shrink-0" data-name="Frame">
                    <p className="font-jakarta font-extrabold relative shrink-0 text-[#10b981] text-[12px]">37.1</p>
                    <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[10px]">°C</p>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[70px] whitespace-nowrap" data-name="Frame">
                  <p className="font-jakarta font-bold relative shrink-0 text-[#64748b] text-[10px]">FR</p>
                  <div className="content-stretch flex gap-[4px] items-baseline relative shrink-0" data-name="Frame">
                    <p className="font-jakarta font-extrabold relative shrink-0 text-[#10b981] text-[12px]">18</p>
                    <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[10px]">rpm</p>
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 w-[60px]" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">GCS</p>
                  <div className="content-stretch flex items-baseline relative shrink-0" data-name="Frame">
                    <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#10b981] text-[12px] whitespace-nowrap">14</p>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col font-jakarta font-semibold gap-[2px] items-end leading-[normal] relative shrink-0 text-right w-[84px]" data-name="Frame">
                  <p className="relative shrink-0 text-[#94a3b8] text-[10px] w-full">ACTUALIZADO</p>
                  <p className="relative shrink-0 text-[#64748b] text-[11px] w-full">hace 14min</p>
                </div>
              </div>
            </div>
            <div className="bg-white border-[#e2e8f0] border-b border-solid content-stretch flex gap-[16px] h-[72px] items-center px-[24px] py-[12px] relative shrink-0 w-full" data-name="bed-row-C-06">
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-[60px]" data-name="Frame">
                <div className="relative shrink-0 size-[18px]" data-name="bed-icon">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBedIcon2} />
                </div>
                <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[12px] whitespace-nowrap">C-06</p>
              </div>
              <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[140px] whitespace-nowrap" data-name="Frame">
                <p className="font-jakarta font-bold relative shrink-0 text-[#0f172a] text-[12px]">F. Díaz</p>
                <p className="font-jakarta font-medium relative shrink-0 text-[#64748b] text-[11px]">81 años</p>
              </div>
              <div className="content-stretch flex items-start relative shrink-0 w-[90px]" data-name="Frame">
                <div className="bg-[#fef2f2] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#ef4444] text-[11px] whitespace-nowrap">CRÍTICO</p>
                </div>
              </div>
              <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-w-px relative" data-name="Frame">
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[70px] whitespace-nowrap" data-name="Frame">
                  <p className="font-jakarta font-bold relative shrink-0 text-[#64748b] text-[10px]">FC</p>
                  <div className="content-stretch flex gap-[4px] items-baseline relative shrink-0" data-name="Frame">
                    <p className="font-jakarta font-extrabold relative shrink-0 text-[#ef4444] text-[12px]">130</p>
                    <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[10px]">bpm</p>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[70px] whitespace-nowrap" data-name="Frame">
                  <p className="font-jakarta font-bold relative shrink-0 text-[#64748b] text-[10px]">SpO2</p>
                  <div className="content-stretch flex gap-[4px] items-baseline relative shrink-0" data-name="Frame">
                    <p className="font-jakarta font-extrabold relative shrink-0 text-[#ef4444] text-[12px]">88</p>
                    <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[10px]">%</p>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[110px] whitespace-nowrap" data-name="Frame">
                  <p className="font-jakarta font-bold relative shrink-0 text-[#64748b] text-[10px]">P. ARTERIAL</p>
                  <div className="content-stretch flex gap-[4px] items-baseline relative shrink-0" data-name="Frame">
                    <p className="font-jakarta font-extrabold relative shrink-0 text-[#ef4444] text-[12px]">85/55</p>
                    <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[10px]">mmHg</p>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[70px] whitespace-nowrap" data-name="Frame">
                  <p className="font-jakarta font-bold relative shrink-0 text-[#64748b] text-[10px]">TEMP</p>
                  <div className="content-stretch flex gap-[4px] items-baseline relative shrink-0" data-name="Frame">
                    <p className="font-jakarta font-extrabold relative shrink-0 text-[#f59e0b] text-[12px]">38.5</p>
                    <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[10px]">°C</p>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[70px] whitespace-nowrap" data-name="Frame">
                  <p className="font-jakarta font-bold relative shrink-0 text-[#64748b] text-[10px]">FR</p>
                  <div className="content-stretch flex gap-[4px] items-baseline relative shrink-0" data-name="Frame">
                    <p className="font-jakarta font-extrabold relative shrink-0 text-[#ef4444] text-[12px]">32</p>
                    <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[10px]">rpm</p>
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 w-[60px]" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">GCS</p>
                  <div className="content-stretch flex items-baseline relative shrink-0" data-name="Frame">
                    <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#ef4444] text-[12px] whitespace-nowrap">8</p>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col font-jakarta font-semibold gap-[2px] items-end leading-[normal] relative shrink-0 text-right w-[84px]" data-name="Frame">
                  <p className="relative shrink-0 text-[#94a3b8] text-[10px] w-full">ACTUALIZADO</p>
                  <p className="relative shrink-0 text-[#64748b] text-[11px] w-full">hace 1min</p>
                </div>
              </div>
            </div>
            <div className="bg-[#f3f4f6] border-[#e2e8f0] border-b border-solid content-stretch flex gap-[16px] h-[72px] items-center px-[24px] py-[12px] relative shrink-0 w-full" data-name="bed-row-C-07">
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-[60px]" data-name="Frame">
                <div className="relative shrink-0 size-[18px]" data-name="bed-icon">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBedIcon4} />
                </div>
                <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[12px] whitespace-nowrap">C-07</p>
              </div>
              <div className="content-stretch flex flex-col items-start relative shrink-0 w-[140px]" data-name="Frame">
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap">Disponible</p>
              </div>
              <div className="content-stretch flex items-start relative shrink-0 w-[90px]" data-name="Frame">
                <div className="bg-[#e8f0ff] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#3b82f6] text-[11px] whitespace-nowrap">DISPONIBLE</p>
                </div>
              </div>
              <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-w-px relative" data-name="Frame">
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] h-[48px] items-start leading-[normal] overflow-clip relative shrink-0 text-[#64748b] w-[70px] whitespace-nowrap" data-name="Frame">
                  <p className="font-jakarta font-medium relative shrink-0 text-[10px]">FC</p>
                  <div className="content-stretch flex gap-[2px] items-start overflow-clip relative shrink-0" data-name="Frame">
                    <p className="font-jakarta font-bold relative shrink-0 text-[14px]">-</p>
                    <p className="font-jakarta font-medium relative shrink-0 text-[10px]">bpm</p>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] h-[48px] items-start leading-[normal] overflow-clip relative shrink-0 text-[#64748b] w-[70px] whitespace-nowrap" data-name="Frame">
                  <p className="font-jakarta font-medium relative shrink-0 text-[10px]">SpO2</p>
                  <div className="content-stretch flex gap-[2px] items-start overflow-clip relative shrink-0" data-name="Frame">
                    <p className="font-jakarta font-bold relative shrink-0 text-[14px]">-</p>
                    <p className="font-jakarta font-medium relative shrink-0 text-[10px]">%</p>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] h-[48px] items-start leading-[normal] overflow-clip relative shrink-0 text-[#64748b] w-[110px] whitespace-nowrap" data-name="Frame">
                  <p className="font-jakarta font-medium relative shrink-0 text-[10px]">P. ARTERIAL</p>
                  <div className="content-stretch flex gap-[2px] items-start overflow-clip relative shrink-0" data-name="Frame">
                    <p className="font-jakarta font-bold relative shrink-0 text-[14px]">-</p>
                    <p className="font-jakarta font-medium relative shrink-0 text-[10px]">mmHg</p>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] h-[48px] items-start leading-[normal] overflow-clip relative shrink-0 text-[#64748b] w-[70px] whitespace-nowrap" data-name="Frame">
                  <p className="font-jakarta font-medium relative shrink-0 text-[10px]">TEMP</p>
                  <div className="content-stretch flex gap-[2px] items-start overflow-clip relative shrink-0" data-name="Frame">
                    <p className="font-jakarta font-bold relative shrink-0 text-[14px]">-</p>
                    <p className="font-jakarta font-medium relative shrink-0 text-[10px]">°C</p>
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 w-[70px]" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">FR</p>
                  <div className="content-stretch flex items-baseline relative shrink-0" data-name="Frame">
                    <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#94a3b8] text-[12px] whitespace-nowrap">-</p>
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 w-[60px]" data-name="Frame">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap">GCS</p>
                  <div className="content-stretch flex items-baseline relative shrink-0" data-name="Frame">
                    <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#94a3b8] text-[12px] whitespace-nowrap">-</p>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col font-jakarta font-semibold gap-[2px] items-end leading-[normal] relative shrink-0 text-right w-[84px]" data-name="Frame">
                  <p className="relative shrink-0 text-[#94a3b8] text-[10px] w-full">ACTUALIZADO</p>
                  <p className="relative shrink-0 text-[#64748b] text-[11px] w-full">-</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
