import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

interface IngredientItemProps {
  /** 재료명 */
  name: string;
  /** 분량 */
  amount: string;
  /** 단위 */
  unit: string;
  /** 필드 변경 핸들러 */
  onFieldChange: (field: 'name' | 'amount' | 'unit', value: string) => void;
  /** 현재 위치에 재료 추가 핸들러 */
  onInsert: () => void;
  /** 현재 재료 삭제 핸들러 */
  onRemove: () => void;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 삭제 버튼 비활성화 여부 */
  removeDisabled?: boolean;
}

export function IngredientItem({
  name,
  amount,
  unit,
  onFieldChange,
  onInsert,
  onRemove,
  disabled,
  removeDisabled,
}: IngredientItemProps) {
  return (
    <div className='flex gap-2 items-center'>
      {/* 재료명 */}
      <Input
        size='sm'
        placeholder='감자'
        value={name}
        onChange={e => onFieldChange('name', e.target.value)}
        disabled={disabled}
        className='flex-1'
      />
      {/* 분량 */}
      <Input
        size='sm'
        placeholder='2'
        value={amount}
        onChange={e => onFieldChange('amount', e.target.value)}
        disabled={disabled}
        className='w-16'
      />
      {/* 단위 */}
      <Input
        size='sm'
        placeholder='개'
        value={unit}
        onChange={e => onFieldChange('unit', e.target.value)}
        disabled={disabled}
        className='w-16'
      />
      <Button
        type='button'
        variant='solid'
        colorScheme='neutral'
        size='sm'
        onClick={onInsert}
        disabled={disabled}
        className='size-10 p-0 shrink-0'
      >
        <Plus className='size-4' />
      </Button>
      <Button
        type='button'
        variant='solid'
        colorScheme='neutral'
        size='sm'
        onClick={onRemove}
        disabled={removeDisabled}
        className='size-10 p-0 shrink-0'
      >
        <Trash2 className='size-4' />
      </Button>
    </div>
  );
}
