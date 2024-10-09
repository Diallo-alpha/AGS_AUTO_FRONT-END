import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorieAjouterComponent } from './categorie-ajouter.component';

describe('CategorieAjouterComponent', () => {
  let component: CategorieAjouterComponent;
  let fixture: ComponentFixture<CategorieAjouterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategorieAjouterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategorieAjouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
