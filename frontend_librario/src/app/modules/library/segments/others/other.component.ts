import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CategoryListPage } from './category-list/category-list.page';
import { TagListPage } from './tag-list/tag-list.page';

@Component({
  selector: 'app-other',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtherComponent implements OnInit {
  public modalController = inject(ModalController);

  constructor() {}

  ngOnInit() {}

  public async openCategories(): Promise<void> {
    const modal = await this.modalController.create({
      component: CategoryListPage,
    });
    await modal.present();
  }

  public async openTags(): Promise<void> {
    const modal = await this.modalController.create({
      component: TagListPage,
    });
    await modal.present();
  }
}
