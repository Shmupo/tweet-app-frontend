import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ProfileImageService } from '../../services/profile-image.service';

@Component({
  selector: 'app-edit-profile-page',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './edit-profile-page.component.html',
  styleUrl: './edit-profile-page.component.css'
})
export class EditProfilePageComponent {
  profile: any = null;
  profileImgUrl: string = '';
  loggedIn: boolean = false;

  images = [
    "default-profile.jpg",
    "bmo-profile.jpg",
    "peter-profile.jpg"
  ]

  apiUrl: string = "http://localhost:9191/api/users/images/"
  selectedImage: string | null = null;

  constructor(private authService: AuthService,
    private profileImageService: ProfileImageService) {}

  ngOnInit() {
    this.authService.getProfile().subscribe((response) => {
      this.profile = response

      if (this.profile) {
        this.loggedIn = true
        this.profileImgUrl = `${this.apiUrl}${this.profile.imgName}`
      }
    })
  }

  selectImage(image: string) {
    this.selectedImage = image;
  }

  updateProfile(): void {
    //console.log(this.selectedImage)
    if (this.selectedImage) {
      this.profileImageService.updateUserImage(this.selectedImage).subscribe({
        next: () => {
          alert('Profile image updated successfully!');
          window.location.reload();
        },
        error: (error) => {
          console.error('Update failed:', error);
          alert('Failed to update profile image. Please try again.');
        }
      });
    } else {
      alert('No image selected to update.');
    }
  }
}
