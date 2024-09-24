import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavConnectComponent } from './nav-connect.component';

describe('NavConnectComponent', () => {
  let component: NavConnectComponent;
  let fixture: ComponentFixture<NavConnectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavConnectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavConnectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
