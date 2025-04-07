import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  ErrorHandlerService,
  HouseService,
  SocketsService,
  StreetService,
} from '../../../../services';
import { House, Street } from '../../../../interfaces';
import { map, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-houses',
  templateUrl: './houses.component.html',
  styleUrl: './houses.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HousesComponent {
  private destroy$ = new Subject<void>();
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public ref: DynamicDialogRef | undefined;
  public streets = signal<Street[] | undefined>(undefined);

  selectedStreet: Street | undefined;

  ngOnInit() {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
