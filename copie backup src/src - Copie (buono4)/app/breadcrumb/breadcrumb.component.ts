import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { filter, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  folderTreeStoreRefreshSubscription: Subscription;
  routerEventSubscription: Subscription;
  constructor(
    private router: Router
  ) {
    //router subscribe doesn't correctly work in ngOnInit (too late)
    this.routerEventSubscription = this.router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationEnd),
      distinctUntilChanged(),
    ).subscribe(() => {
    });
  }

  ngOnInit(): void {  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.folderTreeStoreRefreshSubscription.unsubscribe();
    this.routerEventSubscription.unsubscribe();
  }
}
