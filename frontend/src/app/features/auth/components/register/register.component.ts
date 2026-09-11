import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  form: FormGroup;
  errorMsg = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      employeeId: ['', Validators.required],
      name: ['', Validators.required],
      department: ['', Validators.required],
      adAccount: ['', Validators.required],
      email: ['', Validators.email],
      site: ['']
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMsg = '';

    this.authService.register(this.form.value).subscribe({
      next: () => this.router.navigate(['/inventory']),
      error: (err) => {
        this.errorMsg = err.error?.message ?? '註冊失敗，請確認資料是否重複';
        this.loading = false;
      }
    });
  }
}
