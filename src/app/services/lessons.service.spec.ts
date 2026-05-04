import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { Lesson } from '../models/lesson.model';
import { LessonsService } from './lessons.service';

describe('LessonsService', () => {
  let service: LessonsService;
  let httpTestingController: HttpTestingController;

  const mockLesson: Lesson = {
    id: '10',
    description: 'Signals basics',
    duration: '5:00',
    seqNo: 1,
    courseId: 1,
    videoId: 'abc123',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LessonsService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(LessonsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should load lessons without query params when no filters are passed', async () => {
    const loadPromise = service.loadLessons({});

    const req = httpTestingController.expectOne('/api/search-lessons');
    expect(req.request.method).toBe('GET');
    expect(req.request.params.keys()).toEqual([]);

    req.flush({ lessons: [mockLesson] });

    await expect(loadPromise).resolves.toEqual([mockLesson]);
  });

  it('should load lessons with courseId and query params', async () => {
    const loadPromise = service.loadLessons({
      courseId: '1',
      query: 'signals',
    });

    const req = httpTestingController.expectOne((request) => {
      return request.url === '/api/search-lessons';
    });

    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('courseId')).toBe('1');
    expect(req.request.params.get('query')).toBe('signals');

    req.flush({ lessons: [mockLesson] });

    await expect(loadPromise).resolves.toEqual([mockLesson]);
  });

  it('should save lesson changes', async () => {
    const changes = {
      description: 'Signals advanced',
      duration: '7:00',
    };

    const updatedLesson: Lesson = {
      ...mockLesson,
      ...changes,
    };

    const savePromise = service.saveLesson(mockLesson.id, changes);

    const req = httpTestingController.expectOne(`/api/lessons/${mockLesson.id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(changes);

    req.flush(updatedLesson);

    await expect(savePromise).resolves.toEqual(updatedLesson);
  });
});