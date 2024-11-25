import {
  ComponentFixture,
  TestBed,
  tick,
  fakeAsync,
} from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { CatalogueComponent } from "./catalogue.component";
import { DataService } from "../../../shared/data.service";
import { ResourcesService } from "../../../../services/resources.service";
import { BehaviorSubject, of, throwError } from "rxjs";

describe("CatalogueComponent", () => {
  let component: CatalogueComponent;
  let fixture: ComponentFixture<CatalogueComponent>;
  let dataServiceMock: Partial<DataService>;
  let resourcesServiceMock: Partial<ResourcesService>;
  const mockResourceData = [
    { id: 1, name: "Resource 1", description: "Description 1" },
  ];

  beforeEach(async () => {
    dataServiceMock = {
      dataFromFilter$: new BehaviorSubject<any>(null),
    };

    resourcesServiceMock = {
      getResources: jest
        .fn()
        .mockReturnValue(of({ payload: mockResourceData })),
    };

    await TestBed.configureTestingModule({
      declarations: [CatalogueComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: DataService, useValue: dataServiceMock },
        { provide: ResourcesService, useValue: resourcesServiceMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should set active view", () => {
    component.setActiveView("list");
    expect(component.activeView).toEqual("list");
  });

  it("should get resources on ngOnInit", fakeAsync(() => {
    const getResourcesSpy = jest.spyOn(resourcesServiceMock, "getResources");
    component.ngOnInit();
    expect(getResourcesSpy).toHaveBeenCalledWith(null);
    tick();
    expect(component.catalogueResource).toEqual(mockResourceData);
  }));

  it("should navigate to resource on viewResource", () => {
    const routerSpy = jest.spyOn((component as any).router, "navigate");
    const resourceId = 1;
    component.viewResource(resourceId);
    expect(routerSpy).toHaveBeenCalledWith([
      "/resource-management/view-resource/" + resourceId,
    ]);
  });

  it("should unsubscribe on ngOnDestroy", () => {
    const unsubscribeSpy = jest.spyOn(
      (component as any).subscription,
      "unsubscribe"
    );
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  it("should handle error when fetching resources", () => {
    resourcesServiceMock.getResources = jest
      .fn()
      .mockReturnValue(throwError("Test Error"));

    fixture = TestBed.createComponent(CatalogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.catalogueResource.length).toBe(0);
  });
});
