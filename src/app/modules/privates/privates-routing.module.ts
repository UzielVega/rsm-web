import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrivatesMainComponent } from './pages/privates-main/privates-main.component';
import { StreetsComponent } from './pages/streets/streets.component';
import { HousesComponent } from './pages/houses/houses.component';
import { ResidentsComponent } from './pages/residents/residents.component';
import { VehiclesComponent } from './pages/vehicles/vehicles.component';

const routes: Routes = [
  {
    path: '',
    component: PrivatesMainComponent,
    children: [
      {
        path: 'streets',
        component: StreetsComponent,
      },
      {
        path: 'houses',
        component: HousesComponent,
      },
      {
        path: 'residents',
        component: ResidentsComponent,
      },
      {
        path: 'vehicles',
        component: VehiclesComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrivatesRoutingModule {}
