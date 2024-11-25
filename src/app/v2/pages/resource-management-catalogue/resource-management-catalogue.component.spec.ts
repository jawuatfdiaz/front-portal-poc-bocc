import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ResourceManagementCatalogueComponent } from './resource-management-catalogue.component';
import { MsalService } from '@azure/msal-angular';
import { ResourcesService } from '../../../../services/resources.service';
import { PopupRequest, AuthenticationResult, RedirectRequest, SilentRequest, AuthorizationCodeRequest, PerformanceCallbackFunction, AccountInfo, EndSessionRequest, EndSessionPopupRequest, Logger, WrapperSKU, INavigationClient, BrowserConfiguration } from '@azure/msal-browser';
import { ITokenCache } from '@azure/msal-browser/dist/cache/ITokenCache';
import { CommonAuthorizationUrlRequest } from '@azure/msal-common';

describe('ResourceManagementCatalogueComponent', () => {
  let component: ResourceManagementCatalogueComponent;
  let fixture: any;
  let routerSpy: any;
  let resourceServiceMock: any;
  let msalServiceMock: Partial<MsalService>;

  beforeEach(async () => {
    resourceServiceMock = {
      getResources: jest.fn(() => of({ payload: [{ name: 'Test Resource', relatedParty: [{ email: 'test@example.com' }], status: 'Test Status', commonVersionId: 'Test Id', description: 'Test Description' }] }))
    };
    msalServiceMock = {
      instance: {
        getActiveAccount: jest.fn().mockReturnValue({
          name: "Test User",
          username: "testuser@example.com",
          localAccountId: "Test Tenant ID",
        }),
        initialize: function (): Promise<void> {
          throw new Error('Function not implemented.');
        },
        acquireTokenPopup: function (request: PopupRequest): Promise<AuthenticationResult> {
          throw new Error('Function not implemented.');
        },
        acquireTokenRedirect: function (request: RedirectRequest): Promise<void> {
          throw new Error('Function not implemented.');
        },
        acquireTokenSilent: function (silentRequest: SilentRequest): Promise<AuthenticationResult> {
          throw new Error('Function not implemented.');
        },
        acquireTokenByCode: function (request: AuthorizationCodeRequest): Promise<AuthenticationResult> {
          throw new Error('Function not implemented.');
        },
        addEventCallback: function (callback: Function): string {
          throw new Error('Function not implemented.');
        },
        removeEventCallback: function (callbackId: string): void {
          throw new Error('Function not implemented.');
        },
        addPerformanceCallback: function (callback: PerformanceCallbackFunction): string {
          throw new Error('Function not implemented.');
        },
        removePerformanceCallback: function (callbackId: string): boolean {
          throw new Error('Function not implemented.');
        },
        enableAccountStorageEvents: function (): void {
          throw new Error('Function not implemented.');
        },
        disableAccountStorageEvents: function (): void {
          throw new Error('Function not implemented.');
        },
        getAccountByHomeId: function (homeAccountId: string): AccountInfo {
          throw new Error('Function not implemented.');
        },
        getAccountByLocalId: function (localId: string): AccountInfo {
          throw new Error('Function not implemented.');
        },
        getAccountByUsername: function (userName: string): AccountInfo {
          throw new Error('Function not implemented.');
        },
        getAllAccounts: function (): AccountInfo[] {
          throw new Error('Function not implemented.');
        },
        handleRedirectPromise: function (hash?: string): Promise<AuthenticationResult> {
          throw new Error('Function not implemented.');
        },
        loginPopup: function (request?: PopupRequest): Promise<AuthenticationResult> {
          throw new Error('Function not implemented.');
        },
        loginRedirect: function (request?: RedirectRequest): Promise<void> {
          throw new Error('Function not implemented.');
        },
        logout: function (logoutRequest?: EndSessionRequest): Promise<void> {
          throw new Error('Function not implemented.');
        },
        logoutRedirect: function (logoutRequest?: EndSessionRequest): Promise<void> {
          throw new Error('Function not implemented.');
        },
        logoutPopup: function (logoutRequest?: EndSessionPopupRequest): Promise<void> {
          throw new Error('Function not implemented.');
        },
        ssoSilent: function (request: Partial<Omit<CommonAuthorizationUrlRequest, 'responseMode' | 'codeChallenge' | 'codeChallengeMethod' | 'requestedClaimsHash' | 'nativeBroker'>>): Promise<AuthenticationResult> {
          throw new Error('Function not implemented.');
        },
        getTokenCache: function (): ITokenCache {
          throw new Error('Function not implemented.');
        },
        getLogger: function (): Logger {
          throw new Error('Function not implemented.');
        },
        setLogger: function (logger: Logger): void {
          throw new Error('Function not implemented.');
        },
        setActiveAccount: function (account: AccountInfo): void {
          throw new Error('Function not implemented.');
        },
        initializeWrapperLibrary: function (sku: WrapperSKU, version: string): void {
          throw new Error('Function not implemented.');
        },
        setNavigationClient: function (navigationClient: INavigationClient): void {
          throw new Error('Function not implemented.');
        },
        getConfiguration: function (): BrowserConfiguration {
          throw new Error('Function not implemented.');
        }
      }
    };

    routerSpy = { navigate: jest.fn() };

    await TestBed.configureTestingModule({
      declarations: [ResourceManagementCatalogueComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ResourcesService, useValue: resourceServiceMock },
        { provide: MsalService, useValue: msalServiceMock }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceManagementCatalogueComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize infoAccount from MsalService if localUser is not in localStorage', () => {
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue(undefined);
    fixture.detectChanges();
    expect(component.infoAccount.localAccountId).toBe("Test Tenant ID");
  });

  it('should initialize infoAccount from localStorage if localUser is in localStorage', () => {
    const localUser = JSON.stringify({ localAccountId: "Test Tenant ID" });
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue(localUser);
    fixture.detectChanges();
    expect(component.infoAccount.localAccountId).toBe("Test Tenant ID");
  });

  it('should fetch resources on initialization', () => {
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue(undefined);
    fixture.detectChanges();
    expect(component.resourcesList.length).toBe(1);
    expect(resourceServiceMock.getResources).toHaveBeenCalledWith({ relatedPartyId: 'Test Tenant ID', relatedPartyRole: 'OWNER' });
  });

  it('should handle error when fetching resources', () => {
    resourceServiceMock.getResources = jest.fn(() => throwError('Test Error'));
    fixture = TestBed.createComponent(ResourceManagementCatalogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.resourcesList.length).toBe(0);
    expect(resourceServiceMock.getResources).toHaveBeenCalledWith({ relatedPartyId: 'Test Tenant ID', relatedPartyRole: 'OWNER' });
  });

  it('should navigate to create resource', () => {
    component.goToCreateResource();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/resource-management/create-resource']);
  });

  it('should navigate to resource detail', () => {
    const resourceId = 'Test Id';
    component.seeResourceDetail(resourceId);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/resource-management/view-resource/' + resourceId]);
  });

  it('should set active view correctly', () => {
    component.setActiveView('list');
    expect(component.activeView).toBe('list');
  });
});
