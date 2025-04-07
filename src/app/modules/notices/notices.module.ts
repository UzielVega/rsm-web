import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NoticesRoutingModule } from './notices-routing.module';
import { NoticesComponent } from './notices.component';
import { PrimengModule } from '../../primeng/primeng.module';
import { CreateNoticeComponent } from './components/create-notice/create-notice.component';
import { NoticeCardComponent } from './components/notice-card/notice-card.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ErrorHandlerService } from '../../services';


@NgModule({
  declarations: [
    NoticesComponent,
    CreateNoticeComponent,
    NoticeCardComponent
  ],
  imports: [
    CommonModule,
    NoticesRoutingModule,
    PrimengModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers:[
    MessageService,DialogService,ConfirmationService,ErrorHandlerService
  ]
})
export class NoticesModule { }
