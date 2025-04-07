import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { SocketsService, VisitService } from '../../../../../../services';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Button, House, Street, Visit } from '../../../../../../interfaces';

@Component({
  selector: 'app-table-visits',
  templateUrl: './table-visits.component.html',
  styleUrl: './table-visits.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableVisitsComponent {
  public dialog: DynamicDialogRef | undefined;
  private _dialogService = inject(DialogService);
  private _subscription: Subscription = new Subscription();
  private _socketService = inject(SocketsService);
  private visitService = inject(VisitService);
  private _confirmationService = inject(ConfirmationService);
  private _messageService = inject(MessageService);
  public visits = signal<Visit[] | undefined>(undefined);

  public houseId = input<number>();
  public buttons: Button[] = [
    {
      icon: 'pi pi-trash',
      severity: 'danger',
      id: 'edit-button',
      tooltip: 'Eliminar',
      tooltipPosition: 'bottom',
      action: () => {},
    },
  ];
  constructor() {}

  ngOnInit() {
    this.updateVisits();
    this.getVisitsByHouse(this.houseId()!);
  }

  getVisitsByHouse(id: number) {
    this._subscription.add(
      this.visitService.getAllByHouse(id).subscribe({
        next: (visits) => this.visits.set(visits),
        error: (error) => console.log(error),
      })
    );
  }

  updateVisits() {
    this._subscription.add(
      this._socketService
        .listen('visit:added')
        .subscribe(() => this.getVisitsByHouse(this.houseId()!))
    );

    this._subscription.add(
      this._socketService
        .listen('back:update-data')
        .subscribe(() => this.getVisitsByHouse(this.houseId()!))
    );
  }

  getSeverity(
    visit: Visit
  ): 'contrast' | 'success' | 'warning' | 'danger' | 'info' {
    switch (visit.status?.id) {
      case 1:
        return 'info';
      case 2:
        return 'success';
      case 3:
        return 'danger';
      case 4:
        return 'warning';
      default:
        return 'contrast';
    }
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
}
