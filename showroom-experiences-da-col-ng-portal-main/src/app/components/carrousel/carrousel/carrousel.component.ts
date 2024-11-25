import { Component, ElementRef, ViewChild, AfterViewInit } from "@angular/core";

@Component({
  selector: "app-carrousel",
  templateUrl: "./carrousel.component.html",
  styleUrls: ["./carrousel.component.scss"],
})
export class CarrouselComponent implements AfterViewInit {
  @ViewChild("widgetsContent") widgetsContent: ElementRef;

  // Definir constantes reutilizables
  private readonly descriptions = {
    digitalArchitecture:
      "Providing digital platforms to streamline transformation",
    dataAnalytics: "Enabling data based decisions and actionable insights",
    digitalExperience: "Bringing to life digital products through any channel",
    cybersecurity: "Securing the digital transformation",
    crm: "Managing customer experiences on the Salesforce and Microsoft platforms",
  };

  private readonly images = {
    digitalArchitecture: "../../../../assets/res/home-page/digitalarc.jpg",
    dataAnalytics: "../../../../assets/res/home-page/dataanalitycs.jpg",
    digitalExperience: "../../../../assets/res/home-page/digitalexp.jpg",
    cybersecurity: "../../../../assets/res/home-page/ciber.jpg",
    crm: "../../../../assets/res/home-page/salesforce.png",
  };

  private readonly areas = {
    digitalArchitecture: [
      "Architecture Strategy & Design",
      "Micro Frontends Architectures",
      "API Strategy",
      "Composable and Integration Architectures",
      "Hybrid and Multi Cloud Architectures",
      "DevSecOps, SRE, and Resilient Architectures",
      "Blockchain, DLTs and Web3",
      "Digital Twins, Edge & IoT Architectures",
    ],
    dataAnalytics: [
      "Data Strategy",
      "Data Platform",
      "Artificial Intelligence",
      "Decision Intelligence",
      "Data Security",
    ],
    digitalExperience: [
      "Experience Design",
      "Creative Design",
      "Mobile Design",
      "Conversational AI",
      "Metaverse",
      "Digital Commerce",
      "DX Platforms",
      "Phygital",
      "Experience Intelligence & Marketing Automation",
    ],
    cybersecurity: [
      "Security by Design",
      "Offensive Security",
      "Threat Intelligence",
      "Managed Security Monitoring",
      "Incident Response",
      "Identity and Access Management",
      "Digital Culture",
      "Integrated Risk Management",
      "Privacy Assurance",
      "Business Continuity and IT Resilience",
    ],
    crm: [
      "Salesforce Core (Sales, Service, Platform & Communities)",
      "Salesforce Industries",
      "Salesforce Marketing Cloud",
      "Salesforce Field Service",
      "Salesforce Sustainability",
      "Microsoft Dynamics 365",
    ],
  };

  dataFountadions = [
    this.createDataFoundation(
      "Digital Architecture",
      this.descriptions.digitalArchitecture,
      this.areas.digitalArchitecture,
      this.images.digitalArchitecture
    ),
    this.createDataFoundation(
      "Data & Analytics",
      this.descriptions.dataAnalytics,
      this.areas.dataAnalytics,
      this.images.dataAnalytics
    ),
    this.createDataFoundation(
      "Digital Experience",
      this.descriptions.digitalExperience,
      this.areas.digitalExperience,
      this.images.digitalExperience
    ),
    this.createDataFoundation(
      "Cybersecurity",
      this.descriptions.cybersecurity,
      this.areas.cybersecurity,
      this.images.cybersecurity
    ),
    this.createDataFoundation(
      "CRM",
      this.descriptions.crm,
      this.areas.crm,
      this.images.crm
    ),
  ];

  ngAfterViewInit() {
    this.widgetsContent.nativeElement.scrollLeft = 0;
  }

  createDataFoundation(
    title: string,
    description: string,
    areas: string[],
    image: string
  ) {
    return {
      title,
      description,
      areas: this.removeDuplicateAreas(areas),
      image,
    };
  }

  removeDuplicateAreas(areas: string[]): { value: string }[] {
    const uniqueAreas = [...new Set(areas)];
    return uniqueAreas.map((area) => ({ value: area }));
  }

  slide(slideTo: string) {
    if (slideTo === "left") {
      this.widgetsContent.nativeElement.scrollLeft -= 420;
    } else if (slideTo === "right") {
      this.widgetsContent.nativeElement.scrollLeft += 420;
    }
  }
}
