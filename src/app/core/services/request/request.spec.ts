import { TestBed } from '@angular/core/testing';

import { RequestService } from './request';

describe('RequestService', () => {
  let service: RequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RequestService]
    });
    service = TestBed.inject(RequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have loading$ observable', () => {
    expect(service.loading$).toBeTruthy();
  });

  it('should start with loading as false', (done) => {
    service.loading$.subscribe(loading => {
      expect(loading).toBeFalsy();
      done();
    });
  });

  it('should have the expected properties', () => {
    expect(service.loading$).toBeDefined();
  });
});