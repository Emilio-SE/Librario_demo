import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import * as ApexCharts from 'apexcharts';

import { StatisticsService } from '../../models/services/statistics.service';

import { ToastrUtils } from 'src/app/core/utils/Toastr/toastr.utils';

import { MonthNames } from '../../models/const/statistics.const';

import { ExpensesPerMonth } from '../../models/interfaces/statistics.interface';

@Component({
  selector: 'app-finance-statistics',
  templateUrl: './finance-statistics.component.html',
  styleUrls: ['./finance-statistics.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinanceStatisticsComponent implements OnInit {
  private _statisticsSvc = inject(StatisticsService);
  private _destroyRef = inject(DestroyRef);
  private _cdr = inject(ChangeDetectorRef);

  private _toastrUtil = new ToastrUtils();

  public monthNames = MonthNames;
  public isLoaded: boolean | undefined;
  public totalMoney: number = 0;
  public statistics: ExpensesPerMonth[] = [];

  private _options = {
    series: [
      {
        name: '',
        data: [0],
      },
    ],
    chart: {
      height: 350,
      type: 'line',
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'straight',
    },
    markers: {
      size: 5,
    },
    title: {
      text: 'Gastos por mes',
      align: 'left',
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'],
        opacity: 0.5,
      },
    },
    xaxis: {
      categories: [
        'Ene',
        'Feb',
        'Mar',
        'Abr',
        'May',
        'Jun',
        'Jul',
        'Ago',
        'Sep',
        'Oct',
        'Nov',
        'Dic',
      ],
    },
  };
  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.getData(null);
  }

  public getData(event: any): void {
    this.isLoaded = undefined;
    this._statisticsSvc
      .getFinanceStatistics()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (data) => {
          this.setData(data);
          this.setChart(data);
          if (event) {
            event.target.complete();
          }
          this._cdr.detectChanges();
        },
        error: (err) => {
          this._toastrUtil.emitInfoToast(
            'danger',
            'Error al obtener las estadísticas de los libros ' +
              err.error.message
          );
          this.isLoaded = false;
          if (event) {
            event.target.complete();
          }
          this._cdr.detectChanges();
        }
      });
  }

  private setData(data: ExpensesPerMonth[]): void {
    this.isLoaded = true;
    this.totalMoney = data.reduce((acc, curr) => acc + curr.totalSpent, 0);
    this.statistics = data;
    this._cdr.detectChanges();
  }

  private setChart(data: ExpensesPerMonth[]): void {
    this._options.series = [
      {
        name: 'Dinero',
        data: data.map((d) => d.totalSpent),
      },
    ];

    const chart = new ApexCharts(
      document.querySelector('#readChart'),
      this._options
    );
    chart.render();
  }

  public getMonthName(month: number): string {
    return this.monthNames[month as keyof typeof MonthNames];
  }
}
