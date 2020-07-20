import { Component, OnInit } from '@angular/core';
import { GridApi } from 'ag-grid-community';
import { OrdersService } from 'src/shared/services/orders.service';
import { FilePreviewModalComponent } from '../../file-preview-modal/file-preview-modal.component';
import { OrderShipping } from 'src/shared/models/OrderShipping';

@Component({
  selector: 'app-orders-shipping',
  templateUrl: './orders-shipping.component.html',
  styleUrls: ['./orders-shipping.component.scss']
})
export class OrdersShippingComponent implements OnInit {
  public columnDefs;
  public defaultColDef;
  gridApi: GridApi;
  ordersShipping: OrderShipping[];
  filter: string;
  menuTabs: Array<string> = ['filterMenuTab'];
  exportParams = {
    allColumns: false,
    columnKeys: ["magasin", "date_commande", "date_expedition", "type_commande", "numero_commande", "nom_client", "tel", "nb_produits"]
  }

  constructor(
    private ordersService: OrdersService
  ) {

    this.columnDefs = [      
      { headerName: 'Magasin', field: "magasin" },
      { headerName: 'Date de la commande', field: "date_commande" },
      { headerName: "Date d'expédition", field: "date_expedition" },
      { headerName: 'Type de commande', field: "type_commande", flex: 5, resizable: true },
      { headerName: 'Numéro de commande', field: "numero_commande" },
      { headerName: 'Nom client', field: "nom_client"},
      { headerName: 'Téléphone', field: "tel" },
      { headerName: 'Nbs de produits', field: "nb_produits" },
    ];
    this.defaultColDef = { sortable: true, filter: true, suppressMovable: true, menuTabs: this.menuTabs, cellClass: "d-flex align-items-center border-right border-grey" };
  }

  ngOnInit(): void {
    this.loadOrdersShipping();
  }

  ngOnDestroy() {
  }

  onGridReady(params) {
    this.gridApi = params.api;
  }

  loadOrdersShipping() {
    this.ordersService.getOrdersShipping()
    .subscribe((ordersShipping: OrderShipping[]) => {
      this.ordersShipping = ordersShipping;
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
