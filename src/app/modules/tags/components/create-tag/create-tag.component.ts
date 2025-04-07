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
  TagService,
  VehicleService,
} from '../../../../services';
import { Message, MessageService } from 'primeng/api';
import { House, Street } from '../../../../interfaces';
import {
  BehaviorSubject,
  catchError,
  of,
  Subject,
  takeUntil,
  throwError,
} from 'rxjs';

@Component({
  selector: 'app-create-tag',
  templateUrl: './create-tag.component.html',
  styleUrl: './create-tag.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateTagComponent {
  public destroy$ = new Subject<void>();
  private dialog = inject(DynamicDialogRef);
  private fb = inject(FormBuilder);
  private streetService = inject(StreetService);
  private houseService = inject(HouseService);
  private tagService = inject(TagService);
  private socketService = inject(SocketsService);
  private messageService = inject(MessageService);
  private formService = inject(FormService);
  private dialogConfig = inject(DynamicDialogConfig);

  public data = signal<any>(this.dialogConfig.data);
  public streets$ = new BehaviorSubject<Street[]>([]);
  public street!: Street | undefined;
  public houses$ = new BehaviorSubject<House[]>([]);
  public house!: House | undefined;
  public messages = signal<Message[]>([]);

  public form!: FormGroup;

  constructor() {}

  ngOnInit(): void {
    this.loadStreets();
    this.buildForms();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  buildForms(): void {
    this.form = this.fb.group({
      houseId: ['', [Validators.required]],
      code: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]*$/),
          Validators.minLength(7),
          Validators.maxLength(12),
        ],
      ],
    });
  }

  assignId(id: number): void {
    this.form.get('houseId')?.setValue(id);
  }
  private loadStreets(): void {
    this.streetService
      .getAll()
      .pipe(
        catchError((err) => {
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
        catchError(() => {
          return of([]);
        })
      )
      .subscribe({
        next: (houses) => this.houses$.next(houses),
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

  validateTag() {
    this.messages.set([]);
    const code: string | null = this.form.get('code')?.value;
    if (code) {
      if (code.length >= 9) {
        this.tagService.getOneByCode(code).subscribe({
          next: (tag) => {
            if (tag)
              this.messages.set([
                {
                  summary: 'El Tag ya se encuentra registrado.',
                  severity: 'warn',
                },
              ]);
            this.form.get('code')?.setErrors({
              duplicated: true,
            });
          },
        });
      }
    }
  }

  public create(): void {
    const selectedHouseUuid = this.house?.id;
    if (!selectedHouseUuid) return;
    this.form.get('houseId')?.setValue(selectedHouseUuid);

    if (this.form.invalid) return;

    this.tagService
      .create(this.form.value)
      .pipe(
        catchError((err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error al crear Tag',
            detail: err.error.message,
          });
          return throwError(() => err);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (tag) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Tag creado',
            detail: 'El Tag ha sido creado correctamente.',
          });
          this.socketService.emit('tag:added',tag);
          this.form.get('code')?.reset();
        },
      });
  }
}
