// Pantalla "med/monitoreo/grid-uci" (Figma node 45:984) — generada desde el diseño original de Figma.
import { Link } from 'react-router-dom';
import imgActivity10 from '../../assets/activity-10.svg';
import imgActivity8 from '../../assets/activity-8.svg';
import imgActivity9 from '../../assets/activity-9.svg';
import imgAlertTextEllipse from '../../assets/alert-text-ellipse.svg';
import imgAlertTextEllipse2 from '../../assets/alert-text-ellipse-2.svg';
import imgArmchair from '../../assets/armchair.svg';
import imgArmchair2 from '../../assets/armchair-2.svg';
import imgArmchair3 from '../../assets/armchair-3.svg';
import imgBed from '../../assets/bed.svg';
import imgBed2 from '../../assets/bed-2.svg';
import imgBed3 from '../../assets/bed-3.svg';
import imgBrain2 from '../../assets/brain-2.svg';
import imgBrain3 from '../../assets/brain-3.svg';
import imgBrain4 from '../../assets/brain-4.svg';
import imgBrain5 from '../../assets/brain-5.svg';
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
import imgHeart6 from '../../assets/heart-6.svg';
import imgHeart7 from '../../assets/heart-7.svg';
import imgHeart8 from '../../assets/heart-8.svg';
import imgHeart9 from '../../assets/heart-9.svg';
import imgStatusPillEllipse from '../../assets/status-pill-ellipse.svg';
import imgThermometer2 from '../../assets/thermometer-2.svg';
import imgThermometer3 from '../../assets/thermometer-3.svg';
import imgWind2 from '../../assets/wind-2.svg';
import imgWind3 from '../../assets/wind-3.svg';
import imgWind4 from '../../assets/wind-4.svg';
import imgWind5 from '../../assets/wind-5.svg';
import { AppLayout, SegmentedControl } from '../../components';

