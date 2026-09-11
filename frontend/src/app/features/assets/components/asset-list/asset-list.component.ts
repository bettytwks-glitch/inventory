import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AssetService } from '../../../../core/services/asset.service';
import { Asset, EmployeeOption } from '../../../../shared/models/asset.model';

interface DetailEdit {
  assetNo: string;
  computerName: string;
  purchaseDate: string;
  spec: string;
  lanMac: string;
  wifiMac: string;
  assetType: string;
  purpose: string;
  site: string;
  department: string;
  custodianId: string;
  managerId: string;
  dispatchDate: string;
  notes: string;
  officeVersion: string;
  osSerial: string;
  status: string;
}

interface AssetRow extends Asset {
  editStatus: string;
  editCustodianId: string;
  custodianSearch: string;
  custodianSuggestions: EmployeeOption[];
  showCustodianDrop: boolean;
  editManagerId: string;
  managerSearch: string;
  managerSuggestions: EmployeeOption[];
  showManagerDrop: boolean;
  saving: boolean;
  saved: boolean;
  expanded: boolean;
  detailEdit: DetailEdit;
  detailSaving: boolean;
  detailSaved: boolean;
}

function toDateStr(val: string | undefined | null): string {
  if (!val) return '';
  return val.substring(0, 10);
}

function buildDetailEdit(a: Asset): DetailEdit {
  return {
    assetNo:       a.assetNo ?? '',
    computerName:  a.computerName ?? '',
    purchaseDate:  toDateStr(a.purchaseDate),
    spec:          a.spec ?? '',
    lanMac:        a.lanMac ?? '',
    wifiMac:       a.wifiMac ?? '',
    assetType:     a.assetType ?? '',
    purpose:       a.purpose ?? '',
    site:          a.site ?? '',
    department:    a.department ?? '',
    custodianId:   a.custodianId ?? '',
    managerId:     a.managerId ?? '',
    dispatchDate:  toDateStr(a.dispatchDate),
    notes:         a.notes ?? '',
    officeVersion: a.officeVersion ?? '',
    osSerial:      a.osSerial ?? '',
    status:        a.status
  };
}

@Component({
  selector: 'app-asset-list',
  templateUrl: './asset-list.component.html',
  styleUrls: ['./asset-list.component.scss']
})
export class AssetListComponent implements OnInit {
  rows: AssetRow[] = [];
  employees: EmployeeOption[] = [];
  isLoading = false;

  filter = {
    assetNo:       '',
    assetName:     '',
    site:          '',
    custodianName: '',
    managerName:   '',
    status:        '',
    inventoried:   ''
  };

  get filteredRows(): AssetRow[] {
    const f = this.filter;
    return this.rows.filter(r => {
      if (f.assetNo       && !r.assetNo?.toLowerCase().includes(f.assetNo.toLowerCase()))       return false;
      if (f.assetName     && !r.assetName?.toLowerCase().includes(f.assetName.toLowerCase()))   return false;
      if (f.site          && r.site !== f.site)                                                  return false;
      if (f.custodianName && !(r.custodian?.name ?? 'IT').includes(f.custodianName))            return false;
      if (f.managerName   && !(r.manager?.name   ?? 'IT').includes(f.managerName))             return false;
      if (f.status        && r.status !== f.status)                                             return false;
      if (f.inventoried === 'yes' && !r.inventoried)                                            return false;
      if (f.inventoried === 'no'  &&  r.inventoried)                                            return false;
      return true;
    });
  }

  clearFilter(): void {
    this.filter = { assetNo: '', assetName: '', site: '', custodianName: '', managerName: '', status: '', inventoried: '' };
  }

  onCustodianFocus(row: AssetRow): void {
    if (!row.editCustodianId) row.custodianSearch = '';
    row.showCustodianDrop    = true;
    row.custodianSuggestions = this.employees;
  }

  onCustodianInput(row: AssetRow): void {
    const q = row.custodianSearch.trim();
    row.custodianSuggestions = q
      ? this.employees.filter(e => e.name.includes(q) || e.department.includes(q))
      : this.employees;
  }

