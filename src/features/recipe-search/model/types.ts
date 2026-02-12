/**
 * 카테고리 필터 타입
 * 각 타입별로 선택된 카테고리 코드 배열
 */
export interface CategoryFilters {
  situation: string[];
  cuisine: string[];
  dishType: string[];
}

/**
 * 조리시간 범위 타입 (분 단위)
 */
export interface CookingTimeRange {
  min: number;
  max: number;
}
