import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-kpi-card',
  imports: [CommonModule,
    MatCardModule,
    MatIconModule],
  template: `
    <mat-card class="kpi-card">
        <mat-card-header>
            <mat-card-title>{{ title() }}</mat-card-title>
            <mat-card-subtitle>{{ subtitle() }}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content class="kpi-card-content">
            <p>{{ value() }}</p>
        </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .kpi-card {
        margin: 16px;
    }
    .kpi-card-content {
        font-size: 20px;
        font-weight: bold;
    }
  `]
})
export class KpiCard {

  title = input.required<string>();
  subtitle = input.required<string>();
  value = input.required<any>();

}
