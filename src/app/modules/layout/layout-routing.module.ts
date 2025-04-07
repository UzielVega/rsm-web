import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { roleGuard } from '../../guards/role.guard';

const routes: Routes = [
  {
    path:'',
    component:LayoutComponent,
    children:[
      {
        path:'',
        canActivate:[roleGuard],
        data: { expectedRole: ['super-admin','admin'] },
        loadChildren:()=> import('../dashboard/dashboard.module').then((m) => m.DashboardModule)
      },
      {
        path:'resident',
        canActivate:[roleGuard],
        data: { expectedRole: ['resident','resident-admin'] },
        loadChildren:()=> import('../residents/residents.module').then((m) => m.ResidentsModule)
      },
      {
        path:'accesses',
        canActivate:[roleGuard],
        data: { expectedRole: ['super-admin','admin','guard'] },
        loadChildren:()=> import('../access-control/access-control.module').then((m) => m.AccessControlModule)
      },
      {
        path:'users',
        canActivate:[roleGuard],
        data: { expectedRole: ['super-admin','admin'] },
        loadChildren:()=> import('../users/users.module').then((m) => m.UsersModule)
      },
      {
        path:'privates',
        canActivate:[roleGuard],
        data: { expectedRole: ['super-admin','admin'] },
        loadChildren:()=> import('../privates/privates.module').then((m) => m.PrivatesModule)
      },
      {
        path:'tags',
        canActivate:[roleGuard],
        data: { expectedRole: ['super-admin','admin'] },
        loadChildren:()=> import('../tags/tags.module').then((m) => m.TagsModule)
      },
      {
        path:'maintenance',
        canActivate:[roleGuard],
        data: { expectedRole: ['super-admin','admin'] },
        loadChildren:()=> import('../maintenance/maintenance.module').then((m) => m.MaintenanceModule)
      },
      {
        path:'imports',
        canActivate:[roleGuard],
        data: { expectedRole: ['super-admin','admin'] },
        loadChildren:()=> import('../imports/imports.module').then((m) => m.ImportsModule)
      },
      {
        path:'notices',
        canActivate:[roleGuard],
        data: { expectedRole: ['super-admin','admin'] },
        loadChildren:()=> import('../notices/notices.module').then((m) => m.NoticesModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule { }
