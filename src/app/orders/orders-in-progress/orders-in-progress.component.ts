import { Component, OnInit } from '@angular/core';
import { GridApi } from 'ag-grid-community';
import { OrdersService } from 'src/shared/services/orders.service';
import { FilePreviewModalComponent } from '../../file-preview-modal/file-preview-modal.component';
import { OrderInProgress } from 'src/shared/models/OrderInProgress';
import { DeviceDetectorService } from 'ngx-device-detector';

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
  mob: boolean;
  menuTabs: Array<string> = ['filterMenuTab'];
  exportParams = {
    allColumns: false,
    columnKeys: ["id", "magasin", "date_commande", "type_commande", "numero_commande", "nom_client", "tel", "nb_produits"]
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
      { headerName: 'Magasin', field: "magasin", resizable: true },
      { headerName: 'Date de la commande', field: "date_commande", resizable: true },
      { headerName: 'Type de commande', field: "type_commande", width: 300, resizable: true },
      { headerName: 'Numéro de commande', field: "numero_commande", resizable: true },
      { headerName: 'Nom client', field: "nom_client", resizable: true },
      { headerName: 'Téléphone', field: "tel", resizable: true },
      { headerName: 'Nb produits', field: "nb_produits", resizable: true },
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
