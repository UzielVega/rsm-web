import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BehaviorSubject, catchError, map, of, Subject, throwError } from 'rxjs';
import {
  FormService,
  HouseService,
  SocketsService,
  StreetService,
} from '../../../../../../services';
import { MessageService } from 'primeng/api';
import { Street } from '../../../../../../interfaces';

@Component({
  selector: 'app-create-houses',
  templateUrl: './create-houses.component.html',
  styleUrl: './create-houses.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateHousesComponent {
  public destroy$ = new Subject<void>();
  public dialog = inject(DynamicDialogRef);
  public dialogConfig = inject(DynamicDialogConfig);
  public type = signal<string>(this.dialogConfig.data.type);
  public streets$ = new BehaviorSubject<Street[]>([]);
  private fb = inject(FormBuilder);
  private socketService = inject(SocketsService);
  private streetService = inject(StreetService);
  private messageService = inject(MessageService);
  private formsService = inject(FormService);
  private houseService = inject(HouseService);
  public form!: FormGroup;

  constructor() {}

  ngOnInit() {
    this.buildForm();
    this.loadStreets();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private buildForm() {
    this.form = this.fb.group({
      street: ['', [Validators.required]],
    });
  }

  private loadStreets(): void {
    this.streetService
      .getAll()
      .pipe(
        catchError((err) => {
          this.messageService.add({
            severity: 'warn',
            summary: 'No existen Calles en el sistema.',
            detail: err.error.message,
          });
          return of([]);
        })
      )
      .subscribe({
        next: (streets) => this.streets$.next(streets),
      });
  }

  getErrorMessage(controlName: string): string | null {
    return this.formsService.getErrorMessage(this.form, controlName);
  }

  create() {
    if (this.form.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor, seleccione una calle',
      });
      return;
    }
    const streetId = this.form.get('street')?.value.id!;
    console.log(streetId);
    

    this.houseService
      .create({ streetId: streetId })
      .pipe(
        catchError((err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Ha ocurrido un error al crear la casa',
          });
          return throwError(() => err);
        })
      )
      .subscribe({
        next: (house) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Casa creada',
            detail: 'La casa ha sido creada con éxito',
          });
          this.socketService.emit('house:added', house);
        },
      });
  }
}
