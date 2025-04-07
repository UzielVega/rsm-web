import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormService, SocketsService, TagService } from '../../../../services';
import { Message, MessageService } from 'primeng/api';
import { House, Tag } from '../../../../interfaces';
import { catchError, Subject, throwError } from 'rxjs';

@Component({
  selector: 'app-update-tag',
  templateUrl: './update-tag.component.html',
  styleUrl: './update-tag.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateTagComponent {
  public destroy$ = new Subject<void>();
  private fb = inject(FormBuilder);
  private socketService = inject(SocketsService);
  private messageService = inject(MessageService);
  private formsService = inject(FormService);
  private tagService = inject(TagService);
  public dialog = inject(DynamicDialogRef);
  public dialogConfig = inject(DynamicDialogConfig);
  public data = signal<Tag>(this.dialogConfig.data.tag);
  public type = signal<string>(this.dialogConfig.data.type);
  public vehicles = signal<House[]>(this.dialogConfig.data.vehicles);
  public messages = signal<Message[]>([]);
  public form!: FormGroup;

  constructor() {}

  ngOnInit(): void {
    this.buildForms();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

  buildForms() {
    switch (this.type()) {
      case 'update':
        this.form = this.fb.group({
          code: [
            { value: this.data().code, disabled: true },
            [
              Validators.required,
              Validators.pattern(/^[0-9]*$/),
              Validators.minLength(8),
              Validators.maxLength(8),
            ],
          ],
        });
        break;
      case 'update-vehicle':
        this.form = this.fb.group({
          vehicleId: ['', [Validators.required]],
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
    if (this.form.invalid) return;
    const data = this.form.value;

    switch (this.type()) {
      case 'update':
        this.tagService
          .update(data, this.data().id!)
          .pipe(
            catchError((err) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al actualizar el tag.',
                life: 2000,
              });
              return throwError(() => err);
            })
          )
          .subscribe({
            next: (tagUpdated) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Actualizada',
                detail: 'Tag Actualizado.',
                life: 2000,
              });
              this.socketService.emit('tag:updated', tagUpdated);
              this.dialog.close();
              this.form.reset();
            },
          });

        break;
      case 'update-vehicle':
        this.tagService
          .assignVehicle(data, this.data().id!)
          .pipe(
            catchError((err) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: err.error.message,
                life: 2000,
              });
              return throwError(() => err);
            })
          )
          .subscribe({
            next: (tagUpdated) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Actualizado',
                detail: 'Vehiculo Asignado.',
              });
              this.socketService.emit('tag:updated', tagUpdated);
              this.dialog.close();
              this.form.reset();
            },
          });

        break;

      default:
        break;
    }
  }
}
