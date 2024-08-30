import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TweetService } from '../../services/tweet.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReplyCreateComponent } from '../../components/reply-create/reply-create.component';
import { AuthService } from '../../services/auth.service';
import { catchError, forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-post-replies-page',
  standalone: true,
  imports: [
    CommonModule,
    ReplyCreateComponent,
  ],
  templateUrl: './post-replies-page.component.html',
  styleUrls: ['./post-replies-page.component.css']
})
export class PostRepliesPageComponent implements OnInit {
  @Input() postId: number = -1;
  post: any;
  postAuthor: any;
  replies: any[] = [];
  repliesAuthors: any[] = [];

  profile: any = null
  loggedIn: boolean = false;

  constructor(private tweetService: TweetService, private route: ActivatedRoute, private authService: AuthService) {
    authService.getProfile().subscribe((response) => {
      this.profile = response

      if (this.profile) {
        this.loggedIn = true
      }
    })
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const postIdParam = params.get('postId');
      this.postId = postIdParam !== null ? +postIdParam : -1;

      if (this.postId !== -1) {
        this.loadPostsAndRepliesAndAuthors();
      } else {
        console.log("No valid post found");
      }
    });
  }

  loadPostsAndRepliesAndAuthors() {
    // Load post and post author
    this.tweetService.getPostById(this.postId).pipe(
      catchError((error) => {
        console.error(`Error fetching post with ID ${this.postId}:`, error);
        return of(null);
      })
    ).subscribe((postResponse) => {
      this.post = postResponse;

      if (this.post) {
        this.tweetService.getUsernameOfUserId(this.post.userId)
          .pipe(
            catchError((error) => {
              console.error(`Error finding user with ID ${this.post.userId}:`, error);
              return of('USER NOT FOUND');
            })
          )
          .subscribe((authorResponse) => {
            this.postAuthor = authorResponse;
          });
      }
    });

    // Load replies and reply authors
    this.tweetService.getPostReplies(this.postId).pipe(
      catchError((error) => {
        console.error(`Error fetching replies for post ID ${this.postId}:`, error);
        return of([]);
      })
    ).subscribe((repliesResponse) => {
      this.replies = repliesResponse;

      const authorRequests = this.replies.map(reply => 
        this.tweetService.getUsernameOfUserId(reply.userId)
          .pipe(
            catchError((error) => {
              console.error(`Error finding user with ID ${reply.userId}:`, error);
              return of('USER NOT FOUND');
            })
          )
      );

      forkJoin(authorRequests).subscribe((authorsResponses) => {
        this.repliesAuthors = authorsResponses;
      });
    });
  }

}
