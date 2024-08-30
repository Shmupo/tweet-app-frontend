import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';  // Import NgForm
import { Post } from '../../models/post.model';
import { TweetService } from '../../services/tweet.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-tweet-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './tweet-create.component.html',
  styleUrls: ['./tweet-create.component.css']  // Fix styleUrls typo
})
export class TweetCreateComponent {
  post: Post = new Post();
  profile: any = null
  loggedIn: boolean = false

  constructor(private tweetService: TweetService, private authService: AuthService) {
    authService.getProfile().subscribe((response) => {
      this.profile = response

      if (this.profile) {
        this.loggedIn = true
      }
    })
  }

  onSubmitHandler(postCreateForm: NgForm) {  // Accept the form object (NgForm)
    this.post.userId = this.profile.id
    if (postCreateForm.valid) {  // Check the form's validity
      console.log("Submitting...");
      console.log(this.post);  // Log the post object
      this.tweetService.createPost(this.post).subscribe(
        response => {
          alert("Post created successfully!");
          postCreateForm.resetForm();  // Reset the form after submission
          this.post = new Post();  // Reset the post object
        },
        error => {
          alert("Error creating post.");
          console.log("Error creating post:", error);
        }
      );
    } else {
      console.log("Form invalid:");
      console.log(postCreateForm);  // Log the form object
    }
  }
}
