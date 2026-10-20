import React, { useState } from 'react';
import { ScreenMode, Dataset, UserPersonnel, AuditEntry, UserRole } from './types.ts';
import { INITIAL_DATASETS, INITIAL_PERSONNEL, INITIAL_AUDIT_LOGS } from './mockData.ts';
import { Sidebar } from './components/Sidebar.tsx';
import { Header } from './components/Header.tsx';
import { GovAiDrawer } from './components/GovAiDrawer.tsx';
import { DataPreviewModal } from './components/DataPreviewModal.tsx';
import { SharePointExportModal } from './components/SharePointExportModal.tsx';
import { HomeView } from './views/HomeView.tsx';
import { BrowseView } from './views/BrowseView.tsx';
import { DatasetDetailView } from './views/DatasetDetailView.tsx';
import { AddDatasetView } from './views/AddDatasetView.tsx';
import { ManageAccessView } from './views/ManageAccessView.tsx';
import { LoginView } from './views/LoginView.tsx';
import { MyDatasetsView } from './views/MyDatasetsView.tsx';
import { HelpView } from './views/HelpView.tsx';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenMode>('home');
  const [datasets, setDatasets] = useState<Dataset[]>(INITIAL_DATASETS);
  const [selectedDataset, setSelectedDataset] = useState<Dataset>(INITIAL_DATASETS[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [personnel, setPersonnel] = useState<UserPersonnel[]>(INITIAL_PERSONNEL);
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>(INITIAL_AUDIT_LOGS);
  
  // GovAI side-drawer state
  const [govAiOpen, setGovAiOpen] = useState(false);
  const [govAiInitialPrompt, setGovAiInitialPrompt] = useState<string | undefined>();
  
  // Data Preview modal
  const [previewDataset, setPreviewDataset] = useState<Dataset | null>(null);

  // SharePoint Export modal
  const [sharePointExportOpen, setSharePointExportOpen] = useState(false);
  const [sharePointExportDataset, setSharePointExportDataset] = useState<Dataset | null>(null);

  const handleOpenSharePointExport = (dataset?: Dataset) => {
    setSharePointExportDataset(dataset || null);
    setSharePointExportOpen(true);
  };

  // Authenticated user
  const [currentUser, setCurrentUser] = useState({
    name: 'Alex Mercer',
    role: 'Principal Data Manager',
    email: 'a.mercer@planning.gov'
  });

  const handleOpenGovAi = (prompt?: string) => {
    setGovAiInitialPrompt(prompt);
    setGovAiOpen(true);
  };

  const handleCloseGovAi = () => {
    setGovAiOpen(false);
    setGovAiInitialPrompt(undefined);
  };

  const handleSelectDataset = (d: Dataset) => {
    setSelectedDataset(d);
  };

  const handleAddDataset = (newDataset: Dataset) => {
    setDatasets(prev => [newDataset, ...prev]);
    // Add audit entry
    const newAudit: AuditEntry = {
      id: `audit-${Date.now()}`,
      type: 'Dataset Registered',
      date: 'Mar 2026',
      timestamp: 'Just now',
      description: `New resource '${newDataset.name}' registered to SharePoint catalog by ${currentUser.name}.`,
      actor: currentUser.name,
      sha256: `SHA256: ${Math.random().toString(36).substring(2, 9)}...${Math.random().toString(36).substring(2, 6)}`
    };
    setAuditLogs(prev => [newAudit, ...prev]);
  };

  const handleUpdatePersonnelRole = (userId: string, newRole: UserRole, datasetContext?: string) => {
    setPersonnel(prev => prev.map(p => {
      if (p.id === userId) {
        return {
          ...p,
          role: newRole,
          editDatasetsCount: newRole === 'Editor' ? Math.max(1, p.editDatasetsCount + 1) : 0,
          isPendingGrant: false,
          lastChanged: 'Mar 2026'
        };
      }
      return p;
    }));

    const targetPerson = personnel.find(p => p.id === userId);
    const newAudit: AuditEntry = {
      id: `audit-${Date.now()}`,
      type: 'Role Upgrade',
      date: 'Mar 2026',
      timestamp: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' EST',
      description: `${targetPerson?.name || 'Staff member'} changed to ${newRole}${datasetContext ? ` on ${datasetContext}` : ''}, by ${currentUser.name}`,
      actor: currentUser.name,
      sha256: `SHA256: ${Math.random().toString(36).substring(2, 9)}...${Math.random().toString(36).substring(2, 6)}`
    };
    setAuditLogs(prev => [newAudit, ...prev]);
  };

  const handleAddPersonnel = (newUser: UserPersonnel) => {
    setPersonnel(prev => [...prev, newUser]);
  };

  const handleRemovePersonnel = (userId: string) => {
    setPersonnel(prev => prev.filter(p => p.id !== userId));
  };

  const handleLoginSuccess = (user: { name: string; role: string; email: string }) => {
    setCurrentUser(user);
  };

  return (
    <div className="bg-surface font-sans text-on-surface antialiased min-h-screen selection:bg-secondary-container selection:text-on-secondary-container">
      {/* Persistent Left Sidebar */}
      <Sidebar 
        currentScreen={currentScreen} 
        onNavigate={(screen) => {
          if (screen === 'browse-by-topic' && !searchQuery) {
            setSearchQuery('county population and regional environment');
          }
          setCurrentScreen(screen);
        }}
        onOpenGovAi={() => handleOpenGovAi()}
      />

      {/* Main Content Pane (offset by 288px / 72 spacing units) */}
      <div className="pl-72">
        {/* Persistent Top Header */}
        <Header 
          currentScreen={currentScreen}
          onNavigate={setCurrentScreen}
          datasetName={selectedDataset?.name}
          currentUser={currentUser}
        />

        {/* Dynamic Screen View */}
        <main className="w-full pt-20 px-space-xl pb-space-xl min-h-screen">
          {currentScreen === 'home' && (
            <HomeView 
              datasets={datasets}
              onSelectDataset={handleSelectDataset}
              onNavigate={setCurrentScreen}
              onOpenGovAi={handleOpenGovAi}
              onPreviewDataset={setPreviewDataset}
              onSearchQuery={(q) => setSearchQuery(q)}
              onOpenSharePointExport={handleOpenSharePointExport}
            />
          )}

          {currentScreen === 'browse-by-topic' && (
            <BrowseView 
              datasets={datasets}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSelectDataset={handleSelectDataset}
              onNavigate={setCurrentScreen}
              onOpenGovAi={handleOpenGovAi}
              onPreviewDataset={setPreviewDataset}
              onOpenSharePointExport={handleOpenSharePointExport}
            />
          )}

          {currentScreen === 'dataset-details' && (
            <DatasetDetailView 
              dataset={selectedDataset}
              onNavigate={setCurrentScreen}
              onOpenGovAi={handleOpenGovAi}
              onPreviewDataset={setPreviewDataset}
              onOpenSharePointExport={handleOpenSharePointExport}
            />
          )}

          {currentScreen === 'my-datasets' && (
            <MyDatasetsView 
              datasets={datasets}
              currentUser={currentUser}
              onSelectDataset={handleSelectDataset}
              onNavigate={setCurrentScreen}
              onPreviewDataset={setPreviewDataset}
            />
          )}

          {currentScreen === 'add-dataset' && (
            <AddDatasetView 
              onAddDataset={handleAddDataset}
              onNavigate={setCurrentScreen}
            />
          )}

          {currentScreen === 'manage-access' && (
            <ManageAccessView 
              personnel={personnel}
              auditLogs={auditLogs}
              onUpdatePersonnelRole={handleUpdatePersonnelRole}
              onAddPersonnel={handleAddPersonnel}
              onRemovePersonnel={handleRemovePersonnel}
            />
          )}

          {currentScreen === 'login' && (
            <LoginView 
              onLoginSuccess={handleLoginSuccess}
              onNavigate={setCurrentScreen}
            />
          )}

          {currentScreen === 'help' && (
            <HelpView />
          )}
        </main>
      </div>

      {/* Slide-over GovAI Data Assistant Drawer */}
      <GovAiDrawer 
        isOpen={govAiOpen}
        onClose={handleCloseGovAi}
        datasets={datasets}
        onSelectDataset={handleSelectDataset}
        onNavigate={setCurrentScreen}
        initialPrompt={govAiInitialPrompt}
      />

      {/* Data Record Preview Modal */}
      <DataPreviewModal 
        dataset={previewDataset}
        onClose={() => setPreviewDataset(null)}
        onViewFullDetails={(d) => {
          setSelectedDataset(d);
          setCurrentScreen('dataset-details');
        }}
        onOpenSharePointExport={handleOpenSharePointExport}
      />

      {/* SharePoint Export Center Modal */}
      <SharePointExportModal
        isOpen={sharePointExportOpen}
        onClose={() => setSharePointExportOpen(false)}
        datasets={datasets}
        selectedDataset={sharePointExportDataset}
      />

      {/* Persistent Floating GovAI Assistant Button */}
      {!govAiOpen && (
        <button
          onClick={() => handleOpenGovAi()}
          className="fixed bottom-space-lg right-space-lg z-40 flex items-center gap-space-xs px-space-md py-space-sm bg-primary text-on-primary rounded-full shadow-[0_4px_14px_rgba(0,0,0,0.18)] hover:bg-primary-container transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary cursor-pointer border border-outline-variant/30 group"
        >
          <span className="material-symbols-outlined text-secondary-fixed text-[20px] group-hover:rotate-12 transition-transform">
            auto_awesome
          </span>
          <span className="text-[14px] font-bold tracking-wide">GovAI • Data Assistant</span>
        </button>
      )}
    </div>
  );
}
