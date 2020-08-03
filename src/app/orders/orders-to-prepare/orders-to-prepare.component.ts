import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GridApi } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { OrdersService } from 'src/shared/services/orders.service';
import { FilePreviewModalComponent } from '../../file-preview-modal/file-preview-modal.component';
import { Order } from 'src/shared/models/order';
import { DeviceDetectorService } from 'ngx-device-detector';

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
  mob: boolean;
  menuTabs: Array<string> = ['filterMenuTab'];
  exportParams = {
    allColumns: false,
    columnKeys: ["id", "magasin", "date_creation", "type_commande", "numero_commande", "nom_client", "tel", "nb_produits", "retard"]
  }

  constructor(
    private ordersService: OrdersService,
    public dialog: MatDialog,
    private deviceService: DeviceDetectorService
  ) {
    this.mob = this.deviceService.isMobile() ? true : false;
    this.columnDefs = [
      { headerName: 'ID', field: "id", resizable: true },
      { headerName: 'Magasin', field: "magasin", resizable: true },
      { headerName: 'Date de la commande', field: "date_creation", resizable: true },
      { headerName: 'Type de commande', field: "type_commande", width: 300, resizable: true },
      { headerName: 'Numéro de commande', field: "numero_commande", resizable: true },
      { headerName: 'Nom client', field: "nom_client", resizable: true },
      { headerName: 'Téléphone', field: "tel", resizable: true },
      { headerName: 'Nb produits', field: "nb_produits", resizable: true },
      { headerName: 'Retard', field: "retard", resizable: true },
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

  showOrderPreviewModal(cylandeCode) {
    this.ordersService.getOrderInfo(cylandeCode).subscribe(
      (orderInfo: Order[]) => {
        //console.log(orderInfo);
        this.dialog.open(FilePreviewModalComponent, { data: "{ blob: orderInfo }", minWidth:"100vw", maxWidth:"100vw", panelClass: 'preview-modal' });
      }
    )
  }

  getContextMenuItems = (params) => {
    if (params.node) {
      var cylandeCode = params.node.data.numero_commande;
      //console.log(cylandeCode);
      var result = [
        {
          name: 'Aperçu',
          icon: `<i class="material-icons-outlined text-secondary">visibility</i>`,
          action: () => {
            this.showOrderPreviewModal(cylandeCode)
          }
        },
        {
          name: 'Modifier',
          icon: `<i class="material-icons-outlined text-secondary">create</i>`,
          action: () => {
            //this.showUpdateModal(file)
          }
        },
        {
          name: 'Déplacer',
          icon: `<i class="material-icons-outlined text-secondary">low_priority</i>`,
          action: () => {
            //this.showMoveModal(file)
          }
        },
        {
          name: 'Télécharger',
          icon: `<i class="material-icons-outlined text-secondary">save_alt</i>`,
          action: () => {
            //this.downloadFile(file)
          }

        },
        {
          name: 'Supprimer',
          icon: `<i class="material-icons-outlined text-secondary">delete</i>`,
          action: () => {
            //this.tryDeleteFiles(this.gridApi.getSelectedRows())
          }
        },
      ];

      return result;
    }
  }
}
