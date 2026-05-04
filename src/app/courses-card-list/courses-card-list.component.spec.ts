import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Course } from '../models/course.model';
import { CoursesCardListComponent } from './courses-card-list.component';

describe('CoursesCardListComponent', () => {
  const courses: Course[] = [
    {
      id: 'course-1',
      title: 'Angular Signals In Depth',
      longDescription: 'Learn how to build reactive Angular apps with signals.',
      seqNo: 1,
      iconUrl: '/assets/angular-signals.png',
      price: 89,
      uploadedImageUrl: '/assets/angular-signals-uploaded.png',
      courseListIcon: 'signal',
      category: 'BEGINNER',
      lessonsCount: 12,
    },
    {
      id: 'course-2',
      title: 'Advanced RxJS Patterns',
      longDescription: 'Compose complex async flows with RxJS operators.',
      seqNo: 2,
      iconUrl: '/assets/advanced-rxjs.png',
      price: 99,
      uploadedImageUrl: '/assets/advanced-rxjs-uploaded.png',
      courseListIcon: 'rxjs',
      category: 'ADVANCED',
      lessonsCount: 18,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursesCardListComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  function createComponent() {
    const fixture = TestBed.createComponent(CoursesCardListComponent);
    fixture.componentRef.setInput('courses', courses);
    fixture.detectChanges();
    return fixture;
  }

  it('should create the component', () => {
    const fixture = createComponent();

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render a card for each course', () => {
    const fixture = createComponent();

    const courseCards = fixture.nativeElement.querySelectorAll('.course-card');
    const courseTitles = Array.from(
      fixture.nativeElement.querySelectorAll('.course-title'),
      (element: Element) => element.textContent?.trim(),
    );

    expect(courseCards).toHaveLength(courses.length);
    expect(courseTitles).toEqual(courses.map((course) => course.title));
  });

  it('should emit courseEdit when clicking edit', () => {
    const fixture = createComponent();
    const emitSpy = vi.spyOn(fixture.componentInstance.courseEdit, 'emit');

    const editButton: HTMLButtonElement = fixture.nativeElement.querySelectorAll('.course-actions .btn')[1];
    editButton.click();

    expect(emitSpy).toHaveBeenCalledWith(courses[0]);
  });

  it('should emit courseDeleted with the course id when clicking delete', () => {
    const fixture = createComponent();
    const emitSpy = vi.spyOn(fixture.componentInstance.courseDeleted, 'emit');

    const deleteButton: HTMLImageElement = fixture.nativeElement.querySelector('.course-actions .delete');
    deleteButton.click();

    expect(emitSpy).toHaveBeenCalledWith(courses[0].id);
  });
});