import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import {
  ConfigurationService,
  HouseService,
  MaintenanceService,
  SocketsService,
  StreetService,
  TicketPdfService,
} from '../../../../../../../services';
import { Message, MessageService } from 'primeng/api';
import {
  House,
  Maintenance,
  PaymentMethod,
  Street,
} from '../../../../../../../interfaces';
import { catchError, Observable, of, throwError } from 'rxjs';
import { PaymentMethodService } from '../../../../../../../services/payment-method.service';

@Component({
  selector: 'app-form-create-maintenance',
  templateUrl: './form-create-maintenance.component.html',
  styleUrl: './form-create-maintenance.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormCreateMaintenanceComponent {
  private dialogConfig = inject(DynamicDialogConfig);
  private houseService = inject(HouseService);
  private paymentMethodService = inject(PaymentMethodService);
  private messageService = inject(MessageService);
  private socketService = inject(SocketsService);
  public configurationService = inject(ConfigurationService);
  private ticketPdfService = inject(TicketPdfService);
  private streetService = inject(StreetService);
  private maintenanceService = inject(MaintenanceService);

  maintenancePrice: number = 0;
  maintenancePeriod: string = '';

  streets$!: Observable<Street[]>;
  paymentMethods$!: Observable<PaymentMethod[]>;
  data = signal<any>(this.dialogConfig.data);
  houses = signal<House[] | undefined>(undefined);
  selectedStreet = signal<Street | undefined>(undefined);
  selectedHouse = signal<House | undefined>(undefined);
  selectedPaymentMethod!: any;
  messages = signal<Message[]>([]);
  maxDateCount!: number;
  dates: Date[] | undefined;
  paymentDate = new Date();
  startDate!: Date | undefined;
  maxDate!: Date | undefined;
  endDate!: Date;
  maintenanceTotal = computed<number>(
    () => this.maintenancePrice * this.maxDateCount
  );

  getConfiguration() {
    this.configurationService
      .getAll()
      .pipe(
        catchError(() => {
          this.messageService.add({
            severity: 'error',
            detail: 'Error al cargar configuraciones',
          });
          return of([]); // Devolver un array vacío en caso de error
        })
      )
      .subscribe({
        next: (configurations) => {
          configurations.forEach((data) => {
            switch (data.key) {
              case 'price_maintenance':
                this.maintenancePrice = parseInt(data.value!);
                break;
              case 'period_maintenance':
                this.maintenancePeriod = data.value!;
                break;

              default:
                break;
            }
          });
          this.configSelectionMonths();
        },
      });
  }

  constructor() {}

  ngOnInit(): void {
    this.getConfiguration();
    this.loadPaymentMethods();
    this.loadStreets();
    this.socketService.listen('response-update-data').subscribe({
      next: () => this.showHouses(this.selectedStreet()!),
    });
  }

  loadStreets(): void {
    this.streets$ = this.streetService.getAll().pipe(
      catchError(() => {
        this.messageService.add({
          severity: 'error',
          detail: 'Error al cargar calles',
        });
        return of([]); // Devolver un array vacío en caso de error
      })
    );
  }

  loadPaymentMethods(): void {
    this.paymentMethods$ = this.paymentMethodService.getAll().pipe(
      catchError(() => {
        this.messageService.add({
          severity: 'error',
          detail: 'Error al cargar los Metodos de Pago',
        });
        return of([]); // Devolver un array vacío en caso de error
      })
    );
  }

  configSelectionMonths() {
    const periodMap: { [key: string]: number } = {
      mensual: 1,
      bimestral: 2,
      trimestral: 3,
      semestral: 6,
      anual: 12,
    };

    const maxCount = periodMap[this.maintenancePeriod];

    this.maxDateCount = maxCount;
  }

  showMonths() {
    console.log(this.dates);
    
    const fechas = this.ajustarFechaFinal(this.dates!);
    this.startDate = fechas[0];
    this.endDate = fechas[1];
    if (this.startDate) {
      this.maxDate = new Date(
        this.startDate.getFullYear(),
        this.startDate.getMonth() + 1
      );
    }
  }

  showHouses(street: Street): void {
    if (!street) return;
    this.houses.set(undefined);
    this.houseService
      .getByStreet(street.id!)
      .pipe(
        catchError((error) => {
          this.messages.set([
            {
              severity: 'warn',
              summary: 'No existen Casas en la Calle seleccionada.',
            },
          ]);
          return of([]);
        })
      )
      .subscribe((houses) => this.houses.set(houses));
  }

  resetSelections(): void {
    this.houses.set(undefined);
    this.selectedHouse.set(undefined);
    this.selectedStreet.set(undefined);
    this.dates = undefined;
    this.maxDate = undefined;
    this.startDate = undefined;

  }

  ajustarFechaFinal(fechas: Date[]): Date[] {
    if (fechas) {
      const fechaInicial = fechas[0];
      const fechaFinal = fechas[1];

      // Verifica si la fecha final es el día 1 de algún mes
      if (fechaFinal) {
        if (fechaFinal.getDate() === 1) {
          // Reemplaza la fecha final por el último día del mes anterior
          fechas[1] = this.getUltimoDiaDelMes(fechaFinal);
        }
      }

      return fechas;
    }
    return [];
  }

  getUltimoDiaDelMes(fecha: Date): Date {
    const año = fecha.getFullYear();
    const mes = fecha.getMonth() + 1; // Los meses van de 0 (enero) a 11 (diciembre), así que sumamos 1 para el mes correcto
    const ultimoDia = new Date(año, mes, 0); // El día 0 del siguiente mes nos da el último día del mes actual
    return ultimoDia;
  }

  create(): void {
    const selectedHouseUuid = this.selectedHouse()?.id;
    if (!selectedHouseUuid) return;

    const data: Maintenance = {
      houseId: selectedHouseUuid,
      amount: this.maintenanceTotal(),
      paymentDate: this.paymentDate.toDateString(),
      startDate: this.startDate!.toDateString(),
      endDate: this.endDate.toDateString(),
      period: this.maintenancePeriod,
      paymentMethodUuid: this.selectedPaymentMethod.uuid,
    };

    console.log(data);

    this.maintenanceService.create(data).pipe(
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error al registrar el pago',
          detail: err.error.message,
        });
        return throwError(() => err);
      })
    ).subscribe({
      next: (maintenance) => {
        console.log(maintenance);
        this.messageService.add({
          severity: 'success',
          summary: 'Mantenimiento Pagado',
        });

        this.socketService.emit('request-update-data');
        this.ticketPdfService.generateTicket(maintenance);
      }
    });
  }
}
