import { Component, OnInit } from '@angular/core';
import { GridApi } from 'ag-grid-community';
import { OrdersService } from 'src/shared/services/orders.service';
import { FilePreviewModalComponent } from '../../file-preview-modal/file-preview-modal.component';
import { OrderAvMore14dd } from 'src/shared/models/OrderAvMore14dd';

@Component({
  selector: 'app-order-av-more-fourteen-dd',
  templateUrl: './order-av-more-fourteen-dd.component.html',
  styleUrls: ['./order-av-more-fourteen-dd.component.scss']
})
export class OrderAvMoreFourteenDdComponent implements OnInit {
  public columnDefs;
  public defaultColDef;
  gridApi: GridApi;
  ordersAvMore14dd: OrderAvMore14dd[];
  filter: string;
  menuTabs: Array<string> = ['filterMenuTab'];
  exportParams = {
    allColumns: false,
    columnKeys: ["magasin", "date_creation", "date_mise_de_cote", "dispo_depuis", "type_commande", "numero_commande", "nom_client", "tel", "nb_produits"]
  }

  constructor(
    private ordersService: OrdersService
  ) {

    this.columnDefs = [      
      { headerName: 'Magasin', field: "magasin" },
      { headerName: 'Date de la commande', field: "date_creation", resizable: true },
      { headerName: 'Date mise de coté', field: "date_mise_de_cote", resizable: true },
      { headerName: 'Commande dispo depuis (jours)', field: "dispo_depuis", resizable: true },
      { headerName: 'Type de commande', field: "type_commande", width: 300, resizable: true },
      { headerName: 'Numéro de commande', field: "numero_commande", resizable: true },
      { headerName: 'Nom client', field: "nom_client", resizable: true },
      { headerName: 'Téléphone', field: "tel", resizable: true },
      { headerName: 'Nb produits', field: "nb_produits", resizable: true },
    ];
    this.defaultColDef = { sortable: true, filter: true, suppressMovable: true, menuTabs: this.menuTabs, cellClass: "d-flex align-items-center border-right border-grey" };
  }

  ngOnInit(): void {
    this.loadOrdersAvMore14dd();
  }

  ngOnDestroy() {
  }

  onGridReady(params) {
    this.gridApi = params.api;
  }

  loadOrdersAvMore14dd() {
    this.ordersService.getOrdersAvMore14dd()
    .subscribe((ordersAvMore14dd: OrderAvMore14dd[]) => {
      this.ordersAvMore14dd = ordersAvMore14dd;
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
