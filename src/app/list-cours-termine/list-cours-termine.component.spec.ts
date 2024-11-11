import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCoursTermineComponent } from './list-cours-termine.component';

describe('ListCoursTermineComponent', () => {
  let component: ListCoursTermineComponent;
  let fixture: ComponentFixture<ListCoursTermineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListCoursTermineComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListCoursTermineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
