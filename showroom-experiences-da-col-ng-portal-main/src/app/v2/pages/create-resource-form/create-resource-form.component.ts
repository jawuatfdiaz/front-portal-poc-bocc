import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
} from "@angular/forms";
import { MsalService } from "@azure/msal-angular";
import Swal from "sweetalert2";
import { catchError, tap } from "rxjs";
import { Router } from "@angular/router";
// import { TO_TITLE_CASE } from "src/app/v2/utils/constants/constants";
import { checkInvalidCharactersField, uniqueKeyValidator } from "src/app/v2/utils/form/validators";
import { dropdownGeneral, dropdownTypeResource, dropdownTypeResource2 } from "./create-resource-form.constants";
import { ResourcesService } from "src/services/resources.service";

@Component({
  selector: "app-create-resource-form",
  templateUrl: "./create-resource-form.component.html",
  styleUrls: ["./create-resource-form.component.scss", "./custom-theme.scss"],
})
export class CreateResourceFormComponent implements OnInit {

  parametersForm: FormGroup;
  linksForm: FormGroup;
  infoAccount: any;

  removeFields = {
    categories: false,
    subCategories: false,
    technologies: false,
    typeResource: false,
    monthlyCost: false,
    deployOrchestor: false,
  }

  isLinear = false;
  disabled = false;
  resourceTypeSelect = "";
  createRes: any = {};
  isLoading = false;
  themeCategories = []

  typeOfResourcesList = [];
  categoriesList = [];
  subcategoriesList = [];
  technologiesList = [];
  cloudProvidersList = [];

  dropdownGeneral = dropdownGeneral
  dropdownTypeResource = dropdownTypeResource
  dropdownTypeResource2 = dropdownTypeResource2

  firstFormGroup = this._formBuilder.group({
    type: ["", Validators.compose([Validators.required])],
    name: ["", Validators.compose([Validators.required])],
    categories: new FormControl<any>("", Validators.compose([Validators.required])),
    subCategories: new FormControl<any>(""),
    technologies: new FormControl<any>(""),
    monthlyCost: ["", Validators.compose([Validators.required]), [checkInvalidCharactersField(this, 'monthlyCost')]], //No requerido en back
    description: ["", Validators.compose([Validators.required])],
  })

  secondFormGroup = this._formBuilder.group({
    repositoryUrl: [""],
    repositorySourceBranch: [""],
    cloudProvider: new FormControl<any[]>([], Validators.compose([Validators.required])),
    userGithub: [""],
    providerName: [""],
    version: [""],
    deploymentOrchestador: [""],
  })

  constructor(
    private _formBuilder: FormBuilder,
    private msalService: MsalService,
    private resourceService: ResourcesService,
    private router: Router
  ) {
    const theme: any = JSON.parse(localStorage.getItem("theme"))
    const isLocalLogin = theme.properties.localLogin

    this.infoAccount = isLocalLogin
      ? JSON.parse(localStorage.getItem("localUser"))
      : this.msalService.instance.getActiveAccount();

    const defaultValues = JSON.parse(localStorage.getItem("defaultValues"));

    theme.properties.removeFields.forEach((field) => {
      if (field in this.removeFields) {
        this.removeFields[field] = true;
      }
    });

    this.themeCategories = theme?.properties?.dataFilters?.categories || defaultValues?.defaultFilters?.categories

    this.typeOfResourcesList =
      this.initializeList(theme?.properties?.dataFilters?.typeResources || defaultValues?.defaultFilters?.typeResources)

    this.categoriesList =
      this.initializeList(theme?.properties?.dataFilters?.categories || defaultValues?.defaultFilters?.categories)

    this.subcategoriesList =
      this.initializeList([])

    this.cloudProvidersList =
      this.initializeList(theme?.properties?.dataFilters?.cloudProvider || defaultValues?.defaultFilters?.cloudProvider)

    this.technologiesList =
      this.initializeList(theme?.properties?.dataFilters?.technologies || defaultValues?.defaultFilters?.technologies)

    this.parametersForm = this._formBuilder.group({
      parameters: this._formBuilder.array([]),
    })

    this.linksForm = this._formBuilder.group({
      links: this._formBuilder.array([]),
      // links: this._formBuilder.array([this.createLinkGroup()]),
    })
  }

  ngOnInit() {
    this.filterSubcategories()
  }

  initializeList(filterData): [] {
    if(filterData){
      return filterData.map((item) => ({
        item_id: item.id || item.code,
        item_text: item.value || item.name,
      }))
    }
  }

  filterSubcategories(): void {
    this.firstFormGroup.get('categories')!.valueChanges.subscribe(categories => {
      let categoriesIds = categories.map(category => category.item_id);

      let availableSubcategories =
        this.themeCategories.filter(category => categoriesIds.includes(category.code))

      this.subcategoriesList =
        this.initializeList(availableSubcategories.reduce((acc, category) => acc.concat(category.subItems), []))
    })
  }

  addParameter(): void {
    this.parameters.push(
      this._formBuilder.group({
        key: ["", [Validators.required, Validators.pattern(/^(?![_\d])[-_a-zA-Z0-9]*$/), uniqueKeyValidator(this.parameters.controls)]],
        type: ["", Validators.required],
        value: ["", Validators.required],
        required: [false],
      })
    )
  }

