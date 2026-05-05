import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
  inject,
  effect,
} from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/auth.models';

@Directive({
  selector: '[hasRole]',
  standalone: true,
})
export class HasRoleDirective implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);

  @Input({ required: true }) hasRole!: UserRole | UserRole[];

  ngOnInit(): void {
    effect(() => {
      this.updateView();
    });
  }

  private updateView(): void {
    const roles = Array.isArray(this.hasRole) ? this.hasRole : [this.hasRole];
    const hasAccess = this.authService.hasRole(roles);

    this.viewContainer.clear();
    if (hasAccess) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}

@Directive({
  selector: '[hasMinRole]',
  standalone: true,
})
export class HasMinRoleDirective implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);

  @Input({ required: true }) hasMinRole!: UserRole;

  ngOnInit(): void {
    effect(() => {
      this.updateView();
    });
  }

  private updateView(): void {
    const hasAccess = this.authService.hasMinimumRole(this.hasMinRole);
    this.viewContainer.clear();
    if (hasAccess) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