  selectCustodian(row: AssetRow, emp: EmployeeOption): void {
    row.editCustodianId       = emp.employeeId;
    row.custodianSearch       = emp.name;
    row.custodianSuggestions  = [];
    row.showCustodianDrop     = false;
    row.detailEdit.department = emp.department;
    row.editStatus            = 'in_use';
  }

  clearCustodian(row: AssetRow): void {
    row.editCustodianId       = '';
    row.custodianSearch       = 'IT';
    row.custodianSuggestions  = [];
    row.showCustodianDrop     = false;
    row.editStatus            = 'idle';
    row.detailEdit.department = '';
  }

  hideCustodianDrop(row: AssetRow): void {
    setTimeout(() => {
      row.showCustodianDrop = false;
      if (!row.editCustodianId) row.custodianSearch = 'IT';
    }, 160);
  }

  onManagerFocus(row: AssetRow): void {
    if (!row.editManagerId) row.managerSearch = '';
    row.showManagerDrop    = true;
    row.managerSuggestions = this.employees;
  }

  onManagerInput(row: AssetRow): void {
    const q = row.managerSearch.trim();
    row.managerSuggestions = q
      ? this.employees.filter(e => e.name.includes(q) || e.department.includes(q))
      : this.employees;
  }

  selectManager(row: AssetRow, emp: EmployeeOption): void {
    row.editManagerId      = emp.employeeId;
    row.managerSearch      = emp.name;
    row.managerSuggestions = [];
    row.showManagerDrop    = false;
  }

  clearManager(row: AssetRow): void {
    row.editManagerId      = '';
    row.managerSearch      = 'IT';
    row.managerSuggestions = [];
    row.showManagerDrop    = false;
  }

  hideManagerDrop(row: AssetRow): void {
    setTimeout(() => {
      row.showManagerDrop = false;
      if (!row.editManagerId) row.managerSearch = 'IT';
    }, 160);
  }

  readonly siteOptions = [
    { code: 'WPT', label: '樹谷', value: '樹谷' },
    { code: 'WPN', label: '楠梓', value: '楠梓' },
    { code: 'WPY', label: '永安', value: '永安' }
  ];

  private readonly siteMap: Record<string, string> = {
    '樹谷': 'WPT', '楠梓': 'WPN', '永安': 'WPY', '越南': 'WPD'
  };

  getSiteCode(site: string | undefined): string {
    if (!site) return '-';
    return this.siteMap[site] ?? site;
  }

  readonly statusOptions = [
    { value: 'new',         label: '新品'  },
    { value: 'in_use',      label: '使用中' },
    { value: 'idle',        label: '閒置'  },
    { value: 'maintenance', label: '維修中' },
    { value: 'scrapped',    label: '停用'  }
  ];

