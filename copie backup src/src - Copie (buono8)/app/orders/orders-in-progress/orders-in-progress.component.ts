import { Component, OnInit } from '@angular/core';
import { GridApi } from 'ag-grid-community';
import { OrdersService } from 'src/shared/services/orders.service';
import { FilePreviewModalComponent } from '../../file-preview-modal/file-preview-modal.component';
import { OrderInProgress } from 'src/shared/models/OrderInProgress';

@Component({
  selector: 'app-orders-in-progress',
  templateUrl: './orders-in-progress.component.html',
  styleUrls: ['./orders-in-progress.component.scss']
})
export class OrdersInProgressComponent implements OnInit {
  public columnDefs;
  public defaultColDef;
  gridApi: GridApi;
  ordersInProgress: OrderInProgress[];
  filter: string;
  menuTabs: Array<string> = ['filterMenuTab'];
  exportParams = {
    allColumns: false,
    columnKeys: ["magasin", "date_commande", "type_commande", "numero_commande", "nom_client", "tel", "nb_produits"]
  }

  constructor(
    private ordersService: OrdersService
  ) {

    this.columnDefs = [      
      { headerName: 'Magasin', field: "magasin" },
      { headerName: 'Date de la commande', field: "date_commande" },
      { headerName: 'Type de commande', field: "type_commande", flex: 5, resizable: true },
      { headerName: 'Numéro de commande', field: "numero_commande" },
      { headerName: 'Nom client', field: "nom_client"},
      { headerName: 'Téléphone', field: "tel" },
      { headerName: 'Nb produits', field: "nb_produits" },
    ];
    this.defaultColDef = { sortable: true, filter: true, suppressMovable: true, menuTabs: this.menuTabs, cellClass: "d-flex align-items-center border-right border-grey" };
  }

  ngOnInit(): void {
    this.loadOrdersInProgress();
  }

  ngOnDestroy() {
  }

  onGridReady(params) {
    this.gridApi = params.api;
  }

  loadOrdersInProgress() {
    this.ordersService.getOrdersInProgress()
    .subscribe((ordersInProgress: OrderInProgress[]) => {
      this.ordersInProgress = ordersInProgress;
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
