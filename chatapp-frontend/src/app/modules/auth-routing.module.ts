import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthTabsComponent } from '../components/auth-tabs/auth-tabs.component';

const rountes:Routes =[
  {
    path:'',
    component:AuthTabsComponent
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(rountes)],
  exports:[RouterModule]
})
export class AuthRoutingModule { }
