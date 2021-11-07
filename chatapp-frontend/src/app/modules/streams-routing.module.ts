import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { StreamsComponent } from '../components/streams/streams.component';
import { AuthGuard } from '../services/auth.guard';
import { CommentsComponent } from '../components/comments/comments.component';
import { PeopleComponent } from '../components/people/people.component';
import { FollowingComponent } from '../components/following/following.component';
import { FollowersComponent } from '../components/followers/followers.component';
import { NotificationsComponent } from '../components/notifications/notifications.component';
import { ChatComponent } from '../components/chat/chat.component';
import { ImagesComponent } from '../components/images/images.component';
import { ViewUserComponent } from '../components/view-user/view-user.component';
import { ChangePasswordComponent } from '../components/change-password/change-password.component';

const rountes:Routes =[
  {
    path:'streams',
    component:StreamsComponent,
    canActivate:[AuthGuard]
  },{
    path:'post/:id',
    component:CommentsComponent,
    canActivate:[AuthGuard]
  },{
    path:'people',
    component:PeopleComponent,
    canActivate:[AuthGuard]
  },{
    path:'people/following',
    component:FollowingComponent,
    canActivate:[AuthGuard]
  },{
    path:'people/followers',
    component:FollowersComponent,
    canActivate:[AuthGuard]
  },{
    path:'notifications',
    component:NotificationsComponent,
    canActivate:[AuthGuard]
  },{
    path:'chat/:name',
    component:ChatComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'images/:name',
    component: ImagesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: ':name',
    component: ViewUserComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'account/password',
    component: ChangePasswordComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo:'streams'
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule,RouterModule.forRoot(rountes)],
  exports:[RouterModule],
})
export class StreamsRoutingModule { }
