import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], text: string): any[] {

    if (!items) { return []; }

    if (!text) { return items; }

    return items.filter(it => 
      it.announcementTitle.toLowerCase().indexOf(text.toLocaleLowerCase()) !== -1);
  }

}
