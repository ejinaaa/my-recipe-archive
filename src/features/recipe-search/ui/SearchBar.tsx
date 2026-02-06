'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from '@/shared/ui/input-group';

interface SearchBarProps {
  defaultValue?: string;
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({
  defaultValue = '',
  onSearch,
  placeholder = '어떤 요리를 찾으세요?',
}: SearchBarProps) {
  const [inputValue, setInputValue] = useState(defaultValue);

  // defaultValue 변경 시 inputValue 동기화
  useEffect(() => {
    setInputValue(defaultValue);
  }, [defaultValue]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue) {
      onSearch(inputValue);
    }
  };

  return (
    <InputGroup size='sm' className='flex-1'>
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      <InputGroupInput
        placeholder={placeholder}
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {inputValue && (
        <InputGroupButton
          onClick={() => setInputValue('')}
          aria-label='검색어 삭제'
          className='bg-white/80'
        >
          <X />
        </InputGroupButton>
      )}
    </InputGroup>
  );
}
