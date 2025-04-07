import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ControlComponent } from './pages/control/control.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { MaintenanceComponent } from './maintenance.component';

const routes: Routes = [
  {
    path:'',
    component:MaintenanceComponent,
    children:[
      {
        path:'control',
        component:ControlComponent
      },
      {
        path:'reports',
        component:ReportsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenanceRoutingModule { }
