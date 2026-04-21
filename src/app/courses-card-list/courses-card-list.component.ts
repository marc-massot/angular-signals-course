import {Component, inject, input, output} from '@angular/core';
import {RouterLink} from "@angular/router";
import {Course} from "../models/course.model";

@Component({
    selector: 'courses-card-list',
    imports: [
        RouterLink
    ],
    templateUrl: './courses-card-list.component.html',
    styleUrl: './courses-card-list.component.scss'
})
export class CoursesCardListComponent {

  courses = input.required<Course[]>();

  courseEdit = output<Course>();

  courseDeleted = output<string>();

  onEditCourse(course: Course) {
    this.courseEdit.emit(course);
  }

  onCourseDeleted(course: Course) {
    this.courseDeleted.emit(course.id);
  }

}
