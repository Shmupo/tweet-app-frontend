import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TweetListComponent } from '../../components/tweet-list/tweet-list.component';
import { TweetCreateComponent } from '../../components/tweet-create/tweet-create.component';
import { ProfileBannerComponent } from '../../components/profile-banner/profile-banner.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    TweetCreateComponent,
    TweetListComponent,
    ProfileBannerComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  profile: any = null
  loggedIn: boolean = false;

  constructor(private authService: AuthService) {
    authService.getProfile().subscribe((response) => {
      this.profile = response

      if (this.profile) {
        this.loggedIn = true
      }
    })
  }
}
