import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccessControlRoutingModule } from './access-control-routing.module';
import { AccessControlComponent } from './pages/access-control/access-control.component';
import { PrimengModule } from '../../primeng/primeng.module';
import { TableLogsComponent } from './pages/access-control/components/table-logs/table-logs.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogValidateVisitsComponent } from './pages/access-control/components/dialog-validate-visits/dialog-validate-visits.component';
import { DialogService } from 'primeng/dynamicdialog';
import { AccessesService } from '../../services';
import { AccessReportComponent } from './pages/access-report/access-report.component';
import { MainComponent } from './pages/main/main.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TableAccessReportComponent } from './pages/access-report/components/table-access-report/table-access-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VisitControlComponent } from './pages/visit-control/visit-control.component';
import { VisitReportComponent } from './pages/visit-report/visit-report.component';
import { TableVisitControlComponent } from './pages/visit-control/components/table-visit-control/table-visit-control.component';
import { TableVisitReportComponent } from './pages/visit-report/components/table-visit-report/table-visit-report.component';

@NgModule({
  declarations: [
    AccessControlComponent,
    DialogValidateVisitsComponent,
    TableLogsComponent,
    AccessReportComponent,
    MainComponent,
    DashboardComponent,
    TableAccessReportComponent,
    VisitControlComponent,
    VisitReportComponent,
    TableVisitControlComponent,
    TableVisitReportComponent,

  ],
  imports: [CommonModule, AccessControlRoutingModule, PrimengModule, FormsModule,
    ReactiveFormsModule],
  providers: [
    MessageService,
    ConfirmationService,
    DialogService,
    AccessesService
  ],
})
export class AccessControlModule {}
