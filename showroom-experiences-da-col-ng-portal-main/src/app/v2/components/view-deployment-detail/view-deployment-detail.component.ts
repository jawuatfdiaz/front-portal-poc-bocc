import { Component, Input } from "@angular/core";
import { ResourcesService } from "src/services/resources.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-view-deployment-detail',
  templateUrl: './view-deployment-detail.component.html',
  styleUrls: ['./view-deployment-detail.component.scss']
})
export class ViewDeploymentDetailComponent {
  @Input() deploymentDetail: any

  constructor(
    private resourceService: ResourcesService,
  ) { }

  formatDateTime(dateTimeString: string): string {
    return this.resourceService.formatDate(dateTimeString)
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
}
