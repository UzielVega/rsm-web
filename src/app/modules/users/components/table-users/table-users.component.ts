import { environment } from './../../../../../environments/environment';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  AuthService,
  SocketsService,
  UserService,
  ErrorHandlerService,
  ListService,
} from '../../../../services';
import { User, Button } from '../../../../interfaces';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormUpdateUserComponent } from '../forms/form-update-user/form-update-user.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormCreateUserComponent } from '../forms/form-create-user/form-create-user.component';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-table-users',
  templateUrl: './table-users.component.html',
  styleUrl: './table-users.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableUsersComponent {
  private destroy$ = new Subject<void>();
  public ref: DynamicDialogRef | undefined;
  public dialog: DynamicDialogRef | undefined;
  private dialogService = inject(DialogService);
  private socketService = inject(SocketsService);
  private listService = inject(ListService);
  private userService = inject(UserService);
  private errorService = inject(ErrorHandlerService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  public authService = inject(AuthService);
  public users$ = new BehaviorSubject<User[]>([]);
  public users = signal<User[]>([]);
  public urlProfilePhoto = `${environment.urlServer}${environment.pathProfilePhoto}`;

  searchValue: string | undefined;

  public buttons: Button[] = [
    {
      icon: 'pi pi-pencil',
      severity: 'primary',
      id: 'edit-button',
      expectedRoles: ['super-admin', 'admin'],
      action: (user: User) => this.openUpdateDialog('update', user),
    },
    {
      icon: 'pi pi-key',
      severity: 'primary',
      id: 'edit-password-button',
      expectedRoles: ['super-admin', 'admin'],
      action: (user: User) => this.openUpdateDialog('update-password', user),
    },
    {
      icon: 'pi pi-user',
      severity: 'primary',
      id: 'edit-role-button',
      expectedRoles: ['super-admin', 'admin'],
      action: (user: User) => this.openUpdateDialog('update-role', user),
    },
    {
      icon: 'pi pi-lock',
      severity: 'warning',
      id: 'block-button',
      expectedRoles: ['super-admin', 'admin'],
      action: (user: User) => this.lockUnlockUser(user),
    },
    {
      icon: 'pi pi-trash',
      severity: 'danger',
      id: 'delete-button',
      expectedRoles: ['super-admin'],
      action: (user: User) => this.deleteUser(user),
    },
  ];
  constructor() {}

  ngOnInit() {
    this.getAll();
    // Suscribe a eventos de socket para agregar, actualizar o eliminar usuarios
    this.subscribeToSocketEvent<User>('user:added', (user) =>
      this.handleUserEvent('added', user)
    );
    this.subscribeToSocketEvent<User>('user:deleted', (user) =>
      this.handleUserEvent('deleted', user)
    );
    this.subscribeToSocketEvent<User>('user:updated', (user) =>
      this.handleUserEvent('updated', user)
    );
  }

  ngOnDestroy() {
    this.destroy$.next(); // Emite para finalizar las suscripciones
    this.destroy$.complete(); // Completa el Subject
  }

  ngAfterViewInit() {}

  clear(table: Table) {
    table.clear();
    this.searchValue = ''
}

  private getAll() {
    this.userService
      .getAll()
      .pipe(this.errorService.handleError<User[]>([]), takeUntil(this.destroy$))
      .subscribe({
        next: (users) => {
          this.users.set(users); // Actualiza el signal
          this.users$.next(users); // Emite a BehaviorSubject para async pipe
        },
      });
  }

  openNew() {
    this.ref = this.dialogService.open(FormCreateUserComponent, {
      header: 'Nuevo Usuario',
      width: '40vw',
      contentStyle: { overflow: 'auto' },
      breakpoints: {
        '1650px': '30vw',
        '1200px': '40vw',
        '960px': '60vw',
        '640px': '85vw',
      },
    });
  }

  private handleUserEvent(eventType: string, user: User) {
    if (!user) return;

    this.users.update((users) => {
      let updatedUsers;
      switch (eventType) {
        case 'added':
          updatedUsers = this.listService.addItemToList(users!, user);
          break;
        case 'deleted':
          updatedUsers = this.listService.removeItemFromList(
            users!,
            user,
            (a, b) => a.uuid === b.uuid
          );
          break;
        case 'updated':
          updatedUsers = this.listService.updateItemInList(
            users!,
            user,
            (a, b) => a.uuid === b.uuid
          );
          break;
        default:
          updatedUsers = users;
      }

      this.users$.next(updatedUsers); // Emitir actualización a BehaviorSubject
      return updatedUsers; // Actualizar el signal
    });
  }

  private subscribeToSocketEvent<T>(
    eventName: string,
    handler: (data: T) => void
  ) {
    this.socketService
      .listen(eventName)
      .pipe(
        this.errorService.handleError<T>(null as unknown as T),
        takeUntil(this.destroy$)
      )
      .subscribe(handler);
  }

  openUpdateDialog(type: string, user: User) {
    this.dialog = this.dialogService.open(FormUpdateUserComponent, {
      header: 'Actualizar Usuario',
      data: { type, user },
      breakpoints: {
        '1920px': '30vw',
        '1650px': '40vw',
        '1440px': '50vw',
        '1200px': '60vw',
        '960px': '70vw',
        '640px': '85vw',
      },
      contentStyle: { overflow: 'auto' },
    });
  }

  lockUnlockUser(user: User) {
    this.confirmationService.confirm({
      message: `Quieres ${
        user.isActive ? 'bloquear' : 'desbloquear'
      } a ${user.name?.toUpperCase()}?`,
      header: `Confirmación de ${user.isActive ? 'bloqueo' : 'desbloqueo'}`,
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      acceptLabel: 'Sí',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.userService
          .update(
            {
              isActive: user.isActive ? false : true,
            },
            user.uuid!
          )
          .pipe(
            this.errorService.handleError<User>({}),
            takeUntil(this.destroy$) // Finaliza cuando destroy$ emite un valor
          )
          .subscribe({
            next: (userUpdated) => {
              console.log(userUpdated);

              this.messageService.add({
                severity: user.isActive ? 'warn' : 'success',
                summary: `Usuario ${
                  user.isActive ? 'Bloqueado' : 'Desbloqueado'
                }`,
              });
              this.socketService.emit('user:updated', userUpdated);
            },
          });
      },
    });
  }

  deleteUser(user: User) {
    this.confirmationService.confirm({
      message: '¿Quieres eliminar este registro?',
      header: 'Confirmación de eliminación',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      acceptLabel: 'Si',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      accept: () => {
        this.userService
          .delete(user.uuid!)
          .pipe(
            this.errorService.handleError<User>({}),
            takeUntil(this.destroy$)
          )
          .subscribe({
            next: (user) => {
              this.messageService.add({
                icon: '',
                severity: 'warn',
                summary: `Usuario Eliminado`,
              }),
                this.socketService.emit('user:deleted', user);
            },
          });
      },
    });
  }
}
