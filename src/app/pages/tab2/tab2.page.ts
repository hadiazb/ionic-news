import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';

import { Article } from 'src/app/interfaces';
import { NewsService } from 'src/app/services/news.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  @ViewChild(IonInfiniteScroll, { static: true })
  ionInfiniteScroll?: IonInfiniteScroll;

  public categories: string[] = [
    'business',
    'entertainment',
    'general',
    'health',
    'science',
    'sports',
    'technology',
  ];

  public segmentDefault: string = this.categories[0];
  public articles: Article[] = [];

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.getNewsByCategory(this.segmentDefault);
  }

  public segmentChanged(event: Event) {
    const newEvent = event as CustomEvent;
    this.segmentDefault = newEvent.detail.value;
    this.getNewsByCategory(this.segmentDefault);
  }

  public getNewsByCategory(category: string): void {
    this.newsService
      .getTopHeadlinesByCategory(category)
      .subscribe((articles) => {
        this.articles = [...articles];
      });
  }

  public loadData(event: Event) {
    this.newsService
      .getTopHeadlinesByCategory(this.segmentDefault, true)
      .subscribe((articles) => {
        this.articles = articles;

        // if (articles.length === this.articles.length) {
        //   this.ionInfiniteScroll!.disabled = true;
        //   return;
        // }

        setTimeout(() => {
          this.ionInfiniteScroll?.complete();
        }, 2000);
      });
  }
}
