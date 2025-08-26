import { computed, inject, Injectable, signal } from '@angular/core';
import { Hero } from '../../../models/hero.model';
import { Power } from '../../../models/power.model';
import { delay, Observable, of, throwError } from 'rxjs';
import { AuthService } from '../auth/auth';
import { RequestService } from '../request/request';

@Injectable({
  providedIn: 'root'
})
export class HeroService extends RequestService {
  private ENTITY = 'Héroe';
  private authService = inject(AuthService);

  private heros = signal<Hero[]>(
    [
      new Hero(1, 'Superman', [
        new Power(1, 'Súper Fuerza', 'Fuerza sobrenatural'),
        new Power(2, 'Vuelo', 'vuela'),
        new Power(3, 'Visión de Rayos X', 'Ver a través de todo')
      ], 'Sistema', 'https://example.com/superman.jpg'),

      new Hero(2, 'Hombre Araña', [
        new Power(9, 'Telarañas', 'Disparo de telarañas'),
        new Power(10, 'Sentido Arácnido', 'anticipa peligro'),
        new Power(11, 'Agilidad', 'Agilidad')
      ], 'Sistema', 'https://example.com/spiderman.jpg'),

      new Hero(3, 'X-MEN', [
        new Power(12, 'Súper Fuerza', 'Fuerza sobrenatural'),
      ], 'Sistema', ''),
      new Hero(4, 'Batman', [
        new Power(16, 'Artes Marciales', 'Combate cuerpo a cuerpo'),
      ], 'Sistema', ''),
      new Hero(5, 'Robin', [
        new Power(18, 'Artes Marciales', 'Combate cuerpo a cuerpo'),
      ], 'Sistema', ''),
      new Hero(6, 'SuperPerro', [
        new Power(55, 'Súper Mordida', 'Fuerza Perruna'),
      ], 'Sistema', ''),
      new Hero(7, 'Hombre Agil', [
        new Power(11, 'Agilidad', 'Agilidad')
      ], 'Sistema', ''),
      new Hero(8, 'Mujer maravilla', [
        new Power(2, 'Vuelo', 'vuela'),
      ], 'Sistema', ''),
    ]
  )
  readonly currentUser = this.authService.currentUser;
  public readonly totalHeroes = computed(() => this.heros().length);

  getNewId(): number {
    const cHeros = this.heros()
    return cHeros.length > 0 ? cHeros.length + 1 : 1;
  }

  getAllHeroes(): Observable<Hero[]> {
    return this.query(of(this.heros()).pipe(delay(1000)));
  }

  getHeroById(id: number): Observable<Hero | undefined> {
    const heroById = this.heros().find(hero => hero.id === id)
    return this.query(of(heroById || undefined).pipe(delay(500)));
  }

  registerHero(heroData: Omit<Hero, 'id'>): Observable<Hero | null> {
    const currentHeroes = this.heros();

    const maxId = this.getNewId();
    const newHero = new Hero(
      maxId,
      heroData.name,
      heroData.powers,
      this.currentUser()?.name || 'testuser',
      heroData.imageUrl,
    );

    this.heros.set([...currentHeroes, newHero]);

    return this.create(of(newHero).pipe(delay(500)), this.ENTITY);
  }

  updateHero(hero: Hero): Observable<Hero> {

    const currentHeroes = this.heros();
    const idx = currentHeroes.findIndex(h => h.id === hero.id);

    if (idx === -1) {
      return throwError(() => new Error('El héroe no existe'));
    }

    const updatedHeroes = [...currentHeroes];
    updatedHeroes[idx] = { ...hero };
    this.heros.set(updatedHeroes);

    return this.update(of(hero).pipe(delay(500)), this.ENTITY);
  }

  deleteHero(id: number): Observable<boolean> {
    const currentHeroes = this.heros();
    const idx = currentHeroes.findIndex(h => h.id === id);

    if (idx === -1) {
      return throwError(() => new Error('El héroe no existe'));
    }

    const updatedHeroes = currentHeroes.filter(h => h.id !== id);
    this.heros.set(updatedHeroes);

    return this.delete(of(true).pipe(delay(500)), this.ENTITY);
  }

}
