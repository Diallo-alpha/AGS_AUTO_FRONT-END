import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduitAjouterComponent } from './produit-ajouter.component';

describe('ProduitAjouterComponent', () => {
  let component: ProduitAjouterComponent;
  let fixture: ComponentFixture<ProduitAjouterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProduitAjouterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProduitAjouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
