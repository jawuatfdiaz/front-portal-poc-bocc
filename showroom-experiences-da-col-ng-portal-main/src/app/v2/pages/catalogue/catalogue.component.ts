import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, delay, map } from "rxjs/operators";

import { ResourcesService } from "../../../../services/resources.service";
import { DataService } from "../../../shared/data.service";
import { Subscription } from "rxjs";
import { Resource } from "src/app/v2/models/resource.interface";
import { COLUMNS_TABLE } from "./catalogue.contants";

@Component({
  selector: "app-catalogue",
  templateUrl: "./catalogue.component.html",
  styleUrls: ["./catalogue.component.scss"],
})
export class CatalogueComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  columns_table = COLUMNS_TABLE;

  grid = "grid";
  list = "list";
  activeView = this.grid;
  loading = true;

  catalogueResource: {resources: Resource[], total: number };
  dataFilter: any;
  isClickFilterBtn: boolean;

  constructor(
    private resourceService: ResourcesService,
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscription = this.dataService.dataFromFilter$.subscribe((data) => {      
      this.dataFilter = data;
      this.getResources(0, this.dataFilter);
    });
  }

  setActiveView(view: string): void {
    this.activeView = view;
  }

  getResources(pageIndex: number, payload?: any): void {
    this.resourceService
      .getResources(payload, pageIndex, true)
      .pipe(
        delay(300),
        map((response) => {
          this.catalogueResource = {
            resources: response?.payload,
            total: response?.total,
          };
          this.loading = false;
        }),
        catchError((error) => {
          this.loading = false;
          throw error;
        })
      )
      .subscribe();
  }

  viewResource(idResource?: any): void {
    this.router.navigate(["/catalogue/view-resource/" + idResource]);
  }

  // onPageChange(event): void {
  //   this.getResources(event.pageIndex, this.dataFilter)
  // }

  onPageChange(pageIndex: number): void {        
    this.getResources(pageIndex, this.dataFilter);
  }

  filterChange(isClickFilterBtn: boolean): void {
    this.isClickFilterBtn = isClickFilterBtn;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
