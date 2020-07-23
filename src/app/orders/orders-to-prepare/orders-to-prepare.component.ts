import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GridApi } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { OrdersService } from 'src/shared/services/orders.service';
import { FilePreviewModalComponent } from '../../file-preview-modal/file-preview-modal.component';
import { Order } from 'src/shared/models/order';

@Component({
  selector: 'app-orders-to-prepare',
  templateUrl: './orders-to-prepare.component.html',
  styleUrls: ['./orders-to-prepare.component.less']
})
export class OrdersToPrepareComponent implements OnInit {
  public columnDefs;
  public defaultColDef;
  gridApi: GridApi;
  orders: Order[];
  filter: string;
  menuTabs: Array<string> = ['filterMenuTab'];
  exportParams = {
    allColumns: false,
    columnKeys: ["magasin", "date_creation", "type_commande", "numero_commande", "nom_client", "tel", "nb_produits"]
  }

  constructor(
    private ordersService: OrdersService
  ) {

    this.columnDefs = [      
      { headerName: 'Magasin', field: "magasin", resizable: true },
      { headerName: 'Date de la commande', field: "date_creation", resizable: true },
      { headerName: 'Type de commande', field: "type_commande", width: 300, resizable: true },
      { headerName: 'Numéro de commande', field: "numero_commande", resizable: true },
      { headerName: 'Nom client', field: "nom_client", resizable: true },
      { headerName: 'Téléphone', field: "tel", resizable: true },
      { headerName: 'Nb produits', field: "nb_produits", resizable: true },
    ];
    this.defaultColDef = { sortable: true, filter: true, suppressMovable: true, menuTabs: this.menuTabs, cellClass: "d-flex align-items-center border-right border-grey" };
  }

  ngOnInit(): void {
    this.loadAllOrders();
  }

  ngOnDestroy() {
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.sizeToFit();
  }

  sizeToFit() {
    this.gridApi.sizeColumnsToFit();
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
