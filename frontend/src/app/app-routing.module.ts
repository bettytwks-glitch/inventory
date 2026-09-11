import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'inventory',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'inventory',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/inventory/inventory.module').then(m => m.InventoryModule)
  },
  {
    path: 'assets',
    canActivate: [AuthGuard, AdminGuard],
    loadChildren: () =>
      import('./features/assets/asset.module').then(m => m.AssetModule)
  },
  {
    path: 'personnel',
    canActivate: [AuthGuard, AdminGuard],
    loadChildren: () =>
      import('./features/personnel/personnel.module').then(m => m.PersonnelModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
