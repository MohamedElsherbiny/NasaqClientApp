import { Routes } from '@angular/router';
import { CorporateDashboardComponent } from './pages/corporate-dashboard/corporate-dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { CompanyProfileComponent } from './pages/corporate-dashboard/components/company-profile/company-profile.component';
import { HelpSupportComponent as CorporateHelpSupportComponent } from './pages/corporate-dashboard/components/help-support/help-support.component';
import { HelpSupportComponent as PersonalHelpSupportComponent } from './pages/personal-dashboard/components/help-support/help-support.component';
import { ServiceProviderComponent } from './pages/corporate-dashboard/components/service-provider/service-provider.component';
import { OrderManagementComponent } from './pages/corporate-dashboard/components/order-management/order-management.component';
import { TeamManagementComponent } from './pages/corporate-dashboard/components/team-management/team-management.component';
import { PersonalDashboardComponent } from './pages/personal-dashboard/personal-dashboard.component';
import { DashboardComponent as PersonalDashboardIndexComponent } from './pages/personal-dashboard/components/dashboard/dashboard.component';
import { DashboardComponent as CorporateDashboardIndexComponent } from './pages/corporate-dashboard/components/dashboard/dashboard.component';
import { DashboardComponent as AdminDashboardIndexComponent } from './pages/admin-dashboard/components/dashboard/dashboard.component';
import { ProfileComponent } from './pages/personal-dashboard/components/profile/profile.component';
import { RequestToJoinInstitutionComponent } from './pages/personal-dashboard/components/request-to-join-institution/request-to-join-institution.component';
import { MyRequestsComponent } from './pages/personal-dashboard/components/my-requests/my-requests.component';
import { TaskManagementComponent } from './pages/personal-dashboard/components/task-management/task-management.component';
import { LoginComponent } from './pages/login/login.component';
import { tokenValidationGuard } from './shared/core/guards/token-validation.guard';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AdminProfileComponent } from './pages/admin-dashboard/components/admin-profile/admin-profile.component';
import { adminGuard } from './shared/core/guards/admin.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    {
        path: 'corporate-dashboard',
        component: CorporateDashboardComponent,
        canActivate: [tokenValidationGuard],
        children: [
            { path: '', component: CorporateDashboardIndexComponent },
            { path: 'company-profile', component: CompanyProfileComponent },
            { path: 'help-support', component: CorporateHelpSupportComponent },
            { path: 'service-provider', component: ServiceProviderComponent },
            { path: 'order-management', component: OrderManagementComponent },
            { path: 'team-management', component: TeamManagementComponent },
        ]
    },
    {
        path: 'personal-dashboard',
        canActivate: [tokenValidationGuard],
        component: PersonalDashboardComponent,
        children: [
            { path: '', component: PersonalDashboardIndexComponent },
            { path: 'profile', component: ProfileComponent },
            { path: 'help-support', component: PersonalHelpSupportComponent },
            { path: 'request-to-join-institution', component: RequestToJoinInstitutionComponent },
            { path: 'my-requests', component: MyRequestsComponent },
            { path: 'task-management', component: TaskManagementComponent },
        ]
    },
    {
        path: 'admin-dashboard',
        canActivate: [tokenValidationGuard, adminGuard],
        component: AdminDashboardComponent,
        children: [
            { path: '', component: AdminDashboardIndexComponent },
            { path: 'profile', component: AdminProfileComponent },
        ]
    },
    { path: '', redirectTo: '/', pathMatch: 'full' },
    { path: '**', component: HomeComponent },
];
