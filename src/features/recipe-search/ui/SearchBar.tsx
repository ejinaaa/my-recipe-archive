'use client';

import { useState, useEffect, useRef } from 'react';
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
  disabled?: boolean;
}

export function SearchBar({
  defaultValue = '',
  onSearch,
  placeholder = '어떤 요리를 찾으세요?',
  disabled,
}: SearchBarProps) {
  const [inputValue, setInputValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);
  const isSearchingRef = useRef(false);

  // defaultValue 변경 시 inputValue 동기화
  useEffect(() => {
    setInputValue(defaultValue);
  }, [defaultValue]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === 'Enter') {
      isSearchingRef.current = true;
      onSearch(inputValue);
      inputRef.current?.blur();
    }
  };

  const handleClear = () => {
    setInputValue('');
    inputRef.current?.focus();
  };

  const handleBlur = () => {
    if (isSearchingRef.current) {
      isSearchingRef.current = false;
      return;
    }
    setInputValue(defaultValue);
  };

  return (
    <InputGroup size='sm' className='flex-1' disabled={disabled}>
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      <InputGroupInput
        ref={inputRef}
        placeholder={placeholder}
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
      />
      {inputValue && (
        <InputGroupButton
          onMouseDown={e => e.preventDefault()}
          onClick={handleClear}
          aria-label='검색어 삭제'
          className='bg-white/80'
        >
          <X />
        </InputGroupButton>
      )}
    </InputGroup>
  );
}
