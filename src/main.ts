import { bootstrapApplication } from "@angular/platform-browser";
import { appConfig } from "./app/app.config";
import { AppComponent } from "./app/app.component";
import { environment } from "./environments/environment";

if (environment.production) {
  const FONT_SIZE = "font-size: 40px;";

  console.log(
    "%cFront%cend %cMentor",
    FONT_SIZE + "color: #67bece;",
    FONT_SIZE + "color: #3f54a3;",
    FONT_SIZE +
      "color: #fff;" +
      "background-color: #3f54a3;" +
      "border-radius: 8px;" +
      "padding: 0 12px;",
  );
  console.log("Challenge by Frontend Mentor. Coded by Johnny Gérard.");
  console.log(
    "Code repository: https://github.com/johnnygerard/fem-password-generator-app",
  );
  console.log("Portfolio: https://www.frontendmentor.io/profile/johnnygerard");
}

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err),
);
