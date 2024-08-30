import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TweetService } from '../../services/tweet.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { catchError, forkJoin, of } from 'rxjs';

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

  constructor(private tweetService: TweetService, private router: Router) {}

  ngOnInit(): void {
    console.log(this.posts)
    if (this.posts.length === 0) {
      this.loadPosts(); // Load posts if none are provided
    } else {
      this.loadAuthors(); // Load authors if posts are provided
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['posts']) {
      if (this.posts.length > 0) {
        this.loadAuthors();
      } else {
        this.loadPosts(); // Load posts if none are provided
      }
    }
  }

  loadPosts() {
    this.tweetService.getAllPosts().subscribe((response) => {
      this.posts = response;
      this.loadAuthors();
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
}
