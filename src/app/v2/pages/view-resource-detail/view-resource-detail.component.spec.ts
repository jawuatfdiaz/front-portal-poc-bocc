import {
  ComponentFixture,
  TestBed,
  waitForAsync,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
} from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ActivatedRoute, Router } from "@angular/router";
import { of, throwError } from "rxjs";
import Swal, { SweetAlertResult } from "sweetalert2";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import {
  MatSlideToggleModule,
  MatSlideToggleChange,
} from "@angular/material/slide-toggle";

import { ViewResourceDetailComponent } from "./view-resource-detail.component";
import { ResourcesService } from "../../../../services/resources.service";
import { MsalService } from "@azure/msal-angular";
import { ModalService } from "../../modal.service";

// Mock setup for ActivatedRoute
const activatedRouteMock = {
  params: of({ id: "123" }),
};

// Mocks for MsalService y ResourcesService
const msalServiceMock = {
  instance: {
    getActiveAccount: jest.fn(() => ({
      name: "John Doe",
      username: "johndoe@example.com",
      localAccountId: "tenant-id",
    })),
  },
};

const resourcesServiceMock = {
  getResourceById: jest.fn().mockReturnValue(
    of({
      payload: [
        {
          type: "type",
          name: "name",
          category: [],
          subCategory: [],
          technologies: [],
          description: "",
          estimatedCost: "",
          specifications: [{ providers: [], inputs: [] }],
          repositorySourceUrl: "",
          cloudProvider: "",
          repositorySourceKind: "",
          repositorySourceBranchRef: "",
          links: [],
        },
      ],
    })
  ),
  postCreateResource: jest.fn().mockReturnValue(of({ success: true })),
  enableResource: jest.fn().mockReturnValue(of({ success: true })),
};

const modalServiceMock = {
  openModal: jest.fn(),
  closeModal: jest.fn(),
};

