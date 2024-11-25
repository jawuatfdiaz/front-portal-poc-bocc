// main.spec.ts

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

describe('Main', () => {
  let bootstrapModuleSpy: jest.SpyInstance;

  // Creamos un objeto que contendrá nuestra función bootstrapModule
  const platformBrowserDynamicMock = {
    bootstrapModule: jest.fn().mockReturnValue(Promise.resolve(null))
  };

  // Almacenamos una referencia a la función bootstrapModule para facilitar las pruebas
  const bootstrapModule = platformBrowserDynamicMock.bootstrapModule;

  // Hacemos que la función platformBrowserDynamic devuelva nuestro objeto personalizado
  jest.mock('@angular/platform-browser-dynamic', () => ({
    platformBrowserDynamic: () => platformBrowserDynamicMock
  }));

  beforeEach(() => {
    // Configuramos un espía en la función bootstrapModule antes de cada prueba
    bootstrapModuleSpy = jest.spyOn(platformBrowserDynamicMock, 'bootstrapModule');
  });

  afterEach(() => {
    // Restauramos el espía después de cada prueba
    bootstrapModuleSpy.mockClear();
  });

  it('should bootstrap AppModule in production environment', async () => {

    // Llamamos a main
    require('./main');

    // Esperamos a que se resuelva la promesa
    await new Promise(resolve => setTimeout(resolve));

    // Verificamos que bootstrapModule haya sido llamada con AppModule
    expect(bootstrapModuleSpy).toHaveBeenCalledWith(AppModule);
  });


});
