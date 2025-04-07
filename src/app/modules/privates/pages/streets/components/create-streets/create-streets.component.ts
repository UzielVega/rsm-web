import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormService, SocketsService, StreetService } from '../../../../../../services';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { catchError, Subject, take, takeUntil, throwError } from 'rxjs';

@Component({
  selector: 'app-create-streets',
  templateUrl: './create-streets.component.html',
  styleUrl: './create-streets.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateStreetsComponent {
  public destroy$ = new Subject<void>();
  public dialog = inject(DynamicDialogRef);
  private fb = inject(FormBuilder);
  private streetService = inject(StreetService);
  private socketService = inject(SocketsService);
  private messageService = inject(MessageService);
  private formService = inject(FormService);

  public form!: FormGroup;

  ngOnInit(): void {
    this.buildForms();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  buildForms(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', []],
    });
  }

  getErrorMessage(controlName: string): string | null {
    return this.formService.getErrorMessage(this.form, controlName);
  }
  create() {
    const { name, description } = this.form.value;

    this.streetService
      .create({ name, description })
      .pipe(
        catchError((err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error al crear la calle',
          });
          return throwError(() => err);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (street) => {
          this.socketService.emit('street:added', street);
          this.messageService.add({
            severity: 'success',
            summary: 'Calle creada',
            detail: `La calle ${street.name} ha sido creada`,
          });
          this.dialog.close();
        },
      });
  }
}
