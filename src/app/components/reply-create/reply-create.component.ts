import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Reply } from '../../models/reply.model';
import { TweetService } from '../../services/tweet.service';

@Component({
  selector: 'app-reply-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './reply-create.component.html',
  styleUrl: './reply-create.component.css'
})
export class ReplyCreateComponent implements OnChanges {
  @Input() postId: number = -1;
  reply: Reply = new Reply();

  constructor(private tweetService: TweetService) {}

  ngOnChanges(changes: any) {
    if (changes['postId']) {
      console.log("PostId on Changes:", this.postId);
    }
  }

  onSubmitHandler(replyCreateForm: NgForm) {  // Accept the form object (NgForm)
    //console.log(this.postId)
    if (replyCreateForm.valid) {  // Check the form's validity
      console.log("Submitting...");
      console.log(this.reply);  // Log the post object
      this.reply.postId = this.postId;
      this.tweetService.createReply(this.postId, this.reply).subscribe(
        response => {
          alert("Reply created successfully!")
          replyCreateForm.reset();
          this.reply = new Reply()
        },
        error => {
          alert("Error creating reply.")
          console.log("Error creating reply: ", error)
        }
      );
    } else {
      console.log("Form invalid:");
      console.log(replyCreateForm);  // Log the form object
    }
  }
}