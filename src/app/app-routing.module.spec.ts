import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { InicioComponent } from './pages/inicio/inicio.component';
import { DashboardV2Component } from './v2/pages/dashboard/dashboard.component';
import { PocManagementComponent } from './v2/pages/poc-management/poc-management.component';
import { CreateResourceComponent } from './v2/pages/create-resource/create-resource.component';
import { ViewResourceComponent } from './v2/pages/view-resource/view-resource.component';
import { RequestManagementViewComponent } from './v2/pages/request-management-view/request-management-view.component';
import { InboxRequestViewComponent } from './v2/pages/inbox-request-view/inbox-request-view.component';
import { Component } from '@angular/core';

// Dummy components for testing routes
@Component({ template: '' })
class DummyComponent {}

describe('AppRoutingModule', () => {
  let router: Router;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: '', component: InicioComponent },
          { path: 'catalogue', component: DashboardV2Component },
          { path: 'resource-management', component: PocManagementComponent },
          { path: 'resource-management/create-resource', component: CreateResourceComponent },
          { path: 'resource-management/view-resource/:id', component: ViewResourceComponent },
          { path: 'request-management', component: RequestManagementViewComponent },
          { path: 'inbox-management', component: InboxRequestViewComponent },
          { path: 'inbox-management/:id', component: InboxRequestViewComponent },
        ]),
        AppRoutingModule
      ],
      declarations: [
        InicioComponent,
        DashboardV2Component,
        PocManagementComponent,
        CreateResourceComponent,
        ViewResourceComponent,
        RequestManagementViewComponent,
        InboxRequestViewComponent,
        DummyComponent
      ]
    });

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  it('should navigate to "" and render InicioComponent', async () => {
    router.navigate(['']).then(() => {
      expect(location.path()).toBe('');
    });
  });

  it('should navigate to "catalogue" and render DashboardV2Component', async () => {
    router.navigate(['catalogue']).then(() => {
      expect(location.path()).toBe('/catalogue');
    });
  });

  it('should navigate to "resource-management" and render PocManagementComponent', async () => {
    router.navigate(['resource-management']).then(() => {
      expect(location.path()).toBe('/resource-management');
    });
  });

  it('should navigate to "resource-management/create-resource" and render CreateResourceComponent', async () => {
    router.navigate(['resource-management/create-resource']).then(() => {
      expect(location.path()).toBe('/resource-management/create-resource');
    });
  });

  it('should navigate to "resource-management/view-resource/1" and render ViewResourceComponent', async () => {
    router.navigate(['resource-management/view-resource/1']).then(() => {
      expect(location.path()).toBe('/resource-management/view-resource/1');
    });
  });

  it('should navigate to "request-management" and render RequestManagementViewComponent', async () => {
    router.navigate(['request-management']).then(() => {
      expect(location.path()).toBe('/request-management');
    });
  });

  it('should navigate to "inbox-management" and render InboxRequestViewComponent', async () => {
    router.navigate(['inbox-management']).then(() => {
      expect(location.path()).toBe('/inbox-management');
    });
  });

  it('should navigate to "inbox-management/1" and render InboxRequestViewComponent', async () => {
    router.navigate(['inbox-management/1']).then(() => {
      expect(location.path()).toBe('/inbox-management/1');
    });
  });
});