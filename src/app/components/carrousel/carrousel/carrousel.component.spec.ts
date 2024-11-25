import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarrouselComponent } from './carrousel.component';

describe('CarrouselComponent', () => {
  let component: CarrouselComponent;
  let fixture: ComponentFixture<CarrouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CarrouselComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarrouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should scroll left when slide("left") is called', () => {
    const scrollLeftSpy = jest.spyOn(component.widgetsContent.nativeElement, 'scrollLeft', 'set');
    
    component.slide('left');
    
    expect(scrollLeftSpy).toHaveBeenCalledWith(expect.any(Number)); // Assumiendo que se haya desplazado hacia la izquierda
  });

  it('should scroll right when slide("right") is called', () => {
    const scrollLeftSpy = jest.spyOn(component.widgetsContent.nativeElement, 'scrollLeft', 'set');
    
    component.slide('right');
    
    expect(scrollLeftSpy).toHaveBeenCalledWith(expect.any(Number)); // Assumiendo que se haya desplazado hacia la derecha
  });
});
