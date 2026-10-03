import type { MetadataRoute } from 'next';
import { site } from '@/lib/content';
import { courses, courseYears, courseHref } from '@/lib/courses';
export const dynamic = 'force-static';
export default function sitemap(): MetadataRoute.Sitemap {
 const paths=['','/courses',...courseYears.map(n=>`/courses/year-${n}`),...courses.map(courseHref)];
 return ['', '/fr', '/ar'].flatMap(prefix=>paths.map(path=>({url:`${site.url}${prefix}${path}`,lastModified:new Date(),changeFrequency:'monthly' as const,priority:path?0.7:1})));
}
