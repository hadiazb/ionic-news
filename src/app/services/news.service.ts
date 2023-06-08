import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  Article,
  ArticlesByCategoryAndPage,
  NewsResponse,
} from '../interfaces';
import { environment } from 'src/environments/environment';

const apiKey = environment.apiKey;
const apiNewsUrl = environment.apiNewsUrl;

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private articleByCategoryAndPage: ArticlesByCategoryAndPage = {};

  constructor(private http: HttpClient) {}

  public executeQuery(
    category: string = 'business',
    country: string = 'us',
    page: number = 0
  ): Observable<NewsResponse> {
    return this.http.get<NewsResponse>(apiNewsUrl, {
      params: {
        apiKey,
        category,
        country,
        page,
      },
    });
  }

  public getTopHeadlinesByCategory(
    category: string,
    loadMore: boolean = false
  ): Observable<Article[]> {
    if (loadMore) {
      return this.getArticlesByCategory(category);
    }

    if (this.articleByCategoryAndPage[category]) {
      return of(this.articleByCategoryAndPage[category].articles);
    }

    return this.getArticlesByCategory(category);
  }

  private getArticlesByCategory(category: string): Observable<Article[]> {
    if (Object.keys(this.articleByCategoryAndPage).includes(category)) {
      // ya existe
    } else {
      // no existe
      this.articleByCategoryAndPage[category] = {
        page: 0,
        articles: [],
      };
    }

    const page = this.articleByCategoryAndPage[category].page + 1;

    return this.executeQuery(category, 'us', page).pipe(
      map(({ articles }) => {
        if (articles.length === 0) {
          return this.articleByCategoryAndPage[category].articles;
        }

        this.articleByCategoryAndPage[category] = {
          page,
          articles: [
            ...this.articleByCategoryAndPage[category].articles,
            ...articles,
          ],
        };
        return this.articleByCategoryAndPage[category].articles;
      })
    );
  }
}
