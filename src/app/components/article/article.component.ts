import { Component, Input } from '@angular/core';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { ActionSheetController, Platform } from '@ionic/angular';

import { Article } from 'src/app/interfaces';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent {
  @Input() article: Article | null = null;
  @Input() i: number = 0;

  constructor(
    private iab: InAppBrowser,
    private platform: Platform,
    private actionSheetCtr: ActionSheetController,
    private socialSharing: SocialSharing,
    private storageService: StorageService
  ) {}

  public async onOpenMenu(): Promise<void> {
    if (!this.article) {
      return;
    }

    const articleInFavorite = this.storageService.articleInFavorite(
      this.article
    );

    const normalBts = [
      {
        text: !articleInFavorite ? 'Favorito' : 'Remover Favorito',
        icon: !articleInFavorite ? 'heart-outline' : 'heart',
        handler: () => this.onToggleFavorite(),
      },
      {
        text: 'Cancelar',
        role: 'cancel',
        icon: 'close-outline',
      },
    ];

    const share = {
      text: 'Compartir',
      icon: 'share-outline',
      handler: () => this.onShareArticle(),
    };

    if (this.platform.is('capacitor')) {
      normalBts.unshift(share);
    }

    const actionSheet = await this.actionSheetCtr.create({
      header: 'Options',
      buttons: normalBts,
    });

    await actionSheet.present();
  }

  public openArticle(): void {
    if (!this.article) {
      return;
    }

    if (this.platform.is('ios') || this.platform.is('android')) {
      const browser = this.iab.create(this.article.url);
      browser.show();

      return;
    }

    window.open(this.article.url, '_blank');
  }

  public onShareArticle() {
    if (!this.article) {
      return;
    }

    this.socialSharing.share(
      this.article.title,
      this.article.source.name,
      undefined,
      this.article.url
    );
  }

  public onToggleFavorite() {
    if (!this.article) {
      return;
    }

    this.storageService.saveRemoveArticle(this.article);
  }
}
