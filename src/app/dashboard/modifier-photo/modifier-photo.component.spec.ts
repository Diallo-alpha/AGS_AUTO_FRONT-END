import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierPhotoComponent } from './modifier-photo.component';

describe('ModifierPhotoComponent', () => {
  let component: ModifierPhotoComponent;
  let fixture: ComponentFixture<ModifierPhotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifierPhotoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifierPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
