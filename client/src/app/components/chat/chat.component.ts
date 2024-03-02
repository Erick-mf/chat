import { Component } from "@angular/core";
import { ChatService } from "../../services/chat.service";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../auth.service";

@Component({
    selector: "app-chat",
    standalone: true,
    imports: [FormsModule],
    templateUrl: "./chat.component.html",
    styles: [":host { min-height: 100vh; display: flex; }"],
})
export class ChatComponent {
    public message: string = "";
    public messages: { from: string; body: string }[] = [];
    public currentUser: string = this.authService.getCurrentUserId();
    public imgData: string = "";
    public users: any[] = [];
    public selectedUser: string = "";

    constructor(
        private chatService: ChatService,
        private authService: AuthService,
    ) {}

    ngOnInit() {
        this.chatService.getMessage().subscribe((message: any) => {
            this.messages.push({ from: message.from, body: message.body });
        });

        this.chatService.getUsersCount().subscribe((users: any[]) => {
            this.users = users;
        });
    }

    selectUser(user: string) {
        this.selectedUser = user;
    }

    sendMessage() {
        // const userName = this.authService.getCurrentUserId();
        // this.chatService.sendMessage(userName, this.message);
        // this.messages.push({ from: userName, body: this.message });
        // this.message = "";
        const userName = this.authService.getCurrentUserId();
        this.chatService.sendMessageToUser(userName, this.message, this.selectedUser);
        this.messages.push({ from: userName, body: this.message });
        this.message = "";
    }

    sendImage(image: string) {
        const userName = this.authService.getCurrentUserId();
        this.chatService.sendMessage(userName, image);
        this.messages.push({ from: userName, body: image });
        this.message = "";
    }

    onFileSelected(event: any) {
        const file: File = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e: any) => {
            this.imgData = e.target.result;
            this.sendImage(this.imgData);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    }
}
