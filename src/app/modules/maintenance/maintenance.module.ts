import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaintenanceRoutingModule } from './maintenance-routing.module';
import { ControlComponent } from './pages/control/control.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { PrimengModule } from '../../primeng/primeng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableControlComponent } from './pages/control/components/table-control/table-control.component';
import { FormCreateMaintenanceComponent } from './pages/control/components/forms/form-create-maintenance/form-create-maintenance.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarControlComponent } from './pages/control/components/calendar-control/calendar-control.component';
import { MaintenanceComponent } from './maintenance.component'; // Importar FullCalendarModule
import { SidebarModule } from 'primeng/sidebar';


@NgModule({
  declarations: [
    ControlComponent,
    ReportsComponent,
    TableControlComponent,
    FormCreateMaintenanceComponent,
    CalendarControlComponent,
    MaintenanceComponent,
  ],
  imports: [
    CommonModule,
    MaintenanceRoutingModule,
    PrimengModule,
    FormsModule,
    ReactiveFormsModule,
    FullCalendarModule,
  ],
  providers: [DialogService, ConfirmationService, MessageService],
})
export class MaintenanceModule {}
