import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile-banner',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './profile-banner.component.html',
  styleUrl: './profile-banner.component.css'
})
export class ProfileBannerComponent implements OnInit {
  profile: any = null
  profileImgUrl: string = '...'
  loggedIn: boolean = false

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getProfile().subscribe((response) => {
      this.profile = response

      if (this.profile) {
        this.loggedIn = true
        this.profileImgUrl = `http://localhost:9191/api/users/images/${this.profile.imgName}`
      }
    })
  }
}
