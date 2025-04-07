import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { Message, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  ConfigurationService,
  MaintenanceService,
  SocketsService,
  StreetService,
} from '../../../../services';
import { Configuration, House, Street } from '../../../../interfaces';
import { FormCreateMaintenanceComponent } from './components/forms/form-create-maintenance/form-create-maintenance.component';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrl: './control.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlComponent {
  public dialogService = inject(DialogService);
  private streetService = inject(StreetService);
  private maintenanceService = inject(MaintenanceService);
  private socketService = inject(SocketsService);
  public messageService = inject(MessageService);
  public houses = signal<House[] | undefined>(undefined);
  public configurationService = inject(ConfigurationService);
  public configurations = signal<Configuration[] | undefined>(undefined);
  public house = signal<House | undefined>(undefined);
  public street = signal<Street | undefined>(undefined);
  public ref: DynamicDialogRef | undefined;
  public streets = signal<Street[] | undefined>(undefined);
  public messages = signal<Message[]>([]);
  public paid = signal<number>(0);
  public notPaid = signal<number>(0);
  data: any;
  sidebarVisible: boolean = false;
  options: any;
  basicData: any;

  basicOptions: any;

  maintenancePrice = signal<number>(0);
  maintenancePeriod = signal<string>('');

  constructor() {
    effect(() => {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');

      this.data = {
        labels: ['Pagado', 'No Pagado'],
        datasets: [
          {
            data: [this.paid(), this.notPaid()],
            backgroundColor: [
              documentStyle.getPropertyValue('--green-400'),
              documentStyle.getPropertyValue('--red-400'),
            ],
            hoverBackgroundColor: [
              documentStyle.getPropertyValue('--green-300'),
              documentStyle.getPropertyValue('--red-300'),
            ],
          },
        ],
      };

      this.options = {
        cutout: '60%',
        plugins: {
          legend: {
            labels: {
              color: textColor,
            },
          },
        },
      };
    });
  }

  ngOnInit() {
    this.getConfiguration();
    this.showCharts();
    this.getStreets();
    this.socketService.listen('response-update-data').subscribe({
      next:()=>this.showHouses(this.street()!)
    })
  }

  getConfiguration() {
    this.configurationService.getAll().subscribe({
      next: (configurations) => {
        configurations.forEach((data) => {
          if (data.key === 'price_maintenance') {
            this.maintenancePrice.set(parseInt(data.value!));
          } else if (data.key === 'period_maintenance') {
            this.maintenancePeriod.set(data.value!);
          }
        });
      },
    });
  }

  getStreets() {
    this.streetService.getAll().subscribe({
      next: (streets) => this.streets.set(streets),
      error: (error: any) => {},
    });
  }

  openConfig() {
    this.sidebarVisible = true;
  }

  public showCharts() {
    this.maintenanceService.getAll().subscribe({
      next: (data) => {
        this.houses.set(data.houses)
        this.paid.set(data.counts.paidCount);
        this.notPaid.set(data.counts.notPaidCount);
      },
    });
  }

  public showHouses(street: Street): void {
    if (!street) return;
    this.houses.set(undefined);
    this.maintenanceService.getByStreet(street.id!).subscribe({
      next: (data) => {
        this.houses.set(data.houses);
        this.paid.set(data.counts.paidCount);
        this.notPaid.set(data.counts.notPaidCount);
      },
      error: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'No existen Casas en la Calle seleccionada.',
        });
      },
    });
  }

  openNew() {
    this.ref = this.dialogService.open(FormCreateMaintenanceComponent, {
      header: 'Pago de Mantenimiento',
      data: {
        maintenancePrice: this.maintenancePrice(),
        maintenancePeriod: this.maintenancePeriod(),
      },
      contentStyle: { overflow: 'auto' },
      
    });
  }
}
