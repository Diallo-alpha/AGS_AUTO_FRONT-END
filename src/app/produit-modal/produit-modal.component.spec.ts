import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduitModalComponent } from './produit-modal.component';

describe('ProduitModalComponent', () => {
  let component: ProduitModalComponent;
  let fixture: ComponentFixture<ProduitModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProduitModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProduitModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
