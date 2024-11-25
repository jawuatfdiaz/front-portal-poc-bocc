import { Component } from "@angular/core";

import { Router } from "@angular/router";
import { ResourcesService } from "../../../../services/resources.service";
import { MsalService } from "@azure/msal-angular";
import { catchError, delay, map } from "rxjs";
import { Resource } from "src/app/v2/models/resource.interface";

@Component({
  selector: "app-resource-management-catalogue",
  templateUrl: "./resource-management-catalogue.component.html",
  styleUrls: ["./resource-management-catalogue.component.scss"],
})
export class ResourceManagementCatalogueComponent {

  activeView = "grid";
  infoAccount: any;
  resourcesList: any = [];
  payload: any
  loading = true

  constructor(
    private router: Router,
    private resourceService: ResourcesService,
    private msalService: MsalService
  ) {
    this.infoAccount =
      localStorage.getItem("localUser") == undefined
        ? this.msalService.instance.getActiveAccount()
        : JSON.parse(localStorage.getItem("localUser"));

    this.payload = {
      relatedPartyId: this.infoAccount.localAccountId,
      relatedPartyRole: "OWNER",
    };

    this.getResources(0, this.payload)
  }

  getResources(pageIndex: number, payload?: any): void {
    this.resourceService
      .getResources(payload, pageIndex)
      .pipe(delay(300),
        map((response) => {
          this.resourcesList = {
            resources: response.payload,
            total: response?.total,
          };
          this.loading = false
        }),
        catchError((error) => {
          console.error(error);
          throw error;
        })
      )
      .subscribe();
  }

  setActiveView(view: string): void {
    this.activeView = view;
  }

  goToCreateResource(): void {
    this.router.navigate(["/resource-management/create-resource"]);
  }

  seeResourceDetail(id: string): void {
    this.router.navigate(["/resource-management/view-resource/" + id]);
  }

  // onPageChange(event): void {
  //   this.getResources(event.pageIndex)
  // }

  onPageChange(pageIndex: number): void {
    this.getResources(pageIndex, this.payload)
  }
}
