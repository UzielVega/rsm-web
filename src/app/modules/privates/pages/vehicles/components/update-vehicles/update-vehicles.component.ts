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
  SocketsService,
  VehicleService,
} from '../../../../../../services';
import { MessageService } from 'primeng/api';
import { House, Vehicle } from '../../../../../../interfaces';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-update-vehicles',
  templateUrl: './update-vehicles.component.html',
  styleUrl: './update-vehicles.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateVehiclesComponent {
  private _fb = inject(FormBuilder);
  private socketService = inject(SocketsService);
  private vehicleService = inject(VehicleService);
  private messageService = inject(MessageService);
  private formsService = inject(FormService);
  public dialog = inject(DynamicDialogRef);
  public dialogConfig = inject(DynamicDialogConfig);
  public data = signal<Vehicle>(this.dialogConfig.data.vehicle);
  public type = signal<string>(this.dialogConfig.data.type);
  public houses = signal<House[]>(this.dialogConfig.data.houses);
  public form!: FormGroup;

  id: number = this.data().id!;

  constructor() {}

  ngOnInit() {
    this.buildForms();
  }
  buildForms() {
    switch (this.type()) {
      case 'update':
        this.form = this._fb.group({
          plate: [
            { value: this.data().plate, disabled: true },
            [Validators.required, Validators.minLength(6)],
          ],
          brand: [
            { value: this.data().brand, disabled: true },
            [Validators.required],
          ],
          model: [
            { value: this.data().model, disabled: true },
            [Validators.required],
          ],
          modelYear: [
            { value: this.data().modelYear?.toString(), disabled: true },
            [Validators.required],
          ],
          color: [
            { value: this.data().color, disabled: true },
            [Validators.required],
          ],
        });

        break;
      default:
        break;
    }
  }

  getErrorMessage(controlName: string): string | null {
    return this.formsService.getErrorMessage(this.form, controlName);
  }

  enableInput(controlName: string[]) {
    controlName.forEach((name) => {
      this.form.get(name)?.enable();
    });
  }

  update() {
    const data = this.form.value;

    this.vehicleService
      .update(data, this.id)
      .pipe(
        catchError((err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar vehiculo.',
            life: 2000,
          });
          return throwError(() => err);
        })
      )
      .subscribe({
        next: (vehicleUpdated) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Actualizado',
            detail: 'Vehiculo Actualizado.',
            life: 2000,
          });
          this.dialog.close();
          this.form.reset();
          this.socketService.emit('vehicle:updated', vehicleUpdated);
        },
      });
  }
}
