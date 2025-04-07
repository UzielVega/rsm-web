import { AuthService } from './../../services/auth.service';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SocketsService } from '../../services';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class LayoutComponent {
  private socketService = inject(SocketsService);

  constructor() {
    this.socketService.checkStatus();
  }

  ngOnDestroy() {
    this.socketService.socketDisconnect();
  }
}
