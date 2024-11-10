import { Component } from '@angular/core';
import { CompanySignupComponent } from "./company-signup/company-signup.component";

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CompanySignupComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

}
