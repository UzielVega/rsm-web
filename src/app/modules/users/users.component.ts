import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormCreateUserComponent } from './components/forms/form-create-user/form-create-user.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent {
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
 

  constructor() {}

 
}