export default function MedMonitoreoGridUci() {
  return (
    <AppLayout
      breadcrumb={"SIAPPC > Monitoreo"}
      title="Central de Monitoreo - UCI"
      actions={
        <>
          <SegmentedControl label="Vista" active="grid" items={[{ id: 'grid', label: 'Grid', to: '/MedMonitoreoGridUci' }, { id: 'lista', label: 'Lista', to: '/MedMonitoreoListaUci' }]} />
        </>
      }
    >
<div className="flex w-full min-w-0 flex-1 flex-col items-start gap-6 bg-white p-4 md:p-8" data-name="page-body">
          <div className="flex w-full flex-wrap items-center justify-between gap-3 rounded-xl border border-[#e5e7eb] bg-white px-5 py-4" data-name="overview-ribbon">
            <p className="[word-break:break-word] font-jakarta font-semibold leading-[0] text-[#374151] text-[15px]"><span className="leading-[normal]">{`Monitoreo activo para `}</span><span className="font-jakarta font-extrabold leading-[normal]">6 pacientes críticos en UCI</span><span className="leading-[normal]">{` • 2 Estable • 1 Monitoreo • 3 Crítico`}</span></p>
            <div className="flex flex-wrap items-center gap-4" data-name="indicators">
              <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="ind-stable">
                <div className="relative shrink-0 size-[8px]" data-name="Ellipse">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgStatusPillEllipse} />
                </div>
                <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-subtle text-[12px] whitespace-nowrap">Estable</p>
              </div>
              <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="ind-warning">
                <div className="relative shrink-0 size-[8px]" data-name="Ellipse">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgAlertTextEllipse} />
                </div>
                <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-subtle text-[12px] whitespace-nowrap">Monitoreo</p>
              </div>
              <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="ind-crit">
                <div className="relative shrink-0 size-[8px]" data-name="Ellipse">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgAlertTextEllipse2} />
                </div>
                <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-subtle text-[12px] whitespace-nowrap">Crítico</p>
              </div>
            </div>
          </div>
          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3" data-name="beds-grid">
            <div className="contents" data-name="row-1">
              <div className="bg-white border-[#1e3a8a] border-b border-l-4 border-r border-t flex flex-col gap-[12px] items-start overflow-clip p-[16px] rounded-[12px] min-w-0 xl:h-[360px]" data-name="bed-card-C-01">
                <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="card-header">
                  <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="bed-id">
                    <div className="relative shrink-0 size-[18px]" data-name="bed">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBed} />
                    </div>
                    <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#111827] text-[16px] whitespace-nowrap">C-01</p>
                  </div>
                  <div className="bg-[#d1fae5] content-stretch flex items-start px-[8px] py-[2px] relative rounded-[4px] shrink-0" data-name="status-badge">
                    <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-success text-[10px] whitespace-nowrap">ESTABLE</p>
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
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-muted text-[10px] whitespace-nowrap">FC</p>
                        <div className="bg-success relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-success text-[0px] whitespace-nowrap"><span className="leading-[normal] text-[22px]">{`78 `}</span><span className="font-jakarta font-medium leading-[normal] text-muted text-[12px]">bpm</span></p>
                    </div>
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="activity">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgActivity8} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-muted text-[10px] whitespace-nowrap">SpO₂</p>
                        <div className="bg-success relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-success text-[0px] whitespace-nowrap"><span className="leading-[normal] text-[22px]">{`98 `}</span><span className="font-jakarta font-medium leading-[normal] text-muted text-[12px]">%</span></p>
                    </div>
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="armchair">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgArmchair} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-muted text-[10px] whitespace-nowrap">PA</p>
                        <div className="bg-success relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-success text-[0px] whitespace-nowrap"><span className="leading-[normal] text-[18px]">{`120/80 `}</span><span className="font-jakarta font-medium leading-[normal] text-muted text-[12px]">mmHg</span></p>
                      <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] min-w-full relative shrink-0 text-muted text-[12px] w-[min-content]">PAM: 93 mmHg</p>
                    </div>
                  </div>
                  <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="vital-row-secondary">
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="wind">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgWind2} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-muted text-[10px] whitespace-nowrap">FR</p>
                        <div className="bg-success relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-success text-[0px] whitespace-nowrap"><span className="leading-[normal] text-[18px]">{`16 `}</span><span className="font-jakarta font-medium leading-[normal] text-muted text-[12px]">rpm</span></p>
                    </div>
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="thermometer">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgThermometer2} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-muted text-[10px] whitespace-nowrap">TEMP</p>
                        <div className="bg-success relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-success text-[0px] whitespace-nowrap"><span className="leading-[normal] text-[18px]">{`36.5 `}</span><span className="font-jakarta font-medium leading-[normal] text-muted text-[12px]">°C</span></p>
                    </div>
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="brain">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBrain2} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-muted text-[10px] whitespace-nowrap">GCS</p>
                        <div className="bg-success relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-success text-[0px] whitespace-nowrap"><span className="leading-[normal] text-[18px]">{`15 `}</span><span className="font-jakarta font-medium leading-[normal] text-muted text-[12px]">pts</span></p>
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
              <div className="bg-white border-[#dc2626] border-b border-l-4 border-r border-t flex flex-col gap-[12px] items-start overflow-clip p-[16px] rounded-[12px] min-w-0 xl:h-[360px]" data-name="bed-card-C-02">
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
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-muted text-[10px] whitespace-nowrap">FC</p>
                        <div className="bg-danger relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-danger text-[0px] whitespace-nowrap"><span className="leading-[normal] text-[22px]">{`125 `}</span><span className="font-jakarta font-medium leading-[normal] text-muted text-[12px]">bpm</span></p>
                    </div>
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="activity">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgActivity9} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-muted text-[10px] whitespace-nowrap">SpO₂</p>
                        <div className="bg-danger relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-danger text-[0px] whitespace-nowrap"><span className="leading-[normal] text-[22px]">{`89 `}</span><span className="font-jakarta font-medium leading-[normal] text-muted text-[12px]">%</span></p>
                    </div>
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="armchair">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgArmchair2} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-muted text-[10px] whitespace-nowrap">PA</p>
                        <div className="bg-danger relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-danger text-[0px] whitespace-nowrap"><span className="leading-[normal] text-[18px]">{`90/60 `}</span><span className="font-jakarta font-medium leading-[normal] text-muted text-[12px]">mmHg</span></p>
                      <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] min-w-full relative shrink-0 text-muted text-[12px] w-[min-content]">PAM: 70 mmHg</p>
                    </div>
                  </div>
                  <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="vital-row-secondary">
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="wind">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgWind3} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-muted text-[10px] whitespace-nowrap">FR</p>
                        <div className="bg-warning relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-warning text-[0px] whitespace-nowrap"><span className="leading-[normal] text-[18px]">{`28 `}</span><span className="font-jakarta font-medium leading-[normal] text-muted text-[12px]">rpm</span></p>
                    </div>
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="thermometer">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgThermometer3} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-muted text-[10px] whitespace-nowrap">TEMP</p>
                        <div className="bg-warning relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-warning text-[0px] whitespace-nowrap"><span className="leading-[normal] text-[18px]">{`38.2 `}</span><span className="font-jakarta font-medium leading-[normal] text-muted text-[12px]">°C</span></p>
                    </div>
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="brain">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBrain3} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-muted text-[10px] whitespace-nowrap">GCS</p>
                        <div className="bg-danger relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-danger text-[0px] whitespace-nowrap"><span className="leading-[normal] text-[18px]">{`10 `}</span><span className="font-jakarta font-medium leading-[normal] text-muted text-[12px]">pts</span></p>
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
              <Link className="bg-white border-[#dc2626] border-b border-l-4 border-r border-t cursor-pointer flex flex-col gap-[12px] items-start overflow-clip p-[16px] rounded-[12px] min-w-0 xl:h-[360px]" data-name="bed-card-C-03" to="/MedPacienteResumen">
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
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-muted text-[10px] text-left whitespace-nowrap">FC</p>
                        <div className="bg-warning relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-warning text-[0px] text-left whitespace-nowrap"><span className="leading-[normal] text-[22px]">{`112 `}</span><span className="font-jakarta font-medium leading-[normal] text-muted text-[12px]">bpm</span></p>
                    </div>
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="activity">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgActivity10} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-muted text-[10px] text-left whitespace-nowrap">SpO₂</p>
                        <div className="bg-warning relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-warning text-[0px] text-left whitespace-nowrap"><span className="leading-[normal] text-[22px]">{`93 `}</span><span className="font-jakarta font-medium leading-[normal] text-muted text-[12px]">%</span></p>
                    </div>
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="armchair">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgArmchair3} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-muted text-[10px] text-left whitespace-nowrap">PA</p>
                        <div className="bg-warning relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-warning text-[0px] text-left whitespace-nowrap"><span className="leading-[normal] text-[18px]">{`145/92 `}</span><span className="font-jakarta font-medium leading-[normal] text-muted text-[12px]">mmHg</span></p>
                      <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] min-w-full relative shrink-0 text-muted text-[12px] text-left w-[min-content]">PAM: 110 mmHg</p>
                    </div>
                  </div>
                  <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="vital-row-secondary">
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="wind">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgWind3} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-muted text-[10px] text-left whitespace-nowrap">FR</p>
                        <div className="bg-warning relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-warning text-[0px] text-left whitespace-nowrap"><span className="leading-[normal] text-[18px]">{`22 `}</span><span className="font-jakarta font-medium leading-[normal] text-muted text-[12px]">rpm</span></p>
                    </div>
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="thermometer">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgThermometer3} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-muted text-[10px] text-left whitespace-nowrap">TEMP</p>
                        <div className="bg-warning relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-warning text-[0px] text-left whitespace-nowrap"><span className="leading-[normal] text-[18px]">{`37.8 `}</span><span className="font-jakarta font-medium leading-[normal] text-muted text-[12px]">°C</span></p>
                    </div>
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="brain">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBrain4} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-muted text-[10px] text-left whitespace-nowrap">GCS</p>
                        <div className="bg-warning relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-warning text-[0px] text-left whitespace-nowrap"><span className="leading-[normal] text-[18px]">{`12 `}</span><span className="font-jakarta font-medium leading-[normal] text-muted text-[12px]">pts</span></p>
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
            <div className="contents" data-name="row-2">
              <div className="bg-white border-[#d97706] border-b border-l-4 border-r border-t flex flex-col gap-[12px] items-start overflow-clip p-[16px] rounded-[12px] min-w-0 xl:h-[360px]" data-name="bed-card-C-05">
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
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-muted text-[10px] whitespace-nowrap">FC</p>
                        <div className="bg-success relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-success text-[0px] whitespace-nowrap"><span className="leading-[normal] text-[22px]">{`95 `}</span><span className="font-jakarta font-medium leading-[normal] text-muted text-[12px]">bpm</span></p>
                    </div>
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="activity">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgActivity10} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-muted text-[10px] whitespace-nowrap">SpO₂</p>
                        <div className="bg-warning relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-warning text-[0px] whitespace-nowrap"><span className="leading-[normal] text-[22px]">{`95 `}</span><span className="font-jakarta font-medium leading-[normal] text-muted text-[12px]">%</span></p>
                    </div>
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="armchair">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgArmchair3} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-muted text-[10px] whitespace-nowrap">PA</p>
                        <div className="bg-warning relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-warning text-[0px] whitespace-nowrap"><span className="leading-[normal] text-[18px]">{`135/88 `}</span><span className="font-jakarta font-medium leading-[normal] text-muted text-[12px]">mmHg</span></p>
                      <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] min-w-full relative shrink-0 text-muted text-[12px] w-[min-content]">PAM: 104 mmHg</p>
                    </div>
                  </div>
                  <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="vital-row-secondary">
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="wind">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgWind4} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-muted text-[10px] whitespace-nowrap">FR</p>
                        <div className="bg-success relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-success text-[0px] whitespace-nowrap"><span className="leading-[normal] text-[18px]">{`18 `}</span><span className="font-jakarta font-medium leading-[normal] text-muted text-[12px]">rpm</span></p>
                    </div>
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="thermometer">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgThermometer2} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-muted text-[10px] whitespace-nowrap">TEMP</p>
                        <div className="bg-success relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-success text-[0px] whitespace-nowrap"><span className="leading-[normal] text-[18px]">{`37.1 `}</span><span className="font-jakarta font-medium leading-[normal] text-muted text-[12px]">°C</span></p>
                    </div>
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="brain">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBrain5} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-muted text-[10px] whitespace-nowrap">GCS</p>
                        <div className="bg-success relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-success text-[0px] whitespace-nowrap"><span className="leading-[normal] text-[18px]">{`14 `}</span><span className="font-jakarta font-medium leading-[normal] text-muted text-[12px]">pts</span></p>
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
              <div className="bg-white border-[#dc2626] border-b border-l-4 border-r border-t flex flex-col gap-[12px] items-start overflow-clip p-[16px] rounded-[12px] min-w-0 xl:h-[360px]" data-name="bed-card-C-06">
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
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-muted text-[10px] whitespace-nowrap">FC</p>
                        <div className="bg-danger relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-danger text-[0px] whitespace-nowrap"><span className="leading-[normal] text-[22px]">{`130 `}</span><span className="font-jakarta font-medium leading-[normal] text-muted text-[12px]">bpm</span></p>
                    </div>
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="activity">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgActivity9} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-muted text-[10px] whitespace-nowrap">SpO₂</p>
                        <div className="bg-danger relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-danger text-[0px] whitespace-nowrap"><span className="leading-[normal] text-[22px]">{`88 `}</span><span className="font-jakarta font-medium leading-[normal] text-muted text-[12px]">%</span></p>
                    </div>
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="armchair">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgArmchair2} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-muted text-[10px] whitespace-nowrap">PA</p>
                        <div className="bg-danger relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-danger text-[0px] whitespace-nowrap"><span className="leading-[normal] text-[18px]">{`85/55 `}</span><span className="font-jakarta font-medium leading-[normal] text-muted text-[12px]">mmHg</span></p>
                      <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] min-w-full relative shrink-0 text-muted text-[12px] w-[min-content]">PAM: 65 mmHg</p>
                    </div>
                  </div>
                  <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="vital-row-secondary">
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="wind">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgWind5} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-muted text-[10px] whitespace-nowrap">FR</p>
                        <div className="bg-danger relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-danger text-[0px] whitespace-nowrap"><span className="leading-[normal] text-[18px]">{`32 `}</span><span className="font-jakarta font-medium leading-[normal] text-muted text-[12px]">rpm</span></p>
                    </div>
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="thermometer">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgThermometer3} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-muted text-[10px] whitespace-nowrap">TEMP</p>
                        <div className="bg-warning relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-warning text-[0px] whitespace-nowrap"><span className="leading-[normal] text-[18px]">{`38.5 `}</span><span className="font-jakarta font-medium leading-[normal] text-muted text-[12px]">°C</span></p>
                    </div>
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="vital-cell">
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="label-row">
                        <div className="relative shrink-0 size-[14px]" data-name="brain">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBrain3} />
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-muted text-[10px] whitespace-nowrap">GCS</p>
                        <div className="bg-danger relative rounded-[3px] shrink-0 size-[6px]" data-name="status-dot" />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-danger text-[0px] whitespace-nowrap"><span className="leading-[normal] text-[18px]">{`8 `}</span><span className="font-jakarta font-medium leading-[normal] text-muted text-[12px]">pts</span></p>
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
              <div className="bg-[#f3f4f6] border-[#1e3a8a] border-b border-l-4 border-r border-t flex flex-col gap-[12px] items-start overflow-clip p-[16px] rounded-[12px] min-w-0 xl:h-[360px]" data-name="bed-card-C-07">
                <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="card-header">
                  <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="bed-id">
                    <div className="relative shrink-0 size-[18px]" data-name="bed">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBed} />
                    </div>
                    <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#111827] text-[16px] whitespace-nowrap">C-07</p>
                  </div>
                  <div className="bg-primary-soft content-stretch flex items-start px-[8px] py-[2px] relative rounded-[4px] shrink-0" data-name="status-badge">
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
    </AppLayout>
  );
}
