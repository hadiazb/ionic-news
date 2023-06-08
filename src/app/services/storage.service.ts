import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Article } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _storage: Storage | null = null;
  private _localArticles: Article[] = [];

  constructor(private storage: Storage) {
    this.init();
  }

  get getLocalArticles() {
    return [...this._localArticles];
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
    this.loadFavorites();
  }

  public async saveRemoveArticle(article: Article) {
    if (!this._storage) {
      return;
    }

    const exists = this._localArticles.find(
      (localArticle) => localArticle.title === article.title
    );

    if (exists) {
      this._localArticles = this._localArticles.filter(
        (localArticle) => localArticle.title !== article.title
      );
    } else {
      this._localArticles = [article, ...this._localArticles];
    }

    this._storage.set('articles', this._localArticles);
  }

  public async loadFavorites() {
    if (!this._storage) {
      return;
    }

    try {
      const articles = await this._storage.get('articles');
      this._localArticles = articles || [];
    } catch (error) {
      console.error(error);
    }
  }

  public articleInFavorite(article: Article) {
    return !!this._localArticles.find(
      (localArticle) => localArticle.title === article.title
    );
  }
}
