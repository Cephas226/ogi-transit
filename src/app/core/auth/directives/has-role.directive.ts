import { Directive, Input, OnInit, TemplateRef, ViewContainerRef, inject, effect } from '@angular/core';
import { AuthService } from '../services/auth.service';
import type { UserRole } from '../models/auth.models';

@Directive({ selector: '[hasRole]', standalone: true })
export class HasRoleDirective implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);

  @Input({ required: true }) hasRole!: UserRole | UserRole[];

  ngOnInit(): void {
    effect(() => {
      const roles = Array.isArray(this.hasRole) ? this.hasRole : [this.hasRole];
      this.viewContainer.clear();
      if (this.authService.hasRole(roles)) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    });
  }
}

@Directive({ selector: '[hasMinRole]', standalone: true })
export class HasMinRoleDirective implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);

  @Input({ required: true }) hasMinRole!: UserRole;

  ngOnInit(): void {
    effect(() => {
      this.viewContainer.clear();
      if (this.authService.hasMinimumRole(this.hasMinRole)) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    });
  }
}
