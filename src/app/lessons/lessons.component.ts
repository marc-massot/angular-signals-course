import {Component, computed, ElementRef, inject, signal, viewChild} from '@angular/core';
import {LessonsService} from "../services/lessons.service";
import {Lesson} from "../models/lesson.model";
import {LessonDetailComponent} from "./lesson-detail/lesson-detail.component";

@Component({
    selector: 'lessons',
    imports: [ LessonDetailComponent ],
    templateUrl: './lessons.component.html',
    styleUrl: './lessons.component.scss'
})
export class LessonsComponent {

  lessons = signal<Lesson[]>([]);
  selectedLesson = signal<Lesson | null>(null);
  mode =  computed(() => this.selectedLesson() ? 'detail' : 'master');

  lessonsService = inject(LessonsService);

  searchInput = viewChild.required<ElementRef>('search');

  async onSearch() {
    const query = this.searchInput()?.nativeElement.value;
    console.log('search query', query);
    const results =
      await this.lessonsService.loadLessons({query});
    this.lessons.set(results);

  }

  onLessonSelected(lesson: Lesson) {
    this.selectedLesson.set(lesson);
  }

  onCancel() {
    this.selectedLesson.set(null);
  }

  onLessonUpdated(lesson: Lesson) {
    this.lessons.update(lessons =>
      lessons.map(l => l.id === lesson.id ? lesson : l)
    );

  }
}