  constructor(private assetService: AssetService, private router: Router) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.assetService.getEmployees().subscribe(e => {
      this.employees = e.filter(emp => !emp.department.startsWith('V'));
    });
    this.assetService.getAll().subscribe({
      next: assets => {
        this.rows = assets.map(a => ({
          ...a,
          editStatus:          a.status,
          editCustodianId:     a.custodianId ?? '',
          custodianSearch:     a.custodian?.name ?? 'IT',
          custodianSuggestions: [],
          showCustodianDrop:   false,
          editManagerId:       a.managerId ?? '',
          managerSearch:       a.manager?.name ?? 'IT',
          managerSuggestions:  [],
          showManagerDrop:     false,
          saving:              false,
          saved:               false,
          expanded:            false,
          detailEdit:          buildDetailEdit(a),
          detailSaving:        false,
          detailSaved:         false
        }));
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  toggleExpand(row: AssetRow): void {
    row.expanded = !row.expanded;
    if (row.expanded) {
      row.detailEdit = buildDetailEdit(row);
    }
  }

  cancelDetail(row: AssetRow): void {
    row.detailEdit = buildDetailEdit(row);
    row.expanded = false;
  }

  saveDetail(row: AssetRow): void {
    row.detailSaving = true;
    const d = row.detailEdit;
    const body: Record<string, unknown> = {
      assetNo:       d.assetNo       || null,
      computerName:  d.computerName  || null,
      purchaseDate:  d.purchaseDate  || null,
      spec:          d.spec          || null,
      lanMac:        d.lanMac        || null,
      wifiMac:       d.wifiMac       || null,
      assetType:     d.assetType     || null,
      purpose:       d.purpose       || null,
      site:          d.site          || null,
      department:    d.department    || null,
      custodianId:   d.custodianId   || null,
      managerId:     d.managerId     || null,
      dispatchDate:  d.dispatchDate  || null,
      notes:         d.notes         || null,
      officeVersion: d.officeVersion || null,
      osSerial:      d.osSerial      || null,
      status:        d.status
    };

    this.assetService.updateFull(row.assetId, body).subscribe({
      next: updated => {
        Object.assign(row, updated);
        row.editStatus       = updated.status;
        row.editCustodianId  = updated.custodianId ?? '';
        row.custodianSearch  = updated.custodian?.name ?? 'IT';
        row.editManagerId    = updated.managerId ?? '';
        row.managerSearch    = updated.manager?.name ?? 'IT';
        row.detailEdit       = buildDetailEdit(updated);
        row.detailSaving     = false;
        row.detailSaved      = true;
        setTimeout(() => { row.detailSaved = false; }, 2000);
      },
      error: () => { row.detailSaving = false; }
    });
  }

  update(row: AssetRow): void {
    row.saving = true;
    row.saved  = false;
    const d = row.detailEdit;
    const body: Record<string, unknown> = {
      assetNo:       d.assetNo      || null,
      computerName:  d.computerName || null,
      purchaseDate:  d.purchaseDate || null,
      spec:          d.spec         || null,
      lanMac:        d.lanMac       || null,
      wifiMac:       d.wifiMac      || null,
      assetType:     d.assetType    || null,
      purpose:       d.purpose      || null,
      site:          d.site         || null,
      department:    d.department   || null,
      custodianId:   row.editCustodianId || null,
      managerId:     row.editManagerId   || null,
      dispatchDate:  d.dispatchDate || null,
      notes:         d.notes        || null,
      officeVersion: d.officeVersion|| null,
      osSerial:      d.osSerial     || null,
      status:        row.editStatus
    };
    this.assetService.updateFull(row.assetId, body).subscribe({
      next: updated => {
        Object.assign(row, updated);
        row.editStatus      = updated.status;
        row.custodianSearch = updated.custodian?.name ?? '';
        row.editManagerId   = updated.managerId ?? '';
        row.managerSearch   = updated.manager?.name ?? '';
        row.detailEdit      = buildDetailEdit(updated);
        row.saving          = false;
        row.saved           = true;
        setTimeout(() => row.saved = false, 2000);
      },
      error: () => { row.saving = false; }
    });
  }

  getStatusLabel(status: string): string {
    return this.statusOptions.find(s => s.value === status)?.label ?? status;
  }

  copy(row: AssetRow): void {
    const d = row.detailEdit;
    this.router.navigate(['/assets/create'], {
      state: {
        prefill: {
          categoryId:    row.categoryId,
          computerName:  d.computerName,
          purchaseDate:  d.purchaseDate,
          spec:          d.spec,
          lanMac:        d.lanMac,
          wifiMac:       d.wifiMac,
          assetType:     d.assetType,
          purpose:       d.purpose,
          site:          d.site,
          department:    d.department,
          custodianId:   row.editCustodianId,
          custodianName: row.editCustodianId ? row.custodianSearch : '',
          managerId:     row.editManagerId,
          managerName:   row.editManagerId ? row.managerSearch : '',
          dispatchDate:  d.dispatchDate,
          notes:         d.notes,
          officeVersion: d.officeVersion,
          osSerial:      d.osSerial
        }
      }
    });
  }
}
