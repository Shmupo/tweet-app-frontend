import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProfileBannerComponent } from '../../components/profile-banner/profile-banner.component';
import { TweetListComponent } from '../../components/tweet-list/tweet-list.component';
import { TweetService } from '../../services/tweet.service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tag-posts-page',
  standalone: true,
  imports: [
    CommonModule,
    ProfileBannerComponent,
    TweetListComponent
  ],
  templateUrl: './tag-posts-page.component.html',
  styleUrl: './tag-posts-page.component.css'
})
export class TagPostsPageComponent {
  profile: any = null;
  tag: String = ""
  loggedIn: boolean = false;
  posts: any[] = [];

  // for error messages to user
  alertClass = "";
  responseMessage: string = ''

  constructor(
    private tweetService: TweetService, 
    private authService: AuthService, 
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // getting tag from url
    this.route.paramMap.subscribe(params => {
      this.tag = params.get('tag') || '';
      this.loadPostsByTag();
    });

    this.authService.getProfile().subscribe((response) => {
      this.profile = response;

      if (this.profile) {
        this.loggedIn = true;
      }
    });
  }

  loadPostsByTag() {
    this.tweetService.getAllPostsByTag(this.tag).subscribe((response) => {
      console.log("potato")
      this.posts = response
      if (this.posts.length === 0) {
        this.responseMessage = 'No posts found with this tag. Be the first to use it!'
        this.alertClass = "alert-warning"
      }
    }, (err) => {
      this.responseMessage = 'Error retrieving posts. Try again later.'
      this.alertClass = "alert-danger"
    }); 
  }

}
