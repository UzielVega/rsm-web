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
  StreetService,
  HouseService,
  ErrorHandlerService,
  ListService,
} from '../../../../../../services';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Button, House, Street } from '../../../../../../interfaces';
import { UpdateStreetsComponent } from '../update-streets/update-streets.component';
import { Table } from 'primeng/table';
import { CreateStreetsComponent } from '../create-streets/create-streets.component';

@Component({
  selector: 'app-table-streets',
  templateUrl: './table-streets.component.html',
  styleUrl: './table-streets.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableStreetsComponent {
  private destroy$ = new Subject<void>();
  public dialog: DynamicDialogRef | undefined;
  private dialogService = inject(DialogService);
  private socketService = inject(SocketsService);
  private streetService = inject(StreetService);
  private listService = inject(ListService);
  private houseService = inject(HouseService);
  private confirmationService = inject(ConfirmationService);
  private errorHandlerService = inject(ErrorHandlerService);
  private messageService = inject(MessageService);
  public streets$ = new BehaviorSubject<Street[]>([]);
  public streets = signal<Street[]>([]);
  public ref: DynamicDialogRef | undefined;

  searchValue: string | undefined;

  public buttons: Button[] = [
    {
      icon: 'pi pi-pencil',
      severity: 'primary',
      id: 'edit-button',
      tooltip: 'Editar',
      tooltipPosition: 'bottom',
      action: (street: Street) => this.update('update', street),
    },
    {
      icon: 'pi pi-shield',
      severity: 'primary',
      id: 'edit-password-button',
      tooltip: 'Asignar Administrador',
      tooltipPosition: 'bottom',
      action: (street: Street) => this.updateAdmin('update-admin', street),
    },
    {
      icon: 'pi pi-lock',
      severity: 'warning',
      id: 'block-button',
      tooltip: 'Bloquear',
      tooltipPosition: 'bottom',
      action: (street: Street) => this.lockUnlock(street),
    },
    {
      icon: 'pi pi-trash',
      severity: 'danger',
      id: 'edit-button',
      tooltip: 'Eliminar',
      tooltipPosition: 'bottom',
      action: () => {},
    },
  ];
  constructor() {}
  ngOnInit(): void {
    this.getAll();
    this.socketService.subscribeToEvent<Street>('street:added', (street) =>
      this.handleEvent('added', street)
    );
    this.socketService.subscribeToEvent<Street>('street:deleted', (street) =>
      this.handleEvent('deleted', street)
    );
    this.socketService.subscribeToEvent<Street>('street:updated', (street) =>
      this.handleEvent('updated', street)
    );
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getAll() {
    this.streetService
      .getAll()
      .pipe(
        this.errorHandlerService.handleError<Street[]>([]),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (streets) => {
          this.streets.set(streets); // Actualiza el signal
          this.streets$.next(streets); // Emite a BehaviorSubject para async pipe
        },
      });
  }

  private handleEvent(eventType: string, street: Street) {
    if (!street) return;

    this.streets.update((streets) => {
      let updatedStreets;
      switch (eventType) {
        case 'added':
          updatedStreets = this.listService.addItemToList(streets!, street);
          break;
        case 'deleted':
          updatedStreets = this.listService.removeItemFromList(
            streets!,
            street,
            (a, b) => a.id === b.id
          );
          break;
        case 'updated':
          updatedStreets = this.listService.updateItemInList(
            streets!,
            street,
            (a, b) => a.id === b.id
          );

          break;
        default:
          updatedStreets = streets;
      }

      this.streets$.next(updatedStreets); // Emitir actualización a BehaviorSubject
      return updatedStreets; // Actualizar el signal
    });
  }
  clear(table: Table) {
    table.clear();
    this.searchValue = '';
  }

  updateAdmin(type: string, street: Street) {
    this.houseService
      .getByStreet(street.id!)
      .pipe(
        catchError((err) => {
          this.messageService.add({
            icon: 'pi pi-exclamation-triangle',
            severity: 'warn',
            summary: 'No se Puede Asignar Administrador',
            detail: 'Verifica que existan casas en esta calle.',
          });
          return throwError(() => err);
        })
      )
      .subscribe({
        next: (houses) => {
          if (houses) {
            this.update(type, street, houses);
          }
        },
      });
  }

  update(type: string, street: Street, houses?: House[]) {
    this.dialog = this.dialogService.open(UpdateStreetsComponent, {
      header:
        type === 'update-admin' ? 'Asignar Administrador' : 'Editar Calle',
      data: { type, street, houses },
      contentStyle: { overflow: 'hidden' },
    });
  }

  add() {
    this.ref = this.dialogService.open(CreateStreetsComponent, {
      header: 'Nueva Calle',
      contentStyle: { overflow: 'hidden' },
    });
  }

  lockUnlock(street: Street) {
    this.confirmationService.confirm({
      message: `Quieres ${
        street.isActive ? 'bloquear' : 'desbloquear'
      } la calle ${street.name?.toUpperCase()}?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      acceptLabel: 'Sí',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.streetService
          .update(
            {
              isActive: street.isActive ? false : true,
            },
            street.id!
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
            })
          )
          .subscribe({
            next: (street) => {
              this.messageService.add({
                severity: street.isActive ? 'warn' : 'success',
                summary: `Calle ${
                  street.isActive ? 'Bloqueada' : 'Desbloqueada'
                }`,
              });
              this.socketService.emit('street:updated', street);
            },
          });
      },
    });
  }
}
