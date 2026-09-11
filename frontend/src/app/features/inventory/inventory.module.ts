import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { InventoryListComponent } from './components/inventory-list/inventory-list.component';

const routes: Routes = [
  { path: '', component: InventoryListComponent }
];

@NgModule({
  declarations: [InventoryListComponent],
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class InventoryModule {}
