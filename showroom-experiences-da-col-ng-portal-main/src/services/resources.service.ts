import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class ResourcesService {
  private apiUrl = '';

  constructor(private http: HttpClient) {
    const theme = JSON.parse(localStorage.getItem("theme"))
    this.apiUrl = theme?.properties?.backendUrl;
  }

  postCreateResource(datos: any): Observable<any> {
    return this.http
      .post<any>(this.apiUrl + "provisioning/resource", datos)
      .pipe(
        map((response) => {
          console.log(response);
        })
      );
  }

  getResources(payload, pageIndex = 0, isEnable = false): Observable<any> {
    let urlParams = isEnable ? 'type=BLUEPRINT_INFRAESTRUCTURE&enable=true' : 'type=BLUEPRINT_INFRAESTRUCTURE';

    if (payload != undefined && payload != null) {
      urlParams = "";

      Object.keys(payload).forEach((key) => {
        const value = payload[key];

        if (value !== null && Array.isArray(value)) {
          if (
            value.every(
              (item) =>
                (typeof item === "object" && "item_id" in item) ||
                typeof item === "string"
            )
          ) {
            const values = value.filter((item) => item !== null);
            if (values.length > 0) {
              const formattedValues = values.map((item) =>
                typeof item === "object" ? item.item_id : item
              );
              urlParams += `${key}=${formattedValues.join(",")}&`;
            }
          }
        } else if (value !== null && typeof value !== "object") {
          urlParams += `${key}=${value}&`;
        }
      });

      // Eliminamos el último &
      urlParams = urlParams.slice(0, -1);
    }

    return this.http.get<any>(
      `${this.apiUrl}provisioning/resource?${urlParams}&page=${pageIndex}`
    );
  }

  getResourceById(id): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}provisioning/resource/${id}`);
  }

  postRequestDeploy(obj: any): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}provisioning/deployment`, obj)
      .pipe(
        map((response) => {
          console.log(response);
        })
      );
  }

  enableResource(obj: any, idResource: any): Observable<any> {
    return this.http
      .patch<any>(`${this.apiUrl}provisioning/resource/${idResource}`, obj)
      .pipe(
        map((response) => {
          console.log(response);
        })
      );
  }

  getRequestDeploy(filter: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}provisioning/deployment?${filter}`
    );
  }

  getRequestDeployId(id: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}provisioning/deployment/${id}`);
  }

  putApprovalResource(id: string, relatedParty: any): Observable<any> {
    const obj = {
      response: {
        status: "APPROVED",
        message: "APPROVED",
      },
      relatedParty: relatedParty,
    }

    return this.http
      .put<any>(`${this.apiUrl}provisioning/deployment/${id}`, obj)
      .pipe(
        map((response) => {
          console.log(response)
        })
      )
  }

  putRejectResource(id: string, relatedParty: any): Observable<any> {
    const obj = {
      response: {
        status: "REJECTED",
        message: "REJECTED",
      },
      relatedParty: relatedParty,
    }

    return this.http
      .put<any>(`${this.apiUrl}provisioning/deployment/${id}`, obj)
      .pipe(
        map((response) => {
          console.log(response)
        })
      )
  }

  formatDate(dateTimeString) {
    const date = new Date(dateTimeString);
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const year = date.getFullYear();
    const monthIndex = date.getMonth();
    const day = String(date.getDate()).padStart(2, "0");
    const month = months[monthIndex];
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${month} ${day}, ${year} ${hours}:${minutes}:${seconds}`;
  }
}
