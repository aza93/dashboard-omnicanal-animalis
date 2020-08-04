import { Component, OnInit } from '@angular/core';
import { GridApi } from 'ag-grid-community';
import { OrdersService } from 'src/shared/services/orders.service';
import { FilePreviewModalComponent } from '../../file-preview-modal/file-preview-modal.component';
import { OrderAvLess14dd } from 'src/shared/models/OrderAvLess14dd';
import { DeviceDetectorService } from 'ngx-device-detector';

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
  mob: boolean;
  menuTabs: Array<string> = ['filterMenuTab'];
  exportParams = {
    allColumns: false,
    columnKeys: ["id", "magasin", "date_creation", "date_mise_de_cote", "dispo_depuis", "type_commande", "numero_commande", "nom_client", "tel", "nb_produits"]
  }
  public loadingTemplate;
  public noRowsTemplate;

  constructor(
    private ordersService: OrdersService,
    private deviceService: DeviceDetectorService
  ) {
    this.mob = this.deviceService.isMobile() ? true : false;
    this.loadingTemplate = `<span class="ag-overlay-loading-center">En cours de traitement...</span>`;
    this.noRowsTemplate = `<span><b>Aucune commande n'a été trouvée avec les éléments saisis<b></span>`;

    this.columnDefs = [    
      { headerName: 'ID', field: "id", resizable: true },  
      { headerName: 'Magasin', field: "magasin" },
      { headerName: 'Date de la commande', field: "date_creation", resizable: true },
      { headerName: 'Date mise de coté', field: "date_mise_de_cote", resizable: true },
      { headerName: 'Commande dispo depuis (jours)', field: "dispo_depuis" },
      { headerName: 'Type de commande', field: "type_commande", width: 300, resizable: true },
      { headerName: 'Numéro de commande', field: "numero_commande", resizable: true },
      { headerName: 'Nom client', field: "nom_client", resizable: true },
      { headerName: 'Téléphone', field: "tel", resizable: true },
      { headerName: 'Nb produits', field: "nb_produits", resizable: true },
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
