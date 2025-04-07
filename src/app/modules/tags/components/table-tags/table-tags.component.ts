import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  of,
  takeUntil,
  throwError,
} from 'rxjs';
import {
  SocketsService,
  TagService,
  VehicleService,
  ListService,
  ErrorHandlerService,
} from '../../../../services';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Button, House, Street, Tag, Vehicle } from '../../../../interfaces';
import { UpdateTagComponent } from '../update-tag/update-tag.component';
import { CreateTagComponent } from '../create-tag/create-tag.component';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-table-tags',
  templateUrl: './table-tags.component.html',
  styleUrl: './table-tags.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableTagsComponent {
  public destroy$ = new Subject<void>();
  public dialog: DynamicDialogRef | undefined;
  private dialogService = inject(DialogService);
  private socketService = inject(SocketsService);
  private listService = inject(ListService);
  private tagService = inject(TagService);
  private vehicleService = inject(VehicleService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private errorService = inject(ErrorHandlerService);
  public streets$!: Observable<Street[]>;
  public ref: DynamicDialogRef | undefined;
  public tags$ = new BehaviorSubject<Tag[]>([]);
  public tags = signal<Tag[]>([]);

  houses$!: Observable<House[]>;
  selectedStreet = signal<Street | undefined>(undefined);
  selectedHouse = signal<House | undefined>(undefined);
  showHouse = false;
  searchValue: string | undefined;

  public buttons: Button[] = [
    {
      icon: 'pi pi-pencil',
      severity: 'primary',
      id: 'edit-button',
      tooltip: 'Editar',
      tooltipPosition: 'bottom',
      action: (tag: Tag) => this.updateTag('update', tag),
    },
    {
      icon: 'pi pi-car',
      severity: 'primary',
      id: 'edit-vehicle-button',
      tooltip: 'Asignar Vehiculo',
      tooltipPosition: 'bottom',
      action: (tag: Tag) => this.updateVehicle('update-vehicle', tag),
    },
    {
      icon: 'pi pi-lock',
      severity: 'warning',
      id: 'block-button',
      tooltip: 'Bloquear',
      tooltipPosition: 'bottom',
      action: (tag: Tag) => this.lockUnlockTag(tag),
    },
    {
      icon: 'pi pi-trash',
      severity: 'danger',
      id: 'edit-button',
      tooltip: 'Eliminar',
      tooltipPosition: 'bottom',
      action: (tag: Tag) => this.deleteTag(tag),
    },
  ];

  constructor() {}

  ngOnInit(): void {
    this.getTags();
    this.subscribeToSocketEvent<Tag>('tag:added', (tag) =>
      this.handleUserEvent('added', tag)
    );
    this.subscribeToSocketEvent<Tag>('tag:deleted', (tag) =>
      this.handleUserEvent('deleted', tag)
    );
    this.subscribeToSocketEvent<Tag>('tag:updated', (tag) => 
      this.handleUserEvent('updated', tag)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

  private handleUserEvent(eventType: string, tag: Tag) {
    if (!tag) return;

    this.tags.update((tags) => {
      let updatedTags;
      switch (eventType) {
        case 'added':
          updatedTags = this.listService.addItemToList(tags!, tag);
          break;
        case 'deleted':
          updatedTags = this.listService.removeItemFromList(
            tags!,
            tag,
            (a, b) => a.id === b.id
          );
          break;
        case 'updated':
          updatedTags = this.listService.updateItemInList(
            tags!,
            tag,
            (a, b) => a.id === b.id
          );
          break;
        default:
          updatedTags = tags;
      }

      this.tags$.next(updatedTags); // Emitir actualización a BehaviorSubject
      return updatedTags; // Actualizar el signal
    });
  }

  add() {
    this.ref = this.dialogService.open(CreateTagComponent, {
      header: 'Nuevo Tag',
      contentStyle: { overflow: 'hidden' },
    });
  }

  clear(table: Table) {
    table.clear();
    this.searchValue = '';
  }

  getTags() {
    this.tagService
      .getAll()
      .pipe(
        catchError((error) => {
          return of([]);
        })
      )
      .subscribe({
        next: (tags) => {
          this.tags.set(tags);
          this.tags$.next(tags);
        },
      });
  }

  updateVehicle(type: string, tag: Tag) {
    this.vehicleService.getByHouse(tag.house?.id!).pipe(catchError((err)=>{
      this.messageService.add({
        severity: 'warn',
        summary: `No hay vehiculos registrados en ${tag.house?.name}.`,
        detail: err.error.message,
      });
      return throwError(() => err);
    })).subscribe({
      next: (vehicles) => this.updateTag(type, tag, vehicles),
    });
  }

  updateTag(type: string, tag: Tag, vehicles?: Vehicle[]) {
    this.dialog = this.dialogService.open(UpdateTagComponent, {
      header: type === 'update-vehicle' ? 'Asignar Vehiculo' : 'Editar Tag',
      data: { type, tag, vehicles },
      contentStyle: { overflow: 'hidden' },
    });
  }

  lockUnlockTag(tag: Tag) {
    this.confirmationService.confirm({
      message: `Quieres ${
        tag.isActive ? 'bloquear' : 'desbloquear'
      } el tag ${tag.code?.toUpperCase()}?`,
      header: `Confirmación de ${tag.isActive ? 'Bloqueo' : 'Desbloqueo'}`,
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      acceptLabel: 'Sí',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.tagService
          .enableDisable(tag.id!)
          .pipe(
            this.errorService.handleError<Tag>({}),
            takeUntil(this.destroy$)
          )
          .subscribe({
            next: (tagUpdated) => {
              this.messageService.add({
                severity: tag.isActive ? 'warn' : 'success',
                summary: `Tag ${tag.isActive ? 'Bloqueado' : 'Desbloqueado'}`,
              }),
                this.socketService.emit('tag:updated', tagUpdated);
            },
          });
      },
    });
  }

  deleteTag(tag: Tag) {
    this.confirmationService.confirm({
      message: '¿Quieres eliminar este Tag?',
      header: 'Confirmación de Eliminación',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      acceptLabel: 'Si',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      accept: () => {
        this.tagService
          .delete(tag.id!)
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
            next: (tagUpdated) => {
              this.messageService.add({
                icon: '',
                severity: 'warn',
                summary: `Tag Eliminado`,
              }),
                this.socketService.emit('tag:deleted', tagUpdated);
            },
          });
      },
    });
  }
}
