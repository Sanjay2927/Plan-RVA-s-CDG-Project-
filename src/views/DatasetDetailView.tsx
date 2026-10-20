import React, { useState } from 'react';
import { Dataset, ScreenMode } from '../types.ts';

interface DatasetDetailViewProps {
  dataset: Dataset;
  onNavigate: (screen: ScreenMode) => void;
  onOpenGovAi: (prompt?: string) => void;
  onPreviewDataset: (dataset: Dataset) => void;
  onOpenSharePointExport?: (dataset?: Dataset) => void;
}

export const DatasetDetailView: React.FC<DatasetDetailViewProps> = ({
  dataset,
  onNavigate,
  onOpenGovAi,
  onPreviewDataset,
  onOpenSharePointExport
}) => {
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [editNotice, setEditNotice] = useState(false);

  const handleEditClick = () => {
    if (dataset.userAccess === 'Editor') {
      onNavigate('add-dataset');
    } else {
      setEditNotice(true);
      setTimeout(() => setEditNotice(false), 4000);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-[1520px] mx-auto pb-16">
      {/* Toast Notice */}
      {editNotice && (
        <div className="fixed top-20 right-8 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 border border-secondary text-xs font-semibold animate-in fade-in">
          <span className="material-symbols-outlined text-secondary text-[18px]">lock</span>
          <span>You currently have Viewer access to this dataset. Contact Alex Mercer to request Editor elevation.</span>
        </div>
      )}

      {/* Revision History Modal */}
      {showRevisionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl max-w-2xl w-full border border-outline-variant/40 overflow-hidden flex flex-col">
            <div className="p-space-md bg-surface-container-low flex items-center justify-between border-b border-outline-variant/30">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[20px]">history_edu</span>
                <h3 className="text-base font-bold text-on-surface">Revision History & Commit Ledger</h3>
              </div>
              <button 
                onClick={() => setShowRevisionModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-container-high text-on-surface-variant cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="p-space-lg flex flex-col gap-space-md max-h-[60vh] overflow-y-auto">
              {[
                { rev: 'v3.2', date: 'March 14, 2026', author: 'J. Doe', note: 'Annual intercensal re-benchmarking against 2025 ACS 5-year microdata file.' },
                { rev: 'v3.1', date: 'November 20, 2025', author: 'A. Smith', note: 'Spatial bounding box recalculation in NAD83 State Plane grid.' },
                { rev: 'v3.0', date: 'March 01, 2025', author: 'J. Doe', note: 'Major schema migration to ISO 19115 compliance standard.' },
                { rev: 'v2.4', date: 'August 14, 2024', author: 'Alex Mercer', note: 'Automated validation check passed under State Directive v4.2.' }
              ].map((c, i) => (
                <div key={i} className="flex flex-col gap-1 pb-3 border-b border-outline-variant/20 last:border-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary font-mono">{c.rev}</span>
                    <span className="text-[11px] text-on-surface-variant font-tabular-data">{c.date}</span>
                  </div>
                  <p className="text-xs text-on-surface">{c.note}</p>
                  <span className="text-[10px] text-on-surface-variant">Committed by: {c.author}</span>
                </div>
              ))}
            </div>
            <div className="p-space-sm bg-surface-container-low border-t border-outline-variant/30 flex justify-end">
              <button 
                onClick={() => setShowRevisionModal(false)}
                className="px-4 py-1.5 bg-primary text-on-primary text-xs font-semibold rounded-lg cursor-pointer hover:bg-primary-container"
              >
                Close Ledger
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Context Breadcrumb Line */}
      <div className="flex items-center justify-between pb-space-sm pt-space-xs flex-wrap gap-2">
        <nav className="flex items-center gap-space-xs text-on-surface-variant text-[13px]">
          <button 
            onClick={() => onNavigate('home')}
            className="hover:text-primary transition-colors flex items-center gap-1 cursor-pointer font-medium"
          >
            <span className="material-symbols-outlined text-[16px]">roofing</span>
            <span>Home</span>
          </button>
          <span className="material-symbols-outlined text-[14px] text-outline-variant">chevron_right</span>
          <button 
            onClick={() => onNavigate('browse-by-topic')}
            className="hover:text-primary transition-colors cursor-pointer font-medium"
          >
            Datasets
          </button>
          <span className="material-symbols-outlined text-[14px] text-outline-variant">chevron_right</span>
          <span className="text-on-surface font-bold bg-surface-container-high px-space-xs py-0.5 rounded text-[13px]">
            {dataset.name}
          </span>
        </nav>

        <div className="flex items-center gap-space-xs font-tabular-data text-[12px] text-on-surface-variant">
          <span className="w-2 h-2 rounded-full bg-secondary"></span>
          <span>Catalog Node: REG-092-DEMO</span>
          <span className="text-outline-variant">•</span>
          <span className="text-[10px] font-bold uppercase bg-surface-container-high px-1.5 py-0.5 rounded text-on-surface border border-outline-variant/20">
            Tier 1 Certified
          </span>
        </div>
      </div>

      {/* Main Grid Layout: 8 cols + 4 cols */}
      <div className="grid grid-cols-12 gap-gutter-desktop mt-space-sm">
        {/* Left Column (8 cols): Core Header, Actions, Preview & Governance */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-space-lg">
          {/* Primary Dataset Title & Status Card */}
          <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-xs border border-outline-variant/30 relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-surface-container-high/40 pointer-events-none"></div>

            <div className="flex flex-col gap-space-md relative z-10">
              {/* Status Ribbon & Identification */}
              <div className="flex flex-wrap items-center justify-between gap-space-sm">
                <div className="flex items-center gap-space-xs flex-wrap">
                  <span className="px-2.5 py-1 rounded bg-secondary-container text-on-secondary-container text-[11px] font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">public</span> 
                    Regional Baseline
                  </span>
                  <span className="px-2.5 py-1 rounded bg-primary text-on-primary text-[11px] font-bold">
                    Series: Demographics 2020–2030
                  </span>
                </div>
                <div className="flex items-center gap-space-xs text-on-surface-variant font-tabular-data text-[12px]">
                  <span className="material-symbols-outlined text-[16px] text-secondary">verified_user</span>
                  <span>Audit Passed: ISO 19115 compliant</span>
                </div>
              </div>

              {/* Title & Abstract */}
              <div className="space-y-space-xs">
                <h1 className="text-[30px] font-bold text-on-surface tracking-tight leading-tight">
                  {dataset.name}
                </h1>
                <p className="text-[15px] text-on-surface-variant leading-relaxed max-w-3xl">
                  {dataset.description}
                </p>
              </div>

              {/* Metadata Matrix Pills */}
              <div className="flex flex-wrap items-center gap-space-xs pt-space-xs">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface text-[12px] border border-outline-variant/20">
                  <span className="text-on-surface-variant font-normal">Topic:</span>
                  <span className="font-bold text-secondary">{dataset.topic}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface text-[12px] border border-outline-variant/20">
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant">table_chart</span>
                  <span className="text-on-surface-variant font-normal">Format:</span>
                  <span className="font-bold">{dataset.formatLabel}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface text-[12px] border border-outline-variant/20">
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant">account_circle</span>
                  <span className="text-on-surface-variant font-normal">Owner:</span>
                  <span className="font-bold">{dataset.owner}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface text-[12px] border border-outline-variant/20">
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant">event_repeat</span>
                  <span className="text-on-surface-variant font-normal">Last modified:</span>
                  <span className="font-bold">{dataset.lastModified}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface text-[12px] border border-outline-variant/20">
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant">update</span>
                  <span className="text-on-surface-variant font-normal">Schedule:</span>
                  <span className="font-bold">{dataset.updateCadence}</span>
                </div>
              </div>

              {/* Action Command Center */}
              <div className="pt-space-md flex flex-wrap items-center gap-space-sm border-t border-outline-variant/20">
                <button 
                  onClick={() => {
                    if (onOpenSharePointExport) {
                      onOpenSharePointExport(dataset);
                    } else {
                      alert(`Exporting ${dataset.name} directly from SharePoint container.`);
                    }
                  }}
                  className="bg-primary hover:bg-primary-container text-on-primary px-5 py-2.5 rounded-lg text-[14px] font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px] text-secondary-fixed">cloud_download</span>
                  <span>Export from SharePoint ({dataset.fileType === 'Excel' ? '.xlsx' : dataset.fileType} {dataset.fileSize || '18.4 MB'})</span>
                </button>

                <button 
                  onClick={() => {
                    if (onOpenSharePointExport) {
                      onOpenSharePointExport(dataset);
                    } else {
                      alert(`Connecting to internal SharePoint container: ${dataset.sharepointPath}`);
                    }
                  }}
                  className="bg-surface-container-high hover:bg-surface-container-highest text-on-surface px-4 py-2.5 rounded-lg text-[14px] font-semibold flex items-center gap-2 transition-all cursor-pointer border border-outline-variant/30"
                >
                  <span className="material-symbols-outlined text-[18px] text-secondary">open_in_new</span>
                  <span>Open in SharePoint</span>
                </button>

                {/* View on GeoHub Button */}
                {dataset.geohubPublished ? (
                  <button 
                    onClick={() => alert('Opening public ArcGIS FeatureServer Web Map.')}
                    className="bg-secondary text-on-secondary hover:bg-on-secondary-container px-4 py-2.5 rounded-lg text-[14px] font-semibold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">public</span>
                    <span>View on GeoHub</span>
                  </button>
                ) : (
                  <button 
                    disabled 
                    title="Spatial indexing required before public GeoHub export"
                    className="bg-surface-container text-on-surface-variant opacity-60 px-4 py-2.5 rounded-lg text-[14px] font-semibold flex items-center gap-2 cursor-not-allowed border border-outline-variant/20"
                  >
                    <span className="material-symbols-outlined text-[18px]">layers_clear</span>
                    <span>View on GeoHub</span>
                    <span className="text-[10px] font-bold bg-surface-container-highest px-1.5 py-0.5 rounded text-on-surface-variant ml-1">
                      Not published
                    </span>
                  </button>
                )}

                {/* Role-based Edit state */}
                <button 
                  onClick={handleEditClick}
                  className="ml-auto bg-secondary text-on-secondary hover:bg-on-secondary-container px-4 py-2.5 rounded-lg text-[14px] font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">edit_document</span>
                  <span>Edit data</span>
                </button>
              </div>

              {/* Access Mode Comparison Callout */}
              <div className="mt-space-sm bg-surface-container p-space-md rounded-lg flex items-start gap-space-sm border border-outline-variant/20">
                <div className="w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-outline text-[18px]">lock</span>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-space-xs">
                    <span className="text-[11px] font-bold uppercase tracking-wide text-on-surface-variant">Default User Access Mode</span>
                    <span className="px-1.5 py-0.2 rounded bg-surface-container-highest text-[10px] font-bold text-outline">
                      Read Only
                    </span>
                  </div>
                  <p className="text-[13px] text-on-surface font-medium mt-0.5">
                    View and download only. Editing is assigned by the Principal Data Manager.
                  </p>
                </div>
                <span className="text-[11px] font-bold text-on-surface-variant bg-surface-container-lowest px-2 py-1 rounded border border-outline-variant/20">
                  Policy REG-401
                </span>
              </div>
            </div>
          </div>

          {/* Spatial & Tabular Distribution Preview */}
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs border border-outline-variant/30 space-y-space-md">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">Jurisdictional Coverage</span>
                <h2 className="text-[18px] font-bold text-on-surface">Spatial Aggregation & Cohort Density</h2>
              </div>
              <div className="flex items-center gap-space-xs font-tabular-data text-[12px] text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px] text-secondary">pin_drop</span>
                <span className="font-semibold">{dataset.jurisdictionScope || '9 Counties • 48 Municipal Districts'}</span>
              </div>
            </div>

            {/* Bento Mini-Visuals Row */}
            <div className="grid grid-cols-12 gap-space-md">
              {/* Geographic Card with Real Hotlink */}
              <div className="col-span-12 sm:col-span-5 relative rounded-lg overflow-hidden bg-surface-container-high h-48 border border-outline-variant/30">
                <div 
                  className="w-full h-full bg-cover bg-center" 
                  style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDoMnw5U1CGYhhb2-DeUH-S5o1Svqlkc3Ol9adEwZKb83EsXmxSZUn_-PVZnU8d1DSjXzWkOwUDPfhECs6OBXScnWLGZN-tWgLzRHlrn-bFGf6jgcOGevkDkywEI_E8U80Px5GWmVgJI3RbFMBHV_HyLll5SquwjZrKu8Mtot6rhpz1ro-oYwi-cCWO114T8eF9U0trJsbnVBLu8UD2RaOhKPIYMoFIxgk8Z7o2Z3x1kAimfQjo_853')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/30 to-transparent p-space-sm flex flex-col justify-end text-on-primary">
                  <span className="text-[10px] font-bold tracking-wide uppercase opacity-90">Geographic Bounding</span>
                  <span className="text-[15px] font-bold leading-tight">Tri-County Metropolitan Grid</span>
                </div>
              </div>

              {/* Age Cohort Sparkline / Distribution Preview SVG */}
              <div className="col-span-12 sm:col-span-7 bg-surface-container-low p-space-md rounded-lg flex flex-col justify-between border border-outline-variant/20">
                <div className="flex items-center justify-between pb-space-xs">
                  <span className="text-[13px] font-bold text-on-surface">Population Distribution by Age Bracket</span>
                  <span className="text-[11px] font-bold text-secondary bg-surface-container px-2 py-0.5 rounded font-tabular-data">
                    Total: {dataset.totalEntities || '2,418,920'}
                  </span>
                </div>

                {/* Inline High-Performance Vector Chart */}
                <div className="w-full py-space-xs">
                  <svg className="w-full h-16 text-secondary" fill="none" preserveAspectRatio="none" viewBox="0 0 460 70">
                    <path 
                      d="M0,58 L40,52 L80,48 L120,32 L160,20 L200,14 L240,16 L280,24 L320,38 L360,42 L400,50 L460,56 L460,70 L0,70 Z" 
                      fill="currentColor" 
                      fillOpacity="0.15"
                    />
                    <path 
                      d="M0,58 L40,52 L80,48 L120,32 L160,20 L200,14 L240,16 L280,24 L320,38 L360,42 L400,50 L460,56" 
                      stroke="currentColor" 
                      strokeLinecap="round" 
                      strokeWidth="2.5"
                    />
                    <circle className="animate-ping" cx="200" cy="14" fill="#006a61" r="3.5" style={{ animationDuration: '3s' }} />
                    <circle cx="200" cy="14" fill="#006a61" r="3.5" />
                  </svg>
                  <div className="flex justify-between text-on-surface-variant text-[11px] font-medium pt-1">
                    <span>0-17 yrs</span>
                    <span>18-29 yrs</span>
                    <span className="font-bold text-secondary">30-49 yrs (Peak)</span>
                    <span>50-64 yrs</span>
                    <span>65+ yrs</span>
                  </div>
                </div>

                {/* Tabular micro-strip */}
                <div className="grid grid-cols-3 gap-space-xs pt-space-xs font-tabular-data text-[12px] text-on-surface">
                  <div className="bg-surface-container-lowest p-1.5 rounded border border-outline-variant/20">
                    <span className="block text-on-surface-variant text-[10px] font-bold uppercase">Median Age</span>
                    <span className="font-bold text-on-surface">{dataset.medianMetric || '38.4 years'}</span>
                  </div>
                  <div className="bg-surface-container-lowest p-1.5 rounded border border-outline-variant/20">
                    <span className="block text-on-surface-variant text-[10px] font-bold uppercase">YoY Change</span>
                    <span className="font-bold text-secondary">{dataset.yoyMetric || '+1.42%'}</span>
                  </div>
                  <div className="bg-surface-container-lowest p-1.5 rounded border border-outline-variant/20">
                    <span className="block text-on-surface-variant text-[10px] font-bold uppercase">Completeness</span>
                    <span className="font-bold text-on-surface">{dataset.completenessMetric || '99.8%'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sample Records Inspection Drawer Trigger */}
            <div 
              onClick={() => onPreviewDataset(dataset)}
              className="bg-surface-container-low hover:bg-surface-container rounded-lg p-space-sm flex items-center justify-between text-on-surface-variant font-tabular-data text-[12px] cursor-pointer transition-colors border border-outline-variant/20"
            >
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[18px] text-on-surface">table_rows</span>
                <span className="text-on-surface font-semibold">
                  Click to inspect sample records & metadata columns
                </span>
              </div>
              <span className="text-[11px] font-bold text-secondary bg-surface-container px-2 py-1 rounded">
                {dataset.checksum || 'Checksum: SHA-256 Validated'}
              </span>
            </div>
          </div>

          {/* Section: Data Governance & Provenance */}
          <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-xs border border-outline-variant/30 space-y-space-md">
            <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/20">
              <div className="flex items-center gap-space-xs">
                <div className="w-8 h-8 rounded bg-surface-container-high flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">account_balance</span>
                </div>
                <h2 className="text-[18px] font-bold text-on-surface">Data Governance & Provenance</h2>
              </div>
              <span className="text-[11px] font-bold text-on-surface-variant bg-surface-container px-2.5 py-1 rounded">
                Catalog Policy Rev 4.2
              </span>
            </div>

            {/* Governance 4-Box Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              <div className="bg-surface-container-low p-space-md rounded-lg space-y-1 border border-outline-variant/20">
                <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Designated Data Owner</span>
                <div className="flex items-center gap-space-xs pt-1">
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-[11px]">
                    {dataset.ownerInitials}
                  </div>
                  <div>
                    <span className="text-[14px] font-bold text-on-surface block leading-tight">{dataset.owner}</span>
                    <span className="text-[11px] text-on-surface-variant">{dataset.ownerRole || 'Demographics Unit Lead • RPA'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-low p-space-md rounded-lg space-y-1 border border-outline-variant/20">
                <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Update Cadence & Cycle</span>
                <div className="flex items-center gap-space-xs pt-1">
                  <span className="material-symbols-outlined text-secondary text-[22px]">event_available</span>
                  <div>
                    <span className="text-[14px] font-bold text-on-surface block leading-tight">{dataset.updateCadence}</span>
                    <span className="text-[11px] text-on-surface-variant">Next scheduled release: {dataset.nextScheduled || 'March 2027'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-low p-space-md rounded-lg space-y-1 border border-outline-variant/20">
                <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Standard Compliance</span>
                <div className="flex items-center gap-space-xs pt-1">
                  <span className="material-symbols-outlined text-secondary text-[20px]">verified</span>
                  <div>
                    <div className="flex items-center gap-space-xs">
                      <span className="text-[13px] font-bold text-on-surface">Naming standard status:</span>
                      <span className="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container text-[10px] font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Compliant
                      </span>
                    </div>
                    <span className="block text-[11px] text-on-surface-variant mt-0.5">
                      {dataset.complianceStandard || 'Strict adherence to State Demographic Taxonomy v3'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-low p-space-md rounded-lg space-y-1 border border-outline-variant/20">
                <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Storage Location</span>
                <div className="flex items-start gap-space-xs pt-1">
                  <span className="material-symbols-outlined text-outline text-[20px] mt-0.5">folder_special</span>
                  <div className="min-w-0 flex-1">
                    <span className="text-[12px] font-bold text-on-surface break-all font-mono">
                      {dataset.sharepointPath}
                    </span>
                    <button 
                      onClick={() => alert(`Opening container: ${dataset.sharepointPath}`)}
                      className="block text-[11px] text-secondary hover:underline cursor-pointer mt-0.5 font-bold"
                    >
                      Open parent container in SharePoint
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Institutional Signature */}
            <div className="bg-surface-container p-space-sm rounded-lg flex items-center justify-between text-[11px] text-on-surface-variant border border-outline-variant/20 flex-wrap gap-2">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[16px] text-secondary">gavel</span>
                <span>Dataset validated under Regional Data Hygiene Ordinance (Public Record Section 12-B)</span>
              </div>
              <span className="text-on-surface font-bold font-mono">Ledger ID: #8829-19A</span>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): GovAI Assistant, Access Control List, Revision History */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-space-lg">
          {/* GovAI Assistant Module */}
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs border border-outline-variant/30 relative overflow-hidden">
            <div className="flex items-center justify-between pb-space-sm border-b border-outline-variant/20">
              <div className="flex items-center gap-space-xs">
                <div className="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center text-on-secondary-container">
                  <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                </div>
                <div>
                  <h2 className="text-[16px] font-bold text-on-surface">GovAI Assistant</h2>
                  <span className="text-[11px] font-bold text-secondary">LLM Node: Demographic Engine v2</span>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-surface-container px-2 py-0.5 rounded text-on-surface-variant">
                Conf. 99.4%
              </span>
            </div>

            <p className="text-[13px] text-on-surface-variant leading-relaxed mt-space-sm">
              Ask questions against the structured metadata, lineage, column schemas, and cohort revisions of this dataset.
            </p>

            {/* Suggested Question Chips */}
            <div className="flex flex-col gap-space-xs mt-space-md">
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                Suggested Prompts
              </span>
              <button 
                onClick={() => onOpenGovAi(`What does the ${dataset.name} dataset contain?`)}
                className="w-full text-left p-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors flex items-center justify-between group cursor-pointer border border-outline-variant/20"
              >
                <span className="text-[13px] font-medium text-on-surface group-hover:text-primary">"What does this dataset contain?"</span>
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
              </button>
              <button 
                onClick={() => onOpenGovAi(`Who maintains ${dataset.name} and what is the update schedule?`)}
                className="w-full text-left p-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors flex items-center justify-between group cursor-pointer border border-outline-variant/20"
              >
                <span className="text-[13px] font-medium text-on-surface group-hover:text-primary">"Who maintains it?"</span>
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
              </button>
              <button 
                onClick={() => onOpenGovAi(`Is there a newer version of ${dataset.name}?`)}
                className="w-full text-left p-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors flex items-center justify-between group cursor-pointer border border-outline-variant/20"
              >
                <span className="text-[13px] font-medium text-on-surface group-hover:text-primary">"Is there a newer version?"</span>
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
              </button>
            </div>

            {/* Primary Ask GovAI Trigger */}
            <button 
              onClick={() => onOpenGovAi(`Tell me about ${dataset.name} including coverage and attributes.`)}
              className="w-full mt-space-md bg-primary-container text-on-primary hover:bg-primary px-4 py-2.5 rounded-lg text-[14px] font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px] text-secondary-fixed">chat</span>
              <span>Ask GovAI about this dataset</span>
            </button>

            <div className="mt-space-sm flex items-center justify-center gap-1 text-on-surface-variant text-[11px] font-medium">
              <span className="material-symbols-outlined text-[14px] text-secondary">verified</span>
              <span>Audited response logs enabled</span>
            </div>
          </div>

          {/* Access & Permissions Panel */}
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs border border-outline-variant/30 space-y-space-md">
            <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/20">
              <div className="flex items-center gap-space-xs">
                <div className="w-8 h-8 rounded bg-surface-container-high flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">group</span>
                </div>
                <h2 className="text-[16px] font-bold text-on-surface">Access & Permissions</h2>
              </div>
              <span className="font-tabular-data text-[12px] text-on-surface-variant">4 Authorized</span>
            </div>

            {/* User Access List */}
            <div className="flex flex-col gap-space-xs">
              {(dataset.authorizedUsers || [
                { name: 'J. Doe', initials: 'JD', role: 'Editor', title: 'Lead Demographer', avatarBg: 'bg-primary text-on-primary' },
                { name: 'A. Smith', initials: 'AS', role: 'Editor', title: 'GIS Analyst', avatarBg: 'bg-primary-fixed text-on-primary-fixed' },
                { name: 'B. Lee', initials: 'BL', role: 'Viewer', title: 'Transportation Planner', avatarBg: 'bg-surface-container-high text-on-surface' },
                { name: 'C. Patel', initials: 'CP', role: 'Viewer', title: 'Research Intern', avatarBg: 'bg-surface-container-high text-on-surface' }
              ]).map((usr, i) => (
                <div key={i} className="flex items-center justify-between p-space-sm bg-surface-container-low rounded-lg border border-outline-variant/20">
                  <div className="flex items-center gap-space-sm">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[11px] ${usr.avatarBg || 'bg-primary text-on-primary'}`}>
                      {usr.initials}
                    </div>
                    <div className="min-w-0">
                      <span className="text-[13px] font-bold text-on-surface leading-tight block truncate">{usr.name}</span>
                      <span className="text-[11px] text-on-surface-variant">{usr.title}</span>
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                    usr.role === 'Editor'
                      ? 'bg-secondary-container text-on-secondary-container'
                      : 'bg-surface-container text-on-surface-variant font-medium'
                  }`}>
                    {usr.role}
                  </span>
                </div>
              ))}
            </div>

            {/* Admin Action Link */}
            <div className="pt-space-xs">
              <div className="bg-[#e3dfff]/40 p-space-sm rounded-lg flex items-center justify-between border border-[#c3c0ff]">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-tertiary text-[18px]">admin_panel_settings</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-tertiary text-on-tertiary font-bold tracking-wider uppercase">
                    Admin
                  </span>
                </div>
                <button
                  onClick={() => onNavigate('manage-access')}
                  className="text-[13px] text-tertiary-container hover:text-tertiary font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Manage access for this dataset</span>
                  <span className="text-[16px]">→</span>
                </button>
              </div>
              <p className="text-[11px] text-on-surface-variant mt-1.5 px-1 leading-snug">
                Visible only to Alex Mercer (Principal Data Manager). Role updates apply immediately across Active Directory.
              </p>
            </div>
          </div>

          {/* Quick Revision History Reference Card */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs border border-outline-variant/30 flex items-center justify-between">
            <div className="flex items-center gap-space-sm">
              <div className="w-9 h-9 rounded bg-surface-container-high flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">history_edu</span>
              </div>
              <div>
                <span className="text-[14px] font-bold text-on-surface block leading-tight">Revision History</span>
                <span className="text-[11px] text-on-surface-variant">14 commits recorded</span>
              </div>
            </div>
            <button 
              onClick={() => setShowRevisionModal(true)}
              className="text-[12px] text-secondary hover:underline font-bold cursor-pointer"
            >
              View log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
