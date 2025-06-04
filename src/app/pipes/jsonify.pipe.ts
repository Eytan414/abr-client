import { ChangeDetectionStrategy, Pipe, PipeTransform } from '@angular/core';

@Pipe({ 
  name: 'jsonify',
  standalone: true,
  pure: true,
})
export class Jsonify implements PipeTransform {
  transform(value: string): any {
      return JSON.parse(value);
  }
}
