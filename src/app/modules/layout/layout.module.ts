import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { PrimengModule } from '../../primeng/primeng.module';
import { MenuComponent } from './components/menu/menu.component';
import { ErrorHandlerService, SocketsService } from '../../services';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { OptionsMenuComponent } from './components/options-menu/options-menu.component';


@NgModule({
  declarations: [
    LayoutComponent,
    TopbarComponent,
    SidebarComponent,
    MenuComponent,
    OptionsMenuComponent,
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    PrimengModule
  ],
  providers:[SocketsService,MessageService,DialogService,ErrorHandlerService]
})
export class LayoutModule { }
