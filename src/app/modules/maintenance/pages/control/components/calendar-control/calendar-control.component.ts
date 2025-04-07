import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import multiMonthPlugin from '@fullcalendar/multimonth';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Maintenance } from '../../../../../../interfaces';
import { Subscription } from 'rxjs';

interface Event {
  title: string;
  start: string;
  end: string;
  color: string;
}

@Component({
  selector: 'app-calendar-control',
  templateUrl: './calendar-control.component.html',
  styleUrl: './calendar-control.component.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class CalendarControlComponent {
  public dialog = inject(DynamicDialogRef);
  public dialogConfig = inject(DynamicDialogConfig);
  public data = signal<Maintenance[]>(
    this.dialogConfig.data.maintenancePayments
  );
  public type = signal<string>(this.dialogConfig.data.type);
  subscription: Subscription = new Subscription();
  events: Event[] = [];
  constructor() {}

  ngOnInit() {
    this.data().forEach((data) => {
      this.events.push({
        title: 'Pagado',
        start: data.startDate!,
        end:data.endDate!,
        color: 'green',
      });
    });
    
  }

  title = 'Calendario de Pagos de Mantenimiento';

  // Definir las opciones del calendario
  calendarOptions: CalendarOptions = {
    plugins: [multiMonthPlugin], // Plugin para mostrar en vista mensual
    initialView: 'multiMonthYear', // Vista predeterminada

    multiMonthMinWidth: 100,
    multiMonthMaxColumns: 3,

    headerToolbar: {
      left: 'prev,next today',
      center: 'title', // Vista del mes
      right: '',
    },
    events:this.events,
    showNonCurrentDates: false, // Ocultar días fuera del mes actual
    displayEventTime: false, // No mostrar hora de los eventos
    fixedWeekCount: false, // Mostrar solo las semanas reales del mes
    dayHeaderFormat: { weekday: 'narrow' }, // Formato de encabezado de días (abreviado)
    contentHeight: 'auto', // Ajustar altura del calendario automáticamente
  };
}
