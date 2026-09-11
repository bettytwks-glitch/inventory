import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  form: FormGroup;
  errorMsg = '';
  successMsg = '';
  loading = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.form = this.fb.group({ employeeId: ['', Validators.required] });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';

    this.authService.forgotPassword(this.form.value.employeeId).subscribe({
      next: (res) => { this.successMsg = res.message; this.loading = false; },
      error: (err) => {
        this.errorMsg = err.error?.message ?? '申請失敗，請再試一次';
        this.loading = false;
      }
    });
  }
}