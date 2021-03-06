import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-login-user',
  templateUrl: './login-user.component.html',
  styleUrls: ['./login-user.component.css']
})
export class LoginUserComponent implements OnInit {
  userType;
  valid;
  loginForm: FormGroup;
  constructor(
    public userServ: UserService,
    public authServ:AuthService,
    private router: Router,
    private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([
        Validators.pattern('^[_A-Za-z0-9-]+(\\.[_A-Za-z0-9-]{0,10})*@[A-Za-z0-9]+(\\.[A-Za-z0-9]{0,10})*(\\.[A-Za-z]{0,5})$'),
        Validators.required])],
      password: ['', Validators.required]
    });
  }


  ngOnInit() { 
    }

  /**
 * Navigation
 * @param path: string; ;
 */
  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  onItemChange(value) {
    this.userType = value;
  }

  /**
  * Login function
  */
  loginUser() {
    if (this.loginForm.valid) {
      if (this.userType == "Stuff") {
        this.userServ.stuffLogin(this.loginForm.value).subscribe(res => {
          this.valid = false;
          this.authServ.login("ROLE_STUFF");
          this.userServ.setUserData(res);
          this.navigateTo("home/teacher");
        },
          error => {
            console.log(error);
            this.valid = true;
          });
      } else {
        this.userServ.teacherLogin(this.loginForm.value).subscribe(res => {
          console.log(res)
          this.valid = false;
          console.log(res)
          this.authServ.login("ROLE_TEACHER");
          this.userServ.setUserData(res);
          this.navigateTo("home/offers");
        },
          error => {
            console.log(error);
            this.valid = true;
          });
      }
    }
  }
}
