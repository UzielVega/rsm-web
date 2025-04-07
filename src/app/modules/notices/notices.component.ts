import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { NoticesService } from './services/notices.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreateNoticeComponent } from './components/create-notice/create-notice.component';
import { Notice } from './interfaces/notice.interfaces';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-notices',
  templateUrl: './notices.component.html',
  styleUrl: './notices.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoticesComponent {
  private destroy$ = new Subject<void>();
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);

  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
  }

  openAddNotice() {
    this.dialogService.open(CreateNoticeComponent, {
      header: 'Crear Aviso',
      width: '70%',
      contentStyle: { 'max-height': '500px', overflow: 'auto' },
    });
  }
}
