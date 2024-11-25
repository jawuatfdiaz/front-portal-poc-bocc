import { TestBed } from '@angular/core/testing';
import { DataService } from './data.service';

describe('DataService', () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have initial value as null for dataFromHeader$', (done) => {
    service.dataFromHeader$.subscribe(data => {
      expect(data).toBeNull();
      done();
    });
  });

  it('should have initial value as null for dataFromFilter$', (done) => {
    service.dataFromFilter$.subscribe(data => {
      expect(data).toBeNull();
      done();
    });
  });

  it('should send data to dataFromHeader$', () => {
    const testData = { key: 'value' };
    const subscription = service.dataFromHeader$.subscribe(data => {
      expect(data).toEqual(testData);
      subscription.unsubscribe();
    });
    service.sendDataSideBar(testData);
  });

  it('should send data to dataFromFilter$', () => {
    const testData = { key: 'value' };
    const subscription = service.dataFromFilter$.subscribe(data => {
      expect(data).toEqual(testData);
      subscription.unsubscribe();
    });
    service.sendDataCatalog(testData);
  });

  it('should handle multiple data changes for dataFromHeader$', () => {
    const testData1 = { key: 'value1' };
    const testData2 = { key: 'value2' };
    const listener = jest.fn();
    const subscription = service.dataFromHeader$.subscribe(listener);

    service.sendDataSideBar(testData1);
    service.sendDataSideBar(testData2);

    expect(listener).toHaveBeenCalledTimes(3); // null, testData1, testData2
    expect(listener).toHaveBeenCalledWith(testData1);
    expect(listener).toHaveBeenCalledWith(testData2);

    subscription.unsubscribe();
  });

  it('should handle multiple data changes for dataFromFilter$', () => {
    const testData1 = { key: 'value1' };
    const testData2 = { key: 'value2' };
    const listener = jest.fn();
    const subscription = service.dataFromFilter$.subscribe(listener);

    service.sendDataCatalog(testData1);
    service.sendDataCatalog(testData2);

    expect(listener).toHaveBeenCalledTimes(3); // null, testData1, testData2
    expect(listener).toHaveBeenCalledWith(testData1);
    expect(listener).toHaveBeenCalledWith(testData2);

    subscription.unsubscribe();
  });

  it('should handle undefined as data for dataFromHeader$', () => {
    const subscription = service.dataFromHeader$.subscribe(data => {
      expect(data).toBeUndefined();
      subscription.unsubscribe();
    });
    service.sendDataSideBar(undefined);
  });

  it('should handle undefined as data for dataFromFilter$', () => {
    const subscription = service.dataFromFilter$.subscribe(data => {
      expect(data).toBeUndefined();
      subscription.unsubscribe();
    });
    service.sendDataCatalog(undefined);
  });
});
