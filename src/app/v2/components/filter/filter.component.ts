import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DataService } from "../../../shared/data.service";

@Component({
  selector: "app-filter",
  templateUrl: "./filter.component.html",
  styleUrls: ["./filter.component.scss", "./custom-theme.scss"],
})
export class FilterComponent implements OnInit {
  @Output() isFilterChangeEvent = new EventEmitter<boolean>();

  myFormFilters: FormGroup;
  dropdownTypeResource = {};
  disabled = false;
  isClickFilterBtn = true;

  items = [];
  name = "";

  theme: any;
  defaultValues: any;
  removeFields = {
    name: false,
    categories: false,
    subCategories: false,
    technologies: false,
    typeResource: false,
    labels: false,
  };

  typeOfResourcesList = [];
  categoriesList = [];
  subcategoriesList = [];
  technologiesList = [];

  constructor(private fb: FormBuilder, private dataService: DataService) {
    this.theme = JSON.parse(localStorage.getItem("theme"));
    this.defaultValues = JSON.parse(localStorage.getItem("defaultValues"));

    this.theme.properties.removeFields.forEach((field) => {
      if (field in this.removeFields) {
        this.removeFields[field] = true;
      }
    });

    this.typeOfResourcesList = this.initializeList(
      this.theme?.properties?.dataFilters?.typeResources ||
        this.defaultValues?.defaultFilters?.typeResources ||
        []
    );

    this.categoriesList = this.initializeList(
      this.theme?.properties?.dataFilters?.categories ||
        this.defaultValues?.defaultFilters?.categories ||
        []
    );

    // let arraySubcategories = (this.theme?.properties?.dataFilters?.categories || this.defaultValues?.defaultFilters?.categories || [])
    //   .reduce((acc, category) => acc.concat(category.subItems), [])

    // this.subcategoriesList =
    //   this.initializeList(arraySubcategories)

    this.subcategoriesList = this.initializeList([]);

    this.technologiesList = this.initializeList(
      this.theme?.properties?.dataFilters?.technologies ||
        this.defaultValues?.defaultFilters?.technologies ||
        []
    );
  }

  ngOnInit() {
    this.dropdownTypeResource = {
      singleSelection: true,
      idField: "item_id",
      textField: "item_text",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 2,
      allowSearchFilter: false,
    };

    this.myFormFilters = this.fb.group({
      name: ["", Validators.required],
      type: [
        [
          {
            item_text: "BLUEPRINT_INFRAESTRUCTURE",
            item_id: "BLUEPRINT_INFRAESTRUCTURE",
          },
        ],
        Validators.required,
      ],
      category: [[], Validators.required],
      subCategory: [[], Validators.required],
      technologies: [[], Validators.required],
      labels: [[], Validators.required],
    });
    // this.dataService.sendDataCatalog(this.myFormFilters.value);
    this.filterSubcategories();

    this.myFormFilters.get('type')?.valueChanges.subscribe((selectedItems) => {
      if (selectedItems.length === 0) {
        const lastSelected = [this.typeOfResourcesList[3]] || [this.typeOfResourcesList[0]];
        this.myFormFilters.get('type')?.setValue(lastSelected, { emitEvent: false });
      }
    });
  }

  initializeList(filterData): [] {
    if (filterData) {
      return filterData.map((item) => ({
        item_id: item?.code || item.id,
        item_text: item?.name || item.value,
      }));
    }
  }

  filterSubcategories(): void {
    let themeCategories =
      this.theme?.properties?.dataFilters?.categories ||
      this.defaultValues?.defaultFilters?.categories;
    this.myFormFilters.get("category")!.valueChanges.subscribe((categories) => {
      let categoriesIds = categories.map((category) => category.item_id);

      let availableSubcategories = themeCategories.filter((category) =>
        categoriesIds.includes(category.code)
      );

      this.subcategoriesList = this.initializeList(
        availableSubcategories.reduce(
          (acc, category) => acc.concat(category.subItems),
          []
        )
      );
    });
  }

  filterView(): void {
    let listItems = [];
    if (this.items.length) {
      this.items.forEach((label) => {
        listItems.push(label.value);
      });
    }

    //validación para evitar multiples llamado a la api cuando se da clic en filtrar
    if (
      !this.myFormFilters.pristine ||
      this.name != this.myFormFilters.value.name ||
      JSON.stringify(this.myFormFilters.value.labels) !==
        JSON.stringify(listItems)
    ) {
      this.myFormFilters.markAsPristine();

      this.myFormFilters.value.labels = listItems;
      this.myFormFilters.value.name = this.name;

      let isFilterData = Object.values(this.myFormFilters.value).some(
        (item: any) => item?.length
      );
      isFilterData
        ? this.dataService.sendDataCatalog(this.myFormFilters.value)
        : this.dataService.sendDataCatalog(null);

      this.isClickFilterBtn = !this.isClickFilterBtn;
      this.isFilterChangeEvent.emit(this.isClickFilterBtn);
    }
  }
}
