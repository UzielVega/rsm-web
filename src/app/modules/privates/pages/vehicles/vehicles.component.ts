import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  HouseService,
  SocketsService,
  StreetService,
} from '../../../../services';
import { House, Street } from '../../../../interfaces';
import { CreateVehiclesComponent } from './components/create-vehicles/create-vehicles.component';
import { ConfirmPopup } from 'primeng/confirmpopup';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehiclesComponent {
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);


  selectedStreet: Street | undefined;

  constructor() {}

  ngOnInit() {}
}
