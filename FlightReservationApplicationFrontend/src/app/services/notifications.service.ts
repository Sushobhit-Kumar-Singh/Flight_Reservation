import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new Subject<Notification>();

  notifications$ = this.notificationsSubject.asObservable();

  showSuccess(message: string): void {
    this.notificationsSubject.next({ type: 'success', message });
  }

  showError(message: string): void {
    this.notificationsSubject.next({ type: 'error', message });
  }
}

interface Notification {
  type: 'success' | 'error';
  message: string;
}
