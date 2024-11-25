import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SideBarComponent } from "./side-bar.component";
import { Router } from "@angular/router";
import { DataService } from "../../../shared/data.service";
import { MediaMatcher } from "@angular/cdk/layout";

describe("SideBarComponent", () => {
  let component: SideBarComponent;
  let fixture: ComponentFixture<SideBarComponent>;
  let mockRouter: any;
  let mockDataService: any;
  let mockMediaMatcher: any;
  let mockMediaQueryList: any;

  beforeEach(async () => {
    mockRouter = { navigate: jest.fn(), url: '/catalogue' };
    mockDataService = {
      dataFromHeader$: {
        subscribe: jest.fn(callback => {
          callback(true);  // Simulate receiving true
          return { unsubscribe: jest.fn() };
        })
      }
    };

    mockMediaQueryList = {
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    };
    mockMediaMatcher = {
      matchMedia: jest.fn().mockReturnValue(mockMediaQueryList)
    };

    await TestBed.configureTestingModule({
      declarations: [SideBarComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: DataService, useValue: mockDataService },
        { provide: MediaMatcher, useValue: mockMediaMatcher }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should update expandMenu based on data from DataService", () => {
    expect(component.expandMenu).toBe(true);
    expect(mockDataService.dataFromHeader$.subscribe).toHaveBeenCalled();
  });

  it("should toggle isResponsive when MediaQuery matches change", () => {
    expect(mockMediaMatcher.matchMedia).toHaveBeenCalledWith("(max-width: 767px)");
    const callArg = mockMediaQueryList.addEventListener.mock.calls[0][1];
    callArg(); // Trigger the handler function
    expect(component.isResponsive).toBe(false); // Adjust based on matches value
    mockMediaQueryList.matches = true;
    callArg(); // Trigger the handler function again with new matches value
    expect(component.isResponsive).toBe(true);
  });

  it("should navigate to the correct URL when handleMenuClick is called", () => {
    const testIndex = 0;
    const testUrl = "/catalogue";
    component.handleMenuClick(testIndex, testUrl);
    expect(mockRouter.navigate).toHaveBeenCalledWith([testUrl]);
  });

  it("should mark the correct menu option as active based on the current URL", () => {
    component.markActiveMenuOption();
    expect(component.menuOptions.find(option => option.url === mockRouter.url).isActive).toBe(true);
  });

  it("should unsubscribe from dataService on ngOnDestroy", () => {
    const subSpy = jest.spyOn(component['subscription'], 'unsubscribe');
    component.ngOnDestroy();
    expect(subSpy).toHaveBeenCalled();
  });
});
