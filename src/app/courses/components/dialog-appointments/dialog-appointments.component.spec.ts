import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAppointmentsComponent } from './dialog-appointments.component';

describe('DialogAppointmentsComponent', () => {
  let component: DialogAppointmentsComponent;
  let fixture: ComponentFixture<DialogAppointmentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogAppointmentsComponent]
    });
    fixture = TestBed.createComponent(DialogAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
