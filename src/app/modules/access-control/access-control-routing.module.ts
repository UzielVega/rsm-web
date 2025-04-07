import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessControlComponent } from './pages/access-control/access-control.component';
import { MainComponent } from './pages/main/main.component';
import { AccessReportComponent } from './pages/access-report/access-report.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { VisitControlComponent } from './pages/visit-control/visit-control.component';
import { VisitReportComponent } from './pages/visit-report/visit-report.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path:'',
        component: DashboardComponent,
      },
      {
        path: 'access-control',
        component: AccessControlComponent,
      },
      {
        path: 'access-report',
        component: AccessReportComponent,
      },
      {
        path:'visit-control',
        component: VisitControlComponent
      },
      {
        path:'visit-report',
        component:VisitReportComponent
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccessControlRoutingModule {}
