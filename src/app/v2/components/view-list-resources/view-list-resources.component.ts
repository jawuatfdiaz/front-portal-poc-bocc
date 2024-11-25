import { Component, Input, Output, EventEmitter, SimpleChanges, ViewChild } from '@angular/core';
import { Resource } from 'src/app/v2/models/resource.interface';
import { COLUMNS_TABLE } from './view-list-resources.contants';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-list-resources',
  templateUrl: './view-list-resources.component.html',
  styleUrls: ['./view-list-resources.component.scss']
})
export class ViewListResourcesComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @Output() pageIndexEvent = new EventEmitter<number>();
  // @Input() typePage: string
  @Input() routerNavigate: string
  @Input() isClickFilterBtn: boolean
  @Input() set setCatalogueResource(catalogueResources) {
    const { resources, total } = catalogueResources;
    
    this.catalogueResource = resources
    this.total = total
  }

  columns_table = COLUMNS_TABLE

  catalogueResource: Resource[] = []
  loading = true
  grid = 'grid'
  list = 'list'
  activeView = this.list
  pageIndex = 0
  total: number;

  pageEvent: PageEvent;
  length: number;


  constructor(
    private router: Router,
    // private _activatedRoute: ActivatedRoute,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isClickFilterBtn']) {
      // const currentValue = changes['isClickFilterBtn'].currentValue;
      !this.pageIndex || this.paginator?.firstPage();
    }
  }

  setActiveView(view: string): void {
    this.activeView = view;
  }

  viewResource(idResource: string): void {
      this.router.navigate([this.routerNavigate + idResource]);
  }

  onPageChange(event): void {
    this.pageEvent = event;
    this.length = event.length;
    this.pageIndex = event.pageIndex
    this.pageIndexEvent.emit(event.pageIndex);
  }
}
