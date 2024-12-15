import { Routes } from '@angular/router';
import { CorporateDashboardComponent } from './pages/corporate-dashboard/corporate-dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { CompanyProfileComponent } from './pages/corporate-dashboard/components/company-profile/company-profile.component';
import { HelpSupportComponent as CorporateHelpSupportComponent } from './pages/corporate-dashboard/components/help-support/help-support.component';
import { HelpSupportComponent as PersonalHelpSupportComponent } from './pages/personal-dashboard/components/help-support/help-support.component';
import { ServiceProviderComponent } from './pages/corporate-dashboard/components/team-management/service-provider/service-provider.component';
import { OrderManagementComponent } from './pages/corporate-dashboard/components/order-management/order-management.component';
import { TeamManagementComponent } from './pages/corporate-dashboard/components/team-management/team-management.component';
import { PersonalDashboardComponent } from './pages/personal-dashboard/personal-dashboard.component';
import { DashboardComponent as PersonalDashboardIndexComponent } from './pages/personal-dashboard/components/dashboard/dashboard.component';
import { DashboardComponent as CorporateDashboardIndexComponent } from './pages/corporate-dashboard/components/dashboard/dashboard.component';
import { DashboardComponent as AdminDashboardIndexComponent } from './pages/admin-dashboard/components/dashboard/dashboard.component';
import { DashboardComponent as AuthorDashboardIndexComponent } from './pages/author-dashboard/components/dashboard/dashboard.component';
import { DashboardComponent as PublisherDashboardIndexComponent } from './pages/publisher-dashboard/components/dashboard/dashboard.component';
import { ProfileComponent } from './pages/personal-dashboard/components/profile/profile.component';
import { TaskManagementComponent } from './pages/corporate-dashboard/components/task-management/task-management.component';
import { LoginComponent } from './pages/login/login.component';
import { tokenValidationGuard } from './shared/core/guards/token-validation.guard';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AdminProfileComponent } from './pages/admin-dashboard/components/admin-profile/admin-profile.component';
import { adminGuard } from './shared/core/guards/admin.guard';
import { publisherGuard } from './shared/core/guards/publisher.guard';
import { authorGuard } from './shared/core/guards/author.guard';
import { ConfirmEmailComponent } from './pages/confirm-email/confirm-email.component';
import { MyOrdersComponent } from './pages/personal-dashboard/components/my-orders/my-orders.component';
import { OrderEditorComponent } from './pages/personal-dashboard/components/my-orders/order-editor/order-editor.component';
import { MyBooksComponent } from './pages/personal-dashboard/components/my-books/my-books.component';
import { BookEditorComponent } from './pages/personal-dashboard/components/my-books/book-editor/book-editor.component';
import { ProjectManagementComponent as CorporateProjectManagementComponent } from './pages/corporate-dashboard/components/project-management/project-management.component';
import { ProjectManagementComponent as PersonalProjectManagementComponent } from './pages/personal-dashboard/components/project-management/project-management.component';
import { ProjectEditorComponent } from './pages/corporate-dashboard/components/project-management/project-editor/project-editor.component';
import { ProjectDetailsComponent } from './pages/personal-dashboard/components/project-management/project-details/project-details.component';
import { AuthorDashboardComponent } from './pages/author-dashboard/author-dashboard.component';
import { AuthorRequestsComponent } from './pages/author-dashboard/components/author-requests/author-requests.component';
import { AuthorRequestEditorComponent } from './pages/author-dashboard/components/author-requests/author-request-editor/author-request-editor.component';
import { AuthorBooksComponent } from './pages/author-dashboard/components/author-books/author-books.component';
import { AuthorBookEditorComponent } from './pages/author-dashboard/components/author-books/author-book-editor/author-book-editor.component';
import { AuthorProjectsComponent } from './pages/author-dashboard/components/author-projects/author-projects.component';
import { PublisherDashboardComponent } from './pages/publisher-dashboard/publisher-dashboard.component';
import { PublisherRequestsComponent } from './pages/publisher-dashboard/components/publisher-requests/publisher-requests.component';
import { PublisherProjectsComponent } from './pages/publisher-dashboard/components/publisher-projects/publisher-projects.component';
import { TeamComponent } from './pages/publisher-dashboard/components/team/team.component';
import { PublishersComponent } from './pages/author-dashboard/components/publishers/publishers.component';
import { TasksComponent } from './pages/publisher-dashboard/components/tasks/tasks.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'confirm-email', component: ConfirmEmailComponent },
  {
    path: 'corporate-dashboard',
    component: CorporateDashboardComponent,
    canActivate: [tokenValidationGuard, publisherGuard],
    children: [
      { path: '', component: CorporateDashboardIndexComponent },
      { path: 'company-profile', component: CompanyProfileComponent },
      { path: 'help-support', component: CorporateHelpSupportComponent },
      { path: 'service-provider', component: ServiceProviderComponent },
      { path: 'order-management', component: OrderManagementComponent },
      { path: 'project-management', component: CorporateProjectManagementComponent },
      {
        path: 'project-management/project-editor/:projectId',
        component: ProjectEditorComponent,
      },
      { path: 'task-management', component: TaskManagementComponent },
      { path: 'team-management', component: TeamManagementComponent },
    ],
  },
  {
    path: 'personal-dashboard',
    canActivate: [tokenValidationGuard, authorGuard],
    component: PersonalDashboardComponent,
    children: [
      { path: '', component: PersonalDashboardIndexComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'help-support', component: PersonalHelpSupportComponent },
      { path: 'my-orders', component: MyOrdersComponent },
      { path: 'new-order', component: OrderEditorComponent },
      { path: 'my-books', component: MyBooksComponent },
      { path: 'new-book', component: BookEditorComponent },
      { path: 'update-order', component: OrderEditorComponent },
      { path: 'project-management/project-details/:projectId', component: ProjectDetailsComponent },
      { path: 'project-management', component: PersonalProjectManagementComponent },
    ],
  },
  {
    path: 'author-dashboard',
    canActivate: [tokenValidationGuard, authorGuard],
    component: AuthorDashboardComponent,
    children: [
      { path: '', component: AuthorDashboardIndexComponent },
      { path: 'profile', component: ProfileComponent },
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
