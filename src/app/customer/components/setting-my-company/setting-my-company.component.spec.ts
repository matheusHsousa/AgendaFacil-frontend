import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingMyCompanyComponent } from './setting-my-company.component';

describe('SettingMyCompanyComponent', () => {
  let component: SettingMyCompanyComponent;
  let fixture: ComponentFixture<SettingMyCompanyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SettingMyCompanyComponent]
    });
    fixture = TestBed.createComponent(SettingMyCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
