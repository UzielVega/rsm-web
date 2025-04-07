import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivatesRoutingModule } from './privates-routing.module';
import { StreetsComponent } from './pages/streets/streets.component';
import { ResidentsComponent } from './pages/residents/residents.component';
import { HousesComponent } from './pages/houses/houses.component';
import { PrivatesMainComponent } from './pages/privates-main/privates-main.component';
import { TableStreetsComponent } from './pages/streets/components/table-streets/table-streets.component';
import { CreateStreetsComponent } from './pages/streets/components/create-streets/create-streets.component';
import { UpdateStreetsComponent } from './pages/streets/components/update-streets/update-streets.component';
import { PrimengModule } from '../../primeng/primeng.module';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CreateResidentsComponent } from './pages/residents/components/create-residents/create-residents.component';
import { UpdateResidentsComponent } from './pages/residents/components/update-residents/update-residents.component';
import { TableResidentsComponent } from './pages/residents/components/table-residents/table-residents.component';
import { TableHousesComponent } from './pages/houses/components/table-houses/table-houses.component';
import { CreateHousesComponent } from './pages/houses/components/create-houses/create-houses.component';
import { UpdateHousesComponent } from './pages/houses/components/update-houses/update-houses.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';
import { VehiclesComponent } from './pages/vehicles/vehicles.component';
import { CreateVehiclesComponent } from './pages/vehicles/components/create-vehicles/create-vehicles.component';
import { UpdateVehiclesComponent } from './pages/vehicles/components/update-vehicles/update-vehicles.component';
import { TableVehiclesComponent } from './pages/vehicles/components/table-vehicles/table-vehicles.component';
import { ErrorHandlerService } from '../../services';


@NgModule({
  declarations: [
    StreetsComponent,
    ResidentsComponent,
    HousesComponent,
    PrivatesMainComponent,
    TableStreetsComponent,
    CreateStreetsComponent,
    UpdateStreetsComponent,
    CreateResidentsComponent,
    UpdateResidentsComponent,
    TableResidentsComponent,
    TableHousesComponent,
    CreateHousesComponent,
    UpdateHousesComponent,
    VehiclesComponent,
    CreateVehiclesComponent,
    UpdateVehiclesComponent,
    TableVehiclesComponent,
  ],
  imports: [
    CommonModule,
    PrivatesRoutingModule,
    QRCodeModule,
    PrimengModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [DialogService,ConfirmationService, MessageService,ErrorHandlerService],
})
export class PrivatesModule { }
