import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewListResourcesComponent } from './view-list-resources.component';

describe('ViewListResourcesComponent', () => {
  let component: ViewListResourcesComponent;
  let fixture: ComponentFixture<ViewListResourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewListResourcesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewListResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
