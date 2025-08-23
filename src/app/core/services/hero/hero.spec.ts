import { User } from './../auth/auth';
import { TestBed } from "@angular/core/testing";
import { HeroService } from "./hero";
import { Power } from "../../../models/power.model";
import { AuthService } from "../auth/auth";
import { Hero } from '../../../models/hero.model';

describe('HeroService', () => {
  let service: HeroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeroService);
  });

  it('Servicio funcioando', () => {
    expect(service).toBeTruthy();
  });

  it('Obtener todos los héroes', (done) => {
    service.getAllHeroes().subscribe(heroes => {
      expect(heroes.length).toBeGreaterThan(0);
      done();
    });
  });

  it('Obtener héroe por ID', (done) => {
    const heroId = 1;
    service.getHeroById(heroId).subscribe(hero => {
      expect(hero).toBeTruthy();
      expect(hero?.id).toBe(heroId);
      done();
    });
  });

  it('Registrar héroe', (done) => {
    const newHeroData: Omit<Hero, 'id'> = {
      name: 'Nuevo Héroe Test',
      powers: [new Power(99, 'Poder Test', 'Descripción test')],
      createdBy: 'testuser',
      createdAt: new Date(),
    };

    service.registerHero(newHeroData).subscribe(hero => {
      expect(hero).toBeTruthy();
      expect(hero?.id).toBeGreaterThan(0);
      expect(hero?.name).toBe(newHeroData.name);
      done();
    });
  });

  it('Registrar héroe y modificarlo', (done) => {
    const HERO_NAME = 'Nuevo Héroe Test';
    const UPDATED_HERO_NAME = 'Héroe Modificado Test';
    const POWER_NAME = 'Poder Test';
    const UPDATED_POWER_NAME = 'Poder Test modificado';
    const POWER_DESCRIPTION = 'Descripción test';
    const UPDATED_POWER_DESCRIPTION = 'Descripción Test modificada';
    const CREATED_BY = 'testuser';
    const POWER_ID = 99;
    const UPDATED_POWER_ID = 100;

    const newHeroData: Omit<Hero, 'id'> = {
      name: HERO_NAME,
      powers: [new Power(POWER_ID, POWER_NAME, POWER_DESCRIPTION)],
      createdBy: CREATED_BY,
      createdAt: new Date(),
    };

    service.registerHero(newHeroData).subscribe(hero => {
      expect(hero).toBeTruthy();
      expect(hero?.id).toBeGreaterThan(0);
      expect(hero?.name).toBe(HERO_NAME);

      if (hero) {
        const updatedHero: Hero = {
          ...hero,
          name: UPDATED_HERO_NAME,
          powers: [new Power(UPDATED_POWER_ID, UPDATED_POWER_NAME, UPDATED_POWER_DESCRIPTION)],
        };

        service.updateHero(updatedHero).subscribe(updated => {
          expect(updated).toBeTruthy();
          expect(updated?.name).toBe(UPDATED_HERO_NAME);
          expect(updated?.powers[0].name).toBe(UPDATED_POWER_NAME);
          done();
        });
      }
    });
  });


  it('Registrar héroe y eliminarlo', (done) => {
    const HERO_NAME = 'Nuevo Héroe Test';
    const POWER_NAME = 'Poder Test';
    const POWER_DESCRIPTION = 'Descripción test';
    const CREATED_BY = 'testuser';
    const POWER_ID = 99;

    const newHeroData: Omit<Hero, 'id'> = {
      name: HERO_NAME,
      powers: [new Power(POWER_ID, POWER_NAME, POWER_DESCRIPTION)],
      createdBy: CREATED_BY,
      createdAt: new Date(),
    };

    service.registerHero(newHeroData).subscribe(hero => {
      expect(hero).toBeTruthy();
      expect(hero?.id).toBeGreaterThan(0);
      expect(hero?.name).toBe(HERO_NAME);

      if (hero) {
        service.deleteHero(hero.id).subscribe(deleted => {
          expect(deleted).toBeTruthy();
          done();
        });
      }
    });
  });

});
