import { Routes } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";
import { ChatComponent } from "./components/chat/chat.component";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { authGuard } from "./auth.guard";

export const routes: Routes = [
    {
        path: "",
        title: "Angular | Chat",
        component: HomeComponent,
    },
    {
        path: "chat",
        title: "Chat",
        component: ChatComponent,
        canActivate: [authGuard],
    },
    {
        path: "login",
        title: "Login",
        component: LoginComponent,
    },
    {
        path: "register",
        title: "Register",
        component: RegisterComponent,
    },
];
