import { Pipe, PipeTransform } from '@angular/core';
import { Announcements } from '../../models/Announcements';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

  transform(items: Announcements[], text: string): Announcements[] {

    if(!items) 
    {
      return [];
    }

    if(!text) 
    {
      return items;
    }

    return items.filter(it => it.announcementTitle.toLowerCase().includes(text));
  }
}
