import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { Course } from '../models/course.model';
import { CoursesService } from './courses.service';

describe('CoursesService', () => {
  let service: CoursesService;
  let httpTestingController: HttpTestingController;

  const mockCourse: Course = {
    id: '1',
    title: 'Angular Signals',
    longDescription: 'Deep dive into Angular Signals',
    seqNo: 1,
    iconUrl: 'https://example.com/icon.png',
    price: 99,
    uploadedImageUrl: 'https://example.com/image.png',
    courseListIcon: 'description',
    category: 'BEGINNER',
    lessonsCount: 12,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CoursesService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(CoursesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should load all courses and return the courses array', async () => {
    const loadPromise = service.loadAllCourses();

    const req = httpTestingController.expectOne('/api/courses');
    expect(req.request.method).toBe('GET');

    req.flush({
      courses: [mockCourse],
    });

    await expect(loadPromise).resolves.toEqual([mockCourse]);
  });

  it('should get a course by id', async () => {
    const loadPromise = service.getCourseById(mockCourse.id);

    const req = httpTestingController.expectOne(`/api/courses/${mockCourse.id}`);
    expect(req.request.method).toBe('GET');

    req.flush(mockCourse);

    await expect(loadPromise).resolves.toEqual(mockCourse);
  });

  it('should create a course', async () => {
    const newCourse = {
      title: mockCourse.title,
      longDescription: mockCourse.longDescription,
      category: mockCourse.category,
    };

    const createPromise = service.createCourse(newCourse);

    const req = httpTestingController.expectOne('/api/courses');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newCourse);

    req.flush(mockCourse);

    await expect(createPromise).resolves.toEqual(mockCourse);
  });

  it('should save course changes', async () => {
    const changes = {
      title: 'Updated Angular Signals',
      price: 129,
    };
    const updatedCourse = {
      ...mockCourse,
      ...changes,
    };

    const savePromise = service.saveCourse(mockCourse.id, changes);

    const req = httpTestingController.expectOne(`/api/courses/${mockCourse.id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(changes);

    req.flush(updatedCourse);

    await expect(savePromise).resolves.toEqual(updatedCourse);
  });

  it('should delete a course', async () => {
    const deletePromise = service.deleteCourse(mockCourse.id);

    const req = httpTestingController.expectOne(`/api/courses/${mockCourse.id}`);
    expect(req.request.method).toBe('DELETE');

    req.flush(null);

    await expect(deletePromise).resolves.toBeNull();
  });
});