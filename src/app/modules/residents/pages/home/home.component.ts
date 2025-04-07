import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { AuthService, SocketsService } from '../../../../services';
import { Resident } from '../../../../interfaces';
import { DialogService } from 'primeng/dynamicdialog';
import { OpenDoorComponent } from './components/open-door/open-door.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private authService = inject(AuthService);
  private socketService = inject(SocketsService);
  private dialog = inject(DialogService);
  public resident = computed<Resident>(() => this.authService.currentUser()!);

  public residentName = computed<string>(
    () => this.authService.currentUser()?.name!
  );
  greetingMessage: string = '';

  constructor() {}

  ngOnInit(): void {
    this.setGreetingMessage();
    this.openDoor();
  }

  openDoor(): void {
    this.socketService.listen('response[front]:validate_access').subscribe({
      next: (data) => {
        if (this.resident().uuid === data.resident.uuid) {
          this.dialog.open(OpenDoorComponent, {
            header: 'Abrir puerta',
            width: '70%',
            height: '50%',
            data: {
              resident: this.resident(),
              panelData: data.panelData,
            },
          });
        }
      },
    });
  }

  setGreetingMessage() {
    const hour = new Date().getHours();
    if (hour < 12) {
      this.greetingMessage = 'Buenos días';
    } else if (hour < 18) {
      this.greetingMessage = 'Buenas tardes';
    } else {
      this.greetingMessage = 'Buenas noches';
    }
  }
}
