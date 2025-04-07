import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogCreateVisitComponent } from './components/dialog-create-visit/dialog-create-visit.component';
import { AuthService } from '../../../../services';
import { Resident } from '../../../../interfaces';

@Component({
  selector: 'app-visits',
  templateUrl: './visits.component.html',
  styleUrl: './visits.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisitsComponent {
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  private authService = inject(AuthService);
  public resident = computed<Resident>(()=>this.authService.currentUser()!);
  public ref: DynamicDialogRef | undefined;

  constructor() {
    console.log(this.resident().house?.id);
    
  }

  

  openNew() {
    this.ref = this.dialogService.open(DialogCreateVisitComponent, {
      header: 'Programar Nueva Visita',
      contentStyle: { overflow: 'scroll' },
      width: '90%',
      data: { resident: this.resident() },
    });
  }
}
