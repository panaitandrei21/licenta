import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeUUID'
})
export class RemoveUUIDPipe implements PipeTransform {

  transform(value: string): string {
    const parts = value.split('_');
    if (parts.length > 1 && parts[0].length === 36) {
      return parts.slice(1).join('_');
    }
    return value;
  }

}