  get parameters() {
    return this.parametersForm.get("parameters") as FormArray;
  }

  addLink(): void {
    this.links.push(
      this._formBuilder.group({
        type: ["", Validators.required],
        value: ["", Validators.required],
      })
    )
  }

  get links() {
    return this.linksForm.get("links") as FormArray;
  }

  onTypeResourceSelect(event: any): void {
    this.resourceTypeSelect = event.item_id;
  }

  // createLinkGroup() {
  //   return this._formBuilder.group({
  //     type: ["DOCUMENTATION", Validators.required],
  //     value: ["", Validators.required],
  //   });
  // }

  deleteLink(index: number): void {
    this.links.removeAt(index);
  }

  deleteParameter(index: number): void {
    this.parameters.removeAt(index);
  }

  createResource(): void {
    if (this.isLoading == false) {
      this.assignDateResource()
      this.isLoading = true
      // console.log(this.createRes)

      this.resourceService
        .postCreateResource(this.createRes)
        .pipe(
          tap(() => {
            this.successAlert()
            this.isLoading = false
          }),
          catchError((err) => {
            this.errorAlert(err)
            this.isLoading = false
            throw err; // Rethrow el error para que lo maneje otro suscriptor si es necesario
          })
        )
        .subscribe();
    }
  }

  assignDateResource(): void {
    this.createRes = {
      type: this.resourceTypeSelect,
      category: this.mapItems("categories"),
      subCategory: this.mapItems("subCategories"),
      technologies: this.mapItems("technologies"),
      name: this.firstFormGroup.value.name,
      estimatedCost: this.firstFormGroup.value.monthlyCost,
      description: this.firstFormGroup.value.description,
      cloudProvider: this.secondFormGroup.get("cloudProvider")?.value[0]?.item_id || "",
      links: [],
      relatedParty: [],
      specifications: [
        {
          inputs: [],
          providers: [], // Inicializa providers como un array vacío
        },
      ],
    }

    if (this.createRes.type === "TERRAFORM_MODULE" && this.createRes.cloudProvider) {
      this.createRes.specifications[0].providers.push({
        name: this.createRes.cloudProvider,
        version: this.secondFormGroup.value.version,
      })
    }

    this.assignParams()
    this.assignLinks()
    this.assignRelatedParty()

    if (
      this.createRes.type == "TERRAFORM_MODULE" ||
      this.createRes.type == "ANSIBLE_PLAYBOOK" ||
      this.createRes.type == "ANSIBLE_ROLE"
    ) {
      this.createRes.repositorySourceKind = "GITHUB";
      this.createRes.repositorySourceUrl = this.secondFormGroup.value.repositoryUrl;
      this.createRes.repositorySourceBranchRef = this.secondFormGroup.value.repositorySourceBranch;
    } else {
      this.createRes.repositorySourceOwner = this.secondFormGroup.value.userGithub;
    }
  }

  mapItems(formGroupKey: string): any[] {
    let newArray = []
    if (this.firstFormGroup.get(formGroupKey)?.value) {
      this.firstFormGroup.get(formGroupKey).value.map(item => {
        newArray.push(item?.item_id)
      })
    }
    return newArray
  }

  assignParams(): void {
    const params = this.parametersForm.get("parameters").value

    if (Array.isArray(params)) {
      this.createRes.specifications[0].inputs.push(
        ...params.map((param) => ({
          key: param.key,
          defaultValue: this.assignDefaultValue(param.value) || String(param.value),
          type: param.type,
          required: param.required,
        }))
      )
    }
  }

  assignDefaultValue(value: any): string[] {
    return Array.isArray(value) ? value.map(a => a.value) : null;
  }

  assignLinks(): void {
    const links = this.linksForm.get("links").value
    if (Array.isArray(links)) {
      this.createRes.links.push(
        ...links.map((link) => ({
          label: link.type,
          type: link.type,
          value: link.value,
        }))
      )
    }
  }

  assignRelatedParty(): void {
    const dataUser = {
      name: this.infoAccount.name,
      email: this.infoAccount.username,
      username: this.infoAccount.username,
      id: this.infoAccount.localAccountId,
      role: "APPROVER",
    }

    if (this.createRes.type === "BLUEPRINT_INFRAESTRUCTURE") {
      this.createRes.relatedParty.push({ ...dataUser });
    }
    const ownerDataUser = { ...dataUser, role: "OWNER" };
    this.createRes.relatedParty.push(ownerDataUser);
  }

  successAlert = (): void => {
    Swal.fire({
      icon: "success",
      title: "Successful",
      text: "Resource has been created successfully",
      showCancelButton: false,
      confirmButtonText: "close",
    }).then((result) => {
      result.isConfirmed &&
        this.router.navigate(["/resource-management"]);
    })
  }

  errorAlert = (error): void => {
    const htmlList = error.error.details
      .map((error) => `<li>${error.message}</li>`)
      .join("");
    const htmlContent = `
            <div style="text-align: left; 
                ${error.error.details.length > 3
        ? 'overflow: hidden; overflow-y: scroll; max-height: 12rem;'
        : ''}">
              <ul>
                ${htmlList}
              </ul>
            </div>
          `;
    Swal.fire({
      icon: "error",
      title: "Error",
      html: htmlContent,
      confirmButtonText: "OK",
    })
  }
}
