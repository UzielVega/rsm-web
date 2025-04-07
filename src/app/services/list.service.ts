import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ListService<T> {
  constructor() {}

  // Método para actualizar un elemento en la lista
  updateItemInList(
    items: T[],
    updatedItem: T,
    compareFn: (a: T, b: T) => boolean
  ): T[] {
    const index = items.findIndex((item) => compareFn(item, updatedItem));
    if (index === -1) return items; // Retorna la lista sin cambios si no encuentra el elemento

    const updatedItems = [...items];
    updatedItems[index] = { ...items[index], ...updatedItem }; // Actualiza solo el elemento encontrado
    return updatedItems;
  }

  // Método para agregar un elemento a la lista
  addItemToList(items: T[] | null, newItem: T): T[] {
    return items ? [...items, newItem] : [newItem]; // Si hay elementos, agrega el nuevo; si no, crea una lista con el nuevo elemento
  }

  // Método para eliminar un elemento de la lista
  removeItemFromList(
    items: T[] | null,
    itemToRemove: T,
    compareFn: (a: T, b: T) => boolean
  ): T[] {
    return items ? items.filter((item) => !compareFn(item, itemToRemove)) : [];
  }
}
