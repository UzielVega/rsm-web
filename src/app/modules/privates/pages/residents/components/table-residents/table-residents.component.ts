import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  BehaviorSubject,
  catchError,
  Subject,
  takeUntil,
  throwError,
} from 'rxjs';
import {
  SocketsService,
  ResidentService,
  ErrorHandlerService,
  ListService,
} from '../../../../../../services';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Button, Resident } from '../../../../../../interfaces';
import { UpdateResidentsComponent } from '../update-residents/update-residents.component';
import { Table } from 'primeng/table';
import { CreateResidentsComponent } from '../create-residents/create-residents.component';

@Component({
  selector: 'app-table-residents',
  templateUrl: './table-residents.component.html',
  styleUrl: './table-residents.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableResidentsComponent {
  private destroy$ = new Subject<void>();
  public dialog: DynamicDialogRef | undefined;
  public ref: DynamicDialogRef | undefined;
  private dialogService = inject(DialogService);
  private socketService = inject(SocketsService);
  private residentService = inject(ResidentService);
  private confirmationService = inject(ConfirmationService);
  private errorHandlerService = inject(ErrorHandlerService);
  private listService = inject(ListService);
  private messageService = inject(MessageService);
  public residents$ = new BehaviorSubject<Resident[]>([]);
  public residents = signal<Resident[]>([]);

  searchValue: string | undefined;

  public buttons: Button[] = [
    {
      icon: 'pi pi-pencil',
      severity: 'primary',
      id: 'edit-button',
      tooltip: 'Editar',
      tooltipPosition: 'bottom',
      action: (resident: Resident) => this.update('update', resident),
    },
    {
      icon: 'pi pi-key',
      severity: 'secondary',
      id: 'reset-password-button',
      tooltip: 'Restablecer Contraseña',
      tooltipPosition: 'bottom',
      action: (resident: Resident) => this.resetPassword(resident),
    },
    {
      icon: 'pi pi-send',
      severity: 'info',
      id: 'send-credentials-button',
      tooltip: 'Enviar Credenciales',
      tooltipPosition: 'bottom',
      action: (resident: Resident) => this.sendCredentials(resident),
    },
    {
      icon: 'pi pi-lock',
      severity: 'warning',
      id: 'block-button',
      tooltip: 'Bloquear',
      tooltipPosition: 'bottom',
      action: (resident: Resident) => this.lockUnlock(resident),
    },
    {
      icon: 'pi pi-trash',
      severity: 'danger',
      id: 'edit-button',
      tooltip: 'Eliminar',
      tooltipPosition: 'bottom',
      action: (resident: Resident) => this.delete(resident),
    },
  ];
  constructor() {}

  ngOnInit(): void {
    this.getAll();
    this.socketService.subscribeToEvent<Resident>(
      'resident:added',
      (resident) => this.handleResidentEvent('added', resident)
    );
    this.socketService.subscribeToEvent<Resident>(
      'resident:deleted',
      (resident) => this.handleResidentEvent('deleted', resident)
    );
    this.socketService.subscribeToEvent<Resident>(
      'resident:updated',
      (resident) => this.handleResidentEvent('updated', resident)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getAll() {
    this.residentService
      .getAll()
      .pipe(
        this.errorHandlerService.handleError<Resident[]>([]),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (residents) => {
          this.residents.set(residents); // Actualiza el signal
          this.residents$.next(residents); // Emite a BehaviorSubject para async pipe
        },
      });
  }

  private handleResidentEvent(eventType: string, resident: Resident) {
    if (!resident) return;

    this.residents.update((residents) => {
      let updatedResidents;
      switch (eventType) {
        case 'added':
          updatedResidents = this.listService.addItemToList(
            residents!,
            resident
          );
          break;
        case 'deleted':
          updatedResidents = this.listService.removeItemFromList(
            residents!,
            resident,
            (a, b) => a.uuid === b.uuid
          );
          break;
        case 'updated':
          updatedResidents = this.listService.updateItemInList(
            residents!,
            resident,
            (a, b) => a.uuid === b.uuid
          );
          
          break;
        default:
          updatedResidents = residents;
      }

      this.residents$.next(updatedResidents); // Emitir actualización a BehaviorSubject
      return updatedResidents; // Actualizar el signal
    });
  }

  clear(table: Table) {
    table.clear();
    this.searchValue = '';
  }

  add() {
    this.ref = this.dialogService.open(CreateResidentsComponent, {
      header: 'Nuevo Residente',
      contentStyle: { overflow: 'auto' },
    });
  }

  sendCredentials(resident: Resident) {
    this.residentService
      .sendCredentials(resident.uuid!)
      .pipe(
        catchError((err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Ocurrio un error al enviar las credenciales',
            detail: err.error.message,
          });
          return throwError(() => err);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (data) => {          
          this.messageService.add({
            severity: 'success',
            summary: 'Credenciales enviadas',
            detail:
              'Las credenciales han sido enviadas al Whatsapp del residente',
          });
        },
      });
  }

  update(type: string, resident: Resident) {
    this.dialog = this.dialogService.open(UpdateResidentsComponent, {
      header: type === 'update' ? 'Editar Residente' : 'Restablecer Contraseña',
      data: { type, resident },
      contentStyle: { overflow: 'auto' },
    });
  }

  lockUnlock(resident: Resident) {
    this.confirmationService.confirm({
      message: `Quieres ${
        resident.isActive ? 'bloquear' : 'desbloquear'
      } el residente ${resident.name?.toUpperCase()}?`,
      header: `Confirmación de ${resident.isActive ? 'Bloqueo' : 'Desbloqueo'}`,
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      acceptLabel: 'Sí',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.residentService
          .update(
            {
              isActive: resident.isActive ? false : true,
            },
            resident.uuid!
          )
          .pipe(
            catchError((err) => {
              this.messageService.add({
                icon: '',
                severity: 'error',
                summary: 'Ocurrio un error',
                detail: err.error.message,
              });
              return throwError(() => err);
            }),
            takeUntil(this.destroy$)
          )
          .subscribe({
            next: (resident) => {
              this.messageService.add({
                severity: resident.isActive ? 'warn' : 'success',
                summary: `Residente ${
                  resident.isActive ? 'Bloqueado' : 'Desbloqueado'
                }`,
              }),
                this.socketService.emit('resident:updated', resident);
            },
          });
      },
    });
  }

  resetPassword(resident: Resident) {
    this.confirmationService.confirm({
      message: '¿Quieres restablecer la contraseña de este Residente?',
      header: 'Confirmación de Cambio de Contraseña',
      icon: 'pi pi-info-circle',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      rejectButtonStyleClass: 'p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      accept: () => {
        this.residentService
          .resetPassword(resident.uuid!)
          .pipe(
            catchError((err) => {
              this.messageService.add({
                icon: '',
                severity: 'error',
                summary: 'Ocurrio un error al restablecer la contraseña',
                detail: err.error.message,
              });
              return throwError(() => err);
            }),
            takeUntil(this.destroy$)
          )
          .subscribe({
            next: (resident) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Contraseña Restablecida',
                detail: 'La contraseña ha sido restablecida correctamente',
              });              
              this.socketService.emit('resident:updated',resident);

              setTimeout(() => {
                this.dialog = this.dialogService.open(UpdateResidentsComponent, {
                  header: 'Enviar Credenciales',
                  data: { type: 'sent-credentials', resident },
                  contentStyle: { overflow: 'auto' },
                });
              }, 1000);
            },
          });
      },
    });
  }

  delete(resident: Resident) {
    this.confirmationService.confirm({
      message: '¿Quieres eliminar este Residente?',
      header: 'Confirmación de Eliminación',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      acceptLabel: 'Si',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      accept: () => {
        this.residentService
          .delete(resident.uuid!)
          .pipe(
            catchError((err) => {
              this.messageService.add({
                icon: '',
                severity: 'error',
                summary: 'Ocurrio un error al eliminar el residente',
                detail: err.error.message,
              });

              return throwError(() => err);
            }),
            takeUntil(this.destroy$)
          )
          .subscribe({
            next: () => {
              this.messageService.add({
                icon: '',
                severity: 'warn',
                summary: `Residente Eliminado`,
              });
              this.socketService.emit('resident:deleted');
            },
          });
      },
    });
  }
}
