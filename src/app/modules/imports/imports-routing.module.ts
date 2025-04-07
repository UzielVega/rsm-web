import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImportsComponent } from './imports.component';
import { UploadFileComponent } from './pages/upload-file/upload-file.component';

const routes: Routes = [
  {
    path: '', 
    component: ImportsComponent,
    children:[
      {
        path:'upload-file',
        component:UploadFileComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImportsRoutingModule { }
