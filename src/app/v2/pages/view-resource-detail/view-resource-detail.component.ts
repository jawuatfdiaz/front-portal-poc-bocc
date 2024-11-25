import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { catchError, delay, map, tap } from "rxjs";

import Swal from "sweetalert2";
import { MsalService } from "@azure/msal-angular";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";
import { ResourcesService } from "src/services/resources.service";
import { Resource } from "../../models/resource.interface";
import { ModalService } from "../../modal.service";

@Component({
  selector: "app-view-resource-detail",
  templateUrl: "./view-resource-detail.component.html",
  styleUrls: ["./view-resource-detail.component.scss"],
})
export class ViewResourceDetailComponent implements OnInit {

  idResource: string;
  resource
  infoAccount: any;
  enableResource: boolean;
  theme: any
  defaultValues: any
  loading = true

  removeFields = {
    categories: false,
    subCategories: false,
    technologies: false,
    typeResource: false,
    monthlyCost: false,
    deployOrchestor: false,
  }

  obj

  // disabled = true;
  // resourceTypeSelect = "";
  // createRes: any = {};
  // modalDeploy = false;

  // parametersForm: FormGroup;
  // linksForm: FormGroup;
  // firstFormGroup: FormGroup;
  // secondFormGroup: FormGroup;

  // typeOfResourcesList = [];
  // categoriesList = [];
  // subcategoriesList = [];
  // cloudProvidersList = [];
  // technologiesList = [];
  // themeCategories = []

  // dropdownTypeResource = dropdownTypeResource
  // dropdownTypeResource2 = dropdownTypeResource2;
  // dropdownGeneral = dropdownGeneral;

