import { Injectable } from "@angular/core";
import {
    Auth,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
} from "@angular/fire/auth";
import { Firestore, getFirestore, doc, setDoc } from "@angular/fire/firestore";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { ChatService } from "./services/chat.service";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    private firestore: Firestore;

    constructor(
        private auth: Auth,
        private router: Router,
        private chatService: ChatService,
    ) {
        this.firestore = getFirestore();
    }

    async signIn(email: string, password: string) {
        try {
            const credential = await signInWithEmailAndPassword(this.auth, email, password);
            const userDoc = doc(this.firestore, "usuarios", credential.user.uid);
            const user = {
                displayName: credential.user.displayName,
                email: credential.user.email,
                uid: credential.user.uid,
                photoURL: credential.user.photoURL,
            };
            await setDoc(userDoc, user);
            this.chatService.sendUser([user.displayName, user.photoURL]);
            this.router.navigate(["/chat"]);
        } catch (error: any) {
            console.error(error);
        }
    }

    async signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(this.auth, provider);
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential?.accessToken;
            const user = {
                displayName: result.user.displayName,
                email: result.user.email,
                uid: result.user.uid,
                photoURL: result.user.photoURL,
            };
            const userDoc = doc(this.firestore, "usuarios", user.uid);
            await setDoc(userDoc, user);
            this.chatService.sendUser(user);
            this.router.navigate(["/chat"]);
        } catch (error: any) {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
            console.error(errorCode, errorMessage, email, credential);
        }
    }

    async signUp(name: string, email: string, password: string) {
        try {
            const credential = await createUserWithEmailAndPassword(this.auth, email, password);
            const userDoc = doc(this.firestore, "usuarios", credential.user.uid);
            await setDoc(userDoc, {
                displayName: name,
                email: email,
                uid: credential.user.uid,
                photoURL: "",
            });
            await updateProfile(credential.user, { displayName: name });
            this.router.navigate(["/login"]);
        } catch (error) {
            console.error(error);
        }
    }

    async signOut() {
        try {
            this.chatService.userDisconnect(this.auth.currentUser);
            await signOut(this.auth);
            localStorage.removeItem("users");
            this.router.navigate([""]);
        } catch (error) {
            console.error(error);
        }
    }

    getCurrentUserId(): any {
        const user = this.auth.currentUser;
        if (user && user.displayName) {
            return user.displayName;
        } else {
            throw new Error("El usuario no está autenticado");
        }
    }

    isLoggedIn(): Observable<any> {
        return new Observable<boolean>((observer) => {
            this.auth.onAuthStateChanged((user) => {
                observer.next(!!user);
            });
        });
    }
}
