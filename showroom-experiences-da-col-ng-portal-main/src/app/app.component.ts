import { Component, Renderer2 } from "@angular/core";
import config from "../config/config.json";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  theme: string;
  title = "pocs-ntt";
  themeId = config?.themeId || "default";

  constructor(private renderer: Renderer2) {
    const themeDefault = {
      id: "default",
      properties: {
        logo: "../assets/images/resource-default.png",
        themeUrl: "../themes/default.css",
        removeField: [],
        removeFields: ["deployOrchestor"],
        deployOrchestor: false,
        localLogin: false,
        auth: {
          clientId: "25dc2e1a-eced-46ab-8e36-dd230ddfdbd8",
          redirectUri: "https://provisioning.nttdataco.com",
          postLogoutRedirectUri: "https://provisioning.nttdataco.com"
        },
        dataFilters: {
          categories: [
            {
              name: "Digital Architecture",
              code: "digital_architecture",
              description: "",
              subItems: [],
            },
            {
              name: "Digital Experience",
              code: "digital_experience",
              description: "",
              subItems: [],
            },
            {
              name: "Data & Analytics",
              code: "data_and_analytics",
              description: "",
              subItems: [],
            },
          ],
          country: [
            {
              name: "filial 1",
              code: "filial_1",
            },
            {
              name: "filial 2",
              code: "filial_2",
            },
            {
              name: "filial 3",
              code: "filial_3",
            },
            {
              name: "filial 4",
              code: "filial_4",
            },
          ],
          cloudProvider: [
            {
              name: "Azure",
              code: "AZURE",
            },
          ],
        },
      },
    };
    const appTheme =
      config?.themes?.find((theme) => theme.id === this.themeId) ||
      themeDefault;
    localStorage.setItem("theme", JSON.stringify(appTheme));
    localStorage.setItem(
      "defaultValues",
      JSON.stringify({ defaultFilters: config?.defaultFilters })
    );

    this.addStylesheet(appTheme.properties.themeUrl);
  }

  private addStylesheet(filename: string) {
    const linkElement = this.renderer.createElement("link");
    this.renderer.setAttribute(linkElement, "rel", "stylesheet");
    this.renderer.setAttribute(linkElement, "type", "text/css");
    this.renderer.setAttribute(linkElement, "href", filename);
    this.renderer.appendChild(document.head, linkElement);
  }
}
