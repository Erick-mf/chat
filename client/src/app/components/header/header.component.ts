import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { AuthService } from "../../auth.service";

@Component({
    selector: "app-header",
    standalone: true,
    imports: [RouterLink],
    templateUrl: "./header.component.html",
})
export class HeaderComponent {
    public currentUser: boolean = false;

    constructor(private authService: AuthService) {}

    ngOnInit() {
        this.authService.isLoggedIn().subscribe((loggedIn) => {
            this.currentUser = loggedIn;
        });
        this.logout();
    }

    logout() {
        this.authService.signOut();
    }
}