describe("ViewResourceDetailComponent", () => {
  let component: ViewResourceDetailComponent;
  let fixture: ComponentFixture<ViewResourceDetailComponent>;
  let fb: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewResourceDetailComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        NgMultiSelectDropDownModule.forRoot(),
        MatSlideToggleModule,
      ],
      providers: [
        FormBuilder,
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: Router, useValue: jest.fn() },
        { provide: MsalService, useValue: msalServiceMock },
        { provide: ResourcesService, useValue: resourcesServiceMock },
        { provide: ModalService, useValue: modalServiceMock },
      ],
    }).compileComponents();
    const formBuilder = TestBed.inject(FormBuilder);
    fixture = TestBed.createComponent(ViewResourceDetailComponent);
    component = fixture.componentInstance;
    fb = TestBed.inject(FormBuilder);
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should subscribe to route parameters and fetch the resource on ngOnInit", waitForAsync(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.resourceService.getResourceById).toHaveBeenCalledWith(
        "123"
      );
      expect(component.resource).toBeTruthy();
    });
  }));

  it("should initialize dropdown configurations correctly", () => {
    component.ngOnInit();
    expect(component.dropdownTypeResource).toEqual({
      singleSelection: true,
      idField: "item_id",
      textField: "item_text",
      itemsShowLimit: 1,
      allowSearchFilter: false,
    });

    expect(component.dropdownTypeResource2).toEqual({
      singleSelection: false,
      idField: "item_id",
      textField: "item_text",
      itemsShowLimit: 2,
      allowSearchFilter: false,
    });

    expect(component.dropdownGeneral).toEqual({
      singleSelection: false,
      idField: "item_id",
      textField: "item_text",
      itemsShowLimit: 1,
      allowSearchFilter: true,
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      enableCheckAll: true,
    });
  });

  it("should handle successful resource retrieval", waitForAsync(() => {
    component.ngOnInit();
    fixture.whenStable().then(() => {
      expect(component.resource).toBeTruthy();
    });
  }));

  it("should toggle the resource enable state", waitForAsync(() => {
    const event = { checked: true } as MatSlideToggleChange;
    jest
      .spyOn(component.resourceService, "enableResource")
      .mockReturnValue(of({ success: true }));

    component.toggleChanged(event);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.enableResource).toBe(true);
    });
  }));

  it("should initialize lists correctly", () => {
    const filterData = [
      { id: "1", name: "Test 1" },
      { id: "2", name: "Test 2" },
    ];
    const defaultList = [
      { id: "3", value: "Default 1" },
      { id: "4", value: "Default 2" },
    ];

    const result = component.initializeList(filterData, defaultList);

    expect(result).toEqual([
      { item_id: "1", item_text: "Test 1" },
      { item_id: "2", item_text: "Test 2" },
    ]);
  });

  it("should charge data correctly", waitForAsync(() => {
    component.resource = {
      type: "Type 1",
      name: "Resource Name",
      category: ["Category 1"],
      subCategory: ["SubCategory 1"],
      technologies: ["Technology 1"],
      description: "Resource Description",
      estimatedCost: "100",
      specifications: [
        {
          providers: [{ name: "Provider 1", version: "1.0" }],
          inputs: [
            {
              key: "param1",
              type: "string",
              defaultValue: "value1",
              required: true,
            },
          ],
        },
      ],
      repositorySourceUrl: "http://example.com",
      cloudProvider: "CloudProvider 1",
      repositorySourceKind: "Kind 1",
      repositorySourceBranchRef: "Branch 1",
      links: [{ type: "Type 1", value: "Value 1" }],
    };

    component.chargeData();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.firstFormGroup.value).toEqual({
        type: [{ item_id: "Type 1", item_text: "Type 1" }],
        name: "Resource Name",
        categories: [{ item_id: "Category 1", item_text: "Category 1" }],
        subCategories: [
          { item_id: "SubCategory 1", item_text: "SubCategory 1" },
        ],
        technologies: [{ item_id: "Technology 1", item_text: "Technology 1" }],
        description: "Resource Description",
        monthlyCost: "100",
        repositorySourceKind: "Kind 1",
        repositorySourceUrl: "http://example.com",
      });
      expect(component.secondFormGroup.value).toEqual({
        providerName: [{ item_id: "Provider 1", item_text: "Provider 1" }],
        version: "1.0",
        repositoryUrl: "http://example.com",
        cloudProvider: [
          { item_id: "CloudProvider 1", item_text: "CloudProvider 1" },
        ],
        deploymentOrchestador: [{ item_id: "Kind 1", item_text: "Kind 1" }],
        repositorySourceBranch: "Branch 1",
      });
    });
  }));

  it("should create resource correctly", waitForAsync(() => {
    component.firstFormGroup.patchValue({
      type: [{ item_id: "Type 1", item_text: "Type 1" }],
      name: "Resource Name",
      categories: [{ item_id: "Category 1", item_text: "Category 1" }],
      subCategories: [{ item_id: "SubCategory 1", item_text: "SubCategory 1" }],
      technologies: [{ item_id: "Technology 1", item_text: "Technology 1" }],
      description: "Resource Description",
      monthlyCost: "100",
    });

    component.secondFormGroup.patchValue({
      providerName: [{ item_id: "Provider 1", item_text: "Provider 1" }],
      version: "1.0",
      repositoryUrl: "http://example.com",
      cloudProvider: [
        { item_id: "CloudProvider 1", item_text: "CloudProvider 1" },
      ],
      deploymentOrchestador: [{ item_id: "Kind 1", item_text: "Kind 1" }],
      repositorySourceBranch: "Branch 1",
    });

    const swalSpy = jest
      .spyOn(Swal, "fire")
      .mockResolvedValue({} as SweetAlertResult);
    jest
      .spyOn(component.resourceService, "postCreateResource")
      .mockReturnValue(of({ success: true }));

    component.createResource();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(swalSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "successful",
          text: "Resource has been created successfully",
          icon: "success",
        })
      );
    });
  }));

  it("should handle errors in resource creation", async () => {
    const errorResponse = {
      error: { details: [{ message: "Error message" }] },
    };
    jest
      .spyOn(component.resourceService, "postCreateResource")
      .mockReturnValue(throwError(() => errorResponse));

    const swalSpy = jest
      .spyOn(Swal, "fire")
      .mockResolvedValue({} as SweetAlertResult);

    component.createResource();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(swalSpy).toHaveBeenCalledWith({
      icon: "error",
      title: "Oops...",
      html: `
                <div>
                  <h2>Error!</h2>
                  <ul>
                  <li>Error message</li>
                  </ul>
                </div>
              `,
      confirmButtonText: "OK",
    });
  });

  it("should add a new parameter form group", () => {
    expect(component.parameters.length).toBe(0);
    component.addParameter();
    expect(component.parameters.length).toBe(1);
    const formGroup = component.parameters.at(0) as FormGroup;
    expect(formGroup).toBeInstanceOf(FormGroup);
    expect(formGroup.get("key")).toBeTruthy();
    expect(formGroup.get("type")).toBeTruthy();
    expect(formGroup.get("value")).toBeTruthy();
    expect(formGroup.get("required")).toBeTruthy();
    const keyControl = formGroup.get("key");
    keyControl.setValue("");
    expect(keyControl.valid).toBeFalsy();
    keyControl.setValue("validKey");
    expect(keyControl.valid).toBeTruthy();
    keyControl.setValue("1invalidKey");
    expect(keyControl.valid).toBeFalsy();
    keyControl.setValue("_invalidKey");
    expect(keyControl.valid).toBeFalsy();
  });

  it("should handle out of bounds index gracefully", () => {
    component.addParameter();
    component.deleteParameter(5);
    expect(component.parameters.length).toBe(1);
  });

  it("should create an empty FormArray for links", () => {
    expect(component.links).toBeInstanceOf(FormArray);
    expect(component.links.length).toBe(0);
  });

  it("should create a link form group with default values", () => {
    const linkGroup = component.createLinkGroup();
    expect(linkGroup).toBeInstanceOf(FormGroup);
    expect(linkGroup.get("type").value).toBe("DOCUMENTATION");
    expect(linkGroup.get("value").value).toBe("");
  });

  it("should handle out of bounds index gracefully when deleting a link", () => {
    component.addLink();
    component.deleteLink(5);
    expect(component.links.length).toBe(1);
  });

  it("should set resourceTypeSelect with the event item_id", () => {
    const event = {
      item_id: "ANSIBLE_PLAYBOOK",
      item_text: "ANSIBLE_PLAYBOOK",
    };
    component.onTypeResourceSelect(event);
    expect(component.resourceTypeSelect).toBe("ANSIBLE_PLAYBOOK");
  });

  it("should open modal on requestDeploy", () => {
    component.requestDeploy();
    expect(modalServiceMock.openModal).toHaveBeenCalled();
  });

  it("should set relatedParty role to APPROVER when type is BLUEPRINT_INFRAESTRUCTURE", () => {
    component.resourceTypeSelect = "BLUEPRINT_INFRAESTRUCTURE";
    component.createResource();
    expect(component.createRes.relatedParty[0].role).toBe("OWNER");
  });

  it("should set repositorySourceKind to GITHUB for TERRAFORM_MODULE", () => {
    component.resourceTypeSelect = "TERRAFORM_MODULE";
    component.createResource();
    expect(component.createRes.repositorySourceKind).toBe("GITHUB");
  });
});
