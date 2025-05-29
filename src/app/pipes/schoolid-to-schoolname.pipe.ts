import { inject, Pipe, PipeTransform } from '@angular/core';
import { AppService } from '../services/app.service';

@Pipe({
  name: 'schoolidToSchoolname',
  standalone: true,
  pure: true,
})
export class SchoolidToSchoolnamePipe implements PipeTransform {
  readonly appService = inject(AppService);

  transform(value: any): string {
    if(!value.schoolId) return value;
    
    const school = this.appService.schools().find(s => s._id === value.schoolId);
    value.schoolName = school?.name;
    return value;
  }

}
