import { TestBed } from '@angular/core/testing';

import { VentasUserService } from './ventas-user.service';

describe('VentasUserService', () => {
  let service: VentasUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VentasUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
