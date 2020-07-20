import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { MatDialog } from '@angular/material/dialog';
import { FolderService } from 'src/shared/services/folder.service';
import { Folder } from 'src/shared/models/Folder';
import { FolderNode } from 'src/shared/models/FolderNode';
import { Router, NavigationStart, RouterEvent, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { FolderUpdateModalComponent } from '../folder-update-modal/folder-update-modal.component';
import { FolderTreeStoreService } from 'src/shared/services/folder-node-store.service';

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.scss'],
})
export class LeftMenuComponent implements OnInit {
  folderTreeStoreRefreshSubscription: Subscription

  constructor(
    private router: Router,
    private folderTreeStoreService: FolderTreeStoreService,
    private dialog: MatDialog,
    private folderService: FolderService
  ) { }

  ngOnInit(): void {
    this.folderTreeStoreService.refresh();
    this.folderTreeStoreRefreshSubscription = this.folderTreeStoreService.getRefreshEvent.subscribe(
      () => {
        this.refresh();
      });
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.folderTreeStoreRefreshSubscription.unsubscribe();
  }

  refresh() {
  }

  folderTreeStoreServiceRefresh() {
    this.folderTreeStoreService.refresh();
  }

  showFolderUpdateModal(node: FolderNode) {
    let parentNode = this.folderTreeStoreService.getParentNode(node);
    this.dialog.open(FolderUpdateModalComponent, {
      data: { id: node.id, name: node.name, parentFolderId: parentNode ? parentNode.id : null },
      disableClose: true
    })
  }

  async deleteFolder(folder) {
    if (this.folderTreeStoreService.isActiveFolderNodeId(folder.id)) {
      let parentFolder = this.folderTreeStoreService.getParentNode(folder);
      if (parentFolder) {
        this.router.navigate(['/folders/' + parentFolder.id]);
      } else {
        this.router.navigate(['/files']);
      }
    }
    await this.folderService.delete(folder.id);
  }

  toggleNode(event, node) {
    this.stopPropagation(event);
    this.folderTreeStoreService.toggleNode(node);
  }

  isExpanded(node) {
    return this.treeControl.isExpanded(node);
  }

  collapseAll() {
    this.treeControl.collapseAll();
  }

  getRouteFolderId(): string {
    let route = this.router.url;
    if (route.includes("/folders/")) {
      return route.replace("/folders/", "");
    } else {
      return null;
    }
  }

  get dataSource() {
    return this.folderTreeStoreService.dataSource;
  }

  get treeControl() {
    return this.folderTreeStoreService.treeControl;
  }

  stopPropagation(event: Event) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
}
