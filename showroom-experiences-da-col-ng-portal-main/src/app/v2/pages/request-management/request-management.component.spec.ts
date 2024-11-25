import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  flush,
} from "@angular/core/testing";
import { RequestManagementComponent } from "./request-management.component";
import { ResourcesService } from "../../../../services/resources.service";
import { MsalService } from "@azure/msal-angular";
import { ActivatedRoute, Router } from "@angular/router";
import { of, throwError } from "rxjs";
import { RouterTestingModule } from "@angular/router/testing";
import {
  PopupRequest,
  AuthenticationResult,
  RedirectRequest,
  SilentRequest,
  AuthorizationCodeRequest,
  PerformanceCallbackFunction,
  AccountInfo,
  EndSessionRequest,
  EndSessionPopupRequest,
  Logger,
  WrapperSKU,
  INavigationClient,
  BrowserConfiguration,
} from "@azure/msal-browser";
import { ITokenCache } from "@azure/msal-browser/dist/cache/ITokenCache";
import { CommonAuthorizationUrlRequest } from "@azure/msal-common";

describe("RequestManagementComponent", () => {
  let component: RequestManagementComponent;
  let fixture: ComponentFixture<RequestManagementComponent>;
  let resourceServiceMock: Partial<ResourcesService>;
  let msalServiceMock: Partial<MsalService>;
  let router: Router;

  beforeEach(async () => {
    resourceServiceMock = {
      getRequestDeploy: jest.fn(() =>
        of({
          payload: [
            {
              name: "Test Request",
              relatedParty: [{ name: "Test Party" }],
              country: "Test Country",
              request: { requestedDay: "Test Date", status: "Test Status" },
            },
          ],
        })
      ),
      getRequestDeployId: jest.fn(() =>
        of({
          payload: [
            {
              id: "testId",
              name: "Test Request",
              relatedParty: [{ name: "Test Party" }],
              country: "Test Country",
              request: { requestedDay: "Test Date", status: "Test Status" },
            },
          ],
        })
      ),
      formatDate: jest.fn().mockReturnValue("formatted date"),
    };

    msalServiceMock = {
      instance: {
        getActiveAccount: jest.fn().mockReturnValue({
          name: "Local User",
          username: "testuser@example.com",
          localAccountId: "testTenantId",
        }),
        initialize: function (): Promise<void> {
          throw new Error("Function not implemented.");
        },
        acquireTokenPopup: function (
          request: PopupRequest
        ): Promise<AuthenticationResult> {
          throw new Error("Function not implemented.");
        },
        acquireTokenRedirect: function (
          request: RedirectRequest
        ): Promise<void> {
          throw new Error("Function not implemented.");
        },
        acquireTokenSilent: function (
          silentRequest: SilentRequest
        ): Promise<AuthenticationResult> {
          throw new Error("Function not implemented.");
        },
        acquireTokenByCode: function (
          request: AuthorizationCodeRequest
        ): Promise<AuthenticationResult> {
          throw new Error("Function not implemented.");
        },
        addEventCallback: function (callback: Function): string {
          throw new Error("Function not implemented.");
        },
        removeEventCallback: function (callbackId: string): void {
          throw new Error("Function not implemented.");
        },
        addPerformanceCallback: function (
          callback: PerformanceCallbackFunction
        ): string {
          throw new Error("Function not implemented.");
        },
        removePerformanceCallback: function (callbackId: string): boolean {
          throw new Error("Function not implemented.");
        },
        enableAccountStorageEvents: function (): void {
          throw new Error("Function not implemented.");
        },
        disableAccountStorageEvents: function (): void {
          throw new Error("Function not implemented.");
        },
        getAccountByHomeId: function (homeAccountId: string): AccountInfo {
          throw new Error("Function not implemented.");
        },
        getAccountByLocalId: function (localId: string): AccountInfo {
          throw new Error("Function not implemented.");
        },
        getAccountByUsername: function (userName: string): AccountInfo {
          throw new Error("Function not implemented.");
        },
        getAllAccounts: function (): AccountInfo[] {
          throw new Error("Function not implemented.");
        },
        handleRedirectPromise: function (
          hash?: string
        ): Promise<AuthenticationResult> {
          throw new Error("Function not implemented.");
        },
        loginPopup: function (
          request?: PopupRequest
        ): Promise<AuthenticationResult> {
          throw new Error("Function not implemented.");
        },
        loginRedirect: function (request?: RedirectRequest): Promise<void> {
          throw new Error("Function not implemented.");
        },
        logout: function (logoutRequest?: EndSessionRequest): Promise<void> {
          throw new Error("Function not implemented.");
        },
        logoutRedirect: function (
          logoutRequest?: EndSessionRequest
        ): Promise<void> {
          throw new Error("Function not implemented.");
        },
        logoutPopup: function (
          logoutRequest?: EndSessionPopupRequest
        ): Promise<void> {
          throw new Error("Function not implemented.");
        },
        ssoSilent: function (
          request: Partial<
            Omit<
              CommonAuthorizationUrlRequest,
              | "responseMode"
              | "codeChallenge"
              | "codeChallengeMethod"
              | "requestedClaimsHash"
              | "nativeBroker"
            >
          >
        ): Promise<AuthenticationResult> {
          throw new Error("Function not implemented.");
        },
        getTokenCache: function (): ITokenCache {
          throw new Error("Function not implemented.");
        },
        getLogger: function (): Logger {
          throw new Error("Function not implemented.");
        },
        setLogger: function (logger: Logger): void {
          throw new Error("Function not implemented.");
        },
        setActiveAccount: function (account: AccountInfo): void {
          throw new Error("Function not implemented.");
        },
        initializeWrapperLibrary: function (
          sku: WrapperSKU,
          version: string
        ): void {
          throw new Error("Function not implemented.");
        },
        setNavigationClient: function (
          navigationClient: INavigationClient
        ): void {
          throw new Error("Function not implemented.");
        },
        getConfiguration: function (): BrowserConfiguration {
          throw new Error("Function not implemented.");
        },
      },
    };

    await TestBed.configureTestingModule({
      declarations: [RequestManagementComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: ResourcesService, useValue: resourceServiceMock },
        { provide: MsalService, useValue: msalServiceMock },
        { provide: ActivatedRoute, useValue: { params: of({ id: null }) } },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    jest.spyOn(router, "navigate");
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should fetch requests on initialization", fakeAsync(() => {
    component.ngOnInit();
    tick();

    expect(component.requestList.length).toBe(1);
    expect(resourceServiceMock.getRequestDeploy).toHaveBeenCalledWith(
      "status=PENDING&relatedPartyId=testTenantId&relatedPartyRole=APPROVER"
    );
    flush();
  }));

  it("should handle error when fetching requests", fakeAsync(() => {
    const errorMock = jest.fn(() => throwError(() => new Error("Test Error")));
    resourceServiceMock.getRequestDeploy = errorMock;

    fixture = TestBed.createComponent(RequestManagementComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    tick();

    expect(component.requestList.length).toBe(0);
    expect(errorMock).toHaveBeenCalled();
    flush();
  }));

  it("should call getRequest on selectStatus", fakeAsync(() => {
    const spy = jest.spyOn(component, "getRequest");
    const event = { target: { value: "APPROVED" } };

    component.selectStatus(event);
    tick();

    expect(component.selectedStatus).toBe("APPROVED");
    expect(spy).toHaveBeenCalled();
  }));

  it("should call getRequestDeployId and set requestObject", fakeAsync(() => {
    component.getDeployId("testId");
    tick();

    expect(resourceServiceMock.getRequestDeployId).toHaveBeenCalledWith(
      "testId"
    );
    expect(component.requestObject).toEqual({
      id: "testId",
      name: "Test Request",
      relatedParty: [{ name: "Test Party" }],
      country: "Test Country",
      request: { requestedDay: "Test Date", status: "Test Status" },
    });
  }));

  it("should set showDetail to false and navigate to /request-management/ on back", () => {
    component.showDetail = true;

    component.back();

    expect(component.showDetail).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(["/request-management/"]);
  });

  it("should navigate to the correct route on viewRequest", () => {
    const req = { id: "testId" };

    component.viewRequest(req);

    expect(router.navigate).toHaveBeenCalledWith([
      "/request-management/testId",
    ]);
  });

  it("should format date and time correctly", () => {
    const dateTimeString = "2023-05-20T12:00:00Z";
    const formattedDate = component.formatDateTime(dateTimeString);

    expect(resourceServiceMock.formatDate).toHaveBeenCalledWith(dateTimeString);
    expect(formattedDate).toBe("formatted date");
  });

  it("should initialize infoAccount from localStorage if present", () => {
    localStorage.setItem(
      "localUser",
      JSON.stringify({
        name: "Local User",
        username: "localuser@example.com",
        localAccountId: "localTestId",
      })
    );
    component = fixture.componentInstance;
    expect(component.infoAccount.name).toBe("Local User");
    localStorage.removeItem("localUser");
  });

  describe("fetch request based on params", () => {
    let activatedRouteMock: Partial<ActivatedRoute>;

    beforeEach(() => {
      activatedRouteMock = {
        params: of({ id: null }),
      };
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        declarations: [RequestManagementComponent],
        imports: [RouterTestingModule],
        providers: [
          { provide: ResourcesService, useValue: resourceServiceMock },
          { provide: MsalService, useValue: msalServiceMock },
          { provide: ActivatedRoute, useValue: activatedRouteMock },
        ],
      }).compileComponents();
    });

    it("should fetch request if id is null in params", fakeAsync(() => {
      fixture = TestBed.createComponent(RequestManagementComponent);
      component = fixture.componentInstance;
      component.ngOnInit();
      tick();

      expect(component.requestList.length).toBe(1);
      flush();
    }));

    it("should fetch deploy id if id is present in params", fakeAsync(() => {
      activatedRouteMock.params = of({ id: "testId" });
      TestBed.overrideProvider(ActivatedRoute, {
        useValue: activatedRouteMock,
      });

      fixture = TestBed.createComponent(RequestManagementComponent);
      component = fixture.componentInstance;
      component.ngOnInit();
      tick();

      expect(component.idDeploy).toBe("testId");
      expect(component.showDetail).toBe(true);
      expect(resourceServiceMock.getRequestDeployId).toHaveBeenCalledWith(
        "testId"
      );
      flush();
    }));
  });
});
