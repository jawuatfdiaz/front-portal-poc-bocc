import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvrFormComponent } from './evr-form.component';

describe('EvrFormComponent', () => {
  let component: EvrFormComponent;
  let fixture: ComponentFixture<EvrFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvrFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvrFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
