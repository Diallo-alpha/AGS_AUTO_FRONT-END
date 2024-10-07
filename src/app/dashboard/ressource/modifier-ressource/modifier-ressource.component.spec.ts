import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierRessourceComponent } from './modifier-ressource.component';

describe('ModifierRessourceComponent', () => {
  let component: ModifierRessourceComponent;
  let fixture: ComponentFixture<ModifierRessourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifierRessourceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifierRessourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
