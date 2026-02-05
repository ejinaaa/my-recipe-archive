'use client';

import { Search, CornerDownLeft } from 'lucide-react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from '@/shared/ui/input-group';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = '어떤 요리를 찾으세요?',
}: SearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value) {
      onSearch();
    }
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
        onKeyDown={handleKeyDown}
      />
      {value && (
        <InputGroupButton
          onClick={onSearch}
          aria-label='검색'
          className='bg-primary-base text-white hover:bg-primary-base/90'
        >
          <CornerDownLeft />
        </InputGroupButton>
      )}
    </InputGroup>
  );
}
