import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { PostRepliesPageComponent } from './pages/post-replies-page/post-replies-page.component';

export const routes: Routes = [
    { path: 'home', component: HomePageComponent},
    { path: '', redirectTo: 'home', pathMatch: 'full'},
    { path: 'posts/:postId', component: PostRepliesPageComponent },
];
