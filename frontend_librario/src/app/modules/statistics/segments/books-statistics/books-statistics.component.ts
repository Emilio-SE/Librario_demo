import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import * as ApexCharts from 'apexcharts';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { StatisticsService } from '../../models/services/statistics.service';

import { ToastrUtils } from 'src/app/core/utils/Toastr/toastr.utils';

import { MonthNames } from '../../models/const/statistics.const';

import { ReadsPerMonth } from '../../models/interfaces/statistics.interface';

@Component({
  selector: 'app-books-statistics',
  templateUrl: './books-statistics.component.html',
  styleUrls: ['./books-statistics.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksStatisticsComponent implements OnInit {
  private _statisticsSvc = inject(StatisticsService);
  private _destroyRef = inject(DestroyRef);
  private _cdr = inject(ChangeDetectorRef);

  private _toastrUtil = new ToastrUtils();

  public monthNames = MonthNames;
  public isLoaded: boolean | undefined;
  public totalBooks: number = 0;
  public statistics: ReadsPerMonth[] = [];

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
      text: 'Libros leídos por mes',
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
      .getBooksStatistics()
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

  private setData(data: ReadsPerMonth[]): void {
    this.isLoaded = true;
    this.totalBooks = data.reduce((acc, curr) => acc + curr.count, 0);
    this.statistics = data;
    this._cdr.detectChanges();
  }

  private setChart(data: ReadsPerMonth[]): void {
    this._options.series = [
      {
        name: 'Libros',
        data: data.map((d) => d.count),
      },
    ];
    const chart = new ApexCharts(
      document.querySelector('#moneyChart'),
      this._options
    );
    chart.render();
  }

  public getMonthName(month: number): string {
    return this.monthNames[month as keyof typeof MonthNames];
  }
}
