import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TweetListComponent } from '../../components/tweet-list/tweet-list.component';
import { TweetCreateComponent } from '../../components/tweet-create/tweet-create.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    TweetCreateComponent,
    TweetListComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

}
