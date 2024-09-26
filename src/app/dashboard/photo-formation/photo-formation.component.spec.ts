import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoFormationComponent } from './photo-formation.component';

describe('PhotoFormationComponent', () => {
  let component: PhotoFormationComponent;
  let fixture: ComponentFixture<PhotoFormationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoFormationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PhotoFormationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
