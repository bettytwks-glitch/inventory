import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Asset, AssetCategory, CreateAssetRequest, EmployeeOption, FaCategory } from '../../shared/models/asset.model';

@Injectable({ providedIn: 'root' })
export class AssetService {
  private readonly url = `${environment.apiUrl}/assets`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Asset[]> {
    return this.http.get<Asset[]>(this.url);
  }

  getMine(): Observable<Asset[]> {
    return this.http.get<Asset[]>(`${this.url}/mine`);
  }

  create(request: CreateAssetRequest): Observable<Asset> {
    return this.http.post<Asset>(this.url, request);
  }

  updateStatus(id: number, status: string, custodianId?: string): Observable<Asset> {
    return this.http.put<Asset>(`${this.url}/${id}`, { status, custodianId });
  }

  updateFull(id: number, body: Record<string, unknown>): Observable<Asset> {
    return this.http.put<Asset>(`${this.url}/${id}`, body);
  }

  getCategories(): Observable<AssetCategory[]> {
    return this.http.get<AssetCategory[]>(`${environment.apiUrl}/assetcategories`);
  }

  getFaCategories(): Observable<FaCategory[]> {
    return this.http.get<FaCategory[]>(`${environment.apiUrl}/facategories`);
  }

  getEmployees(): Observable<EmployeeOption[]> {
    return this.http.get<EmployeeOption[]>(`${environment.apiUrl}/employees`);
  }

  toggleInventory(id: number, inventoried: boolean): Observable<{ assetId: number; inventoried: boolean; inventoriedAt?: string; inventoriedBy?: string }> {
    return this.http.put<{ assetId: number; inventoried: boolean; inventoriedAt?: string; inventoriedBy?: string }>(`${this.url}/${id}/inventory`, { inventoried });
  }

  getCount(): Observable<number> {
    return this.http.get<{ count: number }>(`${this.url}/count`)
      .pipe(map(r => r.count));
  }
}
