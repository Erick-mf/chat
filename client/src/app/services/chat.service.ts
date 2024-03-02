import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { io } from "socket.io-client";

@Injectable({
    providedIn: "root",
})
export class ChatService {
    private socket: any;

    constructor() {
        this.socket = io("https://chat-2-8u4i.onrender.com");
    }

    sendMessage(from: string, message: string) {
        this.socket.emit("message", { from, body: message });
    }

    sendMessageToUser(from: string, message: string, to: string) {
        this.socket.emit("privateMessage", { from, body: message, to });
    }

    getMessage(): Observable<any> {
        return new Observable((observer) => {
            this.socket.on("message", (data: any) => {
                observer.next(data);
            });

            return () => this.socket.disconnect();
        });
    }

    sendUser(user: any) {
        if (user.displayName && user.photoURL) this.socket.emit("userData", user);
    }

    getUsersCount(): Observable<any[]> {
        return new Observable((observer) => {
            this.socket.on("userList", (data: any[]) => {
                observer.next(data);
            });
            return () => this.socket.disconnect();
        });
    }

    userDisconnect(user: any) {
        this.socket.emit("userDisconnect", user);
    }
}
