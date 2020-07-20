import { Component, OnInit } from '@angular/core';
import { FileModel } from 'src/shared/models/FileModel';
import { Subscription } from 'rxjs';
import { GridApi } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { OrdersService } from 'src/shared/services/orders.service';
import { FilePreviewModalComponent } from '../file-preview-modal/file-preview-modal.component';
import { Order } from 'src/shared/models/order';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.less']
})
export class OrdersComponent implements OnInit {
  public columnDefs;
  public defaultColDef;
  folderIdRouteParam: string;
  dataSentSubscription: Subscription;
  routeParamsSubscription: Subscription;
  folderDeleteSubscription: Subscription;
  gridApi: GridApi;
  orders: Order[];
  filter: string;
  menuTabs: Array<string> = ['filterMenuTab'];
  exportParams = {
    allColumns: false,
    columnKeys: ["magasin", "date_creation", "type_commande", "numero_commande", "nom_client", "tel", "nb_produits"]
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private ordersService: OrdersService,
    public dialog: MatDialog,
  ) {

    this.columnDefs = [      
      { headerName: 'Magasin', field: "magasin" },
      { headerName: 'Date de la commande', field: "date_creation" },
      { headerName: 'Type de commande', field: "type_commande", resizable: true },
      { headerName: 'Numéro de commande', field: "numero_commande" },
      { headerName: 'Nom client', field: "nom_client"},
      { headerName: 'Téléphone', field: "tel" },
      { headerName: 'Nb produits', field: "nb_produits" },
    ];
    this.defaultColDef = { sortable: true, filter: true, suppressMovable: true, menuTabs: this.menuTabs, cellClass: "d-flex align-items-center border-right border-grey" };
  }

  ngOnInit(): void {
    //this.loadAllCommandes();
    this.loadAllOrders();
  }

  ngOnDestroy() {
  }

  onGridReady(params) {
    this.gridApi = params.api;
  }

  loadAllOrders() {
    this.ordersService.getOrders()
    .subscribe((orders: Order[]) => {
      this.orders = orders;
    });
  }

  exportAsCsv() {
    if (this.gridApi) {
      this.gridApi.exportDataAsCsv(this.exportParams);
    }
  }

  exportAsExcel() {
    if (this.gridApi) {
      this.gridApi.exportDataAsExcel(this.exportParams);
    }
  }
}
