import { Component, OnInit, ViewChild } from "@angular/core";
import { ResourcesService } from "../../../../services/resources.service";
import { catchError, delay, map } from "rxjs";
import { MsalService } from "@azure/msal-angular";
import { Router, ActivatedRoute } from "@angular/router";
import Swal from "sweetalert2";
import { COLUMNS_TABLE, FILTERING_OPTIONS } from "./inbox-management.constants";
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: "app-inbox-management",
  templateUrl: "./inbox-management.component.html",
  styleUrls: ["./inbox-management.component.scss"],
})
export class InboxManagementComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  filteringOptions = FILTERING_OPTIONS
  columnsTable = COLUMNS_TABLE

  inboxList = [];
  infoAccount: any;
  requestObject: any;
  showDetail = false;
  idDeployment: string;
  loading = true
  loadingDetail = true
  selectedStatus = "ALL";
  pageIndex = 0;
  total: number;
  routerNavigate = '/inbox-management/'

  constructor(
    private resourceService: ResourcesService,
    private msalService: MsalService,
    private router: Router,
    private routActive: ActivatedRoute
  ) {
    this.infoAccount =
      localStorage.getItem("localUser") == undefined
        ? this.msalService.instance.getActiveAccount()
        : JSON.parse(localStorage.getItem("localUser"));
  }

  ngOnInit(): void {
    this.showDetail = false
    this.routActive.params.subscribe((params) => {
      if (params["id"]) {
        this.idDeployment = params["id"];
        this.getDeployId(this.idDeployment);
        this.showDetail = true;
      } else {
        this.getInbox(0);
      }
    })
  }

  getInbox(pageIndex: number): void {
    let filter = `relatedPartyId=${this.infoAccount.localAccountId}&relatedPartyRole=APPROVER&page=${pageIndex}`;

    if (this.selectedStatus !== 'ALL') {
      filter += `&status=${this.selectedStatus}`;
    }

    this.resourceService
      .getRequestDeploy(filter)
      .pipe(
        delay(300),
        map((response) => {
          this.inboxList = response.payload;
          this.loading = false
        }),
        catchError((error) => {
          this.loading = false
          console.error(error);
          return [];
        })
      )
      .subscribe();
  }

  getDeployId(id: string): void {
    this.resourceService
      .getRequestDeployId(id)
      .pipe(
        // delay(300),
        map((response) => {
          this.requestObject = response.payload[0]
          this.total = response?.total
          this.loadingDetail = false
        }),
        catchError((error) => {
          this.loadingDetail = false
          console.error(error);
          return [];
        })
      )
      .subscribe();
  }

  selectStatus(event: any): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedStatus = selectElement.value;
    this.getInbox(0);
    !this.pageIndex || this.paginator?.firstPage();
  }

  back(): void {
    this.showDetail = false;
    this.router.navigate([this.routerNavigate]);
  }

  deny(id: string): void {
    const relatedParty = [
      {
        name: this.infoAccount.name,
        email: this.infoAccount.username,
        username: this.infoAccount.username,
        id: this.infoAccount.localAccountId,
        role: "APPROVER",
      },
    ]

    this.resourceService
      .putRejectResource(id, relatedParty)
      .pipe(
        map(() => {
          this.successAlert()
        }),
        catchError((error) => {
          this.errorAlert()
          console.error(error);
          return []
        })
      )
      .subscribe()
  }

  approve(id: string): void {
    const relatedParty = [
      {
        name: this.infoAccount.name,
        email: this.infoAccount.username,
        username: this.infoAccount.username,
        id: this.infoAccount.localAccountId,
        role: "APPROVER",
      },
    ]

    this.resourceService
      .putApprovalResource(id, relatedParty)
      .pipe(
        map(() => {
          this.successAlert()
        }),
        catchError((error) => {
          this.errorAlert()
          console.error(error)
          return []
        })
      )
      .subscribe();
  }

  onPageChange(event): void {
    this.pageIndex = event.pageIndex
    this.getInbox(event.pageIndex)
  }

  successAlert(): void {
    Swal.fire({
      title: "Success!",
      text: "Your action was successful",
      icon: "success",
      confirmButtonText: "Ok",
    }).then((result) => {
      if (result.isConfirmed) {
        this.showDetail = false
        this.loading = true
        this.getInbox(0)
      }
    })
  }

  errorAlert(): void {
    Swal.fire({
      position: "top-end",
      icon: "error",
      title: `Your action was not successful`,
      showConfirmButton: false,
      timer: 1300,
      // timerProgressBar: true
    })
  }

  // viewInfo(request): void {
  //   this.showDetail = true
  //   this.router.navigate(["/inbox-management/" + request.id]);
  // }

  // filterChange() {
  //   this.showDetail = false;
  //   console.log(this.paginator)

  //   if (this.paginator) {
  //     this.paginator.pageIndex = this.pageIndex;
  //   }
  // }
}
