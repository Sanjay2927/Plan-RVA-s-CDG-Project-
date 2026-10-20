import React, { useState } from 'react';
import { ScreenMode } from '../types.ts';

interface HeaderProps {
  currentScreen: ScreenMode;
  onNavigate: (screen: ScreenMode) => void;
  datasetName?: string;
  currentUser?: {
    name: string;
    role: string;
    email: string;
  };
}

export const Header: React.FC<HeaderProps> = ({ 
  currentScreen, 
  onNavigate, 
  datasetName,
  currentUser = {
    name: 'Alex Mercer',
    role: 'Principal Data Manager',
    email: 'a.mercer@planning.gov'
  }
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const getBreadcrumbs = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <div className="flex items-center gap-space-xs text-on-surface-variant text-[14px]">
            <span className="material-symbols-outlined text-[18px]">home_pin</span>
            <span className="font-medium">Civil Spatial Registry</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="font-semibold text-secondary">Internal Catalog View</span>
          </div>
        );
      case 'browse-by-topic':
        return (
          <div className="flex items-center gap-space-xs text-on-surface-variant text-[14px]">
            <button onClick={() => onNavigate('home')} className="hover:text-primary transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">home_pin</span>
              <span className="font-medium">Civil Spatial Registry</span>
            </button>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="font-semibold text-secondary">Query Index & Browse</span>
          </div>
        );
      case 'dataset-details':
        return (
          <div className="flex items-center gap-space-xs text-on-surface-variant text-[14px]">
            <button onClick={() => onNavigate('home')} className="hover:text-primary transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">home_pin</span>
              <span className="font-medium">Civil Spatial Registry</span>
            </button>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <button onClick={() => onNavigate('browse-by-topic')} className="hover:text-primary transition-colors">
              Datasets
            </button>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="font-semibold text-secondary truncate max-w-xs">{datasetName || 'Dataset Details'}</span>
          </div>
        );
      case 'my-datasets':
        return (
          <div className="flex items-center gap-space-xs text-on-surface-variant text-[14px]">
            <button onClick={() => onNavigate('home')} className="hover:text-primary transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">home_pin</span>
              <span className="font-medium">Civil Spatial Registry</span>
            </button>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="font-semibold text-secondary">My Assigned Datasets</span>
          </div>
        );
      case 'add-dataset':
        return (
          <div className="flex items-center gap-space-xs text-on-surface-variant text-[14px]">
            <button onClick={() => onNavigate('home')} className="hover:text-primary transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">home_pin</span>
              <span className="font-medium">Civil Spatial Registry</span>
            </button>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="font-semibold text-secondary">Metadata Intake Form (ISO 19115)</span>
          </div>
        );
      case 'manage-access':
        return (
          <div className="flex items-center gap-space-xs text-on-surface-variant text-[14px]">
            <button onClick={() => onNavigate('home')} className="hover:text-primary transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">home_pin</span>
              <span className="font-medium">Civil Spatial Registry</span>
            </button>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="font-semibold text-secondary">RBAC Permissions & Access Control</span>
          </div>
        );
      case 'login':
        return (
          <div className="flex items-center gap-space-xs text-on-surface-variant text-[14px]">
            <span className="material-symbols-outlined text-[18px]">shield</span>
            <span className="font-medium">Authentication Gateway</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="font-semibold text-secondary">Entra ID Single Sign-On</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-space-xs text-on-surface-variant text-[14px]">
            <button onClick={() => onNavigate('home')} className="hover:text-primary transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">home_pin</span>
              <span className="font-medium">Civil Spatial Registry</span>
            </button>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="font-semibold text-secondary">Documentation & Standards</span>
          </div>
        );
    }
  };

  return (
    <header className="fixed top-0 left-72 right-0 h-16 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-outline-variant/30 z-40 flex items-center justify-between px-space-xl">
      <div className="flex items-center gap-space-md">
        {getBreadcrumbs()}
      </div>

      <div className="flex items-center gap-space-lg">
        {/* Spatial DB Status Badge */}
        <div className="flex items-center gap-space-xs text-on-surface-variant bg-surface-container px-space-sm py-1 rounded-full border border-outline-variant/20 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
          <span className="text-[11px] font-bold text-on-surface uppercase tracking-wide">Spatial DB: Synced</span>
        </div>

        {/* User Identity Module */}
        <div className="relative">
          <div 
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-space-md pl-space-md cursor-pointer group"
          >
            <div className="flex flex-col text-right">
              <span className="text-[14px] font-semibold text-on-surface leading-tight group-hover:text-secondary transition-colors">
                {currentUser.name}
              </span>
              <span className="text-[11px] text-[#c3c0ff] bg-[#0a0050] px-1.5 py-0.5 rounded tracking-wide font-semibold mt-0.5">
                {currentUser.role}
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-sm group-hover:ring-2 group-hover:ring-secondary transition-all">
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </div>
          </div>

          {/* User Profile Dropdown Menu */}
          {userMenuOpen && (
            <div className="absolute right-0 top-12 mt-2 w-64 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/40 py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-2 border-b border-outline-variant/30">
                <p className="text-xs font-bold text-on-surface">{currentUser.name}</p>
                <p className="text-xs text-on-surface-variant truncate">{currentUser.email}</p>
                <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-secondary bg-secondary-container/40 px-2 py-0.5 rounded">
                  {currentUser.role}
                </span>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    onNavigate('login');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-on-surface hover:bg-surface-container-high flex items-center gap-2 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px] text-secondary">vpn_key</span>
                  <span>Switch Account / SSO Portal</span>
                </button>
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    onNavigate('manage-access');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-on-surface hover:bg-surface-container-high flex items-center gap-2 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">admin_panel_settings</span>
                  <span>Manage Agency Permissions</span>
                </button>
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    onNavigate('my-datasets');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-on-surface hover:bg-surface-container-high flex items-center gap-2 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px] text-outline">inventory_2</span>
                  <span>View My Datasets</span>
                </button>
              </div>

              <div className="border-t border-outline-variant/30 pt-1">
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    onNavigate('login');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-error hover:bg-error-container/40 flex items-center gap-2 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">logout</span>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
