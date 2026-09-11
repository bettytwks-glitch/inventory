import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateInventoryItem, InventoryItem } from '../../shared/models/inventory-item.model';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private readonly url = `${environment.apiUrl}/inventoryitems`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(this.url);
  }

  getById(id: number): Observable<InventoryItem> {
    return this.http.get<InventoryItem>(`${this.url}/${id}`);
  }

  create(item: CreateInventoryItem): Observable<InventoryItem> {
    return this.http.post<InventoryItem>(this.url, item);
  }

  update(id: number, item: CreateInventoryItem): Observable<InventoryItem> {
    return this.http.put<InventoryItem>(`${this.url}/${id}`, item);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
