import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule, FormsModule } from "@angular/forms"; 
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { TagInputModule } from "ngx-chips";
import { FilterComponent } from "./filter.component";
import { DataService } from "../../../shared/data.service";
import config from "../../../../config/config.json";
import { themeMock } from "../../../mocks/theme.mock";
import { defaultValuesMock } from "../../../mocks/defaultValues.mock";
import { CommonModule } from "@angular/common";

describe("FilterComponent", () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;
  let dataService: any;

  beforeEach(async () => {
    const mockLocalStorage = {
      getItem: (key: string): string | null => {
        if (key === "theme") {
          return themeMock;
        }
        if (key === "defaultValues") {
          return defaultValuesMock;
        }
        return null;
      },
      setItem: jest.fn()
    };

    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

    await TestBed.configureTestingModule({
      declarations: [FilterComponent],
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgMultiSelectDropDownModule.forRoot(),
        TagInputModule,
      ],
      providers: [
        // Usamos un mock de DataService en lugar de la instancia real
        { provide: DataService, useValue: { sendDataCatalog: jest.fn() } },
        { provide: "CONFIG", useValue: config }
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    // Obtenemos la instancia del mock de DataService
    dataService = TestBed.inject(DataService);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize myFormFilters with empty values in ngOnInit", () => {
    component.ngOnInit();

    expect(component.myFormFilters.get('name').value).toEqual('');
    expect(component.myFormFilters.get('type').value).toEqual(null);
    expect(component.myFormFilters.get('categories').value).toEqual(null);
    expect(component.myFormFilters.get('subCategories').value).toEqual(null);
    expect(component.myFormFilters.get('technologies').value).toEqual(null);
    expect(component.myFormFilters.get('labels').value).toEqual(null);
  });

  it("should call sendDataCatalog when filterView is called", () => {
    const formData = {
      name: "test name",
      type: ["test type"],
      categories: ["test category"],
      subCategories: ["test subcategory"],
      technologies: ["test technology"],
      labels: ["test label"],
    };
    component.myFormFilters.setValue(formData);
    component.filterView();

    // Modificamos el objeto formData para reflejar el cambio esperado en 'name'
    formData.name = component.name;

    expect(dataService.sendDataCatalog).toHaveBeenCalledWith(formData);
  });

});
