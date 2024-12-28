import { Component, OnInit } from '@angular/core';
import { CrudService } from '../../services/crud.service';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule],
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
  items: any[] = [];
  currentItem = { name: '', email: '' };
  isCreating = false;
  editItem: any = null;
  isLoading = false;

  constructor(private crudService: CrudService) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems() {
    this.isLoading = true;
    this.crudService.getItems().subscribe(
      (data: any[]) => {
        this.items = data;
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  startCreate() {
    this.isCreating = true;
    this.currentItem = { name: '', email: '' };
  }

  addItem() {
    this.isLoading = true;
    this.crudService.createItem(this.currentItem).subscribe(() => {
      this.isCreating = false;
      this.currentItem = { name: '', email: '' };
      this.loadItems();
    });
  }

  startEdit(item: any) {
    this.editItem = { ...item }; // Clone item
    this.currentItem = { ...item };
  }

  updateItem() {
    if (this.editItem) {
      this.isLoading = true;
      this.crudService.updateItem(this.editItem.id, this.currentItem).subscribe(() => {
        this.editItem = null;
        this.currentItem = { name: '', email: '' };
        this.loadItems();
      });
    }
  }

  cancelAction() {
    this.isCreating = false;
    this.editItem = null;
    this.currentItem = { name: '', email: '' };
  }

  deleteItem(id: number) {
    this.isLoading = true;
    this.crudService.deleteItem(id).subscribe(() => {
      this.loadItems();
    });
  }
}
