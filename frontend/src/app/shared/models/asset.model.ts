export interface FaCategory {
  id: number;
  majorCategory: string;
  majorDescription: string;
  minorCategory: string;
  minorDescription: string;
}

export interface AssetCategory {
  categoryId: number;
  assetCode: string;
  categoryName: string;
  deptInfoCode?: string;
  status: string;
}

export interface EmployeeOption {
  employeeId: string;
  name: string;
  department: string;
}

export interface Asset {
  assetId: number;
  assetNo: string;
  categoryId: number;
  assetName: string;
  computerName?: string;
  purchaseDate?: string;
  spec?: string;
  lanMac?: string;
  wifiMac?: string;
  assetType?: string;
  purpose?: string;
  site?: string;
  department?: string;
  custodianId?: string;
  managerId?: string;
  dispatchDate?: string;
  notes?: string;
  officeVersion?: string;
  osSerial?: string;
  status: string;
  inventoried: boolean;
  inventoriedAt?: string;
  inventoriedBy?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  category?: AssetCategory;
  custodian?: EmployeeOption;
  manager?: EmployeeOption;
}

export interface CreateAssetRequest {
  categoryId: number;
  computerName?: string;
  purchaseDate?: string;
  spec?: string;
  lanMac?: string;
  wifiMac?: string;
  assetType?: string;
  purpose?: string;
  site?: string;
  department?: string;
  custodianId?: string;
  dispatchDate?: string;
  notes?: string;
  officeVersion?: string;
  osSerial?: string;
  status: string;
}

export const ASSET_STATUS_LABELS: Record<string, string> = {
  new:         '新品',
  in_use:      '使用中',
  idle:        '閒置',
  maintenance: '維修中',
  scrapped:    '停用'
};
