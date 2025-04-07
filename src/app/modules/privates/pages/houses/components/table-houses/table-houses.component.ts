import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  BehaviorSubject,
  catchError,
  map,
  Subject,
  takeUntil,
  throwError,
} from 'rxjs';
import {
  AuthService,
  ErrorHandlerService,
  HouseService,
  ListService,
  SocketsService,
  StreetService,
} from '../../../../../../services';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Button, House, Street } from '../../../../../../interfaces';
import { UpdateHousesComponent } from '../update-houses/update-houses.component';
import { Table } from 'primeng/table';
import { CreateHousesComponent } from '../create-houses/create-houses.component';

@Component({
  selector: 'app-table-houses',
  templateUrl: './table-houses.component.html',
  styleUrl: './table-houses.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableHousesComponent {
  private readonly destroy$ = new Subject<void>();

  public dialog: DynamicDialogRef | undefined;
  private dialogService = inject(DialogService);
  private socketService = inject(SocketsService);
  private listService = inject(ListService);
  private errorService = inject(ErrorHandlerService);
  private streetService = inject(StreetService);
  private houseService = inject(HouseService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  public authService = inject(AuthService);
  public houses$ = new BehaviorSubject<House[]>([]);
  public streets = signal<Street[] | undefined>(undefined);
  public houses = signal<House[]>([]);
  public street = input<Street>();

  selectedStreet: Street | undefined;
  searchValue: string | undefined;

  public buttons: Button[] = [
    {
      icon: 'pi pi-pencil',
      severity: 'primary',
      id: 'edit-button',
      tooltip: 'Editar',
      expectedRoles: ['super-admin', 'admin'],
      tooltipPosition: 'bottom',
      action: (house: House) => this.openDialog('update', house),
    },
    {
      icon: 'pi pi-lock',
      severity: 'warning',
      id: 'block-button',
      tooltip: 'Bloquear',
      expectedRoles: ['super-admin', 'admin'],
      tooltipPosition: 'bottom',
      action: (house: House) => this.lockUnlockHouse(house),
    },
    {
      icon: 'pi pi-trash',
      severity: 'danger',
      id: 'edit-button',
      tooltip: 'Eliminar',
      expectedRoles: ['super-admin'],
      tooltipPosition: 'bottom',
      action: (house: House) => this.deleteHouse(house),
    },
  ];
  constructor() {}

  ngOnInit() {
    this.getAll();
    this.subscribeToSocketEvent<House>('house:added', (house) =>
      this.handleUserEvent('added', house)
    );
    this.subscribeToSocketEvent<House>('house:deleted', (house) =>
      this.handleUserEvent('deleted', house)
    );
    this.subscribeToSocketEvent<House>('house:updated', (house) =>
      this.handleUserEvent('updated', house)
    );
  }
  ngOnDestroy() {
    this.destroy$.next(); // Emite para finalizar las suscripciones
    this.destroy$.complete(); // Completa el Subject
  }

  getStreets() {
    this.streetService.getAll().subscribe({
      next: (streets) => this.streets.set(streets),
      error: (error: any) => {},
    });
  }

  clear(table: Table) {
    table.clear();
    this.searchValue = '';
  }
  private getAll() {
    this.houseService
      .getAll()
      .pipe(
        this.errorService.handleError<House[]>([]),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (houses) => {
          this.houses.set(houses); // Actualiza el signal
          this.houses$.next(houses); // Emite a BehaviorSubject para async pipe
        },
      });
  }



  add() {
    this.dialog = this.dialogService.open(CreateHousesComponent, {
      header: 'Crear Casa',
      data: { type: 'create', street: this.selectedStreet },
      contentStyle: { overflow: 'hidden' },
    });
  }
  private handleUserEvent(eventType: string, house: House) {
    if (!house) return;

    this.houses.update((houses) => {
      let updatedHouses;
      switch (eventType) {
        case 'added':
          updatedHouses = this.listService.addItemToList(houses!, house);
          break;
        case 'deleted':
          updatedHouses = this.listService.removeItemFromList(
            houses!,
            house,
            (a, b) => a.id === b.id
          );
          break;
        case 'updated':
          updatedHouses = this.listService.updateItemInList(
            houses!,
            house,
            (a, b) => a.id === b.id
          );
          break;
        default:
          updatedHouses = houses;
      }

      this.houses$.next(updatedHouses); // Emitir actualización a BehaviorSubject
      return updatedHouses; // Actualizar el signal
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

  openDialog(type: string, house: House) {
    this.dialog = this.dialogService.open(UpdateHousesComponent, {
      header: 'Actualiza Casa',
      data: { type, house },
      contentStyle: { overflow: 'hidden' },
    });
  }

  lockUnlockHouse(house: House) {
    this.confirmationService.confirm({
      message: `Quieres ${
        house.isActive ? 'bloquear' : 'desbloquear'
      } la casa ${house.name?.toUpperCase()}?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      acceptLabel: 'Sí',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.houseService
          .update(
            {
              isActive: house.isActive ? false : true,
            },
            house.id!
          )
          .pipe(
            this.errorService.handleError<House>({}),
            takeUntil(this.destroy$)
          )
          .subscribe({
            next: (houseUpdated) => {
              this.messageService.add({
                severity: house.isActive ? 'warn' : 'success',
                summary: `Casa ${
                  house.isActive ? 'Bloqueada' : 'Desbloqueada'
                }`,
              }),
                this.socketService.emit('house:updated', houseUpdated);
            },
          });
      },
    });
  }

  deleteHouse(house: House) {
    this.confirmationService.confirm({
      message: '¿Quieres eliminar esta casa?',
      header: 'Confirmación de eliminación',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      acceptLabel: 'Sí',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      accept: () => {
        this.houseService
          .delete(house.id!)
          .pipe(
            catchError((err) => {
              this.messageService.add({
                severity: 'error',
                summary: 'No se pudo eliminar la casa',
                detail: err.error.message,
              });
              return throwError(() => err);
            }),
            takeUntil(this.destroy$)
          )
          .subscribe({
            next: (house) => {
              this.messageService.add({
                icon: '',
                severity: 'warn',
                summary: `Casa Eliminada`,
                detail: `La casa ${house.name} ha sido eliminada`,
              }),
                this.socketService.emit('house:deleted', house);
            },
          });
      },
    });
  }
}
