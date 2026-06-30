import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LandingPageContent, SiteContent, SiteContentResponse } from '../models/site-content.models';

export interface Lesson {
  id: string;
  course_id?: string;
  title: string;
  bunny_video_id?: string | null;
  order_index: number;
  created_at?: string;
}

export interface Course {
  id: string;
  title: string;
  description?: string | null;
  is_published: boolean;
  created_at?: string;
  lessons?: Lesson[];
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface CoursePayload {
  title: string;
  description?: string;
  is_published: boolean;
}

export interface LessonPayload {
  course_id: string;
  title: string;
  bunny_video_id?: string;
  order_index: number;
}

export interface UserProfile {
  id: string;
  email: string;
  is_admin: boolean;
  device_fingerprint?: string | null;
  created_at?: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = '/api';
  private readonly httpOptions = { withCredentials: true };

  constructor(private readonly http: HttpClient) {}

  health(): Observable<{ ok: boolean; service: string; timestamp: string }> {
    return this.http.get<{ ok: boolean; service: string; timestamp: string }>(
      `${this.baseUrl}/health`,
      this.httpOptions,
    );
  }

  register(payload: RegisterPayload): Observable<{ message: string; user: { id: string; email: string } }> {
    return this.http.post<{ message: string; user: { id: string; email: string } }>(
      `${this.baseUrl}/auth/register`,
      payload,
      this.httpOptions,
    );
  }

  login(payload: LoginPayload): Observable<{ success: boolean; is_admin?: boolean }> {
    return this.http.post<{ success: boolean; is_admin?: boolean }>(
      `${this.baseUrl}/auth/login`,
      payload,
      this.httpOptions,
    );
  }

  getMe(): Observable<{ user: { id: string; email: string }; profile: UserProfile }> {
    return this.http.get<{ user: { id: string; email: string }; profile: UserProfile }>(
      `${this.baseUrl}/user/me`,
      this.httpOptions,
    );
  }

  logout(): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.baseUrl}/auth/logout`, {}, this.httpOptions);
  }

  changeAdminPassword(payload: ChangePasswordPayload): Observable<{ success: boolean }> {
    return this.http.patch<{ success: boolean }>(
      `${this.baseUrl}/admin/password`,
      payload,
      this.httpOptions,
    );
  }

  getPublicCourses(): Observable<{ courses: Course[] }> {
    return this.http.get<{ courses: Course[] }>(`${this.baseUrl}/courses`, this.httpOptions);
  }

  getAdminCourses(): Observable<{ courses: Course[] }> {
    return this.http.get<{ courses: Course[] }>(`${this.baseUrl}/admin/courses`, this.httpOptions);
  }

  createCourse(payload: CoursePayload): Observable<{ course: Course }> {
    return this.http.post<{ course: Course }>(`${this.baseUrl}/admin/courses`, payload, this.httpOptions);
  }

  updateCourse(id: string, payload: Partial<CoursePayload>): Observable<{ course: Course }> {
    return this.http.patch<{ course: Course }>(
      `${this.baseUrl}/admin/courses/${id}`,
      payload,
      this.httpOptions,
    );
  }

  deleteCourse(id: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.baseUrl}/admin/courses/${id}`, this.httpOptions);
  }

  createLesson(payload: LessonPayload): Observable<{ lesson: Lesson }> {
    return this.http.post<{ lesson: Lesson }>(`${this.baseUrl}/admin/lessons`, payload, this.httpOptions);
  }

  deleteLesson(id: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.baseUrl}/admin/lessons/${id}`, this.httpOptions);
  }

  getSiteContent(): Observable<SiteContentResponse> {
    return this.http.get<SiteContentResponse>(`${this.baseUrl}/site-content`, this.httpOptions);
  }

  getAdminSiteContent(): Observable<SiteContentResponse> {
    return this.http.get<SiteContentResponse>(`${this.baseUrl}/admin/site-content`, this.httpOptions);
  }

  putAdminSiteContent(content: SiteContent): Observable<SiteContentResponse> {
    return this.http.put<SiteContentResponse>(
      `${this.baseUrl}/admin/site-content`,
      { content },
      this.httpOptions,
    );
  }

  patchAdminSiteContent(body: {
    content?: Partial<SiteContent>;
    landing?: Partial<LandingPageContent>;
  }): Observable<SiteContentResponse> {
    return this.http.patch<SiteContentResponse>(
      `${this.baseUrl}/admin/site-content`,
      body,
      this.httpOptions,
    );
  }

  resetAdminSiteContent(): Observable<SiteContentResponse> {
    return this.http.post<SiteContentResponse>(
      `${this.baseUrl}/admin/site-content?action=reset`,
      {},
      this.httpOptions,
    );
  }
}
