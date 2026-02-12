import type {
  CategoryCode,
  CategoryGroup,
  CategoryOption,
  CategoryOptionDB,
  CategoryType,
} from './types';

/**
 * Converts a database category option to an application category option
 */
export function toCategoryOption(dbOption: CategoryOptionDB): CategoryOption {
  const baseOption = {
    id: dbOption.id,
    type: dbOption.type,
    code: dbOption.code,
    name: dbOption.name,
    ...(dbOption.sort_order !== null && { sort_order: dbOption.sort_order }),
    ...(dbOption.icon !== null && { icon: dbOption.icon }),
    ...(dbOption.image_url !== null && { image_url: dbOption.image_url }),
  };

  // Type assertion is safe here because CategoryOptionDB guarantees the correct type-code relationship
  return baseOption as CategoryOption;
}

/**
 * Groups category options by type
 */
export function groupCategoriesByType(
  categories: CategoryOption[],
): CategoryGroup[] {
  const grouped = categories.reduce((acc, category) => {
    if (!acc[category.type]) {
      acc[category.type] = [];
    }
    acc[category.type].push(category);
    return acc;
  }, {} as Record<CategoryType, CategoryOption[]>);

  return Object.entries(grouped).map(([type, options]) => ({
    type: type as CategoryType,
    options: options.sort((a, b) => {
      const aOrder = a.sort_order ?? Number.MAX_SAFE_INTEGER;
      const bOrder = b.sort_order ?? Number.MAX_SAFE_INTEGER;
      return aOrder - bOrder;
    }),
  }));
}

/**
 * CategoryGroup 배열에서 특정 타입의 옵션 목록을 반환
 */
export const getOptionsByType = (
  groups: CategoryGroup[],
  type: CategoryType,
): CategoryOption[] => {
  return groups.find(g => g.type === type)?.options ?? [];
};

/**
 * Finds a category option by type and code
 */
export function findCategoryOption(
  categories: CategoryOption[],
  type: CategoryType,
  code: CategoryCode,
): CategoryOption | undefined {
  return categories.find(cat => cat.type === type && cat.code === code);
}
