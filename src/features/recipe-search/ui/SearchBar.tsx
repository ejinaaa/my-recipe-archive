'use client';

import { Search, X } from 'lucide-react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from '@/shared/ui/input-group';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = '어떤 요리를 찾으세요?',
}: SearchBarProps) {
  const handleClear = () => {
    onChange('');
  };

  return (
    <InputGroup size='sm' className='flex-1'>
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      <InputGroupInput
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      {value && (
        <InputGroupButton
          onClick={handleClear}
          aria-label='검색어 지우기'
          className='bg-white'
        >
          <X />
        </InputGroupButton>
      )}
    </InputGroup>
  );
}
