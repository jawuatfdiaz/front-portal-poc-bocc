import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MsalService } from "@azure/msal-angular";
import { FormBuilder, FormGroup } from "@angular/forms";
import Swal from "sweetalert2";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-inicio",
  templateUrl: "./inicio.component.html",
  styleUrls: ["./inicio.component.scss"],
})
export class InicioComponent implements OnInit {
  numberStepper = 0;
  theme: any;
  localLogin: false;
  loginForm: FormGroup;
  infoAccount: any;

  constructor(
    private router: Router,
    private msalService: MsalService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.theme = JSON.parse(localStorage.getItem("theme") || "null");
    const isLocalLogin = this.theme.properties.localLogin;
    this.infoAccount = isLocalLogin
      ? JSON.parse(localStorage.getItem("localUser"))
      : this.msalService.instance.getActiveAccount();

    this.msalService.instance.handleRedirectPromise().then(async (res) => {
      if (res?.account) {
        this.msalService.instance.setActiveAccount(res.account);
      }
      this.isLoggedIn();
    });

    this.loginForm = this.fb.group({
      email: [""],
      password: [""],
    });
  }

  iniciarSesion() {
    this.localLogin = this.theme.properties.localLogin;
    if (!this.infoAccount && !this.localLogin) {
      localStorage.removeItem("localUser");
      this.msalService.instance.loginRedirect();
    }
  }

  closeForm() {
    this.localLogin = false;
  }

  isLoggedIn() {
    if (this.msalService.instance.getActiveAccount()) {
      this.router.navigate(["/catalogue"]);
    }
  }

  changeStepper(stepper: number) {
    this.numberStepper = stepper;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const formValues = this.loginForm.value;
      const login = environment.adminCredentials;
      const areEqual = JSON.stringify(formValues) === JSON.stringify(login);
      if (areEqual) {
        localStorage.setItem(
          "localUser",
          JSON.stringify({
            username: "adminPortal@adminportal.com",
            localAccountId: "a12e1b54-4b7d-4d92-9b22-68ef330ad5a4",
            name: "Admin Portal",
          })
        );
        this.router.navigate(["/catalogue"]);
      } else {
        Swal.fire({
          title: "error",
          text: "User or password is invalid",
          icon: "error",
          showCancelButton: false,
          confirmButtonText: "close",
        });
      }
    }
  }
}