  constructor(
    public resourceService: ResourcesService,
    private routActive: ActivatedRoute,
    private msalService: MsalService,
    private modalService: ModalService
    // private _formBuilder: FormBuilder,
    // private router: Router,
  ) {
    this.infoAccount =
      localStorage.getItem("localUser") == undefined
        ? this.msalService.instance.getActiveAccount()
        : JSON.parse(localStorage.getItem("localUser"));


    this.theme = JSON.parse(localStorage.getItem("theme"))
    this.defaultValues = JSON.parse(localStorage.getItem("defaultValues"))

    this.theme.properties.removeFields.forEach((field) => {
      if (field in this.removeFields) {
        this.removeFields[field] = true;
      }
    });

    // this.firstFormGroup = this._formBuilder.group({
    //   type: [{ value: "", disabled: this.disabled }],
    //   name: [{ value: "", disabled: this.disabled }],
    //   categories: [{ value: "", disabled: this.disabled }],
    //   subCategories: [{ value: "", disabled: this.disabled }],
    //   technologies: [{ value: "", disabled: this.disabled }],
    //   monthlyCost: [{ value: "", disabled: this.disabled }],
    //   description: [{ value: "", disabled: this.disabled }],
    //   repositorySourceKind: [{ value: "", disabled: this.disabled }],
    //   repositorySourceName: [{ value: "", disabled: this.disabled }],
    //   repositorySourceUrl: [{ value: "", disabled: this.disabled }],
    //   owner: [{ value: "", disabled: this.disabled }],
    //   email: [{ value: "", disabled: this.disabled }],
    // });

    // this.secondFormGroup = this._formBuilder.group({
    //   providerName: [{ value: "", disabled: this.disabled }],
    //   version: [{ value: "", disabled: this.disabled }],
    //   repositoryUrl: [{ value: "", disabled: this.disabled }],
    //   cloudProvider: [{ value: "", disabled: this.disabled }],
    //   deploymentOrchestador: [{ value: "", disabled: this.disabled }],
    //   repositorySourceBranch: [{ value: "", disabled: this.disabled }],
    // });

    // if (localStorage.getItem("theme")) {
    //   theme = JSON.parse(localStorage.getItem("theme"));
    // } else {
    //   theme = {
    //     id: "default",
    //     properties: {
    //       logo: "../assets/images/davivienda-logo.png",
    //       removeField: ["country"],
    //       themeUrl: "../themes/davivienda.scss",
    //       deployOrchestor: false,
    //       removeFields: ["subCategories", "technologies", "deployOrchestor"],

    //       dataFilters: {
    //         categories: [
    //           {
    //             name: "Area Usuaria 1",
    //             code: "area_usuaria_1",
    //             description: "",
    //             subItems: [],
    //           },
    //           {
    //             name: "Area Usuaria 3",
    //             code: "area_usuaria_3",
    //             description: "",
    //             subItems: [],
    //           },
    //           {
    //             name: "Area Usuaria 2",
    //             code: "area_usuaria_2",
    //             description: "",
    //             subItems: [],
    //           },
    //         ],

    //         cloudProvider: [
    //           {
    //             name: "Azure",
    //             code: "AZURE",
    //           },
    //         ],
    //         country: [
    //           {
    //             name: "filial 1",
    //             code: "filial_1",
    //           },
    //           {
    //             name: "filial 2",
    //             code: "filial_2",
    //           },

    //           {
    //             name: "filial 4",
    //             code: "filial_4",
    //           },
    //           {
    //             name: "filial 3",
    //             code: "filial_3",
    //           },
    //         ],
    //       },
    //     },
    //   };
    // }

    // let theme = JSON.parse(localStorage.getItem("theme"));
    // const defaultValues = JSON.parse(localStorage.getItem("defaultValues"));

    // this.themeCategories = theme?.properties?.dataFilters?.categories || defaultValues?.defaultFilters?.categories

    // this.typeOfResourcesList =
    //   this.initializeList(theme?.properties?.dataFilters?.typeResources || defaultValues?.defaultFilters?.typeResources)

    // console.log(this.typeOfResourcesList)
    // this.categoriesList =
    //   this.initializeList(theme?.properties?.dataFilters?.categories || defaultValues?.defaultFilters?.categories)

    // console.log(this.subcategoriesList)
    // this.subcategoriesList =
    //   this.initializeList([])

    // this.technologiesList =
    //   this.initializeList(theme?.properties?.dataFilters?.technologies || defaultValues?.defaultFilters?.technologies)

    // this.cloudProvidersList =
    //   this.initializeList(theme?.properties?.dataFilters?.cloudProvider || defaultValues?.defaultFilters?.cloudProvider)

    // this.typeOfResourcesList = this.initializeList(
    //   theme?.properties?.dataFilters?.typeResources,
    //   defaultValues?.defaultFilters.typeResources
    // );
    // this.categoriesList = this.initializeList(
    //   theme?.properties?.dataFilters?.categories,
    //   defaultValues?.defaultFilters.categories
    // );
    // this.cloudProvidersList = this.initializeList(
    //   theme?.properties?.dataFilters?.cloudProvider,
    //   defaultValues?.defaultFilters.cloudProvider
    // );
    // this.technologiesList = this.initializeList(
    //   theme?.properties?.dataFilters?.technologies,
    //   defaultValues?.defaultFilters.technologies
    // );

    // this.parametersForm = this._formBuilder.group({
    //   parameters: this._formBuilder.array([]),
    // });

    // this.linksForm = this._formBuilder.group({
    //   links: this._formBuilder.array([]),
    // });
  }

  ngOnInit(): void {
    this.routActive?.params?.subscribe((params) => {
      this.idResource = params["id"];
      this.getResourceId(this.idResource);
    })
    // this.filterSubcategories()
  }

  getResourceId(id: string): void {
    this.resourceService
      .getResourceById(id)
      .pipe(delay(300),
        map((response) => {
          // this.resource = response.payload[0]
          this.enableResource = response.payload[0].enable
          this.transformResourceData(response.payload[0])
          this.loading = false
        }),
        catchError((error) => {
          this.loading = false
          throw error;
        })
      )
      .subscribe();
  }

