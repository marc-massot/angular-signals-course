import {
  afterNextRender, ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  computed,
  effect,
  EffectRef, ElementRef,
  inject,
  Injector,
  signal,
  viewChild
} from '@angular/core';
import {CoursesService} from "../services/courses.service";
import {Course, sortCoursesBySeqNo} from "../models/course.model";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {CoursesCardListComponent} from "../courses-card-list/courses-card-list.component";
import {MatDialog} from "@angular/material/dialog";
import {MessagesService} from "../messages/messages.service";
import {catchError, from, interval, Observable, startWith, throwError} from "rxjs";
import {toObservable, toSignal, outputToObservable, outputFromObservable} from "@angular/core/rxjs-interop";
import {CoursesServiceWithFetch} from "../services/courses-fetch.service";
import {openEditCourseDialog} from "../edit-course-dialog/edit-course-dialog.component";
import {LoadingService} from "../loading/loading.service";

@Component({
    selector: 'home',
    imports: [ MatTabGroup, MatTab, CoursesCardListComponent ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {

  #courses = signal<Course[]>([]);

  coursesService = inject(CoursesService);

  async loadCourses() {
    try {
      const courses = await this.coursesService.loadAllCourses();
      this.#courses.set(courses.sort(sortCoursesBySeqNo));
    }
    catch(err) {
      this.messageService.showMessage(`Error loading courses!`, "error");
      console.error(err);
    }
  }

  constructor() {
    this.loadCourses()
      .then(() => console.log(`All courses loaded:`, this.#courses()));

    effect(() => {
      console.log(`beginnersList: `, this.beginnersList())
    })

    effect(() => {
      console.log(`Beginner courses: `, this.beginnerCourses())
      console.log(`Advanced courses: `, this.advancedCourses())
    });

  }

  dialog = inject(MatDialog);

  beginnerCourses = computed(() => {
    const courses = this.#courses();
    return courses.filter(course =>
      course.category === "BEGINNER")
  });

  advancedCourses = computed(() => {
    const courses = this.#courses();
    return courses.filter(course =>
      course.category === "ADVANCED")
  });

  messageService = inject(MessagesService);

  beginnersList = viewChild<CoursesCardListComponent>("beginnersList");

  onCourseUpdated(updatedCourse: Course) {
    const courses = this.#courses();
    const newCourses = courses.map(course => (
      course.id === updatedCourse.id ? updatedCourse : course
    ));
    this.#courses.set(newCourses);
  }

  async onCourseDeleted(courseId: string) {
    try {
      await this.coursesService.deleteCourse(courseId);
      const courses = this.#courses();
      const newCourses = courses.filter(
        course => course.id !== courseId)
      this.#courses.set(newCourses);
    }
    catch (err) {
      console.error(err);
      this.messageService.showMessage(`Error deleting course.`, "error");
    }
  }

  async onAddCourse() {
    const courseProps = await openEditCourseDialog(
      this.dialog,
      {
        title: "Create New Course"
      }
    )
    if (!courseProps) {
      return;
    }
    try {
      const newCourse = await this.coursesService.createCourse(courseProps);
      this.#courses.set([...this.#courses(), newCourse]);
    }
    catch (err) {
      console.error(err);
      this.messageService.showMessage(`Error creating the course!`, "error");
    }
  }

  async onEditCourse(course: Course) {
    const courseProps = await openEditCourseDialog(
      this.dialog,
      {
        title: "Update Existing Course",
        course
      }
    )
    if (!courseProps) {
      return;
    }
    try {
      const updatedCourse = await this.coursesService.saveCourse(course.id, courseProps);
      this.onCourseUpdated(updatedCourse);
    }
    catch (err) {
      console.error(err);
      this.messageService.showMessage(`Failed to save the course.`, "error");
    }
  }

  onToObservableExample() {
    const numbers = signal(0);
    numbers.set(1);
    numbers.set(2);
    numbers.set(3);
    const numbers$ = toObservable(numbers, {
      injector: this.injector
    });
    numbers.set(4);
    numbers$.subscribe(val => {
      console.log(`numbers$: `, val)
    })
    numbers.set(5);
  }


  injector = inject(Injector);

  onToSignalExample() {
    try {
      const courses$ = from(this.coursesService.loadAllCourses())
        .pipe(
          catchError(err => {
            console.log(`Error caught in catchError`, err)
            throw err;
          })
        );
      const courses = toSignal(courses$, {
        injector: this.injector,
        
        
      })
      effect(() => {
        console.log(`Courses: `, courses())
      }, {
        injector: this.injector
      })

      setInterval(() => {
        console.log(`Reading courses signal: `, courses())
      }, 1000)

    }
    catch (err) {
      console.log(`Error in catch block: `, err)
    }

  }

}













