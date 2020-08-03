import { Component, OnInit } from '@angular/core';
import { GridApi } from 'ag-grid-community';
import { OrdersService } from 'src/shared/services/orders.service';
import { FilePreviewModalComponent } from '../../file-preview-modal/file-preview-modal.component';
import { OrderShipping } from 'src/shared/models/OrderShipping';
import { DeviceDetectorService } from 'ngx-device-detector';

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
  mob: boolean;
  menuTabs: Array<string> = ['filterMenuTab'];
  exportParams = {
    allColumns: false,
    columnKeys: ["id", "magasin", "date_commande", "date_expedition", "type_commande", "numero_commande", "nom_client", "tel", "nb_produits"]
  }

  constructor(
    private ordersService: OrdersService,
    private deviceService: DeviceDetectorService
  ) {
    this.mob = this.deviceService.isMobile() ? true : false;

    this.columnDefs = [      
      { headerName: 'ID', field: "id", resizable: true },
      { headerName: 'Magasin', field: "magasin", resizable: true },
      { headerName: 'Date de la commande', field: "date_commande", resizable: true },
      { headerName: "Date d'expédition", field: "date_expedition", resizable: true },
      { headerName: 'Type de commande', field: "type_commande", width: 300, resizable: true },
      { headerName: 'Numéro de commande', field: "numero_commande", resizable: true },
      { headerName: 'Nom client', field: "nom_client", resizable: true },
      { headerName: 'Téléphone', field: "tel", resizable: true },
      { headerName: 'Nbs de produits', field: "nb_produits", resizable: true },
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
