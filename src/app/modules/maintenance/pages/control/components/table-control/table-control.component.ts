import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { AuthService, MaintenanceService } from '../../../../../../services';
import { MessageService } from 'primeng/api';
import { Button, House, Street } from '../../../../../../interfaces';

import { CalendarControlComponent } from '../calendar-control/calendar-control.component';
import { Table } from 'primeng/table';
import { FormCreateMaintenanceComponent } from '../forms/form-create-maintenance/form-create-maintenance.component';

@Component({
  selector: 'app-table-control',
  templateUrl: './table-control.component.html',
  styleUrl: './table-control.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableControlComponent {
  public dialog: DynamicDialogRef | undefined;
  private dialogService = inject(DialogService);
  public maintenanceService = inject(MaintenanceService);
  private messageService = inject(MessageService);
  public authService = inject(AuthService);
  public houses = input<House[]>();
  public street = input<Street>();

  searchValue: string | undefined;

  public buttons: Button[] = [
    {
      icon: 'pi pi-calendar',
      severity: 'primary',
      id: 'view-qrcode',
      tooltip: 'Historico',
      expectedRoles: ['super-admin', 'admin'],
      tooltipPosition: 'bottom',
      action: (house: House) => this.openCalendar(house),
    },
  ];
  constructor() {}

  clear(table: Table) {
    table.clear();
    this.searchValue = '';
  }

  add() {
    this.dialog = this.dialogService.open(FormCreateMaintenanceComponent, {
      header: 'Registrar Pago',
      width: '90%',
      modal: true,
      maximizable: true,
      
      data: { type: 'create', street: this.street },
      contentStyle: { overflow: 'auto' },
    });
  }

  openCalendar(house: House) {
    this.maintenanceService.getByHouse(house.id!).subscribe({
      next: (maintenancePayments) => {
        this.dialog = this.dialogService.open(CalendarControlComponent, {
          header: 'Pagos de Mantenimiento',
          data: { maintenancePayments },
          width: '950px',
          contentStyle: { overflow: 'auto' },
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'warn',
          summary: 'No hay pagos de mantenimiento',
        });
      },
    });
  }
}
