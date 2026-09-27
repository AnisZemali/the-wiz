import data from './courses.generated.json';
import { assetPath } from './hosting';

export const courses = data.map(course => ({ ...course, previewUrl: assetPath(course.previewUrl) }));
export type Course = (typeof courses)[number];
export const courseYears = [1, 2, 3, 4, 5, 6];
export const courseHref = (course: Course) => `/courses/year-${course.year}/${course.slug}`;
