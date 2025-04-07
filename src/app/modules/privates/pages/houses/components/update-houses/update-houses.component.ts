import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { House } from '../../../../../../interfaces';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  FormService,
  HouseService,
  SocketsService,
} from '../../../../../../services';
import { MessageService } from 'primeng/api';
import { catchError, Subject, Subscription, throwError } from 'rxjs';
import { SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-update-houses',
  templateUrl: './update-houses.component.html',
  styleUrl: './update-houses.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateHousesComponent {
  private destroy$ = new Subject<void>();
  public dialog = inject(DynamicDialogRef);
  public dialogConfig = inject(DynamicDialogConfig);
  public data = signal<House>(this.dialogConfig.data.house);
  public type = signal<string>(this.dialogConfig.data.type);
  public readonly id = this.data().id;
  private fb = inject(FormBuilder);
  public qrCodeDownloadLink = signal<SafeUrl>('');
  private socketService = inject(SocketsService);
  private messageService = inject(MessageService);
  private formsService = inject(FormService);
  private houseService = inject(HouseService);
  public form!: FormGroup;

  errorMessages: any = {
    description: {
      required: 'obligatorio',
    },
  };
  constructor() {}

  ngOnInit() {
    this.buildForms();
  }

  ngOnDestroy() {
    this.destroy$.next(); // Emite para finalizar las suscripciones
    this.destroy$.complete(); // Completa el Subject
  }

  buildForms() {
    switch (this.type()) {
      case 'update':
        this.buildUpdateForm();
        break;
      default:
        break;
    }
  }

  getErrorMessage(controlName: string): string | null {
    return this.formsService.getErrorMessage(
      this.form,
      controlName
    );
  }

  private buildUpdateForm() {
    this.form = this.fb.group({
      description: [this.data().description, [Validators.required]],
    });
  }

  onChangeURL(url: SafeUrl) {
    this.qrCodeDownloadLink.set(url);
    console.log(this.qrCodeDownloadLink());
  }

  update() {
    const data = this.form.value;
    if (this.form.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor, rellene los campos obligatorios',
      });
      return;
    }
    this.houseService
      .update(data, this.id!)
      .pipe(
        catchError((err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Ha ocurrido un error al actualizar la casa',
          });
          return throwError(() => err);
        })
      )
      .subscribe({
        next: (updatedHouse) => {
          this.socketService.emit('house:updated', updatedHouse);
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Casa actualizada con éxito',
          });
          this.dialog.close();
          this.form.reset();
        },
      });
  }

  validateForm() {}
}
