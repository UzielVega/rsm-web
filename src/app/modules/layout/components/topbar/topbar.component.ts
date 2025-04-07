import { ChangeDetectionStrategy, Component, inject, output, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../../services';
import { environment } from '../../../../../environments/environment';
import { Menu } from 'primeng/menu';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class TopbarComponent {
  private _authService = inject(AuthService);
  onOpenSideBar = output();

  items: MenuItem[] | undefined;


  ngOnInit() {
    this.items = [
      {
        separator: true,
      },
      {
        label: 'Perfil',
        items: [
          {
            label: 'Ajustes',
            icon: 'pi pi-cog',
            shortcut: '⌘+O',
          },
          {
            label: 'Notificaciones',
            icon: 'pi pi-inbox',
            badge: '2',
          },
          {
            label: 'Cerrar Sesion',
            icon: 'pi pi-sign-out',
            shortcut: '⌘+Q',
            action: () => {
              this._authService.logOut();
            },
          },
        ],
      },
      {
        separator: true,
      },
    ];
  }

  openSidebar() {
    this.onOpenSideBar.emit();
  }

  constructor() {}
}
