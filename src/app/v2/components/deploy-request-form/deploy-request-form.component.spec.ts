import {
  ComponentFixture,
  TestBed,
  tick,
  fakeAsync,
} from "@angular/core/testing";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { MsalService } from "@azure/msal-angular";
import { Observable, of, throwError } from "rxjs";
import { ResourcesService } from "../../../../services/resources.service";
import { DeployRequestFormComponent } from "./deploy-request-form.component";
import Swal from "sweetalert2";

describe("DeployRequestFormComponent", () => {
  let component: DeployRequestFormComponent;
  let fixture: ComponentFixture<DeployRequestFormComponent>;
  let resourcesServiceMock: jest.Mocked<ResourcesService>;
  let msalServiceMock: jest.Mocked<MsalService>;

  beforeEach(async () => {
    msalServiceMock = {
      loginRedirect: jest.fn(),
      instance: {
        getActiveAccount: jest.fn(),
        handleRedirectPromise: jest.fn().mockResolvedValue(null),
        setActiveAccount: jest.fn(),
      },
    } as unknown as jest.Mocked<MsalService>;
    resourcesServiceMock = {
      apiUrl: "", // Puedes dejarlo vacío o proporcionar un valor si es necesario
      http: jest.fn(), // Puedes dejarlo vacío o proporcionar una función si es necesario
      postRequestDeploy: jest
        .fn()
        .mockReturnValue(
          throwError({ error: { details: [{ message: "error" }] } })
        ),
      postCreateResource: jest.fn(),
      getResources: jest.fn(),
      getResourceById: jest.fn(),
      enableResource: jest.fn(),
      getRequestDeploy: jest.fn(),
      getRequestDeployId: jest.fn(),
      putApprovalResource: jest.fn(),
      putRejectResource: jest.fn(),
      // Agregar simulaciones para todos los demás métodos de ResourcesService
    } as unknown as jest.Mocked<ResourcesService>;

    const mockResource = {
      specifications: [
        {
          inputs: [
            {
              key: "aks_nodes",
              defaultValue: "2",
              type: "NUMBER",
              required: true,
            },
            {
              key: "param_2",
              defaultValue: "test",
              type: "STRING",
              required: false,
            },
            {
              key: "param_3",
              defaultValue: "34",
              type: "NUMBER",
              required: true,
            },
          ],
        },
      ],
    };

    await TestBed.configureTestingModule({
      declarations: [DeployRequestFormComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: MsalService, useValue: msalServiceMock },
        { provide: ResourcesService, useValue: resourcesServiceMock },
        { provide: "resource", useValue: mockResource },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeployRequestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize deploymentForm and parametersForm", () => {
    expect(component.deploymentForm).toBeTruthy();
    expect(component.parametersForm).toBeTruthy();
  });

  it("should add parameters to parametersForm", () => {
    const resource = {
      specifications: [
        {
          inputs: [
            {
              key: "key1",
              type: "STRING",
              defaultValue: "value1",
              required: true,
            },
          ],
        },
      ],
    };
    component.resource = resource;
    component.ngOnInit();
    expect(component.parameters.length).toBe(1);
  });

  it("should toggle isEfimieral value", () => {
    expect(component.isEfimieral).toBeFalsy();
    component.getCheckValue();
    expect(component.isEfimieral).toBeTruthy();
  });
  it("should create request object with proper values", () => {
    component.deploymentForm.patchValue({
      name: "Test Deployment",
      deploymentDate: "2024-05-20",
      isEfimieral: false,
      destructionDate: "",
      costCenter: "Test Center",
      approver: "Test Approver",
      country: "Test Country",
      githubUser: "Test User",
      description: "Test Description",
    });
    component.sendRequest();
  });
});
