import React, { useState } from 'react';
import { UserPersonnel, AuditEntry, UserRole } from '../types.ts';

interface ManageAccessViewProps {
  personnel: UserPersonnel[];
  auditLogs: AuditEntry[];
  onUpdatePersonnelRole: (id: string, newRole: UserRole, datasetName?: string) => void;
  onAddPersonnel: (user: UserPersonnel) => void;
  onRemovePersonnel: (id: string) => void;
}

export const ManageAccessView: React.FC<ManageAccessViewProps> = ({
  personnel,
  auditLogs,
  onUpdatePersonnelRole,
  onAddPersonnel,
  onRemovePersonnel
}) => {
  const [activeTab, setActiveTab] = useState<'members' | 'dataset'>('members');
  const [searchStaff, setSearchStaff] = useState('');
  const [selectedDatasetKey, setSelectedDatasetKey] = useState('employment');
  
  // Interactive Modal state for Granting Editor Access
  const [showGrantModal, setShowGrantModal] = useState(false);
  const [targetUser, setTargetUser] = useState<UserPersonnel | null>(null);
  const [targetDatasetForGrant, setTargetDatasetForGrant] = useState('Employment by Industry');
  
  // Add member modal state
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newDept, setNewDept] = useState('Planning Analytics');
  const [newRole, setNewRole] = useState<UserRole>('Viewer');

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleOpenGrantModal = (user: UserPersonnel, datasetTitle = 'Employment by Industry') => {
    setTargetUser(user);
    setTargetDatasetForGrant(datasetTitle);
    setShowGrantModal(true);
  };

  const handleConfirmGrant = () => {
    if (targetUser) {
      onUpdatePersonnelRole(targetUser.id, 'Editor', targetDatasetForGrant);
      showToast(`Editor access successfully granted to ${targetUser.name} for ${targetDatasetForGrant}.`);
    }
    setShowGrantModal(false);
  };

  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    const initials = newName
      .split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    const newUser: UserPersonnel = {
      id: `usr-${Date.now()}`,
      name: newName,
      initials,
      email: newEmail,
      role: newRole,
      department: newDept,
      title: `${newDept} Specialist`,
      editDatasetsCount: newRole === 'Editor' ? 1 : 0,
      lastChanged: 'Just now'
    };

    onAddPersonnel(newUser);
    setShowAddMemberModal(false);
    setNewName('');
    setNewEmail('');
    showToast(`Registered new team member: ${newName} (${newRole})`);
  };

  const handleExportAuditCsv = () => {
    const headers = ['Type', 'Date', 'Timestamp', 'Actor', 'Description', 'SHA256'];
    const rows = auditLogs.map(a => [
      a.type,
      `"${a.date}"`,
      `"${a.timestamp}"`,
      `"${a.actor}"`,
      `"${a.description.replace(/"/g, '""')}"`,
      `"${a.sha256 || ''}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rpa_audit_ledger_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredStaff = personnel.filter(p => 
    p.name.toLowerCase().includes(searchStaff.toLowerCase()) ||
    p.email.toLowerCase().includes(searchStaff.toLowerCase()) ||
    p.department.toLowerCase().includes(searchStaff.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full max-w-[1520px] mx-auto pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-space-lg left-1/2 -translate-x-1/2 z-50 bg-inverse-surface text-inverse-on-surface px-space-md py-space-sm rounded-lg shadow-xl flex items-center gap-space-sm border border-secondary text-sm font-medium animate-in fade-in">
          <span className="material-symbols-outlined text-secondary text-[20px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl max-w-md w-full border border-outline-variant/40 overflow-hidden flex flex-col">
            <div className="p-space-md bg-surface-container-low flex items-center justify-between border-b border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">person_add</span>
                <h3 className="text-base font-bold text-on-surface">Add Team Member</h3>
              </div>
              <button 
                onClick={() => setShowAddMemberModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-container-high text-on-surface-variant cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddMemberSubmit} className="p-space-md flex flex-col gap-space-sm">
              <div>
                <label className="text-xs font-bold text-on-surface">Staff Full Name</label>
                <input 
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g., E. Martinez"
                  className="w-full h-9 px-3 mt-1 rounded bg-surface-container-low text-xs border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-secondary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-on-surface">Agency Email Address</label>
                <input 
                  required
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g., e.martinez@planning.gov"
                  className="w-full h-9 px-3 mt-1 rounded bg-surface-container-low text-xs border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-secondary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-on-surface">Department</label>
                <select 
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="w-full h-9 px-3 mt-1 rounded bg-surface-container-low text-xs border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-secondary"
                >
                  <option value="Planning Analytics">Planning Analytics</option>
                  <option value="GIS Coordination">GIS Coordination</option>
                  <option value="Transit Modeling">Transit Modeling</option>
                  <option value="Research & Policy">Research & Policy</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-on-surface">Assigned Role</label>
                <select 
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  className="w-full h-9 px-3 mt-1 rounded bg-surface-container-low text-xs border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-secondary"
                >
                  <option value="Viewer">Viewer (Default Tier: Read & Download)</option>
                  <option value="Editor">Editor (Elevated Tier: Modify Original Data)</option>
                </select>
                <p className="text-[11px] text-on-surface-variant mt-1">New accounts inherit organizational Active Directory clearance.</p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-outline-variant/20 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="px-3 py-1.5 text-xs text-on-surface hover:bg-surface-container rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs bg-primary text-on-primary font-bold rounded cursor-pointer hover:bg-primary-container"
                >
                  Register Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Page Context & Status Notification Header */}
      <div className="mb-space-lg flex flex-col gap-space-xs">
        <div className="flex flex-wrap items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-sm flex-wrap">
            <h1 className="text-[32px] font-bold text-on-surface tracking-tight">Manage access</h1>
            <span className="inline-flex items-center gap-space-xs px-space-sm py-1 rounded bg-tertiary-container text-on-tertiary text-[11px] font-bold uppercase tracking-wider shadow-xs">
              <span className="material-symbols-outlined text-[14px]">security</span>
              Admin: Principal Data Manager only
            </span>
          </div>

          <div className="flex items-center gap-space-md">
            <div className="bg-surface-container-low px-space-md py-1.5 rounded-lg flex items-center gap-space-sm shadow-xs border border-outline-variant/30">
              <span className="material-symbols-outlined text-[18px] text-secondary">shield_person</span>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase text-on-surface-variant leading-none">Security Scope</span>
                <span className="font-tabular-data text-[12px] font-semibold text-on-surface">SharePoint Spatial Node v4</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-[15px] text-on-surface-variant max-w-3xl leading-relaxed">
          Assign and audit Viewer and Editor permissions across SharePoint catalog datasets.
        </p>
      </div>

      {/* Operational Tabs & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md mb-space-lg">
        {/* Segmented Tab Navigation */}
        <div className="inline-flex p-1 bg-surface-container-high rounded-lg gap-space-xs shadow-xs self-start border border-outline-variant/30">
          <button 
            onClick={() => setActiveTab('members')}
            className={`flex items-center gap-space-xs px-space-md py-1.5 rounded-lg text-[13px] font-bold shadow-xs transition-all cursor-pointer ${
              activeTab === 'members'
                ? 'bg-surface text-on-surface shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">groups</span>
            <span>Team Member Permissions</span>
          </button>

          <button 
            onClick={() => setActiveTab('dataset')}
            className={`flex items-center gap-space-xs px-space-md py-1.5 rounded-lg text-[13px] font-bold transition-all cursor-pointer ${
              activeTab === 'dataset'
                ? 'bg-surface text-on-surface shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">dataset</span>
            <span>Per-Dataset Access View</span>
          </button>
        </div>

        {/* Search & Add Member */}
        <div className="flex flex-wrap items-center gap-space-sm">
          <div className="relative min-w-[260px]">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px] pointer-events-none">
              search
            </span>
            <input 
              value={searchStaff}
              onChange={(e) => setSearchStaff(e.target.value)}
              placeholder="Search staff by name or email..."
              className="w-full pl-9 pr-4 py-2 bg-surface-container-lowest text-on-surface rounded text-[13px] shadow-xs placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-secondary transition-all border border-outline-variant/30"
              type="text" 
            />
          </div>

          {/* Add Member Button with Tooltip */}
          <div className="relative group">
            <button 
              onClick={() => setShowAddMemberModal(true)}
              className="flex items-center gap-space-xs px-space-md py-2 bg-primary-container text-on-primary rounded text-[13px] font-bold shadow-xs hover:bg-primary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              <span>Add team member</span>
            </button>
            <div className="absolute right-0 bottom-full mb-2 hidden group-hover:flex flex-col items-center z-30 pointer-events-none">
              <div className="bg-inverse-surface text-inverse-on-surface text-[11px] px-space-sm py-1 rounded shadow-md whitespace-nowrap">
                New members default to Viewer
              </div>
              <div className="w-2 h-2 bg-inverse-surface rotate-45 -mt-1"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Workpane: 8 cols + 4 cols */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
        {/* Left 8-col: Tabular Permissions or Dataset Matrix */}
        <div className="xl:col-span-8 flex flex-col gap-space-lg">
          {/* View 1: Team Member Permissions */}
          {activeTab === 'members' && (
            <div className="flex flex-col bg-surface-container-lowest rounded-xl shadow-xs border border-outline-variant/30 overflow-hidden">
              <div className="p-space-md bg-surface-container-low flex flex-wrap items-center justify-between gap-space-sm border-b border-outline-variant/30">
                <div className="flex items-center gap-space-sm">
                  <span className="text-[16px] font-bold text-on-surface">Registered Personnel</span>
                  <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-[11px] font-bold font-tabular-data">
                    {filteredStaff.length} Active Records
                  </span>
                </div>
                <div className="flex items-center gap-space-xs text-on-surface-variant">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Access Sync: Strict</span>
                  <span className="material-symbols-outlined text-secondary text-[16px]">verified</span>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-surface-container-low text-[12px] font-bold text-on-surface-variant border-b border-outline-variant/30">
                      <th className="py-space-sm px-space-md">Name</th>
                      <th className="py-space-sm px-space-md">Email</th>
                      <th className="py-space-sm px-space-md">Role</th>
                      <th className="py-space-sm px-space-md">Datasets with edit access</th>
                      <th className="py-space-sm px-space-md">Last changed</th>
                      <th className="py-space-sm px-space-md text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20 text-on-surface text-[13px]">
                    {filteredStaff.map((person) => {
                      const isGrantPending = person.isPendingGrant;
                      return (
                        <tr 
                          key={person.id}
                          className={`transition-colors ${
                            isGrantPending ? 'bg-secondary-container/10' : 'hover:bg-surface-container-low'
                          }`}
                        >
                          <td className="py-3 px-space-md font-semibold flex items-center gap-space-sm">
                            <div className="w-7 h-7 rounded-full bg-surface-container-highest flex items-center justify-center text-[11px] font-bold text-on-surface">
                              {person.initials}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span>{person.name}</span>
                              {isGrantPending && (
                                <span className="px-1.5 py-0.5 rounded bg-secondary-container text-on-secondary-container text-[10px] font-bold">
                                  Grant Pending
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-3 px-space-md font-tabular-data text-on-surface-variant">
                            {person.email}
                          </td>

                          <td className="py-3 px-space-md">
                            <div className="relative inline-block">
                              <select 
                                value={person.role}
                                onChange={(e) => {
                                  const newR = e.target.value as UserRole;
                                  if (newR === 'Editor') {
                                    handleOpenGrantModal(person);
                                  } else {
                                    onUpdatePersonnelRole(person.id, newR);
                                    showToast(`${person.name} role changed to Viewer.`);
                                  }
                                }}
                                className="appearance-none bg-surface-container-high text-on-surface text-[12px] font-semibold pl-2 pr-7 py-1 rounded cursor-pointer focus:outline-none focus:ring-1 focus:ring-secondary border border-outline-variant/30"
                              >
                                <option value="Editor">Editor ▼</option>
                                <option value="Viewer">Viewer ▼</option>
                              </select>
                            </div>
                          </td>

                          <td className="py-3 px-space-md font-tabular-data">
                            <span className="font-semibold text-on-surface">
                              {person.editDatasetsCount > 0 ? `${person.editDatasetsCount} datasets` : '0 datasets (Read only)'}
                            </span>
                          </td>

                          <td className="py-3 px-space-md font-tabular-data text-on-surface-variant">
                            {person.lastChanged}
                          </td>

                          <td className="py-3 px-space-md text-right">
                            <div className="inline-flex items-center gap-space-xs">
                              {isGrantPending ? (
                                <button 
                                  onClick={() => handleOpenGrantModal(person)}
                                  className="px-2 py-1 rounded bg-secondary-container text-on-secondary-container text-[11px] font-bold shadow-2xs hover:opacity-90 transition-opacity cursor-pointer"
                                >
                                  Edit Role
                                </button>
                              ) : (
                                <button 
                                  onClick={() => handleOpenGrantModal(person)}
                                  className="px-2 py-1 rounded hover:bg-surface-container-high text-on-surface text-[11px] font-semibold transition-colors cursor-pointer"
                                >
                                  Edit
                                </button>
                              )}
                              <button 
                                onClick={() => {
                                  if (confirm(`Remove ${person.name} from spatial access registry?`)) {
                                    onRemovePersonnel(person.id);
                                    showToast(`Removed ${person.name} from registry.`);
                                  }
                                }}
                                className="px-2 py-1 rounded hover:bg-error-container text-error text-[11px] font-semibold transition-colors cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="p-space-sm bg-surface-container-low flex flex-wrap items-center justify-between text-on-surface-variant text-[11px] border-t border-outline-variant/30">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-[16px]">lock_clock</span>
                  <span>All modifications logged to Civil Registry Audit Ledger</span>
                </div>
                <div className="flex items-center gap-space-sm">
                  <span>Showing 1-{filteredStaff.length} of {filteredStaff.length}</span>
                  <div className="flex items-center gap-1">
                    <button disabled className="w-7 h-7 rounded flex items-center justify-center bg-surface-container-high text-on-surface-variant disabled:opacity-40">
                      <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                    </button>
                    <button disabled className="w-7 h-7 rounded flex items-center justify-center bg-surface-container-high text-on-surface-variant disabled:opacity-40">
                      <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* View 2: Per-Dataset Access View */}
          {activeTab === 'dataset' && (
            <div className="flex flex-col bg-surface-container-lowest rounded-xl shadow-xs border border-outline-variant/30 p-space-lg gap-space-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md pb-space-md border-b border-outline-variant/20">
                <div className="flex flex-col">
                  <h2 className="text-[18px] font-bold text-on-surface">Dataset Permission Matrix</h2>
                  <p className="text-[12px] text-on-surface-variant">
                    Select an authoritative inventory layer to inspect and manage granular write rights.
                  </p>
                </div>

                <div className="flex items-center gap-space-sm">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                    Target Dataset:
                  </label>
                  <div className="relative">
                    <select 
                      value={selectedDatasetKey}
                      onChange={(e) => setSelectedDatasetKey(e.target.value)}
                      className="bg-surface-container-high text-on-surface text-[12px] font-bold rounded px-space-sm py-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-secondary shadow-xs border border-outline-variant/30 cursor-pointer"
                    >
                      <option value="employment">Employment by Industry (Civil-2026-v2)</option>
                      <option value="population">County Population Estimates 2020</option>
                      <option value="parks">Regional Parks Boundaries & Corridors</option>
                      <option value="transit">Multimodal Transit Corridors</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-2 top-2.5 pointer-events-none text-on-surface-variant text-[18px]">
                      arrow_drop_down
                    </span>
                  </div>
                </div>
              </div>

              {/* Matrix List */}
              <div className="bg-surface-container-low rounded-lg p-space-md flex flex-col gap-space-sm border border-outline-variant/20">
                <div className="flex items-center justify-between py-space-xs text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                  <span>Staff Member</span>
                  <span>Target Rights</span>
                </div>

                {personnel.map((person) => {
                  const isEditor = person.role === 'Editor';
                  return (
                    <div key={person.id} className="flex items-center justify-between p-space-sm bg-surface rounded shadow-2xs border border-outline-variant/20">
                      <div className="flex flex-col">
                        <span className="text-[14px] font-bold text-on-surface">{person.name}</span>
                        <span className="text-[11px] text-on-surface-variant">{person.email}</span>
                      </div>

                      <div className="inline-flex rounded-lg p-0.5 bg-surface-container-high border border-outline-variant/30">
                        <button 
                          onClick={() => {
                            if (!isEditor) {
                              handleOpenGrantModal(person, selectedDatasetKey === 'employment' ? 'Employment by Industry' : 'Selected Dataset');
                            }
                          }}
                          className={`px-space-sm py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                            isEditor 
                              ? 'bg-secondary text-on-secondary shadow-2xs' 
                              : 'text-on-surface-variant hover:text-on-surface'
                          }`}
                        >
                          Editor
                        </button>
                        <button 
                          onClick={() => {
                            if (isEditor) {
                              onUpdatePersonnelRole(person.id, 'Viewer');
                              showToast(`${person.name} set to Viewer on ${selectedDatasetKey}.`);
                            }
                          }}
                          className={`px-space-sm py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                            !isEditor 
                              ? 'bg-primary text-on-primary shadow-2xs' 
                              : 'text-on-surface-variant hover:text-on-surface'
                          }`}
                        >
                          Viewer
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Interactive Grant Editor Access Confirmation Modal / Card */}
          {showGrantModal && (
            <div className="bg-surface-container-lowest rounded-xl shadow-xl p-space-lg flex flex-col gap-space-md relative overflow-hidden transition-all border-2 border-secondary animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-start justify-between gap-space-md">
                <div className="flex items-center gap-space-sm">
                  <div className="w-10 h-10 rounded-lg bg-error-container flex items-center justify-center shrink-0 text-on-error-container">
                    <span className="material-symbols-outlined text-[22px]">warning</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-space-xs">
                      <span className="text-[18px] font-bold text-on-surface">Grant Editor Access</span>
                      <span className="px-1.5 py-0.5 bg-surface-container-high text-on-surface-variant text-[10px] font-bold rounded uppercase">
                        Interactive Mockup
                      </span>
                    </div>
                    <span className="text-[13px] text-error font-bold">
                      Editors can modify the original data. Continue?
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => setShowGrantModal(false)}
                  className="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <div className="p-space-md bg-surface-container-low rounded-lg flex flex-col gap-space-xs border border-outline-variant/20">
                <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                  Action Details
                </div>
                <p className="text-[14px] text-on-surface font-medium">
                  Granting Editor role to <span className="text-secondary font-bold">{targetUser?.name || 'C. Patel'}</span> for <span className="font-bold underline decoration-secondary">{targetDatasetForGrant}</span>.
                </p>
                <div className="flex items-center gap-space-xs text-on-surface-variant text-[12px] mt-1">
                  <span className="material-symbols-outlined text-[16px] text-secondary">info</span>
                  <span>This grants full schema revision, row deletion, and GeoJSON ingestion capabilities.</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-space-sm pt-space-xs">
                <button 
                  onClick={() => setShowGrantModal(false)}
                  className="px-space-md py-2 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container transition-colors text-[13px] font-bold cursor-pointer border border-outline-variant/30"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmGrant}
                  className="flex items-center gap-space-xs px-space-md py-2 rounded-lg bg-secondary text-on-secondary hover:bg-on-secondary-container transition-colors text-[13px] font-bold shadow-xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  <span>Confirm & Grant Editor Access</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right 4-col: Role Definitions & Real-time Audit Activity */}
        <div className="xl:col-span-4 flex flex-col gap-space-lg">
          {/* Role definitions reference card */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs border border-outline-variant/30 flex flex-col gap-space-md">
            <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/20">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary text-[20px]">badge</span>
                <h2 className="text-[16px] font-bold text-on-surface">Role definitions</h2>
              </div>
              <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">RBAC 2.4</span>
            </div>

            <div className="flex flex-col gap-space-sm">
              <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-space-xs border border-outline-variant/20">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-[11px] font-bold">
                    Viewer
                  </span>
                  <span className="font-tabular-data text-[11px] text-on-surface-variant">Default Tier</span>
                </div>
                <p className="text-[12px] text-on-surface leading-snug">
                  Search, read, and download data. Cannot change original data.
                </p>
              </div>

              <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-space-xs border border-outline-variant/20">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container text-[11px] font-bold">
                    Editor
                  </span>
                  <span className="font-tabular-data text-[11px] text-secondary font-bold">Elevated Tier</span>
                </div>
                <p className="text-[12px] text-on-surface leading-snug">
                  Everything Viewer can do, plus modify original data.
                </p>
              </div>

              <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-space-xs border border-outline-variant/20">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-tertiary-container text-on-tertiary text-[11px] font-bold">
                    Principal Data Manager
                  </span>
                  <span className="font-tabular-data text-[11px] text-tertiary font-bold">Governance</span>
                </div>
                <p className="text-[12px] text-on-surface leading-snug">
                  Sole role capable of assigning Viewer/Editor permissions.
                </p>
              </div>
            </div>

            <div className="p-space-xs bg-surface-container rounded flex items-center gap-space-xs text-on-surface-variant text-[11px] border border-outline-variant/20">
              <span className="material-symbols-outlined text-[16px] text-secondary">verified_user</span>
              <span>Access token expiry enforced: 180 calendar days.</span>
            </div>
          </div>

          {/* Activity log panel */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs border border-outline-variant/30 flex flex-col gap-space-md">
            <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/20">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary text-[20px]">history_edu</span>
                <h2 className="text-[16px] font-bold text-on-surface">Recent Permission Activity</h2>
              </div>
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            </div>

            {/* Timeline */}
            <div className="flex flex-col gap-space-md relative pl-4">
              <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-surface-container-high"></div>

              {auditLogs.map((log) => (
                <div key={log.id} className="relative flex flex-col gap-space-xs">
                  <div className={`absolute -left-[19px] top-1.5 w-3 h-3 rounded-full ${
                    log.type === 'Role Upgrade' ? 'bg-secondary' : 'bg-outline'
                  }`}></div>
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] uppercase tracking-wider font-bold ${
                      log.type === 'Role Upgrade' ? 'text-secondary' : 'text-on-surface-variant'
                    }`}>
                      {log.type}
                    </span>
                    <span className="font-tabular-data text-[11px] text-on-surface-variant">{log.date}</span>
                  </div>
                  <p className="text-[12px] text-on-surface font-medium leading-snug">
                    {log.description}
                  </p>
                  {log.sha256 && (
                    <span className="font-tabular-data text-[10px] text-on-surface-variant">{log.sha256}</span>
                  )}
                </div>
              ))}
            </div>

            <button 
              onClick={handleExportAuditCsv}
              className="w-full py-2 bg-surface-container-low hover:bg-surface-container text-on-surface text-[12px] font-bold rounded flex items-center justify-center gap-space-xs transition-colors cursor-pointer border border-outline-variant/30"
            >
              <span>Export Complete Audit Trail (.CSV)</span>
              <span className="material-symbols-outlined text-[16px]">download</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
