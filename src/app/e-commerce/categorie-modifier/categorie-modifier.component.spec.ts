import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorieModifierComponent } from './categorie-modifier.component';

describe('CategorieModifierComponent', () => {
  let component: CategorieModifierComponent;
  let fixture: ComponentFixture<CategorieModifierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategorieModifierComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategorieModifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
