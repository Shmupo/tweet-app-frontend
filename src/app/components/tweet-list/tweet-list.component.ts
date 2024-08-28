import { Component } from '@angular/core';
import { TweetService } from '../../services/tweet.service';
import { Router } from '@angular/router';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-tweet-list',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './tweet-list.component.html',
  styleUrl: './tweet-list.component.css'
})
export class TweetListComponent {
  posts: any[] = [];

  constructor(private tweetService: TweetService, private router: Router) {
    this.tweetService.getAllPosts().subscribe((response) => {
      this.posts = response
    });
  }
}
