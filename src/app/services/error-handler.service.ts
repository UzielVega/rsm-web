import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {
  private messageService = inject(MessageService);
  constructor() {}

  handleError<T>(result: T) {
    return (source: Observable<T>) =>
      source.pipe(
        catchError((error) => {
          console.error(error); // Log opcional
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
          return of(result);
        })
      );
  }
}
