import { inject, Injectable, signal } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { ErrorHandlerService } from './error-handler.service';

@Injectable()
export class SocketsService {
  private errorHandlerService = inject(ErrorHandlerService);
  private readonly destroy$ = new Subject<void>();
  private url = signal<string>(environment.urlServer); // Reemplaza con la URL de tu servidor Socket.io
  private access_token = signal<string>(
    localStorage.getItem('access_token') || ''
  );
  public socketStatus = signal<boolean>(false);
  private socket = signal<Socket>(
    io(this.url(), {
      extraHeaders: {
        authorization: this.access_token(),
      },
    })
  );

  constructor() {}

  socketDisconnect() {
    this.socket().disconnect();
  }
  checkStatus() {
    this.socket().on('connect', () => {
      console.log('Conectado al servidor');

      this.socketStatus.set(true);
    });

    this.socket().on('disconnect', () => {
      console.log('Desconectado del servidor');
      this.socketStatus.set(false);
    });
  }

  emit(evento: string, payload?: any): void {
    this.socket().emit(evento, payload);
  }

  listen(evento: string): Observable<any> {
    return new Observable((observer) => {
      this.socket().on(evento, (data) => {
        observer.next(data);
      });
    });
  }

  public subscribeToEvent<T>(
    eventName: string,
    handler: (data: T) => void
  ) {
    this.listen(eventName)
      .pipe(
        this.errorHandlerService.handleError<T>(null as unknown as T),
        takeUntil(this.destroy$)
      )
      .subscribe(handler);
  }
}
