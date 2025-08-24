import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardActions, MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, firstValueFrom } from 'rxjs';
import { HERO_ROUTES } from '../../../core/constants/routes';
import { HeroService } from '../../../core/services/hero/hero';
import { Hero } from '../../../models/hero.model';
import { LoadingSpinner } from "../../../shared/components/loading-spinner/loading-spinner";
@Component({
  selector: 'app-hero-list',
  imports: [CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatCardActions,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule, LoadingSpinner],
  templateUrl: './hero-list.html',
  styleUrl: './hero-list.css'
})
export class HeroList {

  private heroService = inject(HeroService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  private searchTerm = signal<string>('');
  private allHeroes = signal<Hero[]>([]);
  private isLoading = toSignal(this.heroService.loading$);

  private pageSize = signal<number>(5);
  private currentPage = signal<number>(0);
  PAGINATOR = [5, 10, 50, 100];
  loadingMessage = 'Cargando héroes...';

  filterForm: FormGroup = this.fb.group({
    search: [''],
  });

  displayedColumns: string[] = ['Nro.', 'name', 'powers', 'createdBy', 'actions'];

  get dataHeroes() { return this.paginatedHeroes(); }
  get loading() { return this.isLoading(); }
  get pageIndex() { return this.currentPage(); }
  get pageSizeValue() { return this.pageSize(); }

  totalHeroes = computed(() => this.allHeroes().length);
  totalFilteredHeroes = computed(() => this.filteredHeroes().length);

  constructor() {
    this.loadHeroes();

    effect(() => {
      this.filterForm.get('search')?.valueChanges
        .pipe(
          debounceTime(400),
          distinctUntilChanged()
        ).subscribe(value => {
          this.searchTerm.set(value || '');
          this.currentPage.set(0);
        });
    });

  }

  private async loadHeroes(): Promise<void> {

    try {
      const heroes = await firstValueFrom(this.heroService.getAllHeroes());
      this.allHeroes.set(heroes || []);

    } catch (error) {
      console.error('Error cargando héroes:', error);
    }
  }


  paginatedHeroes = computed(() => {
    const filtered = this.filteredHeroes();
    const pageSize = this.pageSize();
    const currentPage = this.currentPage();
    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;

    return filtered.slice(startIndex, endIndex);
  });

  filteredHeroes = computed(() => {
    const searchTerm = this.searchTerm();
    let heroes = [...this.allHeroes()];

    if (searchTerm) {
      heroes = heroes.filter(hero =>
        hero.name.toLowerCase().includes(searchTerm) ||
        hero.powers.some(power => power.name.includes(searchTerm))
      );
    }
    return heroes;
  });

  getRowNumber(index: number): number {
    return index + 1;
  }

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  addHero(): void {
    this.router.navigate([HERO_ROUTES.NEW_HERO]);
  }

  deleteHero(heroId: number): void {
    this.heroService.deleteHero(heroId).subscribe(() => {
      this.loadHeroes();
    });
  }

}
