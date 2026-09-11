import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../core/services/auth.service';

interface EmployeeRow {
  employeeId: string;
  adAccount: string;
  name: string;
  department: string;
  isActive: boolean;
  role: string;
  saving?: boolean;
  saved?: boolean;
}

@Component({
  selector: 'app-personnel-list',
  templateUrl: './personnel-list.component.html',
  styleUrls: ['./personnel-list.component.scss']
})
export class PersonnelListComponent implements OnInit {
  employees: EmployeeRow[] = [];
  loading = false;

  filter = {
    employeeId: '',
    name:       '',
    department: '',
    status:     ''
  };

  get filteredEmployees(): EmployeeRow[] {
    const f = this.filter;
    return this.employees
      .filter(e => {
        if (f.employeeId && !e.employeeId.includes(f.employeeId))   return false;
        if (f.name       && !e.name.includes(f.name))               return false;
        if (f.department && !e.department.includes(f.department))   return false;
        if (f.status === 'active'   && !e.isActive)  return false;
        if (f.status === 'inactive' &&  e.isActive)  return false;
        return true;
      });
  }

  clearFilter(): void {
    this.filter = { employeeId: '', name: '', department: '', status: '' };
  }

  private readonly url = `${environment.apiUrl}/employees`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.loading = true;
    this.http.get<EmployeeRow[]>(`${this.url}?all=true`).subscribe({
      next: data => {
        this.employees = data.sort((a, b) => (a.role === 'admin' ? 0 : 1) - (b.role === 'admin' ? 0 : 1));
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  update(emp: EmployeeRow): void {
    emp.saving = true;
    emp.saved = false;
    this.http.put<EmployeeRow>(`${this.url}/${emp.employeeId}`, {
      name:       emp.name,
      department: emp.department,
      isActive:   emp.isActive,
      role:       emp.role
    }).subscribe({
      next: updated => {
        Object.assign(emp, updated);
        emp.saving = false;
        emp.saved  = true;
        setTimeout(() => emp.saved = false, 2000);
        if (emp.employeeId === this.authService.currentUser?.employeeId) {
          this.authService.patchCurrentUser({ role: emp.role });
        }
      },
      error: () => { emp.saving = false; alert('更新失敗'); }
    });
  }
}
