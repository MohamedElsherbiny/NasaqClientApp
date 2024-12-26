import { Component } from '@angular/core';
import { CompanySignupComponent } from "./company-signup/company-signup.component";
import { AuthorSignupComponent } from "./author-signup/author-signup.component";

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CompanySignupComponent, AuthorSignupComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

}
