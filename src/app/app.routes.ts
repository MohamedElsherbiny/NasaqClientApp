import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent as AdminDashboardIndexComponent } from './pages/admin-dashboard/components/dashboard/dashboard.component';
import { DashboardComponent as AuthorDashboardIndexComponent } from './pages/author-dashboard/components/dashboard/dashboard.component';
import { DashboardComponent as PublisherDashboardIndexComponent } from './pages/publisher-dashboard/components/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { tokenValidationGuard } from './shared/core/guards/token-validation.guard';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AdminProfileComponent } from './pages/admin-dashboard/components/admin-profile/admin-profile.component';
import { adminGuard } from './shared/core/guards/admin.guard';
import { publisherGuard } from './shared/core/guards/publisher.guard';
import { authorGuard } from './shared/core/guards/author.guard';
import { ConfirmEmailComponent } from './pages/confirm-email/confirm-email.component';
import { AuthorDashboardComponent } from './pages/author-dashboard/author-dashboard.component';
import { AuthorRequestsComponent } from './pages/author-dashboard/components/author-requests/author-requests.component';
import { AuthorBooksComponent } from './pages/author-dashboard/components/author-books/author-books.component';
import { AuthorProjectsComponent } from './pages/author-dashboard/components/author-projects/author-projects.component';
import { PublisherDashboardComponent } from './pages/publisher-dashboard/publisher-dashboard.component';
import { PublisherRequestsComponent } from './pages/publisher-dashboard/components/publisher-requests/publisher-requests.component';
import { PublisherProjectsComponent } from './pages/publisher-dashboard/components/publisher-projects/publisher-projects.component';
import { TeamComponent } from './pages/publisher-dashboard/components/team/team.component';
import { PublishersComponent } from './pages/author-dashboard/components/publishers/publishers.component';
import { TasksComponent } from './pages/publisher-dashboard/components/tasks/tasks.component';
import { PublisherRequestEvaluationsComponent } from './pages/publisher-dashboard/components/evaluation/publisher-request-evaluation.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { ResetPasswordEmailComponent } from './pages/reset-password-email/reset-password-email.component';
import { PublisherContractsComponent } from './pages/publisher-dashboard/components/publisher-contracts/publisher-contracts.component';
import { AuthorContractsComponent } from './pages/author-dashboard/components/author-contracts/author-contracts.component';
import { ContarctTemplateEditorComponent } from './pages/publisher-dashboard/components/publisher-contracts/template-editor/template-editor.component';
import { completeProfileGuard } from './shared/core/guards/complete-profile.guard';
import { PublisherProfileEditorComponent } from './pages/publisher-dashboard/components/publisher-profile-editor/publisher-profile-editor.component';
import { PublisherProjectComponent } from './pages/publisher-dashboard/components/project/publisher-project.component';
import { AuthorProjectComponent } from './pages/author-dashboard/components/project/author-project.component';
import { AuthorProfileEditorComponent } from './pages/author-dashboard/components/author-profile-editor/author-profile-editor.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'confirm-email', component: ConfirmEmailComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'reset-password-request', component: ResetPasswordEmailComponent },
  {
    path: 'author-dashboard',
    canActivate: [tokenValidationGuard, authorGuard],
    component: AuthorDashboardComponent,
    children: [
      { path: 'home', component: AuthorDashboardIndexComponent, canActivate: [completeProfileGuard] },
      { path: 'requests', component: AuthorRequestsComponent, canActivate: [completeProfileGuard] },
      { path: 'contracts', component: AuthorContractsComponent, canActivate: [completeProfileGuard] },
      { path: 'books', component: AuthorBooksComponent, canActivate: [completeProfileGuard] },
      { path: 'projects', component: AuthorProjectsComponent, canActivate: [completeProfileGuard] },
      { path: 'publishers', component: PublishersComponent, canActivate: [completeProfileGuard] },
      { path: 'projects/:id', component: AuthorProjectComponent, canActivate: [completeProfileGuard] },
      { path: 'complete-profile', component: AuthorProfileEditorComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  }, {
    path: 'publisher-dashboard',
    canActivate: [tokenValidationGuard, publisherGuard],
    component: PublisherDashboardComponent,
    children: [
      { path: 'home', component: PublisherDashboardIndexComponent, canActivate: [completeProfileGuard] },
      { path: 'requests', component: PublisherRequestsComponent, canActivate: [completeProfileGuard] },
      { path: 'contracts', component: PublisherContractsComponent, canActivate: [completeProfileGuard] },
      { path: 'projects', component: PublisherProjectsComponent, canActivate: [completeProfileGuard] },
      { path: 'projects/:id', component: PublisherProjectComponent, canActivate: [completeProfileGuard] },
      { path: 'team', component: TeamComponent, canActivate: [completeProfileGuard] },
      { path: 'tasks', component: TasksComponent, canActivate: [completeProfileGuard] },
      { path: 'contract-template', component: ContarctTemplateEditorComponent, canActivate: [completeProfileGuard] },
      { path: 'evaluations', component: PublisherRequestEvaluationsComponent, canActivate: [completeProfileGuard] },
      { path: 'complete-profile', component: PublisherProfileEditorComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
  {
    path: 'admin-dashboard',
    canActivate: [tokenValidationGuard, adminGuard],
    component: AdminDashboardComponent,
    children: [
      { path: '', component: AdminDashboardIndexComponent },
      { path: 'profile', component: AdminProfileComponent },
    ],
  },
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '**', component: HomeComponent },
];
