import { Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Accesses } from '../interfaces/accesses.interfaces';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Injectable()
export class AccessesService {
  private http = inject(HttpClient);
  private baseUrl: string = environment.baseUrl;
  public dialog: DynamicDialogRef | undefined;
  private dialogService = inject(DialogService);
  // Cola de eventos y estado del diálogo
  private eventQueue: any[] = [];
  private isDialogVisible: boolean = false;

  private get headers(): HttpHeaders {
    const accessToken = localStorage.getItem('access_token') || '';
    return new HttpHeaders().set('Authorization', `Bearer ${accessToken}`);
  }

  constructor() {}

  public getAll(): Observable<Accesses[]> {
    const url: string = `${this.baseUrl}/accesses/all`;

    return this.http.get<Accesses[]>(url, { headers: this.headers });
  }

  public addEventToQueue(data: any, component: any) {
    this.eventQueue.push(data);
    this.processNextEvent(component); // Procesar el siguiente evento en la cola
  }

  private processNextEvent(component: any) {
    if (this.isDialogVisible || this.eventQueue.length === 0) {
      return;
    }

    const nextEvent = this.eventQueue.shift(); // Obtener el siguiente evento
    console.log('Next event:', nextEvent);
    this.showDialog(nextEvent, component); // Mostrar el siguiente diálogo
  }

  private showDialog(data: any, component: any) {
    this.isDialogVisible = true;
    // Abrir el diálogo y verificar que se haya creado correctamente
    this.dialog = this.dialogService.open(component, {
      header: 'Validar Acceso de Visita',
      data,
      contentStyle: { overflow: 'hidden' },
      closable: false,
      closeOnEscape: false,
    });

    // Verificar si el diálogo fue creado
    if (this.dialog) {
      this.dialog.onClose.subscribe(() => {
        console.log('Dialog closed, processing next event');
        this.isDialogVisible = false;

        // Asegurar una breve espera antes de procesar el siguiente diálogo
        setTimeout(() => {
          if (this.eventQueue.length > 0) {
            console.log('Processing next event in queue:', this.eventQueue);
            this.processNextEvent(component);
          } else {
            console.log('No more events in queue.');
          }
        }, 500); // Espera de 100ms
      });
    } else {
      // Si el diálogo no fue creado, restablecer el estado
      this.isDialogVisible = false;
      this.processNextEvent(component); // Intentar procesar el siguiente evento
    }
  }

  public getAccessesByDate(
    startDate: Date,
    endDate: Date
  ): Observable<Accesses[]> {
    const url: string = `${this.baseUrl}/accesses/dates/?startDate=${startDate}&endDate=${endDate}`;

    return this.http.get<Accesses[]>(url);
  }
}
