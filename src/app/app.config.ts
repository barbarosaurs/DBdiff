import { ApplicationConfig } from "@angular/core";
import { provideRouter } from "@angular/router";
import Aura from "@primeng/themes/aura";

import { routes } from "./app.routes";
import { providePrimeNG } from "primeng/config";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
  ],
};
function provideAnimationsAsync():
  | import("@angular/core").Provider
  | import("@angular/core").EnvironmentProviders {
  throw new Error("Function not implemented.");
}
