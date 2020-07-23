import { Component, OnInit } from '@angular/core';
import { GridApi } from 'ag-grid-community';
import { OrdersService } from 'src/shared/services/orders.service';
import { FilePreviewModalComponent } from '../../file-preview-modal/file-preview-modal.component';
import { DelayedOrder } from 'src/shared/models/DelayedOrder';

@Component({
  selector: 'app-orders-delayed',
  templateUrl: './orders-delayed.component.html',
  styleUrls: ['./orders-delayed.component.scss']
})
export class OrdersDelayedComponent implements OnInit {
  public columnDefs;
  public defaultColDef;
  gridApi: GridApi;
  delayedOrders: DelayedOrder[];
  filter: string;
  menuTabs: Array<string> = ['filterMenuTab'];
  exportParams = {
    allColumns: false,
    columnKeys: ["magasin", "date_creation", "type_commande", "numero_commande", "nom_client", "tel", "nb_produits", "retard"]
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
      { headerName: 'Retard (en heures) par rapport à maintenant', field: "retard", resizable: true },
    ];
    this.defaultColDef = { sortable: true, filter: true, suppressMovable: true, menuTabs: this.menuTabs, cellClass: "d-flex align-items-center border-right border-grey" };
  }

  ngOnInit(): void {
    this.loadAllDelayedOrders();
  }

  ngOnDestroy() {
  }

  onGridReady(params) {
    this.gridApi = params.api;
  }

  loadAllDelayedOrders() {
    this.ordersService.getDelayedOrders()
    .subscribe((delayedOrders: DelayedOrder[]) => {
      this.delayedOrders = delayedOrders;
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
