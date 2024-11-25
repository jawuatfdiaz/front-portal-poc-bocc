import { MsalService } from "@azure/msal-angular";

export class MockedMsalService extends MsalService {
  getActiveAccount(): any {
    return {
      username: "usuario_prueba",
      tenantId: "12345678-1234-5678-9012-345678901234",
      homeAccountId: "test",
      environment: "test",
      localAccountId: "12345678-1234-5678-9012-345678901234",
    };
  }
}
