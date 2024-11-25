import { Component, ElementRef, OnDestroy, HostListener } from "@angular/core";
import { MediaMatcher } from "@angular/cdk/layout";
import { MsalService } from "@azure/msal-angular";
import { DataService } from "../../../shared/data.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnDestroy {
  theme: any;
  isResponsive = false;
  responsiveQuery: MediaQueryList;
  infoAccount: any = {};
  showUserOpt = false;
  showMenu = false;

  constructor(
    media: MediaMatcher,
    public msalService: MsalService,
    private dataService: DataService,
    private elementRef: ElementRef
  ) {
    this.theme = JSON.parse(localStorage.getItem("theme"));
    const isLocalLogin = this.theme.properties.localLogin;
    this.infoAccount = isLocalLogin
      ? JSON.parse(localStorage.getItem("localUser"))
      : this.msalService.instance.getActiveAccount();
    this.responsiveQuery = media.matchMedia("(max-width: 767px)");
    this.responsiveQuery.addEventListener(
      "change",
      this.handleMediaQueryChange
    );
    this.handleMediaQueryChange();
    this.expandMenu();
  }

  handleMediaQueryChange = () => {
    this.isResponsive = this.responsiveQuery.matches;
  };

  showUserOptions(): void {
    this.showUserOpt = !this.showUserOpt;
  }

  expandMenu() {
    this.showMenu = !this.showMenu;
    const dataToSend = this.showMenu;
    this.dataService.sendDataSideBar(dataToSend);
  }

  logout() {
    if (this.theme.properties.localLogin) {
      localStorage.removeItem("localUser");
      window.location.href = "/";
    } else {
      this.msalService.instance.logoutRedirect({
        postLogoutRedirectUri: this.theme.properties.auth.postLogoutRedirectUri,
      });
    }
  }

  @HostListener("document:click", ["$event"])
  onClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showUserOpt = false;
    }
  }

  ngOnDestroy(): void {
    this.responsiveQuery.removeEventListener(
      "change",
      this.handleMediaQueryChange
    );
  }
}
