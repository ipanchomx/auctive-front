import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UnAuthGuard } from './global/guards/un-auth.guard';
import { SignUpComponent } from './pages/session/sign-up.component';

const routes: Routes = [
  { path: '', redirectTo: 'session', pathMatch: 'full' },
  { path: 'session', component: SignUpComponent, canActivate: [UnAuthGuard]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

