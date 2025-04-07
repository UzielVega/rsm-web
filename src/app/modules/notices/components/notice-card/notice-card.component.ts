import { Component, inject, Input, signal } from '@angular/core';
import { Notice } from '../../interfaces/notice.interfaces';
import { NoticesService } from '../../services/notices.service';
import { catchError, of, throwError } from 'rxjs';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-notice-card',
  templateUrl: './notice-card.component.html',
  styleUrl: './notice-card.component.scss',
})
export class NoticeCardComponent {
  private noticesService = inject(NoticesService);
  private confirmationService = inject(ConfirmationService);

  notices = signal<Notice[]>([]);

  constructor() {}

  ngOnInit(): void {
    this.getNotices();
  }

  getNotices() {
    this.noticesService
      .getNotices()
      .pipe(
        catchError((err) => {
          console.log(err);
          return of([]);
        })
      )
      .subscribe({
        next: (data) => {
          this.notices.set(data);
        },
      });
  }

  openConfirmDelete(notice: Notice) {
    this.confirmationService.confirm({
      header: 'Eliminar Aviso',
      message: '¿Está seguro que desea eliminar el aviso?',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deleteNotice(notice);
      },
    });
  }

  deleteNotice(notice: Notice) {
    this.noticesService
      .deleteNotice(notice.id!)
      .pipe(
        catchError((err) => {
          console.log(err);
          return throwError(() => err);
        })
      )
      .subscribe({
        next: (data) => {
          console.log(data);
          
          this.getNotices();
        },
      });
  }
}
