'use client';

import { useState } from 'react';
import { Search, CornerDownLeft } from 'lucide-react';
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
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = () => {
    if (inputValue) {
      onSearch(inputValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const showSearchButton = isFocused && inputValue;

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
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {showSearchButton && (
        <InputGroupButton
          onMouseDown={e => e.preventDefault()}
          onClick={handleSearch}
          aria-label='검색'
          className='bg-primary-base text-white hover:bg-primary-base/90'
        >
          <CornerDownLeft />
        </InputGroupButton>
      )}
    </InputGroup>
  );
}
