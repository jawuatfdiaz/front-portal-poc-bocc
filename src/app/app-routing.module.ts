import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { InicioComponent } from "./pages/inicio/inicio.component";

import { MainLayoutComponent } from "./v2/pages/main-layout/main-layout.component";
import { CatalogueComponent } from "./v2/pages/catalogue/catalogue.component";
import { InboxManagementComponent } from "./v2/pages/inbox-management/inbox-management.component";
import { RequestManagementComponent } from "./v2/pages/request-management/request-management.component";
import { ResourceManagementCatalogueComponent } from "./v2/pages/resource-management-catalogue/resource-management-catalogue.component";
import { ViewResourceDetailComponent } from "./v2/pages/view-resource-detail/view-resource-detail.component";
import { CreateResourceFormComponent } from "./v2/pages/create-resource-form/create-resource-form.component";

const routes: Routes = [
  {
    path: "",
    component: InicioComponent
  },
  {
    path: "",
    component: MainLayoutComponent,
    children: [
      { path: 'catalogue', component: CatalogueComponent },
      { path: 'catalogue/view-resource/:id', component: ViewResourceDetailComponent },
      { path: 'resource-management', component: ResourceManagementCatalogueComponent },
      { path: 'resource-management/create-resource', component: CreateResourceFormComponent },
      { path: 'resource-management/view-resource/:id', component: ViewResourceDetailComponent },
      { path: 'request-management', component: RequestManagementComponent },
      { path: 'request-management/:id', component: RequestManagementComponent },
      { path: 'inbox-management', component: InboxManagementComponent },
      { path: 'inbox-management/:id', component: InboxManagementComponent },
    ],
  },
  // { 
  //   path: "catalogue", 
  //   component: DashboardV2Component 
  // },
  // {
  //   path: "catalogue/view-resource/:id",
  //   component: ViewResourceComponent,
  // },
  // { 
  //   path: "resource-management", 
  //   component: PocManagementComponent 
  // },
  // {
  //   path: "resource-management/create-resource",
  //   component: CreateResourceComponent,
  // },
  // {
  //   path: "resource-management/view-resource/:id",
  //   component: ViewResourceComponent,
  // },
  // { path: "request-management", component: RequestManagementViewComponent },
  // { path: "request-management/:id", component: RequestManagementViewComponent },
  // { path: "inbox-management", component: InboxRequestViewComponent },
  // { path: "inbox-management/:id", component: InboxRequestViewComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
})
export class AppRoutingModule { }