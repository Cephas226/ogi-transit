import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  readonly id: string;
  readonly type: NotificationType;
  readonly message: string;
  readonly duration: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly _notifications = signal<Notification[]>([]);
  readonly notifications = this._notifications.asReadonly();

  success(message: string, duration = 4000): void {
    this.add('success', message, duration);
  }

  error(message: string, duration = 6000): void {
    this.add('error', message, duration);
  }

  warning(message: string, duration = 5000): void {
    this.add('warning', message, duration);
  }

  info(message: string, duration = 4000): void {
    this.add('info', message, duration);
  }

  dismiss(id: string): void {
    this._notifications.update((ns) => ns.filter((n) => n.id !== id));
  }

  private add(type: NotificationType, message: string, duration: number): void {
    const notification: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      type,
      message,
      duration,
    };
    this._notifications.update((ns) => [...ns, notification]);
    if (duration > 0) {
      setTimeout(() => this.dismiss(notification.id), duration);
    }
  }
}
