import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {
  public authService = inject(AuthService);
  public router = inject(Router);

  menuItems = [
    {
      title: 'Inicio',
      icon: 'pi pi-home',
      expectedRoles: ['super-admin', 'admin'],
      path: '',
    },
    {
      title: 'Inicio',
      icon: 'pi pi-home',
      expectedRoles: ['resident', 'resident-admin'],
      path: 'resident',
    },
    {
      title: 'Inicio',
      icon: 'pi pi-home',
      expectedRoles: ['guard'],
      path: 'accesses',
    },
    {
      title: 'Mis Visitas',
      icon: 'pi pi-users',
      expectedRoles: ['resident', 'resident-admin'],
      path: 'resident/visits',
    },

    {
      title: 'Usuarios',
      icon: 'pi pi-users',
      path: '/users',
      expectedRoles: ['super-admin', 'admin'],
    },

    {
      title: 'Calles',
      icon: 'pi pi-flag',
      path: 'privates/streets',
      expectedRoles: ['super-admin', 'admin'],
    },
    {
      title: 'Casas',
      icon: 'pi pi-warehouse',
      path: 'privates/houses',
      expectedRoles: ['super-admin', 'admin'],
    },
    {
      title: 'Residentes',
      icon: 'pi pi-users',
      path: 'privates/residents',
      expectedRoles: ['super-admin', 'admin'],
    },
    {
      title: 'Vehiculos',
      icon: 'pi pi-car',
      path: 'privates/vehicles',
      expectedRoles: ['super-admin', 'admin'],
    },
    {
      title: 'Tags',
      icon: 'pi pi-tags',
      path: '/tags',
      expectedRoles: ['super-admin', 'admin'],
    },
    {
      title: 'Mantenimiento',
      icon: 'pi pi-users',
      path: 'maintenance/control',
      expectedRoles: ['super-admin', 'admin'],
    },
    {
      title: 'Reportes',
      icon: 'pi pi-chart-bar',
      path: 'maintenance/reports',
      expectedRoles: ['super-admin', 'admin'],
    },
    {
      title: 'Monitoreo',
      icon: 'pi pi-desktop',
      path: 'accesses/access-control',
      expectedRoles: ['super-admin', 'admin','guard'],
    },
    {
      title: 'Visitas',
      icon: 'pi pi-desktop',
      path: 'accesses/visit-control',
      expectedRoles: ['super-admin', 'admin','guard'],
    },
    {
      title: 'Accesos',
      icon: 'pi pi-chart-bar',
      path: 'accesses/access-report',
      expectedRoles: ['super-admin', 'admin','guard'],
    },
    {
      title: 'Visitas',
      icon: 'pi pi-chart-bar',
      path: 'accesses/visit-report',
      expectedRoles: ['super-admin', 'admin','guard'],
    },
    {
      title: 'Importación',
      icon: 'pi pi-upload',
      path: 'imports/upload-file',
      expectedRoles: ['super-admin', 'admin'],
    },
    {
      title: 'Noticias',
      icon: 'pi pi-bell',
      path: 'notices',
      expectedRoles: ['super-admin', 'admin'],
    },
  ];

  onNavigate = output();
  activeSection: number | null = null;

  toggleSection(index: number) {
    this.activeSection = this.activeSection === index ? null : index;
  }

  navigate(url: string) {
    this.onNavigate.emit();
    this.router.navigateByUrl(url);
  }
}
