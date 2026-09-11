import { Component, OnInit } from '@angular/core';
import { AssetService } from '../../../../core/services/asset.service';
import { Asset } from '../../../../shared/models/asset.model';

interface InventoryRow extends Asset {
  toggling: boolean;
}

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss']
})
export class InventoryListComponent implements OnInit {
  rows: InventoryRow[] = [];
  isLoading = false;
  errorMsg = '';

  constructor(private assetService: AssetService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.assetService.getMine().subscribe({
      next: data => {
        this.rows = data
          .filter(a => a.status !== 'scrapped')
          .map(a => ({ ...a, toggling: false }));
        this.isLoading = false;
      },
      error: () => { this.errorMsg = '載入失敗'; this.isLoading = false; }
    });
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = { new: '新品', in_use: '使用中', idle: '閒置', maintenance: '維修中', scrapped: '停用' };
    return map[status] ?? status;
  }

  toggle(row: InventoryRow): void {
    row.toggling = true;
    const next = !row.inventoried;
    this.assetService.toggleInventory(row.assetId, next).subscribe({
      next: res => {
        row.inventoried   = res.inventoried;
        row.inventoriedAt = res.inventoriedAt;
        row.inventoriedBy = res.inventoriedBy;
        row.toggling = false;
      },
      error: ()  => { row.toggling = false; }
    });
  }
}
