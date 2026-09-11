import { Component } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { CurrentUser } from './shared/models/employee.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = '庫存管理系統';
  currentUser$: Observable<CurrentUser | null>;

  constructor(public authService: AuthService) {
    this.currentUser$ = authService.currentUser$;
  }
}
