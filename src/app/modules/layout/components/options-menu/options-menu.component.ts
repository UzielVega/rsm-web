import {
  Component,
  computed,
  inject,
  ViewChild,
  viewChild,
} from '@angular/core';
import { MenuItem } from 'primeng/api'; // Adjust the import path as necessary
import { AuthService } from '../../../../services';
import { environment } from '../../../../../environments/environment';
import { UserLogged } from '../../../../interfaces';
import { Menu } from 'primeng/menu';

@Component({
  selector: 'app-options-menu',
  templateUrl: './options-menu.component.html',
  styleUrl: './options-menu.component.scss',
})
export class OptionsMenuComponent {
  items: MenuItem[] | undefined;

  private authService = inject(AuthService);
  public user = computed<UserLogged>(() => this.authService.currentUser()!);
  public urlImage = computed<string>(
    () => `${environment.urlServer}${environment.pathProfilePhoto}${this.user().profileImage}`
  );

  @ViewChild('menu') menu: Menu | undefined;

  ngOnInit() {
    this.items = [
      {
        separator: true,
      },
      {
        label: 'Menu',
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
              this.authService.logOut();
            },
          },
        ],
      },
      {
        separator: true,
      },
    ];
  }

  toggle() {}
}
