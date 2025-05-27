import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'parseJsonOrString' })
export class ParseJsonOrStringPipe implements PipeTransform {
  transform(value: string): any {
    if (!value) return value;
    try {
      return JSON.parse(value);
    } catch {
      return value; 
    }
  }
}
