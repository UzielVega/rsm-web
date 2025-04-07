import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import * as Papa from 'papaparse';
import { ImportService } from '../../../../services';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrl: './upload-file.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadFileComponent {
  constructor() {}

  private importService = inject(ImportService);
  private messageService = inject(MessageService);
  previewData = signal<any[]>([]);
  headers = signal<string[]>([]);
  loading = signal<boolean>(false);
  file = signal<any>(undefined);
  formData = new FormData();
  progress: number = 0; // Variable para el progreso

  onUpload(event: any) {
    this.file.set(event.target.files[0]);

    if (this.file()) {
      // Leer el archivo CSV usando Papa Parse
      Papa.parse(this.file(), {
        header: true,
        skipEmptyLines: true,
        encoding: "UTF-8", // Añade esta opción para evitar problemas con la codificación
        complete: (result) => {
          // Asignar los datos y las cabeceras para la vista previa
          this.previewData.set(result.data);
          this.headers.set(Object.keys(this.previewData()[0]));
        },
      });
    }
  }

  onRemove(event: any) {
    this.previewData.set([]);
    this.headers.set([]);
    this.file.set(undefined);
  }

  uploadData() {
    this.loading.set(true);
    this.formData.append('file', this.file());
    this.importService.uploadFile(this.formData).pipe(
      catchError((error) => {
        this.loading.set(false);
        this.file.set(undefined);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: '¡Ha ocurrido un error al importar el archivo!',
        });
        return error
      })
    ).subscribe({
      next: () => {
        this.loading.set(false);
        this.file.set(undefined);
        this.messageService.add({
          severity: 'success',
          summary: 'Impotación Exitosa',
          detail: '!La importacion ha sido exitosa!',
        })
      },
    });
  }
}
