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
  StreetService,
} from '../../../../../../services';
import { MessageService } from 'primeng/api';
import { House, Street } from '../../../../../../interfaces';
import { catchError, Subject, throwError } from 'rxjs';

@Component({
  selector: 'app-update-streets',
  templateUrl: './update-streets.component.html',
  styleUrl: './update-streets.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateStreetsComponent {
  public destroy$ = new Subject<void>();
  public dialog = inject(DynamicDialogRef);
  public dialogConfig = inject(DynamicDialogConfig);
  public data = signal<Street>(this.dialogConfig.data.street);
  public type = signal<string>(this.dialogConfig.data.type);
  public houses = signal<House[]>(this.dialogConfig.data.houses);
  private fb = inject(FormBuilder);
  private streetService = inject(StreetService);
  private socketService = inject(SocketsService);
  private messageService = inject(MessageService);
  private formsService = inject(FormService);

  public form!: FormGroup;

  constructor() {}

  ngOnInit() {
    this.buildForms();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  buildForms() {
    switch (this.type()) {
      case 'update':
        this.form = this.fb.group({
          name: [
            { value: this.data().name, disabled: true },
            [Validators.required, Validators.minLength(3)],
          ],
          description: [{ value: this.data().description, disabled: true }],
        });
        break;
      case 'update-admin':
        this.form = this.fb.group({
          houseId: ['', [Validators.required]],
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
    if (this.form.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Formulario invalido',
        detail: 'Por favor, rellene los campos correctamente',
        life: 2000,
      });
      return;
    }
    const data = this.form.value;

    this.streetService
      .update(data, this.data().id!)
      .pipe(
        catchError((err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Ocurrio un error',
            detail: err.error.message,
            life: 2000,
          });
          return throwError(() => err);
        })
      )
      .subscribe({
        next: (street) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Calle actualizada',
            detail: 'La calle fue actualizada correctamente',
            life: 2000,
          });
          this.dialog.close(street);
          this.socketService.emit('street:updated', street);
        },
      });
  }

  adminUpdate():void {
    if (this.form.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Formulario invalido',
        detail: 'Por favor, rellene los campos correctamente',
        life: 2000,
      });
      return;
    }
    const data = this.form.value;

    this.streetService
      .adminUpdate(data, this.data().id!)
      .pipe(
        catchError((err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Ocurrio un error',
            detail: err.error.message,
            life: 2000,
          });
          return throwError(() => err);
        })
      )
      .subscribe({
        next: (street) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Calle actualizada',
            detail: 'La calle fue actualizada correctamente',
            life: 2000,
          });
          this.dialog.close(street);
          this.socketService.emit('street:updated', street);
        },
      });
  }
}
