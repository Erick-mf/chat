import { Component } from "@angular/core";
import { AuthService } from "../../auth.service";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";

@Component({
    selector: "app-login",
    standalone: true,
    imports: [FormsModule, RouterLink],
    templateUrl: "./login.component.html",
})
export class LoginComponent {
    email: string = "";
    password: string = "";

    constructor(private authService: AuthService) {}

    signIn() {
        this.authService.signIn(this.email, this.password);
    }

    signInWithGoogle() {
        this.authService.signInWithGoogle();
    }
}
