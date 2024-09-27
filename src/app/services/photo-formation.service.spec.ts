import { TestBed } from '@angular/core/testing';

import { PhotoFormationService } from './photo-formation.service';

describe('PhotoFormationService', () => {
  let service: PhotoFormationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhotoFormationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
