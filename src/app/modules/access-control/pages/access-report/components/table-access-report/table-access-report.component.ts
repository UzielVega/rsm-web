import { MessageService } from 'primeng/api';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewChild,
} from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  BehaviorSubject,
  catchError,
  of,
  Subject,
  take,
  takeUntil,
  throwError,
} from 'rxjs';
import { AccessesService } from '../../../../../../services';
import { Accesses } from '../../../../../../interfaces/accesses.interfaces';
import { Table } from 'primeng/table';

interface ExportColumn {
  title: string;
  dataKey: string;
}

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}
@Component({
  selector: 'app-table-access-report',
  templateUrl: './table-access-report.component.html',
  styleUrl: './table-access-report.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableAccessReportComponent {
  public destroy$ = new Subject<void>();
  public dialog: DynamicDialogRef | undefined;
  private messageService = inject(MessageService);
  private accessesService = inject(AccessesService);
  public accesses$ = new BehaviorSubject<Accesses[]>([]);
  public accesses: Accesses[] = [];
  public loading: boolean = false;

  cols!: Column[];
  exportColumns!: ExportColumn[];
  initialDate: Date | undefined;
  finalDate: Date | undefined;

  @ViewChild('dt') table!: Table;

  constructor() {}

  ngOnInit(): void {
    this.columsConfig();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  columsConfig() {
    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'accessType.name', header: 'Tipo/Acceso' },
      { field: 'tag.code', header: 'Código' },
      { field: 'tag.vehicle.plate', header: 'Placa' },
      { field: 'house.name', header: 'Casa' },
      { field: 'reader', header: 'Lector' },
      { field: 'date', header: 'Fecha' },
      { field: 'time', header: 'Hora' },
      { field: 'isAuthorized', header: 'Autorizado' },
    ];
    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
  }
  exportCSV(): void {
    this.table.filter(this.accesses, 'global', 'contains');
    this.table.exportCSV();
    this.initialDate = undefined;
    this.finalDate = undefined;
    this.accesses$.next([]);
    this.accesses = [];

  }
  clear(): void {
    this.accesses$.next([]);
    this.accesses = [];
    this.initialDate = undefined;
    this.finalDate = undefined;
  }
  generateReport() {
    this.accesses$.next([]);
    this.accesses = [];
    this.loading = true;
    if (this.initialDate === undefined || this.finalDate === undefined) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor, seleccione una fecha inicial y final',
      });
      this.loading = false;
      return;
    }
    this.accessesService
      .getAccessesByDate(this.initialDate!, this.finalDate!)
      .pipe(
        catchError((err) => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error.message,
          });
          takeUntil(this.destroy$);
         
          return throwError(() => err);
        })
      )
      .subscribe({
        next: (accesses) => {
          setTimeout(() => {
            this.loading = false;
            this.accesses$.next(accesses);
            this.accesses = accesses;
          }, 1500);
        },
      });
  }
}
