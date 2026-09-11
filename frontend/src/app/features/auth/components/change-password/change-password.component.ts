import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  form: FormGroup;
  errorMsg = '';
  successMsg = '';
  loading = false;
  isForced = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.isForced = authService.mustChangePassword;
    this.form = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirm:     ['', Validators.required]
    }, { validators: this.passwordMatch });
  }

  private passwordMatch(g: AbstractControl) {
    return g.get('newPassword')?.value === g.get('confirm')?.value
      ? null : { mismatch: true };
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMsg = '';

    const { oldPassword, newPassword } = this.form.value;
    this.authService.changePassword(oldPassword, newPassword).subscribe({
      next: () => {
        this.successMsg = '密碼已更新，即將跳轉…';
        setTimeout(() => this.router.navigate(['/inventory']), 1500);
      },
      error: (err) => {
        this.errorMsg = err.error?.message ?? '修改失敗，請再試一次';
        this.loading = false;
      }
    });
  }

  logout(): void { this.authService.logout(); }
}