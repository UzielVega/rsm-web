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
  AuthService,
  ErrorHandlerService,
  ListService,
  SocketsService,
  VehicleService,
} from '../../../../../../services';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Button, House, Street, Vehicle } from '../../../../../../interfaces';
import { UpdateVehiclesComponent } from '../update-vehicles/update-vehicles.component';
import { CreateVehiclesComponent } from '../create-vehicles/create-vehicles.component';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-table-vehicles',
  templateUrl: './table-vehicles.component.html',
  styleUrl: './table-vehicles.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableVehiclesComponent {
  public destroy$ = new Subject<void>();
  public dialog: DynamicDialogRef | undefined;
  public ref: DynamicDialogRef | undefined;
  private dialogService = inject(DialogService);
  private socketService = inject(SocketsService);
  private confirmationService = inject(ConfirmationService);
  private errorHandlerService = inject(ErrorHandlerService);
  private listService = inject(ListService);
  private vehicleService = inject(VehicleService);
  private messageService = inject(MessageService);
  public streets$ = new BehaviorSubject<Street[]>([]);
  public houses$ = new BehaviorSubject<House[]>([]);
  public house: House | undefined;
  public street: Street | undefined;
  public authService = inject(AuthService);
  public vehicles$ = new BehaviorSubject<Vehicle[]>([]);
  public vehicles = signal<Vehicle[]>([]);
  searchValue: string | undefined;

  public buttons: Button[] = [
    {
      icon: 'pi pi-pencil',
      severity: 'primary',
      id: 'edit-button',
      expectedRoles: ['super-admin', 'admin'],
      tooltip: 'Editar',
      tooltipPosition: 'bottom',
      action: (vehicle: Vehicle) =>
        this.update('update', vehicle),
    },
    {
      icon: 'pi pi-lock',
      severity: 'warning',
      id: 'block-button',
      tooltip: 'Bloquear',
      expectedRoles: ['super-admin', 'admin'],
      tooltipPosition: 'bottom',
      action: (vehicle: Vehicle) => this.lockUnlockVehicle(vehicle),
    },
    {
      icon: 'pi pi-trash',
      severity: 'danger',
      id: 'edit-button',
      tooltip: 'Eliminar',
      expectedRoles: ['super-admin'],
      tooltipPosition: 'bottom',
      action: (vehicle: Vehicle) =>
        this.deleteVehicle(vehicle),
    },
  ];
  constructor() {}
  ngOnInit(): void {
    this.getAll();
    // Suscribe a eventos de socket para agregar, actualizar o eliminar usuarios
    this.socketService.subscribeToEvent<Vehicle>('vehicle:added', (vehicle) =>
      this.handleEvent('added', vehicle)
    );
    this.socketService.subscribeToEvent<Vehicle>('vehicle:deleted', (vehicle) =>
      this.handleEvent('deleted', vehicle)
    );
    this.socketService.subscribeToEvent<Vehicle>(
      'vehicle:updated',
      (vehicle) => {
        console.log(vehicle), this.handleEvent('updated', vehicle);
      }
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getAll() {
    this.vehicleService
      .getAll()
      .pipe(
        this.errorHandlerService.handleError<Vehicle[]>([]),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (vehicles) => {
          this.vehicles.set(vehicles); // Actualiza el signal
          this.vehicles$.next(vehicles);
        },
      });
  }
  private handleEvent(eventType: string, vehicle: Vehicle) {
    if (!vehicle) return;

    this.vehicles.update((vehicles) => {
      let updatedVehicles;
      switch (eventType) {
        case 'added':
          updatedVehicles = this.listService.addItemToList(vehicles!, vehicle);
          break;
        case 'deleted':
          updatedVehicles = this.listService.removeItemFromList(
            vehicles!,
            vehicle,
            (a, b) => a.id === b.id
          );
          break;
        case 'updated':
          updatedVehicles = this.listService.updateItemInList(
            vehicles!,
            vehicle,
            (a, b) => a.id === b.id
          );
          break;
        default:
          updatedVehicles = vehicles;
      }

      this.vehicles$.next(updatedVehicles); // Emitir actualización a BehaviorSubject
      return updatedVehicles;
    });
  }

  clear(table: Table) {
    table.clear();
    this.searchValue = '';
  }

  add() {
    this.ref = this.dialogService.open(CreateVehiclesComponent, {
      header: 'Nuevo Vehiculo',
      contentStyle: { overflow: 'hidden' },
    });
  }

  update(type: string, vehicle: Vehicle) {
    this.dialog = this.dialogService.open(UpdateVehiclesComponent, {
      header: 'Editar Vehiculo',
      data: { type, vehicle },
      contentStyle: { overflow: 'hidden' },
    });
  }

  lockUnlockVehicle(vehicle: Vehicle) {
    this.confirmationService.confirm({
      header: 'Confirmación',
      message: `Quieres ${
        vehicle.isActive ? 'bloquear' : 'desbloquear'
      } el vehiculo con placa ${vehicle.plate!.toUpperCase()}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      acceptLabel: 'Sí',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.vehicleService
          .enableDisable(vehicle.id!)
          .pipe(
            catchError((err) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Ocurrio un error',
                detail: err.error.message,
              });
              return throwError(() => err);
            })
          )
          .subscribe({
            next: (vehicleUpdated) => {
              this.messageService.add({
                severity: vehicle.isActive ? 'warn' : 'success',
                summary: `Vehiculo ${
                  vehicle.isActive ? 'Bloqueado' : 'Desbloqueado'
                }`,
              }),
                this.socketService.emit('vehicle:updated', vehicleUpdated);
            },
          });
      },
    });
  }

  deleteVehicle(vehicle: Vehicle) {
    this.confirmationService.confirm({
      message: '¿Quieres eliminar este Vehiculo?',
      header: 'Confirmación de eliminación',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      acceptLabel: 'Si',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      accept: () => {
        this.vehicleService.delete(vehicle.id!).pipe(catchError((err)=> {
          this.messageService.add({
            icon: '',
            severity: 'error',
            summary: 'Ocurrio un error',
            detail: err.error.message,
          });
          return throwError(() => err);
        })).subscribe({
          next: (vechicleDeleted) =>
          {
            this.messageService.add({
              icon: '',
              severity: 'warn',
              summary: `Vehiculo Eliminado`,
            })
            this.socketService.emit('vehicle:deleted', vechicleDeleted);
          }
        });
      },
    });
  }
}
