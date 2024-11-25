import { Component, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { DataService } from "../../../shared/data.service";
import { MediaMatcher } from "@angular/cdk/layout";
import { MENU_OPTIONS } from "./side-bar.constants";
import { MenuOption } from "src/app/v2/models/menu.interface";


@Component({
  selector: "app-side-bar",
  templateUrl: "./side-bar.component.html",
  styleUrls: ["./side-bar.component.scss"],
})
export class SideBarComponent implements OnDestroy {
  private subscription: Subscription;

  menuOptions: MenuOption[] = MENU_OPTIONS;
  expandMenu = false;
  activeIndex = -1;
  isResponsive = false;
  responsiveQuery: MediaQueryList;

  constructor(
    media: MediaMatcher,
    private router: Router,
    private dataService: DataService
  ) {
    this.subscription = this.dataService.dataFromHeader$.subscribe((data) => {
      this.expandMenu = data;
    });

    this.responsiveQuery = media.matchMedia("(max-width: 767px)");
    this.responsiveQuery.addEventListener(
      "change",
      this.handleMediaQueryChange
    );
    this.handleMediaQueryChange();
    this.markActiveMenuOption(this.router.url);
  }

  handleMediaQueryChange = () => {
    if (this.responsiveQuery.matches) {
      this.isResponsive = true;
    } else {
      this.isResponsive = false;
    }
  };

  handleMenuClick(index: number, currentUrl: string): void {
    this.activeIndex = index;
    this.router.navigate([currentUrl]);
    this.markActiveMenuOption(currentUrl)
  }

  markActiveMenuOption(currentUrl: string): void {
    // const currentUrl = this.router.url;
    this.menuOptions.forEach((option: MenuOption) => {
      option.isActive = currentUrl.includes(option.url);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
