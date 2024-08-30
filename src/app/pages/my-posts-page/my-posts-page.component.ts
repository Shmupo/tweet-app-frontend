import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TweetService } from '../../services/tweet.service';
import { CommonModule } from '@angular/common';
import { ProfileBannerComponent } from '../../components/profile-banner/profile-banner.component';
import { TweetListComponent } from '../../components/tweet-list/tweet-list.component';

@Component({
  selector: 'app-my-posts-page',
  standalone: true,
  imports: [
    CommonModule,
    ProfileBannerComponent,
    TweetListComponent
  ],
  templateUrl: './my-posts-page.component.html',
  styleUrls: ['./my-posts-page.component.css']
})
export class MyPostsPageComponent implements OnInit {
  profile: any = null;
  loggedIn: boolean = false;
  posts: any[] = [];

  constructor(private tweetService: TweetService, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getProfile().subscribe((response) => {
      this.profile = response;

      if (this.profile) {
        this.loggedIn = true;

        this.tweetService.getPostByUserId(this.profile.id).subscribe((response) => {
          this.posts = response;
        });
      }
    });
  }
}
