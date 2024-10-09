import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterRessourceComponent } from './ajouter-ressource.component';

describe('AjouterRessourceComponent', () => {
  let component: AjouterRessourceComponent;
  let fixture: ComponentFixture<AjouterRessourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjouterRessourceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AjouterRessourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
