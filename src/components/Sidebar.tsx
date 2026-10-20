import React from 'react';
import { ScreenMode } from '../types.ts';

interface SidebarProps {
  currentScreen: ScreenMode;
  onNavigate: (screen: ScreenMode) => void;
  onOpenGovAi: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentScreen, onNavigate, onOpenGovAi }) => {
  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-surface-container-low shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between py-space-md border-r border-outline-variant/30 select-none">
      <div className="flex flex-col gap-space-md">
        {/* Brand Header */}
        <div 
          className="px-space-md flex items-center gap-space-sm h-14 cursor-pointer"
          onClick={() => onNavigate('home')}
        >
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-on-primary text-[20px]">database</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-[16px] leading-tight text-on-surface tracking-tight truncate">Data Catalog</span>
            <span className="font-bold text-[11px] text-on-surface-variant uppercase tracking-wider truncate">Regional Planning Agency</span>
          </div>
        </div>

        {/* Portal Status Pill */}
        <div className="px-space-md">
          <div className="bg-surface-container rounded-lg p-space-xs px-space-sm flex items-center gap-space-xs text-on-surface-variant border border-outline-variant/20">
            <span className="material-symbols-outlined text-[16px] text-secondary">verified_user</span>
            <span className="text-[11px] font-bold uppercase tracking-wide text-secondary">Portal Node • Live</span>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex flex-col gap-space-xs px-space-md mt-space-xs">
          {/* Home */}
          <button
            onClick={() => onNavigate('home')}
            className={`flex items-center gap-space-sm px-space-sm py-2 rounded-lg text-left transition-colors font-medium text-[14px] ${
              currentScreen === 'home'
                ? 'bg-primary-container text-on-primary font-bold shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">home</span>
            <span className="flex-1">Home</span>
          </button>

          {/* Browse by Topic */}
          <button
            onClick={() => onNavigate('browse-by-topic')}
            className={`flex items-center gap-space-sm px-space-sm py-2 rounded-lg text-left transition-colors font-medium text-[14px] ${
              currentScreen === 'browse-by-topic' || currentScreen === 'dataset-details'
                ? 'bg-primary-container text-on-primary font-bold shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">folder_open</span>
            <span className="flex-1">Browse by Topic</span>
          </button>

          {/* My Datasets */}
          <button
            onClick={() => onNavigate('my-datasets')}
            className={`flex items-center gap-space-sm px-space-sm py-2 rounded-lg text-left transition-colors font-medium text-[14px] ${
              currentScreen === 'my-datasets'
                ? 'bg-primary-container text-on-primary font-bold shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">inventory_2</span>
            <span className="flex-1">My Datasets</span>
          </button>

          {/* Add Dataset */}
          <button
            onClick={() => onNavigate('add-dataset')}
            className={`flex items-center gap-space-sm px-space-sm py-2 rounded-lg text-left transition-colors font-medium text-[14px] ${
              currentScreen === 'add-dataset'
                ? 'bg-primary-container text-on-primary font-bold shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">add_box</span>
            <span className="flex-1">Add Dataset</span>
            <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface-variant">Restricted</span>
          </button>

          {/* Ask GovAI */}
          <button
            onClick={() => {
              onOpenGovAi();
            }}
            className="flex items-center gap-space-sm px-space-sm py-2 rounded-lg text-left transition-colors font-medium text-[14px] text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[20px] text-secondary">auto_awesome</span>
            <span className="flex-1">Ask GovAI</span>
            <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-secondary-container text-on-secondary-container">GovAI</span>
          </button>

          {/* Manage Access */}
          <button
            onClick={() => onNavigate('manage-access')}
            className={`flex items-center gap-space-sm px-space-sm py-2 rounded-lg text-left transition-colors font-medium text-[14px] ${
              currentScreen === 'manage-access'
                ? 'bg-primary-container text-on-primary font-bold shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">lock</span>
            <span className="flex-1">Manage Access</span>
            <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-primary-container text-on-primary">Admin</span>
          </button>

          {/* Help */}
          <button
            onClick={() => onNavigate('help')}
            className={`flex items-center gap-space-sm px-space-sm py-2 rounded-lg text-left transition-colors font-medium text-[14px] ${
              currentScreen === 'help'
                ? 'bg-primary-container text-on-primary font-bold shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">help_center</span>
            <span className="flex-1">Help</span>
          </button>
        </nav>
      </div>

      {/* RPA Standards Footer Callout */}
      <div className="px-space-md pt-space-sm">
        <div 
          onClick={() => onNavigate('help')}
          className="bg-surface-container-lowest rounded-lg p-space-sm shadow-[0_1px_8px_rgba(0,0,0,0.04)] border border-outline-variant/30 cursor-pointer hover:border-secondary/50 transition-colors"
        >
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
            <span className="text-[12px] font-bold text-on-surface">RPA Core Standards</span>
          </div>
          <p className="text-[12px] text-on-surface-variant mt-1 leading-snug">
            Compliant with State Geographic & Metadata Directive v4.2
          </p>
        </div>
      </div>
    </aside>
  );
};
