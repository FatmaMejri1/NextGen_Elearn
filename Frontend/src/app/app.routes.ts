import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing';
import { PurchaseComponent } from './pages/purchase/purchase';
import { AdminComponent } from './pages/admin/admin';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'purchase', component: PurchaseComponent },
  { path: 'admin', component: AdminComponent },
  { path: '**', redirectTo: '' }
];
