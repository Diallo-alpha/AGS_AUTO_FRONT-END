import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterPartenaireComponent } from './ajouter-partenaire.component';

describe('AjouterPartenaireComponent', () => {
  let component: AjouterPartenaireComponent;
  let fixture: ComponentFixture<AjouterPartenaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjouterPartenaireComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AjouterPartenaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
