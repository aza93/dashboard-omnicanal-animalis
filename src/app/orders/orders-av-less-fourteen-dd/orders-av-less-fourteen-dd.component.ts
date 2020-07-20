import { Component, OnInit } from '@angular/core';
import { GridApi } from 'ag-grid-community';
import { OrdersService } from 'src/shared/services/orders.service';
import { FilePreviewModalComponent } from '../../file-preview-modal/file-preview-modal.component';
import { OrderAvLess14dd } from 'src/shared/models/OrderAvLess14dd';

@Component({
  selector: 'app-orders-av-less-fourteen-dd',
  templateUrl: './orders-av-less-fourteen-dd.component.html',
  styleUrls: ['./orders-av-less-fourteen-dd.component.scss']
})
export class OrdersAvLessFourteenDdComponent implements OnInit {
  public columnDefs;
  public defaultColDef;
  gridApi: GridApi;
  ordersAvLess14dd: OrderAvLess14dd[];
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
      { headerName: 'Date de la commande', field: "date_creation" },
      { headerName: 'Date mise de coté', field: "date_mise_de_cote" },
      { headerName: 'Commande dispo depuis (jours)', field: "dispo_depuis" },
      { headerName: 'Type de commande', field: "type_commande", flex: 5, resizable: true },
      { headerName: 'Numéro de commande', field: "numero_commande" },
      { headerName: 'Nom client', field: "nom_client"},
      { headerName: 'Téléphone', field: "tel" },
      { headerName: 'Nb produits', field: "nb_produits" },
    ];
    this.defaultColDef = { sortable: true, filter: true, suppressMovable: true, menuTabs: this.menuTabs, cellClass: "d-flex align-items-center border-right border-grey" };
  }

  ngOnInit(): void {
    this.loadOrdersAvLess14dd();
  }

  ngOnDestroy() {
  }

  onGridReady(params) {
    this.gridApi = params.api;
  }

  loadOrdersAvLess14dd() {
    this.ordersService.getOrdersAvLess14dd()
    .subscribe((ordersAvLess14dd: OrderAvLess14dd[]) => {
      this.ordersAvLess14dd = ordersAvLess14dd;
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
