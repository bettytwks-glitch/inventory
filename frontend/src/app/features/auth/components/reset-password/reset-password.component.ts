import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  form: FormGroup;
  token = '';
  errorMsg = '';
  successMsg = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirm:     ['', Validators.required]
    }, { validators: this.passwordMatch });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
    if (!this.token) this.errorMsg = '無效的重設連結';
  }

  private passwordMatch(g: AbstractControl) {
    return g.get('newPassword')?.value === g.get('confirm')?.value
      ? null : { mismatch: true };
  }

  submit(): void {
    if (this.form.invalid || !this.token) return;
    this.loading = true;
    this.errorMsg = '';

    const { newPassword } = this.form.value;
    this.authService.resetPassword(this.token, newPassword).subscribe({
      next: (res) => {
        this.successMsg = res.message;
        setTimeout(() => this.router.navigate(['/auth/login']), 2000);
      },
      error: (err) => {
        this.errorMsg = err.error?.message ?? '重設失敗，請重新申請';
        this.loading = false;
      }
    });
  }
}