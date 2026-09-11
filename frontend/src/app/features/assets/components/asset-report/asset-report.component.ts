import { Component, OnInit } from '@angular/core';
import { AssetService } from '../../../../core/services/asset.service';
import { Asset } from '../../../../shared/models/asset.model';

interface SiteRow {
  code: string;
  label: string;
  value: string;
  counts: Record<string, number>;
  total: number;
}

interface TypeRow {
  type: string;
  count: number;
  pct: number;
}

@Component({
  selector: 'app-asset-report',
  templateUrl: './asset-report.component.html',
  styleUrls: ['./asset-report.component.scss']
})
export class AssetReportComponent implements OnInit {
  isLoading = true;
  assets: Asset[] = [];

  readonly statuses = [
    { value: 'new',         label: '新品',  color: '#1976d2' },
    { value: 'in_use',      label: '使用中', color: '#2e7d32' },
    { value: 'idle',        label: '閒置',  color: '#f57f17' },
    { value: 'maintenance', label: '維修中', color: '#e65100' },
    { value: 'scrapped',    label: '停用',  color: '#c62828' }
  ];

  readonly siteOptions = [
    { code: 'WPT', label: '樹谷', value: '樹谷' },
    { code: 'WPN', label: '楠梓', value: '楠梓' },
    { code: 'WPY', label: '永安', value: '永安' },
    { code: 'WPD', label: '越南', value: '越南' }
  ];

  private readonly siteMap: Record<string, string> = {
    '樹谷': 'WPT', '楠梓': 'WPN', '永安': 'WPY', '越南': 'WPD'
  };

  // 總覽
  total = 0;
  statusSummary: { status: { value: string; label: string; color: string }; count: number; pct: number }[] = [];

  // 廠區交叉表
  siteRows: SiteRow[] = [];
  statusTotals: Record<string, number> = {};
  grandTotal = 0;

  // Type 統計
  typeRows: TypeRow[] = [];

  // 盤點統計
  inventoried    = 0;
  notInventoried = 0;
  inventoriedPct = 0;
  siteInventoryRows: { code: string; label: string; inventoried: number; notInventoried: number; total: number }[] = [];

  constructor(private assetService: AssetService) {}

  ngOnInit(): void {
    this.assetService.getAll().subscribe({
      next: assets => {
        this.assets = assets;
        this.compute();
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  private compute(): void {
    const assets = this.assets;
    this.total = assets.length;

    // 狀態總覽
    this.statusSummary = this.statuses.map(s => {
      const count = assets.filter(a => a.status === s.value).length;
      return { status: s, count, pct: this.total ? Math.round(count / this.total * 100) : 0 };
    });

    // 廠區交叉表
    const knownValues = new Set(this.siteOptions.map(s => s.value));
    const rows: SiteRow[] = this.siteOptions.map(s => ({
      ...s,
      counts: Object.fromEntries(this.statuses.map(st => [st.value, 0])),
      total: 0
    }));
    // 未指定列
    const unknownRow: SiteRow = {
      code: '-', label: '未指定', value: '',
      counts: Object.fromEntries(this.statuses.map(st => [st.value, 0])),
      total: 0
    };

    for (const a of assets) {
      const target = knownValues.has(a.site ?? '') ? rows.find(r => r.value === a.site)! : unknownRow;
      target.counts[a.status] = (target.counts[a.status] ?? 0) + 1;
      target.total++;
    }

    this.siteRows = [...rows, unknownRow].filter(r => r.total > 0);

    // 狀態小計（最後一列）
    this.statusTotals = Object.fromEntries(this.statuses.map(s => [
      s.value, this.siteRows.reduce((sum, r) => sum + (r.counts[s.value] ?? 0), 0)
    ]));
    this.grandTotal = this.siteRows.reduce((sum, r) => sum + r.total, 0);

    // Type 統計
    const typeMap: Record<string, number> = {};
    for (const a of assets) {
      const t = a.assetType?.trim() || '未填寫';
      typeMap[t] = (typeMap[t] ?? 0) + 1;
    }
    this.typeRows = Object.entries(typeMap)
      .map(([type, count]) => ({ type, count, pct: Math.round(count / this.total * 100) }))
      .sort((a, b) => b.count - a.count);

    // 盤點統計
    this.inventoried    = assets.filter(a => a.inventoried).length;
    this.notInventoried = assets.filter(a => !a.inventoried).length;
    this.inventoriedPct = this.total ? Math.round(this.inventoried / this.total * 100) : 0;

    const knownSites = this.siteOptions.map(s => s.value);
    this.siteInventoryRows = [
      ...this.siteOptions.map(s => {
        const sub = assets.filter(a => a.site === s.value);
        return { code: s.code, label: s.label, inventoried: sub.filter(a => a.inventoried).length, notInventoried: sub.filter(a => !a.inventoried).length, total: sub.length };
      }),
      (() => {
        const sub = assets.filter(a => !knownSites.includes(a.site ?? ''));
        return { code: '-', label: '未指定', inventoried: sub.filter(a => a.inventoried).length, notInventoried: sub.filter(a => !a.inventoried).length, total: sub.length };
      })()
    ].filter(r => r.total > 0);
  }

  getSiteCode(value: string): string {
    return this.siteMap[value] ?? value;
  }
}
