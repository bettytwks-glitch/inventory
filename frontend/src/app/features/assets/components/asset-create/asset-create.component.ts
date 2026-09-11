import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AssetService } from '../../../../core/services/asset.service';
import { AssetCategory, EmployeeOption } from '../../../../shared/models/asset.model';

@Component({
  selector: 'app-asset-create',
  templateUrl: './asset-create.component.html',
  styleUrls: ['./asset-create.component.scss']
})
export class AssetCreateComponent implements OnInit {
  form!: FormGroup;
  categories: AssetCategory[] = [];
  employees: EmployeeOption[] = [];

  loading = false;
  submitting = false;
  errorMsg = '';
  successMsg = '';
  lastAssetNo = '';

  custodianSearch = '';
  filteredCustodians: EmployeeOption[] = [];
  showCustodianDropdown = false;

  managerSearch = '';
  filteredManagers: EmployeeOption[] = [];
  showManagerDropdown = false;

  readonly siteOptions = ['WPN', 'WPY', 'WPT', 'WPD'];

  constructor(private fb: FormBuilder, private assetService: AssetService, private router: Router) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      categoryId:    [null],
      assetNo:       [''],
      computerName:  [''],
      purchaseDate:  [''],
      spec:          [''],
      lanMac:        [''],
      wifiMac:       [''],
      assetType:     [''],
      purpose:       [''],
      site:          [''],
      department:    [''],
      custodianId:   [''],
      managerId:     [''],
      dispatchDate:  [''],
      notes:         [''],
      officeVersion: [''],
      osSerial:      ['']
    });

    this.loading = true;
    forkJoin({
      categories: this.assetService.getCategories(),
      employees:  this.assetService.getEmployees()
    }).subscribe({
      next: ({ categories, employees }) => {
        this.categories = categories;
        this.employees  = employees.filter(e => !e.department.startsWith('V'));
        this.filteredCustodians = this.employees;
        this.filteredManagers   = this.employees;

        const prefill = history.state?.prefill;
        if (prefill) {
          this.form.patchValue({
            categoryId:    prefill.categoryId ?? (categories[0]?.categoryId ?? null),
            computerName:  prefill.computerName  ?? '',
            purchaseDate:  prefill.purchaseDate  ?? '',
            spec:          prefill.spec          ?? '',
            lanMac:        prefill.lanMac        ?? '',
            wifiMac:       prefill.wifiMac       ?? '',
            assetType:     prefill.assetType     ?? '',
            purpose:       prefill.purpose       ?? '',
            site:          prefill.site          ?? '',
            department:    prefill.department    ?? '',
            custodianId:   prefill.custodianId   ?? '',
            managerId:     prefill.managerId     ?? '',
            dispatchDate:  prefill.dispatchDate  ?? '',
            notes:         prefill.notes         ?? '',
            officeVersion: prefill.officeVersion ?? '',
            osSerial:      prefill.osSerial      ?? ''
          });
          this.custodianSearch = prefill.custodianName ?? '';
          this.managerSearch   = prefill.managerName   ?? '';
        } else if (categories.length > 0) {
          this.form.patchValue({ categoryId: categories[0].categoryId }, { emitEvent: false });
        }

        this.loading = false;
      },
      error: (err) => {
        this.errorMsg = `載入資料失敗（${err.status ?? 'Network Error'}），請確認後端是否正常運行`;
        this.loading = false;
      }
    });
  }

  /* ── 使用者 ── */
  onCustodianInput(event: Event): void {
    this.custodianSearch = (event.target as HTMLInputElement).value;
    this.form.patchValue({ custodianId: '' });
    const q = this.custodianSearch;
    this.filteredCustodians = q
      ? this.employees.filter(e => e.name.includes(q) || e.department.includes(q))
      : this.employees;
    this.showCustodianDropdown = true;
  }

  onCustodianFocus(): void {
    const q = this.custodianSearch;
    this.filteredCustodians = q
      ? this.employees.filter(e => e.name.includes(q) || e.department.includes(q))
      : this.employees;
    this.showCustodianDropdown = true;
  }

  onCustodianBlur(): void { setTimeout(() => { this.showCustodianDropdown = false; }, 150); }

  selectCustodian(emp: EmployeeOption): void {
    this.custodianSearch = emp.name;
    this.form.patchValue({ custodianId: emp.employeeId, department: emp.department });
    this.showCustodianDropdown = false;
  }

  clearCustodian(): void {
    this.custodianSearch = '';
    this.form.patchValue({ custodianId: '' });
    this.filteredCustodians = this.employees;
    this.showCustodianDropdown = false;
  }

  /* ── 管理人 ── */
  onManagerInput(event: Event): void {
    this.managerSearch = (event.target as HTMLInputElement).value;
    this.form.patchValue({ managerId: '' });
    const q = this.managerSearch;
    this.filteredManagers = q
      ? this.employees.filter(e => e.name.includes(q) || e.department.includes(q))
      : this.employees;
    this.showManagerDropdown = true;
  }

  onManagerFocus(): void {
    const q = this.managerSearch;
    this.filteredManagers = q
      ? this.employees.filter(e => e.name.includes(q) || e.department.includes(q))
      : this.employees;
    this.showManagerDropdown = true;
  }

  onManagerBlur(): void { setTimeout(() => { this.showManagerDropdown = false; }, 150); }

  selectManager(emp: EmployeeOption): void {
    this.managerSearch = emp.name;
    this.form.patchValue({ managerId: emp.employeeId });
    this.showManagerDropdown = false;
  }

  clearManager(): void {
    this.managerSearch = '';
    this.form.patchValue({ managerId: '' });
    this.filteredManagers = this.employees;
    this.showManagerDropdown = false;
  }

  submit(): void {
    this.submitting = true;
    this.errorMsg = '';
    this.successMsg = '';

    const val = this.form.value;
    const request = {
      categoryId:    val.categoryId    ? Number(val.categoryId) : 1,
      assetNo:       val.assetNo       || null,
      computerName:  val.computerName  || null,
      purchaseDate:  val.purchaseDate  || null,
      spec:          val.spec          || null,
      lanMac:        val.lanMac        || null,
      wifiMac:       val.wifiMac       || null,
      assetType:     val.assetType     || null,
      purpose:       val.purpose       || null,
      site:          val.site          || null,
      department:    val.department    || null,
      custodianId:   val.custodianId   || null,
      managerId:     val.managerId     || null,
      dispatchDate:  val.dispatchDate  || null,
      notes:         val.notes         || null,
      officeVersion: val.officeVersion || null,
      osSerial:      val.osSerial      || null,
      status:        val.custodianId   ? 'in_use' : 'new'
    };

    this.assetService.create(request).subscribe({
      next: (asset) => {
        this.lastAssetNo = asset.assetNo;
        this.successMsg = `資產新增成功！財產編號：${asset.assetNo}`;
        this.form.reset();
        this.custodianSearch = '';
        this.managerSearch   = '';
        this.filteredCustodians = this.employees;
        this.filteredManagers   = this.employees;
        if (this.categories.length > 0) {
          this.form.patchValue({ categoryId: this.categories[0].categoryId }, { emitEvent: false });
        }
        this.submitting = false;
      },
      error: (err) => {
        this.errorMsg = err.error?.message ?? '新增失敗，請確認資料';
        this.submitting = false;
      }
    });
  }

  cancel(): void { this.router.navigate(['/assets']); }
}