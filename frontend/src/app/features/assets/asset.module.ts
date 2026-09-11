import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AssetCreateComponent } from './components/asset-create/asset-create.component';
import { AssetListComponent } from './components/asset-list/asset-list.component';
import { AssetReportComponent } from './components/asset-report/asset-report.component';

const routes: Routes = [
  { path: 'list',   component: AssetListComponent },
  { path: 'create', component: AssetCreateComponent },
  { path: 'report', component: AssetReportComponent },
  { path: '', redirectTo: 'list', pathMatch: 'full' }
];

@NgModule({
  declarations: [AssetCreateComponent, AssetListComponent, AssetReportComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class AssetModule {}
