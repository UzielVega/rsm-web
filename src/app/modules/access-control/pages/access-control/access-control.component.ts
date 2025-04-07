import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { AccessesService, AuthService, SocketsService } from '../../../../services';
import { MessageService } from 'primeng/api';
import { DialogValidateVisitsComponent } from './components/dialog-validate-visits/dialog-validate-visits.component';

@Component({
  selector: 'app-access-control',
  templateUrl: './access-control.component.html',
  styleUrl: './access-control.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccessControlComponent {
  private socketService = inject(SocketsService);
  private messageService = inject(MessageService);
  private accessService = inject(AccessesService);
  private authService = inject(AuthService);
  private role = signal<string>(this.authService.currentUser()?.role?.name!);
  constructor() {
     // Escuchar eventos del socket

     this.socketService.listen('response[front]:validate_visit').subscribe({
      next: (data) => {        
        this.accessService.addEventToQueue(data, DialogValidateVisitsComponent);
      },
    });
  }

  ngOnInit() {

    this.socketService.listen('error:access').subscribe((error) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error,
      });
    });
  }
}
