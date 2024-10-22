import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListcoursComponent } from './listcours.component';

describe('ListcoursComponent', () => {
  let component: ListcoursComponent;
  let fixture: ComponentFixture<ListcoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListcoursComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListcoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
