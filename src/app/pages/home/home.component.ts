import { Component } from '@angular/core';
import { LoginComponent } from "../../shared/components/auth/login/login.component";
import { SignupComponent } from "../../shared/components/auth/signup/signup.component";
import { TopCompaniesComponent } from "./top-companies/top-companies.component";
import { PopularCategoriesComponent } from "./popular-categories/popular-categories.component";
import { OurBlogComponent } from "./our-blog/our-blog.component";
import { BannerComponent } from "./banner/banner.component";
import { HowItWorkComponent } from "./how-it-work/how-it-work.component";
import { NavbarComponent } from "../../shared/components/navbar/navbar.component";
import { FooterComponent } from "../../shared/components/footer/footer.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    LoginComponent,
    SignupComponent,
    TopCompaniesComponent,
    PopularCategoriesComponent,
    OurBlogComponent,
    BannerComponent,
    HowItWorkComponent,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {


}
