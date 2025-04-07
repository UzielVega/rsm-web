import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { AuthService, ResidentService } from '../../services';
import { MessageService } from 'primeng/api';
import { catchError, of } from 'rxjs';
import { Resident } from '../../interfaces';
import { DialogService } from 'primeng/dynamicdialog';
import { DialogChangePasswordComponent } from './components/dialog-change-password/dialog-change-password.component';

@Component({
  selector: 'app-residents',
  templateUrl: './residents.component.html',
  styleUrl: './residents.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResidentsComponent {
  private residentService = inject(ResidentService);
  private messageService = inject(MessageService);
  private authService = inject(AuthService);
  private dialogService = inject(DialogService);
  private resident = computed<Resident>(() => this.authService.currentUser()!);

  public isFirstTime = computed<boolean>(
    () => this.authService.currentUser()?.isFirstTime!
  );
  public requiresPasswordReset = computed<boolean>(
    () => this.authService.currentUser()?.requiresPasswordReset!
  );
  constructor() {}

  ngOnInit(): void {
    this.loadChangePassword(this.isFirstTime(), this.requiresPasswordReset());
  }

  loadChangePassword(
    ifFirstTime: boolean,
    requiresPasswordReset: boolean
  ): void {
    if (ifFirstTime || requiresPasswordReset) {
      this.dialogService.open(DialogChangePasswordComponent, {
        header: 'Cambiar Contraseña',
        closable: false,
        closeOnEscape: false,
        width: '90%',
        data: {
          resident: this.resident(),
        },
      });
    }
  }
}
