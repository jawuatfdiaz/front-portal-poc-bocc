import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PocManagementComponent } from "./poc-management.component";

describe("PocManagementComponent", () => {
  let component: PocManagementComponent;
  let fixture: ComponentFixture<PocManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PocManagementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PocManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PocManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create the app", () => {
    expect(component).toBeTruthy();
  });
});
