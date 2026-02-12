/**
 * Category Types
 * Generated from Supabase category_options table schema
 */

/**
 * 카테고리 타입
 */
export type CategoryType = 'situation' | 'cuisine' | 'dishType';

/**
 * 상황별 카테고리 코드
 */
export type SituationCode =
  | 'daily' // 일상
  | 'speed' // 초스피드
  | 'guest' // 손님접대
  | 'solo' // 혼밥
  | 'diet' // 다이어트
  | 'bento' // 도시락
  | 'snack' // 술안주/야식
  | 'camping' // 캠핑/나들이
  | 'healing' // 해장/보양
  | 'baby' // 이유식/키즈
  | 'holiday' // 명절
  | 'etc'; // 기타

/**
 * 장르/나라별 카테고리 코드
 */
export type CuisineCode =
  | 'korean' // 한식
  | 'bunsik' // 분식
  | 'western' // 양식
  | 'mexican' // 멕시칸
  | 'chinese' // 중식
  | 'japanese' // 일식
  | 'asian' // 동남아식
  | 'fusion' // 퓨전
  | 'etc'; // 기타

/**
 * 요리 종류별 카테고리 코드
 */
export type DishTypeCode =
  | 'rice' // 밥/죽
  | 'noodle' // 면요리
  | 'soup' // 국/탕
  | 'stew' // 찌개/전골
  | 'salad' // 샐러드/무침
  | 'main_dish' // 메인반찬
  | 'bread' // 샌드위치/토스트
  | 'side_dish' // 밑반찬/김치
  | 'dessert' // 디저트/베이킹
  | 'sauce' // 양념/소스/잼
  | 'drink' // 음료/차
  | 'etc'; // 기타

/**
 * 모든 카테고리 코드의 유니온 타입
 */
export type CategoryCode = SituationCode | CuisineCode | DishTypeCode;

/**
 * Database representation of a category option
 * Matches the category_options table schema in Supabase
 */
export interface CategoryOptionDB {
  /** Unique identifier */
  id: number;
  /** Category type */
  type: CategoryType;
  /** Category code (unique identifier within type) */
  code: CategoryCode;
  /** Display name for the category */
  name: string;
  /** Sort order for display */
  sort_order: number | null;
  /** Icon (emoji or icon name) */
  icon: string | null;
  /** Image URL */
  image_url: string | null;
}

/**
 * Application-level category option type
 * Discriminated union that ensures type-safe code based on type
 */
export type CategoryOption =
  | {
      /** Unique identifier */
      id: number;
      /** 상황별 카테고리 */
      type: 'situation';
      /** 상황 코드 */
      code: SituationCode;
      /** 카테고리 이름 */
      name: string;
      /** 정렬 순서 */
      sort_order?: number;
      /** 아이콘 (이모지) */
      icon?: string;
      /** 이미지 URL */
      image_url?: string;
    }
  | {
      /** Unique identifier */
      id: number;
      /** 장르/나라별 카테고리 */
      type: 'cuisine';
      /** 장르 코드 */
      code: CuisineCode;
      /** 카테고리 이름 */
      name: string;
      /** 정렬 순서 */
      sort_order?: number;
      /** 아이콘 (이모지) */
      icon?: string;
      /** 이미지 URL */
      image_url?: string;
    }
  | {
      /** Unique identifier */
      id: number;
      /** 요리 종류별 카테고리 */
      type: 'dishType';
      /** 요리 종류 코드 */
      code: DishTypeCode;
      /** 카테고리 이름 */
      name: string;
      /** 정렬 순서 */
      sort_order?: number;
      /** 아이콘 (이모지) */
      icon?: string;
      /** 이미지 URL */
      image_url?: string;
    };

/**
 * Type for creating a new category option
 * Discriminated union that ensures type-safe code based on type
 */
export type CategoryOptionInsert =
  | {
      /** 상황별 카테고리 */
      type: 'situation';
      /** 상황 코드 */
      code: SituationCode;
      /** 카테고리 이름 */
      name: string;
      /** 정렬 순서 */
      sort_order?: number;
      /** 아이콘 (이모지) */
      icon?: string;
      /** 이미지 URL */
      image_url?: string;
    }
  | {
      /** 장르/나라별 카테고리 */
      type: 'cuisine';
      /** 장르 코드 */
      code: CuisineCode;
      /** 카테고리 이름 */
      name: string;
      /** 정렬 순서 */
      sort_order?: number;
      /** 아이콘 (이모지) */
      icon?: string;
      /** 이미지 URL */
      image_url?: string;
    }
  | {
      /** 요리 종류별 카테고리 */
      type: 'dishType';
      /** 요리 종류 코드 */
      code: DishTypeCode;
      /** 카테고리 이름 */
      name: string;
      /** 정렬 순서 */
      sort_order?: number;
      /** 아이콘 (이모지) */
      icon?: string;
      /** 이미지 URL */
      image_url?: string;
    };

/**
 * Type for updating an existing category option
 * All fields are optional
 */
export interface CategoryOptionUpdate {
  /** Category type */
  type?: CategoryType;
  /** Category code */
  code?: CategoryCode;
  /** Display name */
  name?: string;
  /** Sort order for display */
  sort_order?: number;
  /** 아이콘 (이모지) */
  icon?: string;
  /** 이미지 URL */
  image_url?: string;
}

/**
 * Categories grouped by type
 */
export interface CategoryGroup {
  /** Category type */
  type: CategoryType;
  /** List of options for this type */
  options: CategoryOption[];
}

