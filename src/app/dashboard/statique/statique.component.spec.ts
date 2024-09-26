import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatiqueComponent } from './statique.component';

describe('StatiqueComponent', () => {
  let component: StatiqueComponent;
  let fixture: ComponentFixture<StatiqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatiqueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StatiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
