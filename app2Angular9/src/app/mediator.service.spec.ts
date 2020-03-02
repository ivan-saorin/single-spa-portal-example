import { TestBed } from '@angular/core/testing';

import { MediatorService } from './mediator.service';

describe('MediatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MediatorService = TestBed.get(MediatorService);
    expect(service).toBeTruthy();
  });
});
