import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewListDeploymentsComponent } from './view-list-deployments.component';

describe('ViewListDeploymentsComponent', () => {
  let component: ViewListDeploymentsComponent;
  let fixture: ComponentFixture<ViewListDeploymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewListDeploymentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewListDeploymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
