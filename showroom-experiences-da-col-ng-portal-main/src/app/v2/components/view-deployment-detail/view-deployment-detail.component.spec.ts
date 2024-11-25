import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDeploymentDetailComponent } from './view-deployment-detail.component';

describe('ViewDeploymentDetailComponent', () => {
  let component: ViewDeploymentDetailComponent;
  let fixture: ComponentFixture<ViewDeploymentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDeploymentDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDeploymentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
