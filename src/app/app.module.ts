import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { InicioComponent } from "./pages/inicio/inicio.component";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MSAL_INSTANCE, MsalModule, MsalService } from "@azure/msal-angular";
import { IPublicClientApplication, PublicClientApplication } from "@azure/msal-browser";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgxDropzoneModule } from "ngx-dropzone";
import { CalendarModule, DateAdapter } from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";

import { DatePipe } from "@angular/common";
import { TagInputModule } from "ngx-chips";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatStepperModule } from "@angular/material/stepper";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';


import { DropzoneComponent } from "./components/dropzone/dropzone.component";
import { CarrouselComponent } from "./components/carrousel/carrousel/carrousel.component";
import { HeaderComponent } from "./v2/components/header/header.component";
import { SideBarComponent } from "./v2/components/side-bar/side-bar.component";
import { CatalogueComponent } from "./v2/pages/catalogue/catalogue.component";
import { FilterComponent } from "./v2/components/filter/filter.component";
import { ResourceManagementCatalogueComponent } from "./v2/pages/resource-management-catalogue/resource-management-catalogue.component";
import { ViewResourceDetailComponent } from "./v2/pages/view-resource-detail/view-resource-detail.component";
import { DeployRequestFormComponent } from "./v2/components/deploy-request-form/deploy-request-form.component";
import { RequestManagementComponent } from "./v2/pages/request-management/request-management.component";
import { InboxManagementComponent } from "./v2/pages/inbox-management/inbox-management.component";
import { MainLayoutComponent } from './v2/pages/main-layout/main-layout.component';
import { ViewListResourcesComponent } from "./v2/components/view-list-resources/view-list-resources.component";
import { ViewDeploymentDetailComponent } from './v2/components/view-deployment-detail/view-deployment-detail.component';
import { EvrFormComponent } from "./v2/components/form/evr-form/evr-form.component";
import { FormAlertComponent } from "./v2/components/form/form-alert/form-alert.component";
import { ViewListDeploymentsComponent } from './v2/components/view-list-deployments/view-list-deployments.component';
import { CreateResourceFormComponent } from "./v2/pages/create-resource-form/create-resource-form.component";

export function MSALInstanceFactory(): IPublicClientApplication {
  const auth = JSON.parse(localStorage.getItem("theme")).properties.auth;
  return new PublicClientApplication({
    auth: auth,
  });
}

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    DropzoneComponent,
    CarrouselComponent,
    HeaderComponent,
    SideBarComponent,
    CatalogueComponent,
    FilterComponent,
    ResourceManagementCatalogueComponent,
    CreateResourceFormComponent,
    ViewResourceDetailComponent,
    DeployRequestFormComponent,
    RequestManagementComponent,
    InboxManagementComponent,
    MainLayoutComponent,
    ViewListResourcesComponent,
    ViewDeploymentDetailComponent,
    EvrFormComponent,
    FormAlertComponent,
    ViewListDeploymentsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MsalModule,
    NgMultiSelectDropDownModule.forRoot(),
    HttpClientModule,
    FormsModule,
    NgxDropzoneModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    TagInputModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatStepperModule,
    MatCheckboxModule,
    MatTooltipModule,
    SweetAlert2Module.forRoot(),
    MatSlideToggleModule,
    MatSelectModule,
  ],
  providers: [
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
    },
    DatePipe,
    MsalService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }