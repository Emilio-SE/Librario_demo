import { Pipe, PipeTransform } from '@angular/core';
import { BookPreview } from '../interfaces/books.interface';

@Pipe({
  name: 'filterBookList'
})
export class FilterBookListPipe implements PipeTransform {

  transform(items: BookPreview[], searchTerm: string): BookPreview[] {
    if(!items || !searchTerm) {
      return items;
    }

    return items.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

}
