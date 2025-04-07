import { ChangeDetectionStrategy, Component, inject, signal, ViewChild } from '@angular/core';
import { Sidebar } from 'primeng/sidebar';
import { AuthService } from '../../../../services';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  public sidebarVisible = signal<boolean>(false);
  private _authService = inject(AuthService);
  public user = this._authService.currentUser;
  urlImage =
    environment.urlServer +
    environment.pathProfilePhoto +
    this.user()?.profileImage;
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;

  closeCallback(e: any): void {
    this.sidebarRef.close(e);
  }

  constructor() {}
}
