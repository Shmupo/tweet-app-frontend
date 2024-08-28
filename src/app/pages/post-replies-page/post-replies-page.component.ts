import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TweetService } from '../../services/tweet.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReplyCreateComponent } from '../../components/reply-create/reply-create.component';

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
  replies: any[] = [];

  constructor(private tweetService: TweetService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const postIdParam = params.get('postId');
      this.postId = postIdParam !== null ? +postIdParam : -1;

      if (this.postId !== -1) {
        this.loadPostData();
      } else {
        console.log("No valid post found");
      }
    });
  }

  loadPostData() {
    this.tweetService.getPostById(this.postId).subscribe((response) => {
      this.post = response;
    });
    this.tweetService.getPostReplies(this.postId).subscribe((response) => {
      this.replies = response;
    });
  }
}
