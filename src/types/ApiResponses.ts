import Chapter from './Chapter';

export interface BaseResponse {
  status?: number;
  error?: string;
}

export interface ChapterResponse extends BaseResponse {
  chapter: Chapter;
}
