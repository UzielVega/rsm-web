import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import {
  FormService,
  HouseService,
  ResidentService,
  SocketsService,
  StreetService,
} from '../../../../../../services';
import { MessageService } from 'primeng/api';
import { House, Street } from '../../../../../../interfaces';
import { BehaviorSubject, catchError, of, throwError } from 'rxjs';

@Component({
  selector: 'app-create-residents',
  templateUrl: './create-residents.component.html',
  styleUrl: './create-residents.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateResidentsComponent {
  private fb = inject(FormBuilder);
  private streetService = inject(StreetService);
  private houseService = inject(HouseService);
  private residentService = inject(ResidentService);
  private socketService = inject(SocketsService);
  private messageService = inject(MessageService);
  private formService = inject(FormService);
  private dialogConfig = inject(DynamicDialogConfig);
  public data = signal<any>(this.dialogConfig.data);
  public streets$ = new BehaviorSubject<Street[]>([]);
  public houses$ = new BehaviorSubject<House[]>([]);
  public street!: Street | undefined;
  public house!: House | undefined;
  public form!: FormGroup;

  constructor() {}

  ngOnInit(): void {
    this.buildForms();
    this.loadStreets();
  }

  buildForms(): void {
    this.form = this.fb.group({
      houseId: [undefined, [Validators.required]],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      lastname: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      ext: ['+52', [Validators.required]],
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      email: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(50)],
      ],
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

  public showHouses(street: Street): void {
    if (!street) return;
    this.houseService
      .getByStreet(street.id!)
      .pipe(
        catchError((err) => {
          this.messageService.add({
            severity: 'warn',
            summary: 'No existen Casas en la Calle seleccionada.',
            detail: err.error.message,
          });
          return of([]);
        })
      )
      .subscribe({
        next: (houses) => this.houses$.next(houses),
      });
  }
  assignId(house: House) {
    this.form.get('houseId')?.setValue(house.id);
  }

  public resetSelections(): void {
    this.house = undefined;
    this.street = undefined;
    this.form.reset();
  }

  public getErrorMessage(controlName: string): string | null {
    return this.formService.getErrorMessage(this.form, controlName);
  }

  public create(): void {
    if (this.form.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario Invalido',
        detail: 'Por favor, rellene todos los campos obligatorios',
      });
      return;
    }
    this.residentService
      .create(this.form.value)
      .pipe(
        catchError((err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error al crear el Residente',
            detail: err.error.message,
          });
          return throwError(() => err);
        })
      )
      .subscribe({
        next: (resident) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Residente Creado',
            detail: 'El Residente se ha creado correctamente',
          });
          this.socketService.emit('resident:added',resident);
          this.form.reset();
        },
      });
  }
}
