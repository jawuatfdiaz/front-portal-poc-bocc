import { ComponentFixture, TestBed } from "@angular/core/testing";
import { InicioComponent } from "./inicio.component";
import { RouterTestingModule } from "@angular/router/testing";
import { Router } from "@angular/router";
import { MsalService } from "@azure/msal-angular";
import { AuthenticationResult } from "@azure/msal-browser";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import Swal from "sweetalert2";

import { themeMock } from "../../mocks/theme.mock";

jest.mock("src/environments/environment", () => ({
  environment: {
    API_URL: "http://mock-api-url",
    adminCredentials: {
      email: "adminportal",
      password: "G3nE!7uZ^QpW8lR",
    },
  },
}));
describe("InicioComponent", () => {
  let component: InicioComponent;
  let fixture: ComponentFixture<InicioComponent>;
  let msalServiceMock: any;
  let router: Router;

  beforeEach(async () => {
    msalServiceMock = {
      instance: {
        getActiveAccount: jest.fn(),
        handleRedirectPromise: jest.fn().mockResolvedValue(null),
        setActiveAccount: jest.fn(),
        loginRedirect: jest.fn(),
      },
    };

    // Asegúrate de que el tema tiene `localLogin` establecido en `false`
    const modifiedThemeMock = JSON.stringify({
      ...JSON.parse(themeMock),
      properties: {
        ...JSON.parse(themeMock).properties,
        localLogin: false,
      },
    });

    localStorage.setItem("theme", modifiedThemeMock);

    await TestBed.configureTestingModule({
      declarations: [InicioComponent],
      imports: [RouterTestingModule, ReactiveFormsModule],
      providers: [
        { provide: MsalService, useValue: msalServiceMock },
        FormBuilder,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(InicioComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    jest.spyOn(router, "navigate");
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should set active account if redirect result has an account", async () => {
    const mockAccount = { username: "test@example.com", idToken: "token" };
    msalServiceMock.instance.handleRedirectPromise.mockResolvedValue({
      account: mockAccount,
    } as AuthenticationResult);

    await component.ngOnInit();
    expect(msalServiceMock.instance.setActiveAccount).toHaveBeenCalledWith(
      mockAccount
    );
  });

  it("should not set active account if redirect result is null", async () => {
    msalServiceMock.instance.handleRedirectPromise.mockResolvedValue(null);
    await component.ngOnInit();
    expect(msalServiceMock.instance.setActiveAccount).not.toHaveBeenCalled();
  });

  it('should navigate to "/catalogue" if there is an active account', () => {
    msalServiceMock.instance.getActiveAccount.mockReturnValue({
      username: "test@example.com",
    });
    component.isLoggedIn();
    expect(router.navigate).toHaveBeenCalledWith(["/catalogue"]);
  });

  it("should not navigate if there is no active account", () => {
    msalServiceMock.instance.getActiveAccount.mockReturnValue(null);
    component.isLoggedIn();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it("should call loginRedirect if no active account is present on iniciarSesion", () => {
    msalServiceMock.instance.getActiveAccount.mockReturnValue(null);
    component.iniciarSesion();
    expect(msalServiceMock.instance.loginRedirect).toHaveBeenCalled();
  });

  it("should change stepper number correctly", () => {
    expect(component.numberStepper).toBe(0); // initial state
    component.changeStepper(1);
    expect(component.numberStepper).toBe(1);
  });

  it("should set localLogin to false when closeForm is called", () => {
    component.closeForm();
    expect(component.localLogin).toBe(false);
  });

  it("should initialize loginForm correctly", () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.controls["email"]).toBeDefined();
    expect(component.loginForm.controls["password"]).toBeDefined();
  });

  it("should handle form submission with valid credentials", () => {
    component.loginForm.setValue({
      email: "adminportal",
      password: "G3nE!7uZ^QpW8lR",
    });
    component.onSubmit();
    expect(localStorage.getItem("localUser")).toBeTruthy();
    expect(router.navigate).toHaveBeenCalledWith(["/catalogue"]);
  });

  it("should handle form submission with invalid credentials", () => {
    jest.spyOn(Swal, "fire");
    component.loginForm.setValue({
      email: "invaliduser",
      password: "invalidpassword",
    });
    component.onSubmit();
    expect(localStorage.getItem("localUser")).toBeNull();
    expect(router.navigate).not.toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalledWith({
      title: "error",
      text: "User or password is invalid",
      icon: "error",
      showCancelButton: false,
      confirmButtonText: "close",
    });
  });
});
