import React from 'react';
import { Dataset } from '../types.ts';

interface DataPreviewModalProps {
  dataset: Dataset | null;
  onClose: () => void;
  onViewFullDetails: (dataset: Dataset) => void;
  onOpenSharePointExport?: (dataset?: Dataset) => void;
}

export const DataPreviewModal: React.FC<DataPreviewModalProps> = ({
  dataset,
  onClose,
  onViewFullDetails,
  onOpenSharePointExport
}) => {
  if (!dataset) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-surface-container-lowest rounded-xl shadow-2xl max-w-4xl w-full border border-outline-variant/40 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-space-md bg-surface-container-low flex items-center justify-between border-b border-outline-variant/30">
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[24px]">
                {dataset.fileType === 'Excel' ? 'table_chart' : dataset.fileType === 'GIS' ? 'layers' : 'description'}
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-on-surface">{dataset.name}</h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                  {dataset.topic}
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-surface-container-high text-on-surface">
                  {dataset.formatLabel}
                </span>
              </div>
              <span className="text-xs text-on-surface-variant font-tabular-data">
                UID: {dataset.uid} • SharePoint: {dataset.sharepointPath}
              </span>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-container-high text-on-surface-variant transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-space-lg overflow-y-auto flex flex-col gap-space-md">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-4 gap-space-sm bg-surface-container-low p-space-sm rounded-lg border border-outline-variant/20">
            <div>
              <span className="text-[10px] uppercase font-bold text-on-surface-variant">Custodian</span>
              <p className="text-xs font-semibold text-on-surface">{dataset.owner} ({dataset.ownerRole || 'Data Owner'})</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-on-surface-variant">Last Modified</span>
              <p className="text-xs font-semibold text-on-surface">{dataset.lastModified}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-on-surface-variant">Jurisdiction</span>
              <p className="text-xs font-semibold text-on-surface">{dataset.jurisdictionScope || 'Tri-County Region'}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-on-surface-variant">Compliance</span>
              <p className="text-xs font-semibold text-secondary flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                ISO-19115 Passed
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">Operational Abstract</h4>
            <p className="text-sm text-on-surface leading-relaxed bg-surface-container-lowest p-space-sm rounded border border-outline-variant/20">
              {dataset.description}
            </p>
          </div>

          {/* Simulated Tabular Sample Records */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Live Data Preview (Top 4 Sample Records)
              </h4>
              <span className="text-[11px] text-secondary font-tabular-data font-semibold">
                SHA-256 Checksum Verified
              </span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-outline-variant/30">
              <table className="w-full text-left text-xs font-tabular-data">
                <thead className="bg-surface-container-low text-on-surface-variant border-b border-outline-variant/30">
                  <tr>
                    <th className="px-3 py-2 font-semibold">FIPS_CODE</th>
                    <th className="px-3 py-2 font-semibold">DISTRICT_NAME</th>
                    <th className="px-3 py-2 font-semibold">POP_BASE_2020</th>
                    <th className="px-3 py-2 font-semibold">EST_GROWTH</th>
                    <th className="px-3 py-2 font-semibold">CONFIDENCE</th>
                    <th className="px-3 py-2 font-semibold">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  <tr className="hover:bg-surface-container-low/50">
                    <td className="px-3 py-2 font-mono">36047</td>
                    <td className="px-3 py-2 font-medium">Metropolitan Central</td>
                    <td className="px-3 py-2">842,109</td>
                    <td className="px-3 py-2 text-secondary font-semibold">+1.8%</td>
                    <td className="px-3 py-2">99.4%</td>
                    <td className="px-3 py-2"><span className="text-[10px] bg-secondary-container text-on-secondary-container px-1.5 py-0.5 rounded font-bold">Approved</span></td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/50">
                    <td className="px-3 py-2 font-mono">36081</td>
                    <td className="px-3 py-2 font-medium">Northern River Sector</td>
                    <td className="px-3 py-2">512,980</td>
                    <td className="px-3 py-2 text-secondary font-semibold">+0.9%</td>
                    <td className="px-3 py-2">98.9%</td>
                    <td className="px-3 py-2"><span className="text-[10px] bg-secondary-container text-on-secondary-container px-1.5 py-0.5 rounded font-bold">Approved</span></td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/50">
                    <td className="px-3 py-2 font-mono">36085</td>
                    <td className="px-3 py-2 font-medium">South Highland Basin</td>
                    <td className="px-3 py-2">498,340</td>
                    <td className="px-3 py-2 text-secondary font-semibold">+1.4%</td>
                    <td className="px-3 py-2">99.1%</td>
                    <td className="px-3 py-2"><span className="text-[10px] bg-secondary-container text-on-secondary-container px-1.5 py-0.5 rounded font-bold">Approved</span></td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/50">
                    <td className="px-3 py-2 font-mono">36005</td>
                    <td className="px-3 py-2 font-medium">Eastern Transit Corridor</td>
                    <td className="px-3 py-2">565,491</td>
                    <td className="px-3 py-2 text-secondary font-semibold">+2.1%</td>
                    <td className="px-3 py-2">99.7%</td>
                    <td className="px-3 py-2"><span className="text-[10px] bg-secondary-container text-on-secondary-container px-1.5 py-0.5 rounded font-bold">Approved</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-space-md bg-surface-container-low border-t border-outline-variant/30 flex items-center justify-between">
          <span className="text-xs text-on-surface-variant font-medium">
            Storage: SharePoint Secure Blob Storage • Verified Access
          </span>

          <div className="flex items-center gap-space-sm">
            <button
              onClick={() => {
                if (onOpenSharePointExport && dataset) {
                  onClose();
                  onOpenSharePointExport(dataset);
                } else {
                  alert(`Initiated download for ${dataset.name}`);
                }
              }}
              className="px-space-md py-2 bg-primary hover:bg-primary-container text-on-primary rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px] text-secondary-fixed">cloud_download</span>
              <span>Export from SharePoint</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onViewFullDetails(dataset);
              }}
              className="px-space-md py-2 bg-primary hover:bg-primary-container text-on-primary rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">file_open</span>
              <span>Open Complete Metadata Record</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
