import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TweetService } from '../../services/tweet.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { catchError, forkJoin, of } from 'rxjs';
import { TweetLikesService } from '../../services/tweet-likes.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-tweet-list',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './tweet-list.component.html',
  styleUrls: ['./tweet-list.component.css']
})
export class TweetListComponent implements OnInit, OnChanges {
  @Input() posts: any[] = [];
  authors: string[] = [];
  likes: number[] = [];
  userLikes: boolean[] = [];
  profile: any = null;

  constructor(private tweetService: TweetService, 
    private router: Router,
    private tweetLikeService: TweetLikesService,
    private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getProfile().subscribe((response) => {
      this.profile = response;
      this.initializeComponent();
    });
  }
  
  initializeComponent(): void {
    if (this.posts.length === 0) {
      this.loadPosts(); // Load posts if none are provided
    } else {
      this.loadAuthors(); // Load authors if posts are provided
      this.loadLikeCounts();
      this.loadUserLikes();
    }
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['posts']) {
      if (this.posts.length > 0) {
        this.loadAuthors();
        this.loadLikeCounts();
        this.loadUserLikes();
      } else {
        this.loadPosts(); // Load posts if none are provided
      }
    }
  }

  loadPosts() {
    this.tweetService.getAllPosts().subscribe((response) => {
      this.posts = response;
      this.loadAuthors();
      this.loadLikeCounts();
      this.loadUserLikes();
    });
  }

  // maps authors to the postId to maintain correct order
  loadAuthors() {
    const authorRequests = this.posts.map(post => 
      this.tweetService.getUsernameOfUserId(post.userId)
        .pipe(
          catchError((error) => {
            console.log(`Could not find user with ID ${post.userId}`)
            return of('USER NOT FOUND');
          })
        )
    );

    forkJoin(authorRequests).subscribe((authorResponses) => {
      this.authors = authorResponses;
    });
  }

  // maps like count to posts
  loadLikeCounts() {
    const likesRequest = this.posts.map(post => 
      this.tweetLikeService.getPostLikeCount(post.id)
        .pipe(
          catchError((error) => {
            console.log(`Could not find post with id: ${post.id}`);
            return of(0); // Return 0 likes if there's an error
          })
        )
    );

    forkJoin(likesRequest).subscribe({
      next: (likeResponses) => {
        this.likes = likeResponses;
        console.log('Like counts loaded:', this.likes);
      },
      error: (err) => {
        console.error('An error occurred while loading like counts:', err);
      }
    });
  }

    // maps current user like to posts
  loadUserLikes() {
    if (this.profile && this.posts.length > 0) {
      const likesRequest = this.posts.map(post => 
        this.tweetLikeService.doesUserLikePost(this.profile.id, post.id)
          .pipe(
            catchError((error) => {
              console.log(`Could not find post with id and user ID: ${post.id} + ${this.profile.id}`);
              return of(false);
            })
          )
      );
    
      forkJoin(likesRequest).subscribe({
        next: (likeResponse) => {
          this.userLikes = likeResponse;
          console.log('User Likes:', this.userLikes);
        },
        error: (err) => {
          console.error('An error occurred:', err);
        }
      });
    } else {
      console.log('Profile or posts not loaded, cannot load user likes.');
    }
  }

  async userLikePost(postId: number, index: number) {
    if (!this.profile) {
      console.log("Must be logged in to like a post");
      return;
    }
  
    console.log(`Liking post: ${postId}, Profile Id: ${this.profile.id}`);
  
    try {
      const userAlreadyLikesPost = await this.tweetLikeService.doesUserLikePost(this.profile.id, postId).toPromise();
  
      if (!userAlreadyLikesPost) {
        await this.tweetLikeService.createUserLikePost(this.profile.id, postId).toPromise();
        this.userLikes[index] = true
        this.likes[index] += 1
        console.log("Post liked successfully");
      } else {
        console.log("Cannot like an already liked post");
      }
    } catch (error) {
      console.error("An error occurred while liking the post:", error);
    }
  }

  async userUnlikePost(postId: number, index: number) {
    if (!this.profile) {
      console.log("Must be logged in to like a post");
      return;
    }

    console.log(`Liking post: ${postId}, Profile Id: ${this.profile.id}`);

    try {
      const userAlreadyLikesPost = await this.tweetLikeService.doesUserLikePost(this.profile.id, postId).toPromise();

      if (userAlreadyLikesPost) {
        await this.tweetLikeService.deleteUserLikePost(this.profile.id, postId).toPromise();
        this.userLikes[index] = false
        this.likes[index] -= 1
        console.log("Post unliked successfully");
      } else {
        console.log("Cannot unlike a not liked post");
      }
    } catch (error) {
      console.error("An error occurred while unliking the post:", error);
    }
  }
}
