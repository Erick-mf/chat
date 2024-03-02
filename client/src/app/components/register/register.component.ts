import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../auth.service";
import { RouterLink } from "@angular/router";

@Component({
    selector: "app-register",
    standalone: true,
    imports: [FormsModule, RouterLink],
    templateUrl: "./register.component.html",
})
export class RegisterComponent {
    name: string = "";
    email: string = "";
    password: string = "";

    constructor(private authService: AuthService) {}

    signUp(event: Event) {
        event.preventDefault();
        this.authService.signUp(this.name, this.email, this.password);
        this.email = "";
        this.password = "";
    }

    onFileSelected(event: Event) {
        const file: File = (event.target as HTMLInputElement).files![0];
        const reader = new FileReader();
    }
}
