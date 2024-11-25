import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-list-deployments',
  templateUrl: './view-list-deployments.component.html',
  styleUrls: ['./view-list-deployments.component.scss']
})
export class ViewListDeploymentsComponent implements OnInit {

  @Input() tipyPage: string
  @Input() routerNavigate: string
  @Input() columnsTable: any
  @Input() deploymentList: any

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
    // console.log(this.deploymentList)
  }

  assignClass = (status: string) => {
    if (status === 'PENDING') {
      return 'warning'
    }

    if (status === 'DEPLOYING' ||
      status === 'RUNNING' ||
      status === 'DESTROYING') {
      return 'info'
    }

    if (status === 'FAILED') {
      return 'error'
    }

    if (status === 'TERMINATED' ||
      status === 'APPROVED' ||
      status === 'REJECTED') {
      return 'success'
    }
    return ''
  }

  viewDeploy(id: string): void {
    this.router.navigate([this.routerNavigate + id]);
  }

}
