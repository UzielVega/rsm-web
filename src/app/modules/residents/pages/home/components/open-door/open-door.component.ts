import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { SocketsService } from '../../../../../../services';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-open-door',
  templateUrl: './open-door.component.html',
  styleUrl: './open-door.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpenDoorComponent {
  public dialog = inject(DynamicDialogRef);
  public dialogConfig = inject(DynamicDialogConfig);
  private socketService = inject(SocketsService);

  constructor() {}

  ngOnInit(): void {}

  openDoor(): void {
    // Open the door
    this.socketService.emit('request_resident[front]:door_open', {
      resident: this.dialogConfig.data.resident,
      panelData: this.dialogConfig.data.panelData,
    });
    this.dialog.close();
  }
}