  transformResourceData(resource: Resource): void {
    let category = this.assignDataName('categories', resource.category)
    let subCategory = this.assignDataName('categories', resource.category, resource.subCategory)
    let technologies = this.assignDataName('technologies', resource.technologies)

    this.resource = {
      ...resource,
      category: category.length ? category : resource.category,
      subCategory: subCategory.length ? subCategory : resource.subCategory,
      technologies: technologies.length ? technologies : resource.technologies,
      cloudProvider: this.assignDataName('cloudProvider', resource.cloudProvider)
    }
  }

  assignDataName(nameDataGroup: string, dataCodes: any, subcategories?: string[]): string[] | string {
    let dataNames = [];

    (this.theme?.properties?.dataFilters?.[nameDataGroup]
      || this.defaultValues?.defaultFilters?.[nameDataGroup])
      .forEach(category => {
        if (dataCodes.includes(category.code)) {

          if (subcategories) {
            category.subItems.forEach(subcategory => {
              if (subcategories.includes(subcategory.code)) {
                dataNames.push(subcategory.name)
              }
            })
          } else {
            Array.isArray(dataCodes) ? dataNames.push(category.name) : dataNames = category.name
          }

        }
      })
    return dataNames
  }

  toggleChanged(event: MatSlideToggleChange): void {
    this.enableResource = event.checked;

    Swal.fire({
      position: "top-end",
      title: event.checked ? `Resource enabled` : `Disabled resource`,
      icon: "success",
      showConfirmButton: false,
      timer: 1200,
      // text: "Resource has been created successfully",
      // timerProgressBar: true
      // confirmButtonText: "close",
    })

    const obj = {
      enable: this.enableResource,
      relatedParty: [
        {
          name: this.infoAccount.name,
          email: this.infoAccount.username,
          username: this.infoAccount.username,
          id: this.infoAccount.localAccountId,
          role: "OWNER",
        },
      ],
    }

    this.resourceService
      .enableResource(obj, this.idResource)
      .pipe(
        tap((response) => {
          this.getResourceId(this.idResource)
        }),
        catchError((error) => {
          throw error; // Rethrow el error para que lo maneje otro suscriptor si es necesario
        })
      )
      .subscribe();
  }

  requestDeploy(): void {
    this.modalService.openModal();
  }

  alertToEnableresources(): void {
    Swal.fire("To make a deployment, the resource must be enabled!");
  }

  handleCopyElement(item: string): void {
    navigator.clipboard.writeText(item)

    Swal.fire({
      position: "top-end",
      icon: "success",
      title: `Copied`,
      showConfirmButton: false,
      timer: 1300,
      // timerProgressBar: true
    })
  }

  // nameItem(nameGroup: string, codeItem: string): string {
  //   let result = (this.theme?.properties?.dataFilters?.[nameGroup] || this.defaultValues?.defaultFilters?.[nameGroup])
  //     ?.find(item => item.code === codeItem)?.name;

  //   return result || codeItem
  // }

  // initializeList(filterData): [] {
  //   return filterData.map((item) => ({
  //     item_id: item.id || item.code,
  //     item_text: item.value || item.name,
  //   }))
  // }

  // filterSubcategories(): void {
  //   this.firstFormGroup.get('categories')!.valueChanges.subscribe(categories => {
  //     let categoriesIds = categories.map(category => category.item_id);

  //     let availableSubcategories =
  //       this.themeCategories.filter(category => categoriesIds.includes(category.code))

  //     this.subcategoriesList =
  //       this.initializeList(availableSubcategories.reduce((acc, category) => acc.concat(category.subItems), []))
  //   })
  // }

  // getRoutActive() {
  //   return this.routActive;
  // }

  // chargeData(): void {
  //   this.resourceTypeSelect = this.resource.type;
  //   this.enableResource = this.resource.enable;

  //   this.firstFormGroup.patchValue({
  //     type: [{ item_id: this.resource.type, item_text: this.resource.type }],
  //     name: this.resource.name,
  //     categories: this.resource.category.map((category) => ({
  //       item_id: category,
  //       item_text: category,
  //     })),
  //     subCategories: this.resource.subCategory.map((subcategory) => ({
  //       item_id: subcategory,
  //       item_text: subcategory,
  //     })),
  //     technologies: this.resource.technologies.map((tecnology) => ({
  //       item_id: tecnology,
  //       item_text: tecnology,
  //     })),
  //     description: this.resource.description,
  //     monthlyCost: this.resource.estimatedCost,
  //     repositorySourceKind: this.resource.repositorySourceKind,
  //     repositorySourceName: this.resource.repositorySourceName,
  //     repositorySourceUrl: this.resource.repositorySourceUrl,
  //     owner: this.resource.relatedParty[1]?.name,
  //     email: this.resource.relatedParty[1]?.email,
  //   });

