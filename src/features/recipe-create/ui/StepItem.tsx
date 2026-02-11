import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';

interface StepItemProps {
  /** 단계 번호 */
  stepNumber: number;
  /** 단계 설명 */
  description: string;
  /** 설명 변경 핸들러 */
  onDescriptionChange: (value: string) => void;
  /** 현재 위치에 단계 추가 핸들러 */
  onInsert: () => void;
  /** 현재 단계 삭제 핸들러 */
  onRemove: () => void;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 삭제 버튼 비활성화 여부 */
  removeDisabled?: boolean;
}

export function StepItem({
  stepNumber,
  description,
  onDescriptionChange,
  onInsert,
  onRemove,
  disabled,
  removeDisabled,
}: StepItemProps) {
  return (
    <div className='flex gap-2 items-start'>
      <div className='shrink-0 size-8 rounded-full bg-secondary-base text-white flex items-center justify-center text-body-2 font-medium mt-2'>
        {stepNumber}
      </div>
      <Textarea
        placeholder={`${stepNumber}단계에서 할 일을 알려주세요`}
        value={description}
        onChange={e => onDescriptionChange(e.target.value)}
        disabled={disabled}
        className='flex-1 min-h-20'
        size='sm'
      />
      <Button
        type='button'
        variant='solid'
        colorScheme='neutral'
        size='sm'
        onClick={onInsert}
        disabled={disabled}
        className='size-10 p-0 shrink-0 mt-2'
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
        className='size-10 p-0 shrink-0 mt-2'
      >
        <Trash2 className='size-4' />
      </Button>
    </div>
  );
}
