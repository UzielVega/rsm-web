import { catchError, Observable, of } from 'rxjs';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagsComponent {
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  

  constructor(){
  
  }
}
