import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { NoticesService } from './../../services/notices.service';
import { Component, inject, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { catchError, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-create-notice',
  templateUrl: './create-notice.component.html',
  styleUrl: './create-notice.component.scss',
})
export class CreateNoticeComponent {
  private fb = inject(FormBuilder);
  private noticeService = inject(NoticesService);
  private dialog = inject(DynamicDialogRef);
  public messageService = inject(MessageService);
  public form!: FormGroup;

  constructor() {}

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.form = this.fb.group({
      title: [''],
      message: [''],
      endDate: [''],
    });
  }

  createNotice(): void {
    const data = this.form.value;
    this.noticeService
      .createNotice(data)
      .pipe(
        catchError((err) => {
          console.log(err);
          throwError(() => err);
          return err;
        })
      )
      .subscribe({
        next: (data) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Aviso creado',
            detail: 'El aviso ha sido creado correctamente',
          });
          this.dialog.close();
        },
      });
  }
}
