import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { ResourcesService } from "../resources.service";
import { CacheService } from "../cache-resolver.service";
import { environment } from "src/environments/environment";

// Mocking environment module
jest.mock("src/environments/environment", () => ({
  environment: {
    API_URL: "http://mock-api-url",
  },
}));

describe("ResourcesService", () => {
  let service: ResourcesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ResourcesService, CacheService],
    });

    service = TestBed.inject(ResourcesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should post and create a resource", () => {
    const dummyData = { name: "test resource" };
    const response = { success: true };

    service.postCreateResource(dummyData).subscribe((res) => {
      expect(res).toEqual(response);
    });

    const req = httpMock.expectOne(service["apiUrl"] + "provisioning/resource");
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual(dummyData);
    req.flush(response);
  });

  it("should get resources with payload", () => {
    const payload1 = { type: "TEST" };
    const response1 = [{ id: 1, name: "resource" }];
    const payload2 = { type: "OTHER" };
    const response2 = [{ id: 2, name: "otherResource" }];

    service.getResources(payload1).subscribe((res) => {
      expect(res).toEqual(response1);
    });

    let req = httpMock.expectOne(
      service["apiUrl"] + "provisioning/resource?type=TEST"
    );
    expect(req.request.method).toBe("GET");
    req.flush(response1);

    service.getResources(payload2).subscribe((res) => {
      expect(res).toEqual(response2);
    });

    req = httpMock.expectOne(
      service["apiUrl"] + "provisioning/resource?type=OTHER"
    );
    expect(req.request.method).toBe("GET");
    req.flush(response2);
  });

  it("should handle array of objects with item_id and strings in getResources", () => {
    const payload = {
      types: [{ item_id: "1" }, { item_id: "2" }, "3"],
    };
    const response = [{ id: 1, name: "resource" }];

    service.getResources(payload).subscribe((res) => {
      expect(res).toEqual(response);
    });

    const req = httpMock.expectOne(
      service["apiUrl"] + "provisioning/resource?types=1,2,3"
    );
    expect(req.request.method).toBe("GET");
    req.flush(response);
  });

  it("should get resource by id", () => {
    const resourceId = 1;
    const response = { id: resourceId, name: "resource" };

    service.getResourceById(resourceId).subscribe((res) => {
      expect(res).toEqual(response);
    });

    const req = httpMock.expectOne(
      service["apiUrl"] + "provisioning/resource/" + resourceId
    );
    expect(req.request.method).toBe("GET");
    req.flush(response);
  });

  it("should post request deploy", () => {
    const dummyObj = { deployment: "test" };
    const response = { success: true };

    service.postRequestDeploy(dummyObj).subscribe((res) => {
      expect(res).toEqual(response);
    });

    const req = httpMock.expectOne(
      service["apiUrl"] + "provisioning/deployment"
    );
    expect(req.request.method).toBe("POST");
    req.flush(response);
  });

  it("should enable resource", () => {
    const dummyObj = { status: "enabled" };
    const resourceId = 1;
    const response = { success: true };

    service.enableResource(dummyObj, resourceId).subscribe((res) => {
      expect(res).toEqual(response);
    });

    const req = httpMock.expectOne(
      service["apiUrl"] + "provisioning/resource/" + resourceId
    );
    expect(req.request.method).toBe("PATCH");
    req.flush(response);
  });

  it("should get request deploy", () => {
    const filter = "status=active";
    const response = [{ id: 1, status: "active" }];

    service.getRequestDeploy(filter).subscribe((res) => {
      expect(res).toEqual(response);
    });

    const req = httpMock.expectOne(
      service["apiUrl"] + "provisioning/deployment?" + filter
    );
    expect(req.request.method).toBe("GET");
    req.flush(response);
  });

  it("should get request deploy by id", () => {
    const deploymentId = 1;
    const response = { id: deploymentId, status: "active" };

    service.getRequestDeployId(deploymentId).subscribe((res) => {
      expect(res).toEqual(response);
    });

    const req = httpMock.expectOne(
      service["apiUrl"] + "provisioning/deployment/" + deploymentId
    );
    expect(req.request.method).toBe("GET");
    req.flush(response);
  });

  it("should put approval resource", () => {
    const resourceId = "1";
    const relatedParty = "1";

    const response = { success: true };

    service.putApprovalResource(resourceId, relatedParty).subscribe((res) => {
      expect(res).toEqual(response);
    });

    const req = httpMock.expectOne(
      service["apiUrl"] + `provisioning/deployment/${resourceId}`
    );
    expect(req.request.method).toBe("PUT");
    req.flush(response);
  });

  it("should put reject resource", () => {
    const resourceId = "1";
    const response = { success: true };

    service.putRejectResource(resourceId).subscribe((res) => {
      expect(res).toEqual(response);
    });

    const req = httpMock.expectOne(
      service["apiUrl"] + `provisioning/deployment/${resourceId}`
    );
    expect(req.request.method).toBe("PUT");
    req.flush(response);
  });

  it("should handle error on post", () => {
    const dummyObj = { deployment: "test" };
    const errorResponse = { status: 400, statusText: "Bad Request" };

    service.postRequestDeploy(dummyObj).subscribe(
      () => {},
      (error) => {
        expect(error.status).toEqual(400);
        expect(error.statusText).toEqual("Bad Request");
      }
    );

    const req = httpMock.expectOne(
      service["apiUrl"] + "provisioning/deployment"
    );
    expect(req.request.method).toBe("POST");
    req.flush(null, errorResponse);
  });

  it("should handle error on enable resource", () => {
    const dummyObj = { status: "enabled" };
    const resourceId = 1;
    const errorResponse = { status: 400, statusText: "Bad Request" };

    service.enableResource(dummyObj, resourceId).subscribe(
      () => {},
      (error) => {
        expect(error.status).toEqual(400);
        expect(error.statusText).toEqual("Bad Request");
      }
    );

    const req = httpMock.expectOne(
      service["apiUrl"] + "provisioning/resource/" + resourceId
    );
    expect(req.request.method).toBe("PATCH");
    req.flush(null, errorResponse);
  });

  it("should format date correctly", () => {
    const dateStr = "2023-01-01T00:00:00Z";
    const date = new Date(dateStr);
    date.setTime(date.getTime() + date.getTimezoneOffset() * 60000); // Convert to local time
    const formattedDate = service.formatDate(date.toISOString());
    expect(formattedDate).toBe("January 01, 2023 00:00:00");
  });
});