  //   if (this.resource.specifications[0]?.providers) {
  //     this.secondFormGroup.patchValue({
  //       providerName: [
  //         {
  //           item_id: this.resource.specifications[0]?.providers[0]?.name,
  //           item_text: this.resource.specifications[0]?.providers[0]?.name,
  //         },
  //       ],
  //       version: this.resource.specifications[0]?.providers[0]?.version,
  //     });
  //   }

  //   this.secondFormGroup.patchValue({
  //     repositoryUrl: this.resource.repositorySourceUrl,
  //     cloudProvider: [
  //       {
  //         item_id: this.resource.cloudProvider,
  //         item_text: this.resource.cloudProvider,
  //       },
  //     ],
  //     deploymentOrchestador: [
  //       {
  //         item_id: this.resource.repositorySourceKind,
  //         item_text: this.resource.repositorySourceKind,
  //       },
  //     ],
  //     repositorySourceBranch: this.resource.repositorySourceBranchRef,
  //   });

  //   this.parameters.clear()
  //   this.resource.specifications[0]?.inputs.forEach((param) => {
  //     this.parameters.push(
  //       this._formBuilder.group({
  //         key: { value: param.key, disabled: this.disabled },
  //         type: { value: param.type, disabled: this.disabled },
  //         value: { value: param.defaultValue, disabled: this.disabled },
  //         required: { value: param.required, disabled: this.disabled },
  //       })
  //     );
  //   });

  //   this.links.clear();
  //   this.resource.links.forEach((link) => {
  //     this.links.push(
  //       this._formBuilder.group({
  //         type: { value: link.type, disabled: this.disabled },
  //         value: { value: link.value, disabled: this.disabled },
  //       })
  //     )
  //   })
  // }

  // get parameters() {
  //   return this.parametersForm.get("parameters") as FormArray;
  // }

  // get links() {
  //   return this.linksForm.get("links") as FormArray;
  // }

  // onTypeResourceSelect(event: any) {
  //   this.resourceTypeSelect = event.item_id;
  // }




  // addParameter() {
  //   this.parameters.push(
  //     this._formBuilder.group({
  //       key: [
  //         "",
  //         [
  //           Validators.required,
  //           Validators.pattern(/^(?![_\d])[-_a-zA-Z0-9]*$/),
  //         ],
  //       ],
  //       type: ["", Validators.required],
  //       value: ["", Validators.required],
  //       required: [false],
  //     })
  //   );
  // }

  // deleteParameter(index: number) {
  //   this.parameters.removeAt(index);
  // }

  // createLinkGroup() {
  //   return this._formBuilder.group({
  //     type: ["DOCUMENTATION", Validators.required],
  //     value: ["", Validators.required],
  //   });
  // }

  // addLink() {
  //   this.links.push(
  //     this._formBuilder.group({
  //       type: ["", Validators.required],
  //       value: ["", Validators.required],
  //     })
  //   );
  // }

  // deleteLink(index: number) {
  //   this.links.removeAt(index);
  // }

  // createResource() {
  //   this.createRes = {
  //     name: this.firstFormGroup.value.name,
  //     description: this.firstFormGroup.value.description,
  //     repositorySourceUrl: this.secondFormGroup.value.repositoryUrl,
  //     repositorySourceBranchRef: this.secondFormGroup.value.repositorySourceBranch,
  //     repositorySourceKind: "", //(GITHUB)
  //     type: this.resourceTypeSelect, //(TERRAFORM_MODULE, ANSIBLE_PLAYBOOK, ANSIBLE_ROLE, BLUEPRINT_INFRAESTRUCTURE)
  //     technologies: [],
  //     category: [],
  //     subCategory: [],
  //     cloudProvider: "",
  //     links: [],
  //     relatedParty: [],
  //     specifications: [
  //       {
  //         inputs: [],
  //         providers: [],
  //       },
  //     ],
  //     estimatedCost: this.firstFormGroup.value.monthlyCost,
  //   };

