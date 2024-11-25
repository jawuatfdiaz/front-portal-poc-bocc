import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Renderer2, RendererStyleFlags2 } from "@angular/core";
import { AppComponent } from "./app.component";

class MockRenderer implements Renderer2 {
  get data(): { [key: string]: any } {
    throw new Error("Method not implemented.");
  }
  destroy(): void {
    throw new Error("Method not implemented.");
  }
  createComment(value: string) {
    throw new Error("Method not implemented.");
  }
  createText(value: string) {
    throw new Error("Method not implemented.");
  }
  destroyNode: (node: any) => void;
  insertBefore(
    parent: any,
    newChild: any,
    refChild: any,
    isMove?: boolean
  ): void {
    throw new Error("Method not implemented.");
  }
  removeChild(parent: any, oldChild: any, isHostElement?: boolean): void {
    throw new Error("Method not implemented.");
  }
  selectRootElement(selectorOrNode: any, preserveContent?: boolean) {
    throw new Error("Method not implemented.");
  }
  parentNode(node: any) {
    throw new Error("Method not implemented.");
  }
  nextSibling(node: any) {
    throw new Error("Method not implemented.");
  }
  removeAttribute(el: any, name: string, namespace?: string): void {
    throw new Error("Method not implemented.");
  }
  addClass(el: any, name: string): void {
    throw new Error("Method not implemented.");
  }
  removeClass(el: any, name: string): void {
    throw new Error("Method not implemented.");
  }
  setStyle(
    el: any,
    style: string,
    value: any,
    flags?: RendererStyleFlags2
  ): void {
    throw new Error("Method not implemented.");
  }
  removeStyle(el: any, style: string, flags?: RendererStyleFlags2): void {
    throw new Error("Method not implemented.");
  }
  setProperty(el: any, name: string, value: any): void {
    throw new Error("Method not implemented.");
  }
  setValue(node: any, value: string): void {
    throw new Error("Method not implemented.");
  }
  listen(
    target: any,
    eventName: string,
    callback: (event: any) => boolean | void
  ): () => void {
    throw new Error("Method not implemented.");
  }
  // Implementa los métodos de Renderer2
  createElement(tagName: string): any {
    return document.createElement(tagName);
  }

  setAttribute(
    el: any,
    name: string,
    value: string | null,
    namespace?: string | null
  ): void {
    el.setAttribute(name, value);
  }

  appendChild(parent: any, newChild: any): void {
    parent.appendChild(newChild);
  }
}

describe("AppComponent", () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockRenderer: MockRenderer;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [{ provide: Renderer2, useClass: MockRenderer }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    mockRenderer = TestBed.inject(Renderer2) as MockRenderer;
  });

  it("should create the app", () => {
    expect(component).toBeTruthy();
  });

  it("should add stylesheet to document head in constructor", () => {
    const createElementSpy = jest.spyOn(mockRenderer, "createElement").mockReturnValue(document.createElement("link"));
    const setAttributeSpy = jest.spyOn(mockRenderer, "setAttribute");
    const appendChildSpy = jest.spyOn(mockRenderer, "appendChild");
  
    component = new AppComponent(mockRenderer);
  
    expect(createElementSpy).toHaveBeenCalledWith("link");
    expect(setAttributeSpy).toHaveBeenCalledWith(expect.anything(), "rel", "stylesheet");
    expect(setAttributeSpy).toHaveBeenCalledWith(expect.anything(), "type", "text/css");
    expect(setAttributeSpy).toHaveBeenCalledWith(expect.anything(), "href", "../themes/davivienda.css");
    expect(appendChildSpy).toHaveBeenCalled();
  });
});
