import { PrimengModule } from './../../primeng/primeng.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TagsRoutingModule } from './tags-routing.module';
import { TagsComponent } from './tags.component';
import { CreateTagComponent } from './components/create-tag/create-tag.component';
import { UpdateTagComponent } from './components/update-tag/update-tag.component';
import { TableTagsComponent } from './components/table-tags/table-tags.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';


@NgModule({
  declarations: [
    TagsComponent,
    CreateTagComponent,
    UpdateTagComponent,
    TableTagsComponent
  ],
  imports: [
    CommonModule,
    PrimengModule,
    FormsModule,
    ReactiveFormsModule,
    TagsRoutingModule
  ],
  providers: [DialogService,ConfirmationService, MessageService],
})
export class TagsModule { }
