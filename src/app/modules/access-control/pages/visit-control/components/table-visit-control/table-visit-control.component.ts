import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  BehaviorSubject,
  catchError,
  of,
  Subject,
  Subscription,
  takeUntil,
  throwError,
} from 'rxjs';
import {
  AccessesService,
  SocketsService,
  VisitService,
} from '../../../../../../services';
import { Accesses } from '../../../../../../interfaces/accesses.interfaces';
import { Visit, VisitAndCount } from '../../../../../../interfaces';

interface Counter {
  title: string;
  value: number;
}
@Component({
  selector: 'app-table-visit-control',
  templateUrl: './table-visit-control.component.html',
  styleUrl: './table-visit-control.component.scss',
})
export class TableVisitControlComponent {
  public destroy$ = new Subject<void>();
  public dialog: DynamicDialogRef | undefined;
  private socketService = inject(SocketsService);
  private visitService = inject(VisitService);
  public visits$ = new BehaviorSubject<Visit[]>([]);
  public countScheduled = signal<number>(0);
  public countEntered = signal<number>(0);
  public countExited = signal<number>(0);
  public countCanceled = signal<number>(0);

  public counters: Counter[] = [];

  constructor() {}

  ngOnInit(): void {
    this.getVisits();
    this.updateVisits();
    this.updateData();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setCounters(
    scheduled: number,
    entered: number,
    exited: number,
    canceled: number
  ) {
    this.counters = [
      { title: 'Programadas', value: scheduled },
      { title: 'Iniciadas', value: entered },
      { title: 'Terminadas', value: exited },
      { title: 'Canceladas', value: canceled },
    ];
  }

  updateVisits():void {
    this.socketService.listen('visit:added').pipe(
      takeUntil(this.destroy$),
      catchError((err) => {
        console.log(err);
        return throwError(() => err);
      })
    ).subscribe(() => {
      this.getVisits();
    });
  }

  updateData(): void {
    this.socketService.listen('visit:updated').pipe(
      takeUntil(this.destroy$),
      catchError((err) => {
        console.log(err);
        return throwError(() => err);
      })
    ).subscribe(() => {
      this.getVisits();
  })
}

  getVisits() {
    this.visitService
      .getAllAndCount()
      .pipe(
        catchError((err) => {
          console.log(err);
          takeUntil(this.destroy$);
          return throwError(() => err);
        })
      )
      .subscribe({
        next: (visits) => {
          this.visits$.next(visits.visits);
          this.setCounters(
            visits.scheduled,
            visits.entered,
            visits.exited,
            visits.canceled
          );
        },
      });
  }
}
