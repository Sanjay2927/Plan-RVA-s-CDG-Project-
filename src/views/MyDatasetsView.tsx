import React from 'react';
import { Dataset, ScreenMode } from '../types.ts';

interface MyDatasetsViewProps {
  datasets: Dataset[];
  currentUser: { name: string; role: string; email: string };
  onSelectDataset: (dataset: Dataset) => void;
  onNavigate: (screen: ScreenMode) => void;
  onPreviewDataset: (dataset: Dataset) => void;
}

export const MyDatasetsView: React.FC<MyDatasetsViewProps> = ({
  datasets,
  currentUser,
  onSelectDataset,
  onNavigate,
  onPreviewDataset
}) => {
  // Datasets where user has Editor access or is listed as owner or authorized
  const myDatasets = datasets.filter(d => 
    d.userAccess === 'Editor' || 
    d.owner.toLowerCase().includes(currentUser.name.toLowerCase()) ||
    currentUser.name.includes('Alex Mercer') // Admin has oversight over all
  );

  return (
    <div className="flex flex-col gap-space-lg w-full max-w-[1520px] mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-space-sm gap-space-sm">
        <div className="flex flex-col">
          <div className="flex items-center gap-space-xs text-on-surface-variant text-[11px] font-bold uppercase tracking-wider mb-1">
            <span>Enterprise Workspace</span>
            <span>/</span>
            <span className="text-secondary font-bold">Custodial Inventory</span>
          </div>
          <h1 className="text-[30px] font-bold text-on-surface tracking-tight">My Assigned Datasets</h1>
          <p className="text-[14px] text-on-surface-variant mt-0.5">
            Datasets where you have custodial oversight or elevated Editor write permissions.
          </p>
        </div>

        <div className="flex items-center gap-space-sm">
          <button
            onClick={() => onNavigate('add-dataset')}
            className="px-space-md py-2 bg-primary hover:bg-primary-container text-on-primary rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">add_box</span>
            <span>Register New Dataset</span>
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs border border-outline-variant/30 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase text-on-surface-variant">Active Edit Clearance</span>
            <div className="text-[28px] font-bold text-on-surface font-tabular-data mt-1">{myDatasets.length} Records</div>
            <span className="text-[12px] text-secondary font-semibold">100% In Compliance</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-secondary-container/40 flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[22px]">edit_document</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs border border-outline-variant/30 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase text-on-surface-variant">Upcoming Audit Cadence</span>
            <div className="text-[28px] font-bold text-on-surface font-tabular-data mt-1">2 Pending</div>
            <span className="text-[12px] text-on-surface-variant">Due within 60 days</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[22px]">schedule</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs border border-outline-variant/30 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase text-on-surface-variant">Linked GeoHub Endpoints</span>
            <div className="text-[28px] font-bold text-secondary font-tabular-data mt-1">
              {myDatasets.filter(d => d.geohubPublished).length} Synced
            </div>
            <span className="text-[12px] text-secondary font-semibold">Direct API Live</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-tertiary">
            <span className="material-symbols-outlined text-[22px]">public</span>
          </div>
        </div>
      </div>

      {/* Dataset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        {myDatasets.map((dataset) => (
          <div 
            key={dataset.id}
            className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs border border-outline-variant/30 flex flex-col justify-between gap-space-md hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container">
                    {dataset.topic}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-surface-container-high text-on-surface">
                    {dataset.formatLabel}
                  </span>
                </div>
                <span className="text-[11px] font-tabular-data text-on-surface-variant bg-surface-container-low px-2 py-0.5 rounded border border-outline-variant/20">
                  {dataset.lastModifiedAgo}
                </span>
              </div>

              <button
                onClick={() => {
                  onSelectDataset(dataset);
                  onNavigate('dataset-details');
                }}
                className="text-left font-bold text-[18px] text-on-surface hover:text-secondary transition-colors cursor-pointer leading-tight"
              >
                {dataset.name}
              </button>

              <p className="text-[13px] text-on-surface-variant leading-relaxed line-clamp-2">
                {dataset.description}
              </p>

              <div className="flex items-center gap-3 text-xs text-on-surface-variant pt-1 font-tabular-data">
                <span>UID: {dataset.uid}</span>
                <span>•</span>
                <span>Custody: {dataset.owner}</span>
                <span>•</span>
                <span className="text-secondary font-semibold">ISO 19115 Validated</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-outline-variant/20">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onPreviewDataset(dataset)}
                  className="px-3 py-1.5 rounded bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">visibility</span>
                  <span>Preview</span>
                </button>
                <button
                  onClick={() => alert(`Downloading raw file bundle for ${dataset.name}`)}
                  className="px-3 py-1.5 rounded bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  <span>Fetch</span>
                </button>
              </div>

              <button
                onClick={() => {
                  onSelectDataset(dataset);
                  onNavigate('dataset-details');
                }}
                className="px-4 py-1.5 bg-primary text-on-primary hover:bg-primary-container rounded text-xs font-bold flex items-center gap-1 cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">edit_document</span>
                <span>Edit Metadata</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
