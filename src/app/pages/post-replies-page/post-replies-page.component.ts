import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TweetService } from '../../services/tweet.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReplyCreateComponent } from '../../components/reply-create/reply-create.component';
import { AuthService } from '../../services/auth.service';
import { catchError, forkJoin, of } from 'rxjs';
import { TweetLikesService } from '../../services/tweet-likes.service';

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

  likes: number = 0;
  userLike: boolean = false;

  profile: any = null
  loggedIn: boolean = false;

  constructor(private tweetService: TweetService, 
    private route: ActivatedRoute, 
    private authService: AuthService,
    private tweetLikeService: TweetLikesService) {
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

    this.authService.getProfile().subscribe((response) => {
      this.profile = response;

      if (this.profile) {  
        this.loggedIn = true;
        this.loadUserLike();
        this.loadLikeCounts();
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
          
        this.loadLikeCounts();
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
  
  loadLikeCounts() {
    if (this.post) {
      this.tweetLikeService.getPostLikeCount(this.post.id).pipe(
        catchError((error) => {
          console.error(`Error fetching like count for post ID ${this.post.id}:`, error);
          return of(0); // Return a default value on error
        })
      ).subscribe((response) => {
        this.likes = response;
      });
    }
  }
  
  loadUserLike() {
    if (this.profile && this.post) {
      this.tweetLikeService.doesUserLikePost(this.profile.id, this.post.id).subscribe((response) => {
        this.userLike = response;
      });
    }
  }

  async userLikePost(postId: number) {
    if (!this.profile) {
      console.log("Must be logged in to like a post");
      return;
    }
  
    console.log(`Liking post: ${postId}, Profile Id: ${this.profile.id}`);
  
    try {
      const userAlreadyLikesPost = await this.tweetLikeService.doesUserLikePost(this.profile.id, postId).toPromise();
  
      if (!userAlreadyLikesPost) {
        await this.tweetLikeService.createUserLikePost(this.profile.id, postId).toPromise();
        this.userLike = true
        this.likes += 1
        console.log("Post liked successfully");
      } else {
        console.log("Cannot like an already liked post");
      }
    } catch (error) {
      console.error("An error occurred while liking the post:", error);
    }
  }

  async userUnlikePost(postId: number) {
    if (!this.profile) {
      console.log("Must be logged in to like a post");
      return;
    }

    console.log(`Liking post: ${postId}, Profile Id: ${this.profile.id}`);

    try {
      const userAlreadyLikesPost = await this.tweetLikeService.doesUserLikePost(this.profile.id, postId).toPromise();

      if (!userAlreadyLikesPost) {
        await this.tweetLikeService.deleteUserLikePost(this.profile.id, postId).toPromise();
        this.userLike = false
        this.likes -= 1
        console.log("Post unliked successfully");
      } else {
        console.log("Cannot unlike a not liked post");
      }
    } catch (error) {
      console.error("An error occurred while unliking the post:", error);
    }
  }
}
