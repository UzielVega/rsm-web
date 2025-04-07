import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResidentsRoutingModule } from './residents-routing.module';
import { ResidentsComponent } from './residents.component';
import { VisitsComponent } from './pages/visits/visits.component';
import { DialogChangePasswordComponent } from './components/dialog-change-password/dialog-change-password.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { PrimengModule } from '../../primeng/primeng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableVisitsComponent } from './pages/visits/components/table-visits/table-visits.component';
import { DialogCreateVisitComponent } from './pages/visits/components/dialog-create-visit/dialog-create-visit.component';
import { HomeComponent } from './pages/home/home.component';
import { QRCodeModule } from 'angularx-qrcode';
import { OpenDoorComponent } from './pages/home/components/open-door/open-door.component';

@NgModule({
  declarations: [
    ResidentsComponent,
    VisitsComponent,
    DialogChangePasswordComponent,
    TableVisitsComponent,
    DialogCreateVisitComponent,
    HomeComponent,
    OpenDoorComponent,
  ],
  imports: [
    CommonModule,
    ResidentsRoutingModule,
    PrimengModule,
    FormsModule,
    ReactiveFormsModule,
    QRCodeModule
  ],
  providers:[MessageService,DialogService,ConfirmationService]
})
export class ResidentsModule { }
