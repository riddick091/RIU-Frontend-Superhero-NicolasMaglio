import { TestBed } from '@angular/core/testing';

import { HeroService } from './hero';
import { Hero } from '../../../models/hero.model';

describe('Hero', () => {
  let service: HeroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
