import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleMapsComponent } from './google-maps.component';

describe('GoogleMapsComponent', () => {
  let component: GoogleMapsComponent;
  let fixture: ComponentFixture<GoogleMapsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GoogleMapsComponent]
    });
    fixture = TestBed.createComponent(GoogleMapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
