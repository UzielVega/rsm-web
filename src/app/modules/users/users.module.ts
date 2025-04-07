import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { TableUsersComponent } from './components/table-users/table-users.component';
import { UsersComponent } from './users.component';
import { PrimengModule } from '../../primeng/primeng.module';
import { FormCreateUserComponent } from './components/forms/form-create-user/form-create-user.component';
import { FormUpdateUserComponent } from './components/forms/form-update-user/form-update-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ErrorHandlerService } from '../../services/error-handler.service';

@NgModule({
  declarations: [
    TableUsersComponent,
    UsersComponent,
    FormCreateUserComponent,
    FormUpdateUserComponent,
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    PrimengModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [DialogService,ConfirmationService, MessageService,ErrorHandlerService],
})
export class UsersModule {}
