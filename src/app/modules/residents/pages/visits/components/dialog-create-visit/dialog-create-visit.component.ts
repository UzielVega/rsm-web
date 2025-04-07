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
  VisitService,
} from '../../../../../../services';
import { Message, MessageService } from 'primeng/api';
import { Resident } from '../../../../../../interfaces';
import { catchError, min, of, throwError } from 'rxjs';

@Component({
  selector: 'app-dialog-create-visit',
  templateUrl: './dialog-create-visit.component.html',
  styleUrl: './dialog-create-visit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogCreateVisitComponent {
  private fb = inject(FormBuilder);
  private visitService = inject(VisitService);
  private socketService = inject(SocketsService);
  private messageService = inject(MessageService);
  private formService = inject(FormService);
  public dialog = inject(DynamicDialogRef);
  private dialogConfig = inject(DynamicDialogConfig);
  public resident = signal<Resident>(this.dialogConfig.data.resident);
  public selectedOptionCar: boolean = true;
  messages: Message[] | undefined;
  stateOptions: any[] = [
    { label: 'Vehicular', value: true },
    { label: 'Peatonal', value: false },
  ];
  minDate = new Date();

  public form = signal<FormGroup>(
    this.fb.group({
      houseId: [this.resident().house?.id, [Validators.required]],
      name: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      ext: ['+52', [Validators.required]],
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      scheduleDate: ['', [Validators.required]],
      hasVehicle: [this.selectedOptionCar, Validators.required],
      plate: ['', [Validators.pattern('^[A-Za-z0-9]*$')]],
    })
  );

  constructor() {
    console.log(this.resident());
  }

  public getErrorMessage(controlName: string): string | null {
    return this.formService.getErrorMessage(
      this.form(),
      controlName
    );
  }

  public createVisit(): void {
    if (this.form().invalid) {
      this.form().markAllAsTouched();
      return;
    }
    this.form().get('hasVehicle')?.setValue(this.selectedOptionCar);
    this.visitService
      .createVisit(this.form().value)
      .pipe(
        catchError((err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error.message,
          });
          return throwError(()=> err);
        })
      )
      .subscribe({
        next: (visit) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Visita programada',
            detail: 'La visita se ha programado correctamente',
          });
          this.socketService.emit('visit:added',visit);
          this.form().reset();
          this.dialog.close();
        },
      });
  }
}
