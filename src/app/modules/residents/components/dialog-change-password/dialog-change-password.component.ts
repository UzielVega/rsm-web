import { ResidentService } from '../../../../services/resident.service';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormService, SocketsService } from '../../../../services';
import { catchError, map, Observable, of, Subject, takeUntil, throwError } from 'rxjs';

@Component({
  selector: 'app-dialog-change-password',
  templateUrl: './dialog-change-password.component.html',
  styleUrl: './dialog-change-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogChangePasswordComponent {
  public destroy$ = new Subject<void>();
  public dialog = inject(DynamicDialogRef);
  public dialogConfig = inject(DynamicDialogConfig);
  private fb = inject(FormBuilder);
  private socketService = inject(SocketsService);
  private formService = inject(FormService);
  private messageService = inject(MessageService);
  private residentService = inject(ResidentService);
  public form!: FormGroup;

  constructor() {}
  ngOnInit(): void {
    this.buildForms();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  buildForms(): void {
    this.form = this.fb.group({
      temporalPassword: [
        '',
        [Validators.required],
        [this.validateTemporalPassword()],
      ],
      newPassword: ['', [Validators.required]],
    });
  }

  getErrorMessage(controlName: string): string | null {
    return this.formService.getErrorMessage(this.form, controlName);
  }

  validateTemporalPassword(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const value = control.value;

      if (!value) {
        return of(null);
      }

      return this.residentService
        .validateTemporalPassword(value, this.dialogConfig.data.resident.uuid)
        .pipe(
          map((isValid) => (isValid ? null : { passwordValidated: true })),
          catchError(() => of({ passwordValidated: true })),
          takeUntil(this.destroy$)
        );
    };
  }
  
  update() {
    if (this.form.invalid) {
      return;
    }

    this.residentService
      .changePasswordFirstTime(
        this.form.value,
        this.dialogConfig.data.resident.uuid
      )
      .pipe(
        catchError((err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error.message,
          });
          return throwError(() => err);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (resident) => {
          console.log(resident);

          this.messageService.add({
            severity: 'success',
            summary: 'Contraseña actualizada',
          });
          this.form.reset();
          this.dialog.close();
          this.socketService.emit('resident:updated', resident);
        },
      });
  }
}
