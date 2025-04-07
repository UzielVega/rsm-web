import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ReportService } from '../../services';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private reportService = inject(ReportService);
  public counters = signal<any>({
    streetsCount: 0,
    housesCount: 0,
    residentsCount: 0,
    visitsCount: 0,
  });

  constructor() {}

  ngOnInit(): void {
    this.getCounters();
  }

  ngOnDestroy(): void {}

  getCounters() {
    this.reportService
      .getCountersDashboard()
      .pipe(
        catchError((err) => {
          console.error(err);
          return [];
        })
      )
      .subscribe({
        next: (counters) => {
          this.counters.set(counters);
        },
      });
  }
  isDarkMode: boolean = false;
  displaySidebar: boolean = false;
  displayModal: boolean = false;
  selectedStat: any;

  activities = [
    { date: '2024-10-31', description: 'Entrada de visitante registrada.' },
    {
      date: '2024-10-30',
      description: 'Nueva casa registrada en Residencial A.',
    },
  ];
  filteredActivities = this.activities;
  notifications = [
    { message: 'Se ha detectado un nuevo visitante en la entrada principal.' },
    { message: 'Revisión de mantenimiento programada para la semana próxima.' },
  ];
  chartData = {
    labels: ['Residentes', 'Visitantes', 'Administración'],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726'],
      },
    ],
  };

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
  }

  toggleSidebar() {
    this.displaySidebar = !this.displaySidebar;
  }

  openModal(stat: any) {
    this.selectedStat = stat;
    this.displayModal = true;
  }

  filterActivities(timeframe: string) {
    const today = new Date();
    this.filteredActivities = this.activities.filter((activity) => {
      const activityDate = new Date(activity.date);
      if (timeframe === 'today') {
        return activityDate.toDateString() === today.toDateString();
      } else if (timeframe === 'week') {
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        return activityDate >= weekAgo && activityDate <= today;
      } else if (timeframe === 'month') {
        return (
          activityDate.getMonth() === today.getMonth() &&
          activityDate.getFullYear() === today.getFullYear()
        );
      }
      return false; // Default return value for unmatched timeframes
    });
  }
}
