import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduitModifierComponent } from './produit-modifier.component';

describe('ProduitModifierComponent', () => {
  let component: ProduitModifierComponent;
  let fixture: ComponentFixture<ProduitModifierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProduitModifierComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProduitModifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
