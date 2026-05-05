import {
  HttpInterceptorFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notifications = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'Une erreur inattendue est survenue.';

      switch (error.status) {
        case 400:
          message = error.error?.detail ?? 'Données invalides.';
          break;
        case 403:
          message = 'Accès refusé. Permissions insuffisantes.';
          break;
        case 404:
          message = 'Ressource introuvable.';
          break;
        case 500:
          message = 'Erreur serveur. Veuillez réessayer.';
          break;
        case 0:
          message = 'Connexion impossible. Vérifiez votre réseau.';
          break;
      }

      if (error.status !== 401) {
        notifications.error(message);
      }

      return throwError(() => ({
        status: error.status,
        message,
        originalError: error,
      }));
    }),
  );
};
