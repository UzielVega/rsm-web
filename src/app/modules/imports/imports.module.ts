import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImportsRoutingModule } from './imports-routing.module';
import { ImportsComponent } from './imports.component';
import { UploadFileComponent } from './pages/upload-file/upload-file.component';
import { PrimengModule } from '../../primeng/primeng.module';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';


@NgModule({
  declarations: [
    ImportsComponent,
    UploadFileComponent
  ],
  imports: [
    CommonModule,
    ImportsRoutingModule,PrimengModule
  ],
  providers:[ConfirmationService,MessageService,DialogService]
})
export class ImportsModule { }
