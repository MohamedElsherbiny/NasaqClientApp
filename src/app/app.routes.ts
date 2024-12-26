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
      { path: '', component: AuthorDashboardIndexComponent },
      { path: 'requests', component: AuthorRequestsComponent },
      { path: 'books', component: AuthorBooksComponent },
      { path: 'projects', component: AuthorProjectsComponent },
      { path: 'publishers', component: PublishersComponent },
    ],
  }, {
    path: 'publisher-dashboard',
    canActivate: [tokenValidationGuard, publisherGuard],
    component: PublisherDashboardComponent,
    children: [
      { path: '', component: PublisherDashboardIndexComponent },
      { path: 'requests', component: PublisherRequestsComponent },
      { path: 'projects', component: PublisherProjectsComponent },
      { path: 'team', component: TeamComponent },
      { path: 'tasks', component: TasksComponent },
      { path: 'evaluations', component: PublisherRequestEvaluationsComponent },
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
