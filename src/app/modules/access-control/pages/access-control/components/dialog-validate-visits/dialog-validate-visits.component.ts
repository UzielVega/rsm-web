import {
  Component,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { SocketsService } from '../../../../../../services';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-dialog-validate-visits',
  templateUrl: './dialog-validate-visits.component.html',
  styleUrl: './dialog-validate-visits.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogValidateVisitsComponent {
  private socketService = inject(SocketsService);
  public dialog = inject(DynamicDialogRef);
  public dialogConfig = inject(DynamicDialogConfig);
  public data = signal<any>(this.dialogConfig.data);
  public visitData = computed(() => this.data().visitData);

  ngOnInit(): void {
    this.socketService.listen('visit:validated').subscribe(() => {
      this.dialog.close();
    });
  }

  allowAccess() {
    this.socketService.emit('request[front]:door_open', {
      panelData: this.data().panelData,
      visitData: this.data().visitData,
    });
  }
}
