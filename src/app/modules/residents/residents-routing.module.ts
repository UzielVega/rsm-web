import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResidentsComponent } from './residents.component';
import { VisitsComponent } from './pages/visits/visits.component';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  {
    path: '', 
    component: ResidentsComponent,
    children: [
      {
        path: '',
        component:HomeComponent
      },
      {
        path: 'visits',
        component:VisitsComponent
      }
    ]
  
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResidentsRoutingModule { }
