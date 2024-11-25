import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MsalService } from "@azure/msal-angular";
import { catchError, Subscription, tap } from "rxjs";
import Swal from "sweetalert2";
import { LIST_COUNTRIES, LIST_USERS } from "src/app/v2/utils/constants/listCountries";
import { checkInvalidFormatField } from "../../utils/form/validators";
import { ResourcesService } from "src/services/resources.service";


@Component({
  selector: "app-deploy-request-form",
  templateUrl: "./deploy-request-form.component.html",
  styleUrls: ["./deploy-request-form.component.scss"],
})
export class DeployRequestFormComponent implements OnInit {
  @Input() resource: any;

  listCountries = LIST_COUNTRIES
  disabled = true;
  infoAccount: any;
  isEfimieral = false;
  currentDate: string;
  approvalUsers: any;

  deploymentForm: FormGroup
  parametersForm: FormGroup

  private deploymentDateSubscription: Subscription

  constructor(
    private _formBuilder: FormBuilder,
    private msalService: MsalService,
    private resourceService: ResourcesService
  ) {
    this.infoAccount =
      localStorage.getItem("localUser") == undefined
        ? this.msalService.instance.getActiveAccount()
        : JSON.parse(localStorage.getItem("localUser"))

    this.initializeDeploymentForm()
    this.initializeParametersForm()
  }

  ngOnInit(): void {
    let date = new Date()
    this.currentDate = this.changeDateFormat(date)
    this.chargeData()
    this.deploymentForm.get('country')?.valueChanges.subscribe(value => {
      this.approvalUsers = LIST_USERS.filter(user => user.country === value)
    });
  }

  initializeDeploymentForm = (): void => {
    this.deploymentForm = this._formBuilder.group({
      name: ["", Validators.required],
      deploymentDate: ["", Validators.required],
      isEfimieral: [""],
      destructionDate: [""],
      costCenter: ["", Validators.compose([Validators.required]), [checkInvalidFormatField(this, 'costCenter')]],
      approver: ["", Validators.required],
      country: ["", Validators.required],
      githubUser: [""],
      description: ["", Validators.required],
    })
  }

  initializeParametersForm = (): void => {
    this.parametersForm = this._formBuilder.group({
      parameters: this._formBuilder.array([]),
    })
  }

  get parameters() {
    return this.parametersForm.get("parameters") as FormArray;
  }

  chargeData(): void {
    if (this.resource?.specifications?.length > 0) {
      this.resource.specifications[0]?.inputs.forEach((param) => {
        this.parameters.push(
          this._formBuilder.group({
            key: { value: param.key, disabled: false },
            type: { value: param.type, disabled: false },
            value: { value: param.defaultValue, disabled: false },
            required: { value: param.required, disabled: false },
          })
        )
      })
    } else {
      console.error("Resource or specifications are not defined.");
    }
  }

  assignDestructionDateValue = (date: string) => {
    const newDate = new Date(date)
    newDate.setHours(newDate.getHours() + 5)
    // fechaOriginal.setMinutes(fechaOriginal.getMinutes() + 5);
    this.deploymentForm.get('destructionDate').setValue(this.changeDateFormat(newDate))
  }

  appendTimeZoneOffset(dateTime: string): string {
    const date = new Date(dateTime);
    const offset = -date.getTimezoneOffset();
    const offsetMinutes = Math.abs(offset % 60).toString().padStart(2, '0');
    const offsetHours = Math.abs(Math.floor(offset / 60)).toString().padStart(2, '0');
    const sign = offset >= 0 ? '+' : '-';
    const timezoneOffset = `${sign}${offsetHours}:${offsetMinutes}`;

    // const year = date.getFullYear();
    // const month = (date.getMonth() + 1).toString().padStart(2, '0');
    // const day = date.getDate().toString().padStart(2, '0');
    // const hours = date.getHours().toString().padStart(2, '0');
    // const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${this.changeDateFormat(dateTime)}:${seconds}${timezoneOffset}`;
    // return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${timezoneOffset}`;
  }

  changeDateFormat = (dateTime): string => {
    const date = new Date(dateTime);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    // Formato: "YYYY-MM-DDTHH:MM"
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  

  getCheckValue(): void {
    if (this.isEfimieral) {
      this.deploymentForm.get('isEfimieral').setValue(false);
    }
    this.isEfimieral = !this.isEfimieral;

    if (this.isEfimieral && this.deploymentForm.get('deploymentDate').value) {
      this.assignDestructionDateValue(this.deploymentForm.get('deploymentDate').value)
    }

    if (this.deploymentDateSubscription) {
      this.deploymentDateSubscription.unsubscribe()
    }
    this.deploymentDateSubscription = this.deploymentForm.get('deploymentDate')?.valueChanges.subscribe(value => {
      this.assignDestructionDateValue(value)
    })
  }

  sendRequest(): void {
    const requestObj = this.assignDateDeploy()
    this.resourceService
      .postRequestDeploy(requestObj)
      .pipe(
        tap(() => {
          this.successAlert()
        }),
        catchError((error) => {
          this.errorAlert(error)
          throw error; // Rethrow el error para que lo maneje otro suscriptor si es necesario
        })
      )
      .subscribe();
  }

  assignDateDeploy = (): {} => {
    const { country, ...userData } = this.returnSelectedUserData(this.deploymentForm.value.approver)
    const requestObj: any = {
      name: this.deploymentForm.value.name,
      description: this.deploymentForm.value.description,
      country: this.deploymentForm.value.country,
      scheduling: {
        type: this.isEfimieral ? "EPHEMERAL" : "STATIC",
        actions: this.assignActions(),
      },
      costCenter: this.deploymentForm.value.costCenter,
      relatedParty: [
        {
          name: this.infoAccount?.name,
          email: this.infoAccount?.username,
          username: this.infoAccount?.username,
          id: this.infoAccount?.localAccountId,
          role: "REQUESTER",
        },
        {
          ...userData,
          role: "APPROVER",
        },
      ],
      configuration: {
        linkedRequestedResourceID: this.resource?.commonVersionId,
        linkedRequestedResourceName: this.resource?.name,
        inputs: this.assignParams(),
      },
    };

    if (this.deploymentForm.value.githubUser != "") {
      requestObj.configuration.gitHubUser =
        this.deploymentForm.value.githubUser;
    }
    return requestObj
  }

  returnSelectedUserData(name: string) {
    return this.approvalUsers?.find((record) => record?.name === name);
  }

  assignParams = (): [] => {
    let updatedInputs = this.resource?.specifications[0].inputs.map((input) => {
      const replacement = this.parametersForm
        .getRawValue().parameters.find((obj) => obj.key === input.key);

      return replacement?.value
        ? { ...input, defaultValue: replacement.value.toString() }
        : input;
    })

    updatedInputs = updatedInputs?.map((item) => ({
      key: item.key,
      value: item.defaultValue,
    }))

    return updatedInputs
  }

  assignActions = (): {} => {
    const actions = [
      { date: this.appendTimeZoneOffset(this.deploymentForm.value.deploymentDate), action: "DEPLOY" },
    ]

    this.isEfimieral &&
      actions.push({
        date: this.appendTimeZoneOffset(this.deploymentForm.value.destructionDate),
        action: "DESTROY",
      })

    return actions
  }

  successAlert = (): void => {
    // this.deploymentForm.reset()
    Swal.fire({
      title: "successful",
      text: "Request has been created successfully",
      icon: "success",
      showCancelButton: false,
      confirmButtonText: "close",
    }).then((result) => {
      // console.log(result);
    })
  }

  errorAlert = (error): void => {
    let htmlList: string
    if (error?.error?.details) {
      htmlList = error.error.details
        .map((error) => `<li>${error.message}</li>`)
        .join("");
    } else {
      htmlList = error?.error.message
    }
    const htmlContent = `
              <div>
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
