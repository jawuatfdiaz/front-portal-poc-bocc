import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HeaderComponent } from "./header.component";
import { MsalService } from "@azure/msal-angular";
import { DataService } from "../../../shared/data.service";
import { ElementRef } from "@angular/core";
import { MediaMatcher } from "@angular/cdk/layout";
import {
  AccountInfo,
  AuthenticationResult,
  AuthorizationCodeRequest,
  BrowserConfiguration,
  EndSessionPopupRequest,
  EndSessionRequest,
  INavigationClient,
  Logger,
  PerformanceCallbackFunction,
  PopupRequest,
  RedirectRequest,
  SilentRequest,
  WrapperSKU,
} from "@azure/msal-browser";
import { themeMock } from "../../../mocks/theme.mock";
import { localUser } from "../../../mocks/localUser.mock";
import { ITokenCache } from "@azure/msal-browser/dist/cache/ITokenCache";
import { CommonAuthorizationUrlRequest } from "@azure/msal-common";

describe("HeaderComponent", () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let msalServiceMock: Partial<MsalService>;
  let dataServiceMock: Partial<DataService>;
  let elementRef: ElementRef;
  let mediaMatcherMock: Partial<MediaMatcher>;

  beforeEach(() => {
    const localStorageMock = (() => {
      let store: { [key: string]: string } = {};
      return {
        getItem(key: string): string | null {
          return store[key] || null;
        },
        setItem(key: string, value: string): void {
          store[key] = value;
        },
        removeItem(key: string): void {
          delete store[key];
        },
        clear(): void {
          store = {};
        },
      };
    })();
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
    });
    window.localStorage.setItem("theme", themeMock);
    window.localStorage.setItem("localUser", localUser);
  });

  beforeEach(async () => {
    const nativeElement = document.createElement("div");
    elementRef = new ElementRef(nativeElement);

    msalServiceMock = {
      instance: {
        getActiveAccount: jest.fn((): AccountInfo | null => {
          return {
            homeAccountId: "test-home-account-id",
            environment: "test-environment",
            tenantId: "test-tenant-id",
            localAccountId: "test-local-account-id",
            username: "test@example.com",
            name: "Test Name",
          };
        }),
        logoutRedirect: jest.fn(),
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

    dataServiceMock = {
      sendDataSideBar: jest.fn(),
    };

    mediaMatcherMock = {
      matchMedia: jest.fn((query: string) => {
        const mql: MediaQueryList = {
          matches: query === "(max-width: 767px)",
          media: query,
          addListener: jest.fn(), // Deprecated
          removeListener: jest.fn(), // Deprecated
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          onchange: null,
          dispatchEvent: jest.fn(),
        };
        return mql;
      }),
    };

    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [
        { provide: MsalService, useValue: msalServiceMock },
        { provide: DataService, useValue: dataServiceMock },
        { provide: ElementRef, useValue: elementRef },
        { provide: MediaMatcher, useValue: mediaMatcherMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should toggle showUserOpt when showUserOptions is called", () => {
    const initialValue = component.showUserOpt;
    component.showUserOptions();
    expect(component.showUserOpt).toBe(!initialValue);
  });

  it("should toggle showMenu and call sendDataSideBar when expandMenu is called", () => {
    const initialValue = component.showMenu;
    component.expandMenu();
    expect(component.showMenu).toBe(!initialValue);
    expect(dataServiceMock.sendDataSideBar).toHaveBeenCalledWith(!initialValue);
  });

  it("should handle media query change", () => {
    // Simular media query para max-width: 767px
    const matchMediaQueryTrue = mediaMatcherMock.matchMedia as jest.Mock;
    matchMediaQueryTrue.mockReturnValue({
      matches: true,
      media: "(max-width: 767px)",
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      onchange: null,
      dispatchEvent: jest.fn(),
    });

    component.handleMediaQueryChange();
    expect(component.isResponsive).toBe(true);

    // Simular media query para más de 767px
    matchMediaQueryTrue.mockReturnValue({
      matches: false,
      media: "(min-width: 768px)",
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      onchange: null,
      dispatchEvent: jest.fn(),
    });

    component.handleMediaQueryChange();
    expect(component.isResponsive).toBe(true);
  });

  it("should handle click event outside element", () => {
    const event = new MouseEvent("click");
    component.onClick(event);
    expect(component.showUserOpt).toBe(false);
  });

  it("should handle click event inside element", () => {
    component.showUserOpt = true;
    fixture.detectChanges();

    const mockTarget = document.createElement("div");
    elementRef.nativeElement.appendChild(mockTarget);

    elementRef.nativeElement.contains = jest
      .fn()
      .mockImplementation((target) => target === mockTarget);

    const event = new MouseEvent("click", { bubbles: true });
    mockTarget.dispatchEvent(event);

    fixture.detectChanges();

    expect(component.showUserOpt).toBe(true);
  });

  it("should logout and clear local storage when localLogin is true", () => {
    component.theme.properties.localLogin = true;
    component.logout();

    expect(localStorage.getItem("localUser")).toBeNull();
    expect(window.location.href).toContain("/");
  });

  it("should call msalService.logoutRedirect when localLogin is false", () => {
    component.theme.properties.localLogin = false;
    component.theme.properties.auth = {
      postLogoutRedirectUri: "http://localhost",
    };
    component.logout();

    expect(msalServiceMock.instance.logoutRedirect).toHaveBeenCalledWith({
      postLogoutRedirectUri:
        component.theme.properties.auth.postLogoutRedirectUri,
    });
  });

  afterEach(() => {
    fixture.destroy();
  });
});
