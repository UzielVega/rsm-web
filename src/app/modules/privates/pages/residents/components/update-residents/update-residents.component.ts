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
  ResidentService,
  SocketsService,
} from '../../../../../../services';
import { MessageService } from 'primeng/api';
import { Resident } from '../../../../../../interfaces';
import { catchError, Subject, Subscription, takeUntil, throwError } from 'rxjs';

@Component({
  selector: 'app-update-residents',
  templateUrl: './update-residents.component.html',
  styleUrl: './update-residents.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateResidentsComponent {
  private destroy$ = new Subject<void>();
  private fb = inject(FormBuilder);
  private socketService = inject(SocketsService);
  private messageService = inject(MessageService);
  private formsService = inject(FormService);
  private residentService = inject(ResidentService);
  public dialog = inject(DynamicDialogRef);
  public dialogConfig = inject(DynamicDialogConfig);
  public data = signal<Resident>(this.dialogConfig.data.resident);
  public type = signal<string>(this.dialogConfig.data.type);

  public form = signal<FormGroup>(this.fb.group({}));

  constructor() {}

  ngOnInit(): void {
    this.buildForms();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  buildForms() {
    switch (this.type()) {
      case 'update':
        this.form.set(
          this.fb.group({
            name: [
              { value: this.data().name?.toUpperCase(), disabled: true },
              [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(50),
              ],
            ],
            lastname: [
              { value: this.data().lastname?.toUpperCase(), disabled: true },
              [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(50),
              ],
            ],
            phoneNumber: [
              { value: this.data().phoneNumber, disabled: true },
              [
                Validators.required,
                Validators.pattern('^[0-9]*$'),
                Validators.minLength(10),
                Validators.maxLength(10),
              ],
            ],
            email: [
              { value: this.data().email?.toLowerCase(), disabled: true },
              [Validators.required, Validators.email, Validators.maxLength(50)],
            ],
          })
        );
        break;
      case 'update-vehicle':
        this.form.set(
          this.fb.group({
            vehicleUuid: ['', [Validators.required]],
          })
        );
        break;
      default:
        break;
    }
  }

  getErrorMessage(controlName: string): string | null {
    return this.formsService.getErrorMessage(this.form(), controlName);
  }

  enableInput(controlName: string[]) {
    controlName.forEach((name) => {
      this.form().get(name)?.enable();
    });
  }

  update() {
    if (this.form().invalid) return;
    const data = this.form().value;

    switch (this.type()) {
      case 'update':
        this.residentService
          .update(data, this.data().uuid!)
          .pipe(
            catchError((error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error al actualizar residente',
                detail: error.error.message,
                life: 2000,
              });
              return throwError(() => error);
            }),
            takeUntil(this.destroy$)
          )
          .subscribe({
            next: (resident) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Actualizado',
                detail: 'Residente Actualizado.',
                life: 2000,
              });
              this.form().reset();
              this.dialog.close();
              this.socketService.emit('resident:updated', resident);
            },
          });
        break;

      default:
        break;
    }
  }
  sendCredentials(): void {
    this.residentService
      .sendCredentials(this.data().uuid!)
      .pipe(
        catchError((err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al enviar las credenciales',
            life: 2000,
          });
          return throwError(() => err);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Credenciales Enviadas',
            detail: 'Las credenciales se han enviado correctamente',
            life: 2000,
          });
          this.dialog.close();
        },
      });
  }
}
