import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutPhotoComponent } from './ajout-photo.component';

describe('AjoutPhotoComponent', () => {
  let component: AjoutPhotoComponent;
  let fixture: ComponentFixture<AjoutPhotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjoutPhotoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AjoutPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
