import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { PostRepliesPageComponent } from './pages/post-replies-page/post-replies-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { MyPostsPageComponent } from './pages/my-posts-page/my-posts-page.component';
import { EditProfilePageComponent } from './pages/edit-profile-page/edit-profile-page.component';
import { TagPostsPageComponent } from './pages/tag-posts-page/tag-posts-page.component';

export const routes: Routes = [
    { path: 'home', component: HomePageComponent},
    { path: '', redirectTo: 'home', pathMatch: 'full'},
    { path: 'posts/:postId', component: PostRepliesPageComponent },
    { path: 'login', component: LoginPageComponent},
    { path: 'register', component: RegisterPageComponent},
    { path: 'my-posts', component: MyPostsPageComponent},
    { path: 'edit-profile', component: EditProfilePageComponent },
    { path: 'posts/tag/:tag', component: TagPostsPageComponent },
];
