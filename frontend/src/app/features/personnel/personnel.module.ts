import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PersonnelListComponent } from './components/personnel-list/personnel-list.component';

const routes: Routes = [
  { path: '', component: PersonnelListComponent }
];

@NgModule({
  declarations: [PersonnelListComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule.forChild(routes)]
})
export class PersonnelModule {}