  //   const categories = this.firstFormGroup.get("categories").value;
  //   if (Array.isArray(categories)) {
  //     this.createRes.category.push(...categories.map((cat) => cat.item_id));
  //   }
  //   const technolog = this.firstFormGroup.get("technologies").value;
  //   if (Array.isArray(technolog)) {
  //     this.createRes.technologies.push(...technolog.map((tec) => tec.item_id));
  //   }

  //   const subCategories = this.firstFormGroup.get("subCategories").value;
  //   if (Array.isArray(subCategories)) {
  //     this.createRes.subCategory.push(
  //       ...subCategories.map((scat) => scat.item_id)
  //     );
  //   }

  //   const cloudProv = this.secondFormGroup.get("cloudProvider").value;
  //   if (Array.isArray(cloudProv)) {
  //     this.createRes.cloudProvider = cloudProv[0].item_id;
  //     if (this.createRes.type == "TERRAFORM_MODULE") {
  //       this.createRes.specifications[0].providers.push(
  //         ...cloudProv.map((cp) => ({
  //           name: cp.item_id,
  //           version: this.secondFormGroup.value.version,
  //         }))
  //       );
  //     }
  //   }

  //   const links = this.linksForm.get("links").value;
  //   if (Array.isArray(links)) {
  //     this.createRes.links.push(
  //       ...links.map((link) => ({
  //         label: link.type,
  //         type: link.type,
  //         value: link.value,
  //       }))
  //     );
  //   }
  // const params = this.parametersForm.get("parameters").value;
  // console.log(params)
  // if (Array.isArray(params)) {
  //   this.createRes.specifications[0].inputs.push(
  //     ...params.map((param) => ({
  //       key: param.key,
  //       defaultValue: String(param.value),
  //       type: param.type,
  //       required: param.required,
  //     }))
  //   );
  // }

  //   this.createRes.relatedParty.push({
  //     name: this.infoAccount.name,
  //     email: this.infoAccount.username,
  //     username: this.infoAccount.username,
  //     id: this.infoAccount.localAccountId,
  //     role:
  //       this.createRes.type == "BLUEPRINT_INFRAESTRUCTURE "
  //         ? "APPROVER"
  //         : "OWNER",
  //   });

  //   if (
  //     this.createRes.type == "TERRAFORM_MODULE" ||
  //     this.createRes.type == "ANSIBLE_PLAYBOOK" ||
  //     this.createRes.type == "ANSIBLE_ROLE"
  //   ) {
  //     this.createRes.repositorySourceKind = "GITHUB";
  //   }

  //   this.resourceService
  //     .postCreateResource(this.createRes)
  //     .pipe(
  //       tap(() => {
  //         Swal.fire({
  //           title: "successful",
  //           text: "Resource has been created successfully",
  //           icon: "success",
  //           showCancelButton: false,
  //           confirmButtonText: "close",
  //         }).then((result) => {
  //           if (result.isConfirmed) {
  //             this.router.navigate(["/resource-management"]);
  //           }
  //         });
  //       }),
  //       catchError((error) => {
  //         const htmlList = error.error.details
  //           .map((error) => `<li>${error.message}</li>`)
  //           .join("");
  //         const htmlContent = `
  //               <div>
  //                 <h2>Error!</h2>
  //                 <ul>
  //                 ${htmlList}
  //                 </ul>
  //               </div>
  //             `;

  //         Swal.fire({
  //           icon: "error",
  //           title: "Oops...",
  //           html: htmlContent,
  //           confirmButtonText: "OK",
  //         });

  //         throw error; // Rethrow el error para que lo maneje otro suscriptor si es necesario
  //       })
  //     )
  //     .subscribe();
  // }
}
