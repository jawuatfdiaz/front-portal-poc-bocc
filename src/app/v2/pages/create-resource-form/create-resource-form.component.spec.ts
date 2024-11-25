import {
  ComponentFixture,
  TestBed,
  tick,
  fakeAsync,
  flush,
} from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { CreateResourceFormComponent } from "./create-resource-form.component";
import { MsalService } from "@azure/msal-angular";
import { ResourcesService } from "../../../../services/resources.service";
import { catchError, of, throwError } from "rxjs";
import Swal, { SweetAlertResult } from "sweetalert2";
import { themeMock } from "../../../mocks/theme.mock";
import { defaultValuesMock } from "../../../mocks/defaultValues.mock";
import { localUser } from "../../../mocks/localUser.mock";
import { Router } from "@angular/router";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
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

// Define la interfaz del enrutador aquí mismo
interface RouterInterface {
  navigate(commands: any[], extras?: any): Promise<boolean>;
}

describe("CreateResourceFormComponent", () => {
  let component: CreateResourceFormComponent;
  let routerMock: RouterInterface;
  let fixture: ComponentFixture<CreateResourceFormComponent>;
  let msalServiceMock: Partial<MsalService>;
  let resourcesServiceMock: Partial<ResourcesService>;
  let swalFireSpy: jest.SpyInstance;

  beforeEach(async () => {
    msalServiceMock = {
      instance: {
        getActiveAccount: jest.fn().mockReturnValue({
          name: "Test User",
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
    routerMock = {
      navigate: jest.fn(),
    };

    resourcesServiceMock = {
      postCreateResource: jest.fn().mockReturnValue(of(null)),
    };

    localStorage.setItem("theme", themeMock);
    localStorage.setItem("defaultValues", defaultValuesMock);
    localStorage.setItem("localUser", localUser);

    await TestBed.configureTestingModule({
      declarations: [CreateResourceFormComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        NgMultiSelectDropDownModule.forRoot(),
      ],
      providers: [
        { provide: MsalService, useValue: msalServiceMock },
        { provide: ResourcesService, useValue: resourcesServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();
    swalFireSpy = jest.spyOn(Swal, "fire");
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateResourceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should add and delete parameters", () => {
    component.addParameter();
    expect(component.parameters.length).toBe(1);
    component.deleteParameter(0);
    expect(component.parameters.length).toBe(0);
  });

  it("should add and delete links", () => {
    component.addLink();
    expect(component.links.length).toBe(2); // One link added in constructor
    component.deleteLink(1);
    expect(component.links.length).toBe(1);
  });

  it("should initialize the form with default values", () => {
    fixture.detectChanges(); // Asegura que se inicialice el componente
    expect(component.firstFormGroup.value).toEqual({
      type: "",
      name: "",
      categories: "",
      subCategories: "",
      technologies: "",
      monthlyCost: "",
      description: "",
    });

    expect(component.secondFormGroup.value).toEqual({
      providerName: "",
      version: "",
      repositoryUrl: "",
      cloudProvider: [], // Ajuste para que coincida con el tipo esperado
      deploymentOrchestador: "",
      repositorySourceBranch: "",
      userGithub: "",
    });

    expect(component.parametersForm.value).toEqual({
      parameters: [],
    });

    expect(component.linksForm.value).toEqual({
      links: [{ type: "DOCUMENTATION", value: "" }],
    });
  });

  it("should add a parameter to the parameters form", () => {
    fixture.detectChanges();
    const initialParameterCount = component.parameters.controls.length;
    component.addParameter();
    expect(component.parameters.controls.length).toEqual(
      initialParameterCount + 1
    );
  });

  it("should set resourceTypeSelect with the event item_id", () => {
    const event = {
      item_id: "ANSIBLE_PLAYBOOK",
      item_text: "ANSIBLE_PLAYBOOK",
    };
    component.onTypeResourceSelect(event);
    expect(component.resourceTypeSelect).toBe("ANSIBLE_PLAYBOOK");
  });

  it("should create a resource", fakeAsync(() => {
    component.firstFormGroup.patchValue({
      name: "Test Resource",
      description: "Test Description",
      categories: [{ item_id: "category_id", item_text: "Category" }],
      subCategories: "test",
      technologies: "test",
      monthlyCost: "100",
    });

    component.resourceTypeSelect = "TERRAFORM_MODULE"; // Set the resource type

    component.createResource();
    tick(); // Avanza el temporizador

    // Verifica que el servicio fue llamado con los parámetros correctos
    expect(resourcesServiceMock.postCreateResource).toHaveBeenCalledWith({
      name: "Test Resource",
      description: "Test Description",
      type: "TERRAFORM_MODULE",
      technologies: [],
      category: ["category_id"],
      subCategory: [],
      cloudProvider: "",
      links: [{ type: "DOCUMENTATION", value: "", label: "DOCUMENTATION" }],
      relatedParty: [
        {
          name: "Test User",
          email: "testuser@example.com",
          username: "testuser@example.com",
          id: "testTenantId",
          role: "OWNER",
        },
      ],
      specifications: [
        {
          inputs: [],
          providers: [], // Verifica que providers esté inicializado correctamente
        },
      ],
      estimatedCost: "100",
      repositorySourceKind: "GITHUB",
      repositorySourceUrl: "",
      repositorySourceBranchRef: "",
    });

    // Limpia cualquier temporizador pendiente
    flush();
  }));

  it("should initialize typeOfResourcesList correctly", () => {
    const mockFilterData = [
      { id: "1", name: "Resource 1" },
      { id: "2", name: "Resource 2" },
    ];
    const mockDefaultList = [
      { id: "1", value: "Default 1" },
      { id: "2", value: "Default 2" },
    ];
    const result = component.initializeList(mockFilterData);
    expect(result).toEqual([
      { item_id: "1", item_text: "Resource 1" },
      { item_id: "2", item_text: "Resource 2" },
    ]);
  });

  it("should handle creating resource with subCategories and technologies", fakeAsync(() => {
    component.firstFormGroup.patchValue({
      name: "Test Resource",
      description: "Test Description",
      categories: [{ item_id: "category_id", item_text: "Category" }],
      subCategories: [{ item_id: "subCategory_id", item_text: "SubCategory" }],
      technologies: [{ item_id: "tech_id", item_text: "Technology" }],
      monthlyCost: "100",
    });

    component.secondFormGroup.patchValue({
      cloudProvider: [
        { item_id: "cloudProvider_id", item_text: "Cloud Provider" },
      ], // Ajuste para coincidir con el tipo esperado
      version: "v1.0",
      repositoryUrl: "http://repo.url",
      repositorySourceBranch: "main",
    });

    component.resourceTypeSelect = "TERRAFORM_MODULE"; // Set the resource type

    component.createResource();
    tick(); // Avanza el temporizador

    // Verifica que el servicio fue llamado con los parámetros correctos
    expect(resourcesServiceMock.postCreateResource).toHaveBeenCalledWith({
      name: "Test Resource",
      description: "Test Description",
      type: "TERRAFORM_MODULE",
      technologies: ["tech_id"],
      category: ["category_id"],
      subCategory: ["subCategory_id"],
      cloudProvider: "cloudProvider_id", // Asegúrate de que este campo esté correctamente asignado
      links: [{ type: "DOCUMENTATION", value: "", label: "DOCUMENTATION" }],
      relatedParty: [
        {
          name: "Test User",
          email: "testuser@example.com",
          username: "testuser@example.com",
          id: "testTenantId",
          role: "OWNER",
        },
      ],
      specifications: [
        {
          inputs: [],
          providers: [
            {
              name: "cloudProvider_id",
              version: "v1.0",
            },
          ],
        },
      ],
      estimatedCost: "100",
      repositorySourceKind: "GITHUB",
      repositorySourceUrl: "http://repo.url",
      repositorySourceBranchRef: "main",
    });

    // Limpia cualquier temporizador pendiente
    flush();
  }));

  it("should add a link to the links form", () => {
    const initialLinkCount = component.links.controls.length;
    component.addLink();
    expect(component.links.controls.length).toBe(initialLinkCount + 1);
  });

  it("should delete a link from the links form", () => {
    component.addLink();
    const initialLinkCount = component.links.controls.length;
    component.deleteLink(initialLinkCount - 1);
    expect(component.links.controls.length).toBe(initialLinkCount - 1);
  });

  it("should add a parameter to the parameters form", () => {
    const initialParameterCount = component.parameters.controls.length;
    component.addParameter();
    expect(component.parameters.controls.length).toBe(
      initialParameterCount + 1
    );
  });

  it("should delete a parameter from the parameters form", () => {
    component.addParameter();
    const initialParameterCount = component.parameters.controls.length;
    component.deleteParameter(initialParameterCount - 1);
    expect(component.parameters.controls.length).toBe(
      initialParameterCount - 1
    );
  });
});
