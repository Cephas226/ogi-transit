import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/services/auth.service';
import { AuthCredentials } from '../../core/auth/models/auth.models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen flex bg-[#f0ede8]">
      <!-- Left panel -->
      <div class="w-[45%] bg-[#1a1e2e] flex flex-col items-center justify-center">
        <div class="text-center">
          <div class="w-14 h-14 bg-[#e85d2f] rounded-xl flex items-center justify-center
                      text-white font-bold text-xl mx-auto mb-4">
            OT
          </div>
          <h1 class="text-white text-2xl font-bold tracking-tight">OGI Transit</h1>
          <p class="text-white/30 text-[10px] tracking-[0.15em] uppercase mt-1">
            Logistics Command
          </p>
          <div class="flex gap-6 justify-center mt-12 opacity-20">
            <div class="w-px h-16 bg-white"></div>
            <div class="w-px h-16 bg-white"></div>
          </div>
        </div>
      </div>

      <!-- Right panel -->
      <div class="flex-1 flex items-center justify-center px-10">
        <div class="w-full max-w-[360px]">
          <div class="mb-7">
            <h2 class="text-[#1a1e2e] text-2xl font-bold">Connexion</h2>
            <p class="text-[#6b7280] text-sm mt-1">Accédez à votre espace OGI Transit</p>
          </div>

          <form #loginForm="ngForm" (ngSubmit)="onSubmit(loginForm)">
            <div class="mb-4">
              <label class="block text-[10px] font-semibold uppercase tracking-wider
                           text-[#6b7280] mb-1.5">
                Adresse email
              </label>
              <input
                type="email"
                name="email"
                ngModel
                required
                email
                class="w-full px-3 py-2.5 border border-black/10 rounded-lg text-sm
                       bg-white outline-none focus:border-[#e85d2f]
                       focus:ring-2 focus:ring-[#e85d2f]/10 transition"
                placeholder="nom@entreprise.com"
                [class.border-red-400]="submitted() && loginForm.controls['email']?.invalid"
              />
            </div>

            <div class="mb-5">
              <label class="block text-[10px] font-semibold uppercase tracking-wider
                           text-[#6b7280] mb-1.5">
                Mot de passe
              </label>
              <div class="relative">
                <input
                  [type]="showPassword() ? 'text' : 'password'"
                  name="password"
                  ngModel
                  required
                  minlength="6"
                  class="w-full px-3 py-2.5 border border-black/10 rounded-lg text-sm
                         bg-white outline-none focus:border-[#e85d2f]
                         focus:ring-2 focus:ring-[#e85d2f]/10 transition pr-10"
                  placeholder="••••••••"
                  [class.border-red-400]="submitted() && loginForm.controls['password']?.invalid"
                />
                <button
                  type="button"
                  (click)="showPassword.set(!showPassword())"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
                         hover:text-gray-600 transition"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943
                             9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943
                             -9.542-7z"/>
                  </svg>
                </button>
              </div>
              <div class="text-right mt-1">
                <a href="#" class="text-[11px] text-[#e85d2f] hover:underline">
                  Mot de passe oublié ?
                </a>
              </div>
            </div>

            <button
              type="submit"
              [disabled]="isLoading()"
              class="w-full py-2.5 bg-[#e85d2f] text-white rounded-lg font-semibold
                     text-sm hover:bg-[#d44e22] transition disabled:opacity-60
                     disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              @if (isLoading()) {
                <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10"
                          stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Connexion en cours...
              } @else {
                Se connecter
              }
            </button>
          </form>

          @if (authError()) {
            <div class="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg
                        flex items-center gap-2 text-red-700 text-[11px]">
              <span>⚠</span>
              {{ authError() }}
            </div>
          }

          <div class="mt-5 text-center">
            <p class="text-[10px] text-gray-400 mb-2">Comptes de démo</p>
            <div class="flex gap-2 justify-center flex-wrap">
              @for (demo of demoAccounts; track demo.email) {
                <button
                  (click)="fillDemo(demo)"
                  class="text-[10px] px-2.5 py-1 bg-white border border-black/10
                         rounded-md text-gray-500 hover:bg-gray-50 transition"
                >
                  {{ demo.label }}
                </button>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isLoading = this.authService.isLoading;
  readonly authError = this.authService.error;
  readonly showPassword = signal(false);
  readonly submitted = signal(false);

  readonly demoAccounts = [
    { label: 'Gérant', email: 'admin@ogi.com', password: 'password' },
    { label: 'Finance', email: 'finance@ogi.com', password: 'password' },
    { label: 'Logistique', email: 'logistique@ogi.com', password: 'password' },
    { label: 'PDG', email: 'pdg@ogi.com', password: 'password' },
  ] as const;

  fillDemo(demo: { email: string; password: string }): void {
    const emailInput = document.querySelector<HTMLInputElement>('[name="email"]');
    const pwdInput = document.querySelector<HTMLInputElement>('[name="password"]');
    if (emailInput) emailInput.value = demo.email;
    if (pwdInput) pwdInput.value = demo.password;
  }

  onSubmit(form: NgForm): void {
    this.submitted.set(true);
    if (form.invalid) return;

    const credentials: AuthCredentials = {
      email: form.value.email,
      password: form.value.password,
    };

    this.authService.login(credentials).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => {},
    });
  }
}
