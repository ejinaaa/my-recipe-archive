import type { CategoryOption } from '@/entities/category/model/types';
import { Badge } from '@/shared/ui/badge';
import { cn } from '@/shared/lib/utils';

interface CategoryOptionBadgeProps {
  /** 카테고리 옵션 */
  option: CategoryOption;
  /** 선택 상태 */
  selected: boolean;
  /** 클릭 핸들러 */
  onClick: () => void;
  /** 비활성화 여부 */
  disabled?: boolean;
}

export function CategoryOptionBadge({
  option,
  selected,
  onClick,
  disabled,
}: CategoryOptionBadgeProps) {
  return (
    <Badge
      variant='outline'
      colorScheme='neutral'
      selected={selected}
      onClick={() => !disabled && onClick()}
      className={cn(
        'cursor-pointer select-none',
        disabled && 'cursor-not-allowed opacity-50',
      )}
    >
      {option.icon}
      {option.name}
    </Badge>
  );
}
