import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { AccessesService, SocketsService } from '../../../../../../services';
import { Accesses } from '../../../../../../interfaces/accesses.interfaces';

@Component({
  selector: 'app-table-logs',
  templateUrl: './table-logs.component.html',
  styleUrl: './table-logs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableLogsComponent {
  public dialog: DynamicDialogRef | undefined;
  private subscription: Subscription = new Subscription();
  private socketService = inject(SocketsService);
  private accessesService = inject(AccessesService)

  public accesses = signal<Accesses[] | undefined>(undefined);

  constructor() {
    this.getAccesses();
    this.socketService.listen('update:access').subscribe(()=>this.getAccesses())
  }
  
  getAccesses() {
    this.subscription.add(
      this.accessesService.getAll().subscribe({
        next: (accesses) => this.accesses.set(accesses),
        error: (error) => console.log(error),
      })
    );
  }
}
