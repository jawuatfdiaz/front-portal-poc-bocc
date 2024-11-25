import { Component, OnInit, ViewChild } from "@angular/core";
import { ResourcesService } from "../../../../services/resources.service";
import { catchError, delay, map, of } from "rxjs";
import { MsalService } from "@azure/msal-angular";
import { ActivatedRoute, Router } from "@angular/router";
import { COLUMNS_TABLE, FILTERING_OPTIONS } from "./request-management.constants";
import { MatPaginator } from "@angular/material/paginator";

@Component({
  selector: "app-request-management",
  templateUrl: "./request-management.component.html",
  styleUrls: ["./request-management.component.scss"],
})
export class RequestManagementComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  filteringOptions = FILTERING_OPTIONS
  columnsTable = COLUMNS_TABLE

  infoAccount: any;
  requestList = [];
  selectedStatus = "ALL";
  showDetail = false;
  idDeploy: string;
  loading = true
  loadingDetail = true
  requestObject: any;
  routerNavigate = '/request-management/'
  total: number;

  pageIndex: number = 0

  constructor(
    private resourceService: ResourcesService,
    private router: Router,
    private routActive: ActivatedRoute,
    private msalService: MsalService
  ) {
    this.infoAccount =
      localStorage.getItem("localUser") == undefined
        ? this.msalService.instance.getActiveAccount()
        : JSON.parse(localStorage.getItem("localUser"));
  }

  ngOnInit(): void {
    this.routActive.params.subscribe((params) => {
      if (params["id"]) {
        this.idDeploy = params["id"];
        this.getDeployId(this.idDeploy);
        this.showDetail = true;
      } else {
        this.getRequest(0);
      }
    })
  }

  getRequest(pageIndex: number): void {
    let filter = `relatedPartyId=${this.infoAccount.localAccountId}&relatedPartyRole=REQUESTER&page=${pageIndex}`;

    if (this.selectedStatus !== 'ALL') {
      filter += `&status=${this.selectedStatus}`;
    }

    this.resourceService
      .getRequestDeploy(filter)
      .pipe(
        delay(300),
        map((response) => {
          this.requestList = response.payload
          this.total = response?.total
          this.loading = false
        }),
        catchError((error) => {
          console.error("Error en la solicitud POST:", error);
          // this.requestList = []; // Aseguramos que requestList esté vacío si hay un error
          this.loading = false
          return of([]); // Devuelve un observable vacío para que el flujo continúe
        })
      )
      .subscribe();
  }

  getDeployId(id: string): void {
    this.resourceService
      .getRequestDeployId(id)
      .pipe(
        map((response) => {
          this.loadingDetail = false
          this.requestObject = response.payload[0]
        }),
        catchError((error) => {
          this.loadingDetail = false
          throw error;
        })
      )
      .subscribe();
  }

  selectStatus(event: any): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedStatus = selectElement.value;
    this.getRequest(0);
    !this.pageIndex || this.paginator?.firstPage();
  }

  back(): void {
    this.showDetail = false;
    this.router.navigate([this.routerNavigate]);
  }

  // formatDateTime(dateTimeString: string) {
  //   return this.resourceService.formatDate(dateTimeString);
  // }

  onPageChange(event): void {
    this.pageIndex = event.pageIndex
    this.getRequest(event.pageIndex);
  }
}
