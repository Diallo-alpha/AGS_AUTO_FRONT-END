import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierPartenaireComponent } from './modifier-partenaire.component';

describe('ModifierPartenaireComponent', () => {
  let component: ModifierPartenaireComponent;
  let fixture: ComponentFixture<ModifierPartenaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifierPartenaireComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifierPartenaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
