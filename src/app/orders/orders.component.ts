import { Component, OnInit } from '@angular/core';
import { GridApi } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from 'src/shared/services/orders.service';
import { FilePreviewModalComponent } from '../file-preview-modal/file-preview-modal.component';
import { Order } from 'src/shared/models/order';
import { DeviceDetectorService } from 'ngx-device-detector';

import { DelayedOrder } from 'src/shared/models/DelayedOrder';
import { OrderAvMore14dd } from 'src/shared/models/OrderAvMore14dd';
import { OrderAvLess14dd } from 'src/shared/models/OrderAvLess14dd';
import { OrderInProgress } from 'src/shared/models/OrderInProgress';
import { OrderShipping } from 'src/shared/models/OrderShipping';

import { environment } from 'src/environments/environment';
import { OrderAllFields } from 'src/shared/models/OrderAllFields';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.less']
})
export class OrdersComponent implements OnInit {
  public columnDefs;
  public defaultColDef;
  gridApi: GridApi;
  orders: Order[] | DelayedOrder[]  | OrderAvMore14dd[] | OrderAvLess14dd[] | OrderShipping[] | OrderInProgress[];
  filter: string;
  mob: boolean;
  menuTabs: Array<string> = ['filterMenuTab'];
  breakpoint: number;
  exportParams = {
    allColumns: false,
    columnKeys: []
  }
  public loadingTemplate;
  public noRowsTemplate;
  public orderType;

  constructor(
    private ordersService: OrdersService,
    public dialog: MatDialog,
    private deviceService: DeviceDetectorService,
    private activatedroute: ActivatedRoute
  ) {
    this.loadingTemplate = `<span class="ag-overlay-loading-center">En cours de traitement...</span>`;
    this.noRowsTemplate = `<span><b>Aucune commande n'a été trouvée avec les éléments saisis<b></span>`;
    this.mob = this.deviceService.isMobile() ? true : false;
    this.defaultColDef = { sortable: true, filter: true, suppressMovable: true, menuTabs: this.menuTabs, cellClass: "d-flex align-items-center border-right border-grey" };
    this.breakpoint = (window.innerWidth <= 400) ? 1 : 6;
  }

  ngOnInit(): void {
    this.activatedroute.params.subscribe(
      params => {
        this.orderType = params['orderType'];
        switch (this.orderType) {
          case 'allOrders':
            this.loadAllOrders();
            this.columnDefs = environment.columnDefsAllOrders;
            break;
          case 'ordersToPrepare':
            this.loadAllOrdersToPrepare();
            this.columnDefs = environment.columnDefsOrdersToPrepare;
            break;
          case 'ordersDelayed':
            this.loadAllDelayedOrders();
            this.columnDefs = environment.columnDefsOrdersDelayed;
            break;
          case 'ordersAvMore14dd':
            this.loadOrdersAvMore14dd();
            this.columnDefs = environment.columnDefsOrderAvMoreFourteenDd;
            break;
          case 'ordersAvLess14dd':
            this.loadOrdersAvLess14dd();
            this.columnDefs = environment.columnDefsOrdersAvLessFourteenDd;
            break;
          case 'ordersShipping':
            this.loadOrdersShipping();
            this.columnDefs = environment.columnDefsOrdersShipping;
            break;
          case 'ordersInProgress':
            this.loadOrdersInProgress();
            this.columnDefs = environment.columnDefsOrdersInProgress;
            break;
        }
        this.columnDefs.forEach(element => {
          this.exportParams.columnKeys.push(element.field)
        })
      }
    );
  }

  ngOnDestroy() {
  }

  onGridReady(params) {
    this.gridApi = params.api;
    const sortModel = [
      { colId: 'id', sort: 'desc' }
    ];
    this.gridApi.setSortModel(sortModel);
    //this.sizeToFit();
  }

  onGridSizeChanged(params) {
    params.api.sizeColumnsToFit();
    //this.sizeToFit();
  }

  sizeToFit() {
    this.gridApi.sizeColumnsToFit();
  }
  
  loadAllOrders() {
    this.ordersService.getAllOrders()
    .subscribe((orders: OrderAllFields[]) => {
      this.orders = orders;
    });
  }
  
  loadAllOrdersToPrepare() {
    this.ordersService.getOrders()
    .subscribe((orders: Order[]) => {
      this.orders = orders;
    });
  }

  loadAllDelayedOrders() {
    this.ordersService.getDelayedOrders()
    .subscribe((orders: DelayedOrder[]) => {
      this.orders = orders;
    });
  }

  loadOrdersAvMore14dd() {
    this.ordersService.getOrdersAvMore14dd()
    .subscribe((orders: OrderAvMore14dd[]) => {
      this.orders = orders;
    });
  }

  loadOrdersAvLess14dd() {
    this.ordersService.getOrdersAvLess14dd()
    .subscribe((orders: OrderAvLess14dd[]) => {
      this.orders = orders;
    });
  }

  loadOrdersInProgress() {
    this.ordersService.getOrdersInProgress()
    .subscribe((orders: OrderInProgress[]) => {
      this.orders = orders;
    });
  }

  loadOrdersShipping() {
    this.ordersService.getOrdersShipping()
    .subscribe((orders: OrderShipping[]) => {
      this.orders = orders;
    });
  }

  exportAsCsv() {
    if (this.gridApi) {
      this.gridApi.exportDataAsCsv(this.exportParams);
    }
  }

  /*
  exportAsExcel() {
    if (this.gridApi) {
      this.gridApi.exportDataAsExcel(this.exportParams);
    }
  }
  */

  showOrderPreviewModal(cylandeCode) {
    this.ordersService.getOrderInfo(cylandeCode).subscribe(
      (orderInfo: Order[]) => {
        //console.log(orderInfo);
        this.dialog.open(FilePreviewModalComponent, { data: "{ blob: orderInfo }", minWidth:"100vw", maxWidth:"100vw", panelClass: 'preview-modal' });
      }
    )
  }

  getContextMenuItems = (params) => {
    if (params.node) {
      var cylandeCode = params.node.data.numero_commande;
      //console.log(cylandeCode);
      var result = [
        {
          name: 'Aperçu',
          icon: `<i class="material-icons-outlined text-secondary">visibility</i>`,
          action: () => {
            this.showOrderPreviewModal(cylandeCode)
          }
        },
        {
          name: 'Modifier',
          icon: `<i class="material-icons-outlined text-secondary">create</i>`,
          action: () => {
            //this.showUpdateModal(file)
          }
        },
        {
          name: 'Déplacer',
          icon: `<i class="material-icons-outlined text-secondary">low_priority</i>`,
          action: () => {
            //this.showMoveModal(file)
          }
        },
        {
          name: 'Télécharger',
          icon: `<i class="material-icons-outlined text-secondary">save_alt</i>`,
          action: () => {
            //this.downloadFile(file)
          }

        },
        {
          name: 'Supprimer',
          icon: `<i class="material-icons-outlined text-secondary">delete</i>`,
          action: () => {
            //this.tryDeleteFiles(this.gridApi.getSelectedRows())
          }
        },
      ];

      return result;
    }
  }
}
