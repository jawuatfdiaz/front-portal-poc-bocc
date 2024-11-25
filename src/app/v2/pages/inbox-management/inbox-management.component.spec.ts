import {
  TestBed,
  ComponentFixture,
  fakeAsync,
  tick,
  flush,
  waitForAsync,
} from "@angular/core/testing";
import { InboxManagementComponent } from "./inbox-management.component";
import { ResourcesService } from "../../../../services/resources.service";
import { MsalService } from "@azure/msal-angular";
import { Router, ActivatedRoute } from "@angular/router";
import { of, throwError } from "rxjs";
import Swal from "sweetalert2";

describe("InboxManagementComponent", () => {
  let component: InboxManagementComponent;
  let fixture: ComponentFixture<InboxManagementComponent>;
  let resourceServiceMock: any;
  let msalServiceMock: any;
  let routerMock: any;
  let activatedRouteMock: any;

  beforeEach(waitForAsync(() => {
    resourceServiceMock = {
      getRequestDeploy: jest.fn().mockReturnValue(of({ payload: [] })),
      getRequestDeployId: jest.fn().mockReturnValue(of({ payload: [{}] })),
      putRejectResource: jest.fn().mockReturnValue(of({})),
      putApprovalResource: jest.fn().mockReturnValue(of({})),
      formatDate: jest.fn((dateTimeString: string) => {
        const date = new Date(dateTimeString);
        return `${date.getMonth() + 1}/${String(date.getDate()).padStart(
          2,
          "0"
        )}/${date.getFullYear()} ${String(date.getHours()).padStart(
          2,
          "0"
        )}:${String(date.getMinutes()).padStart(2, "0")}:${String(
          date.getSeconds()
        ).padStart(2, "0")}`;
      }),
    };

    msalServiceMock = {
      instance: {
        getActiveAccount: jest.fn().mockReturnValue({
          localAccountId: "tenant-id",
        }),
      },
    };

    routerMock = {
      navigate: jest.fn(),
    };

    activatedRouteMock = {
      params: of({ id: "123" }),
    };

    TestBed.configureTestingModule({
      declarations: [InboxManagementComponent],
      providers: [
        { provide: ResourcesService, useValue: resourceServiceMock },
        { provide: MsalService, useValue: msalServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InboxManagementComponent);
    component = fixture.componentInstance;
  }));

  it("should create the component", () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should initialize infoAccount from MsalService if localUser is not in localStorage", () => {
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue(undefined);
    fixture.detectChanges();
    expect(component.infoAccount.localAccountId).toBe("tenant-id");
  });

  it("should initialize infoAccount from localStorage if localUser is in localStorage", () => {
    const localUser = JSON.stringify({ localAccountId: "tenant-id" });
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue(localUser);
    fixture.detectChanges();
    expect(component.infoAccount.localAccountId).toBe("tenant-id");
  });

  it("should fetch the deployment ID from the route params and call getDeployId", () => {
    const spy = jest.spyOn(component, "getDeployId");
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.idDeployment).toBe("123");
    expect(spy).toHaveBeenCalledWith("123");
  });

  it("should fetch the inbox if no deployment ID in the route params", () => {
    activatedRouteMock.params = of({});
    const spy = jest.spyOn(component, "getInbox");
    fixture.detectChanges();
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it("should call getRequestDeploy and set inboxList", () => {
    const inboxData = { payload: [{ id: "1" }, { id: "2" }] };
    resourceServiceMock.getRequestDeploy.mockReturnValue(of(inboxData));
    fixture.detectChanges();
    component.getInbox();
    expect(component.inboxList).toEqual(inboxData.payload);
  });

  it("should call getRequestDeployId and set requestObject", fakeAsync(() => {
    const deployData = { payload: [{ id: "1", name: "Test" }] };
    resourceServiceMock.getRequestDeployId.mockReturnValue(of(deployData));
    fixture.detectChanges();
    component.getDeployId("1");
    tick(); // Avanzar el tiempo para resolver las promesas
    fixture.detectChanges();
    expect(component.requestObject).toEqual(deployData.payload[0]);
  }));

  it("should navigate to the detail view with the correct ID", () => {
    fixture.detectChanges();
    component.viewInfo({ id: "1" });
    expect(routerMock.navigate).toHaveBeenCalledWith(["/inbox-management/1"]);
  });

  it("should navigate back to the inbox list", () => {
    fixture.detectChanges();
    component.back();
    expect(component.showDetail).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalledWith(["/inbox-management/"]);
  });

  it("should call putRejectResource and hide the detail view on success", fakeAsync(() => {
    fixture.detectChanges();
    component.deny("1");
    tick(); // Avanzar el tiempo para resolver las promesas
    fixture.detectChanges();
    expect(component.showDetail).toBe(false);
  }));

  it("should call putApprovalResource and hide the detail view on success", fakeAsync(() => {
    fixture.detectChanges();
    component.approve("1");
    tick(); // Avanzar el tiempo para resolver las promesas
    fixture.detectChanges();
    expect(component.showDetail).toBe(false);
    flush(); // Limpiar temporizadores pendientes
  }));

  it("should call getInbox when selectStatus is called", () => {
    const spy = jest.spyOn(component, "getInbox");
    const event = { target: { value: "APPROVED" } };
    fixture.detectChanges();
    component.selectStatus(event);
    expect(component.selectedStatus).toBe("APPROVED");
    expect(spy).toHaveBeenCalled();
  });

  it("should call putApprovalResource and show success alert", fakeAsync(() => {
    jest.spyOn(Swal, "fire");
    fixture.detectChanges();
    component.approve("1");
    tick();
    expect(component.showDetail).toBe(false);
    expect(Swal.fire).toHaveBeenCalledWith({
      title: "Success!",
      text: "Your action was successful.",
      icon: "success",
      confirmButtonText: "Ok",
    });
    flush();
  }));

  it("should format date and time correctly", () => {
    const dateString = "2024-05-19T10:20:30Z";
    fixture.detectChanges();
    const formattedDate = component.formatDateTime(dateString);
    const date = new Date(dateString);
    const expectedDate = `${date.getMonth() + 1}/${String(
      date.getDate()
    ).padStart(2, "0")}/${date.getFullYear()} ${String(
      date.getHours()
    ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(
      date.getSeconds()
    ).padStart(2, "0")}`;
    expect(formattedDate).toBe(expectedDate);
  });

  it("should handle error in getInbox", fakeAsync(() => {
    resourceServiceMock.getRequestDeploy.mockReturnValue(throwError("error"));
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    fixture.detectChanges();
    component.getInbox();
    tick();
    expect(spy).toHaveBeenCalledWith("error");
    spy.mockRestore();
  }));

  it("should handle error in getDeployId", fakeAsync(() => {
    resourceServiceMock.getRequestDeployId.mockReturnValue(throwError("error"));
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    fixture.detectChanges();
    component.getDeployId("1");
    tick();
    expect(spy).toHaveBeenCalledWith("error");
    spy.mockRestore();
  }));

  it("should handle error in deny", fakeAsync(() => {
    resourceServiceMock.putRejectResource.mockReturnValue(throwError("error"));
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    fixture.detectChanges();
    component.deny("1");
    tick();
    expect(spy).toHaveBeenCalledWith("error");
    spy.mockRestore();
  }));

  it("should handle error in approve", fakeAsync(() => {
    resourceServiceMock.putApprovalResource.mockReturnValue(throwError("error"));
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    fixture.detectChanges();
    component.approve("1");
    tick();
    expect(spy).toHaveBeenCalledWith("error");
    spy.mockRestore();
  }));
});
