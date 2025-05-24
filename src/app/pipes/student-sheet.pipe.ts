import { Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';

@Pipe({
  name: 'studentSheet',
  standalone: true,
  pure: true,
})
export class StudentSheetPipe implements PipeTransform {
  transform(value: unknown) {
    return Number.isInteger(Number(value)) ? value : '…';
  }
}