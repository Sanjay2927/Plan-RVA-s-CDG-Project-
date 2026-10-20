export type ScreenMode = 
  | 'home' 
  | 'browse-by-topic' 
  | 'dataset-details' 
  | 'my-datasets' 
  | 'add-dataset' 
  | 'manage-access' 
  | 'login' 
  | 'help';

export type FileType = 'Excel' | 'CSV' | 'GIS' | 'PDF';
export type TopicType = 'Demographics' | 'Economy' | 'Environment' | 'Transportation' | 'Land Use' | 'Housing';
export type PlanType = 'Economic Development Strategy' | 'Natural Resources Plan' | 'None';
export type UserRole = 'Viewer' | 'Editor' | 'Principal Data Manager';
export type GeoHubStatus = 'yes' | 'no' | 'unsure';

export interface Dataset {
  id: string;
  uid: string;
  name: string;
  topic: TopicType;
  fileType: FileType;
  formatLabel: string;
  plan: string;
  owner: string;
  ownerInitials: string;
  ownerRole?: string;
  lastModified: string;
  lastModifiedAgo: string;
  geohubStatus: GeoHubStatus;
  geohubPublished: boolean;
  geohubText?: string;
  userAccess: 'Editor' | 'Viewer';
  description: string;
  sharepointPath: string;
  fileSize?: string;
  updateCadence: string;
  nextScheduled?: string;
  jurisdictionScope?: string;
  totalEntities?: string;
  medianMetric?: string;
  yoyMetric?: string;
  completenessMetric?: string;
  checksum?: string;
  complianceStandard?: string;
  authorizedUsers?: {
    name: string;
    initials: string;
    role: 'Editor' | 'Viewer';
    title: string;
    avatarBg?: string;
  }[];
}

export interface UserPersonnel {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: UserRole;
  department: string;
  title: string;
  editDatasetsCount: number;
  lastChanged: string;
  isPendingGrant?: boolean;
}

export interface AuditEntry {
  id: string;
  type: 'Role Upgrade' | 'Verification' | 'Base Ingestion' | 'Dataset Registered';
  date: string;
  timestamp: string;
  description: string;
  actor: string;
  sha256?: string;
  tagClass?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'govai';
  text: string;
  timestamp: string;
  embeddedDataset?: Dataset;
  accessNotice?: string;
  sourceTag?: string;
}
