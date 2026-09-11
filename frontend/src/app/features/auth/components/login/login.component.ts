import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form: FormGroup;
  errorMsg = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    const remembered = localStorage.getItem('remember_account') ?? '';
    this.form = this.fb.group({
      employeeId:      [remembered, Validators.required],
      password:        ['', Validators.required],
      rememberAccount: [!!remembered]
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMsg = '';

    const { employeeId, password, rememberAccount } = this.form.value;
    if (rememberAccount) {
      localStorage.setItem('remember_account', employeeId);
    } else {
      localStorage.removeItem('remember_account');
    }

    this.authService.login({ employeeId, password }).subscribe({
      next: (res) => {
        if (res.mustChangePassword) {
          this.router.navigate(['/auth/change-password']);
        } else {
          this.router.navigate(['/inventory']);
        }
      },
      error: (err) => {
        this.errorMsg = err.error?.message ?? '登入失敗，請確認工號或密碼';
        this.loading = false;
      }
    });
  }
}