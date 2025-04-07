import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  FormService,
  HouseService,
  SocketsService,
  StreetService,
  VehicleService,
} from '../../../../../../services';
import { Message, MessageService } from 'primeng/api';
import { House, Street } from '../../../../../../interfaces';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-create-vehicles',
  templateUrl: './create-vehicles.component.html',
  styleUrl: './create-vehicles.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateVehiclesComponent {
  private dialog = inject(DynamicDialogRef);
  private fb = inject(FormBuilder);
  private streetService = inject(StreetService);
  private houseService = inject(HouseService);
  private vehicleService = inject(VehicleService);
  private socketService = inject(SocketsService);
  private messageService = inject(MessageService);
  private formService = inject(FormService);
  private dialogConfig = inject(DynamicDialogConfig);

  public data = signal<any>(this.dialogConfig.data);
  public streets = signal<Street[] | undefined>(undefined);
  public street: Street | undefined;
  public houses = signal<House[] | undefined>(undefined);
  public house: House | undefined;
  public form!: FormGroup;

  constructor() {
    this.loadStreets();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      houseId: ['', Validators.required],
      plate: [
        '',
        [Validators.required, Validators.minLength(6), Validators.maxLength(7)],
      ],
      brand: ['', Validators.required],
      model: ['', Validators.required],
      modelYear: ['', Validators.required],
      color: ['', Validators.required],
    });
  }

  private loadStreets(): void {
    this.streetService.getAll().subscribe({
      next: (streets) => this.streets.set(streets),
      error: () => {
        this.messageService.add({
          severity: 'error',
          detail: 'Error al cargar calles',
        });
      },
    });
  }

  public showHouses(street: Street): void {
    if (!street) return;

    this.houses.set(undefined);
    this.houseService.getByStreet(street.id!).subscribe({
      next: (houses) => this.houses.set(houses),
      error: () => {
        this.resetSelections();
      },
    });
  }

  public resetSelections(): void {
    this.house = undefined;
    this.street = undefined;
    this.form.reset();
  }

  public getErrorMessage(controlName: string): string | null {
    return this.formService.getErrorMessage(this.form, controlName);
  }

  assignId(house: House): void {
    this.form.get('houseId')?.setValue(house.id);
  }
  public create(): void {
    const selectedHouseUuid = this.house?.id;
    if (!selectedHouseUuid) return;

    this.form.get('house')?.setValue(selectedHouseUuid);
    this.vehicleService
      .create(this.form.value)
      .pipe(
        catchError((err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error al crear el vehículo',
            detail: err.error.message,
          });
          return throwError(() => err);
        })
      )
      .subscribe({
        next: (vehicleCreated) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Vehículo creado',
          });
          this.socketService.emit('vehicle:added', vehicleCreated);
     
        },
      });
  }
}
