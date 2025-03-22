import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Suggestion {
  id: string | number;
  text: string;
  value: string;
  secondaryText?: string;
  icon?: React.ReactNode;
}

interface AutoSuggestProps {
  suggestions: Suggestion[];
  placeholder?: string;
  onSelect: (value: string) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  className?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  error?: boolean;
  name?: string;
  required?: boolean;
  id?: string;
}

export function AutoSuggest({
  suggestions,
  placeholder = '',
  onSelect,
  onChange,
  value = '',
  className,
  icon,
  disabled = false,
  error = false,
  name,
  required = false,
  id,
}: AutoSuggestProps) {
  const [inputValue, setInputValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<Suggestion[]>(suggestions);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update internal state when prop value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Handle filtering of suggestions as user types
  useEffect(() => {
    if (inputValue) {
      const filtered = suggestions.filter(
        (s) =>
          s.text.toLowerCase().includes(inputValue.toLowerCase()) ||
          (s.secondaryText && s.secondaryText.toLowerCase().includes(inputValue.toLowerCase()))
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions(suggestions);
    }
  }, [inputValue, suggestions]);

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    // Call parent onChange if provided
    if (onChange) {
      onChange(e);
    }

    if (!isOpen && e.target.value) {
      setIsOpen(true);
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setInputValue(suggestion.text);
    onSelect(suggestion.value);
    setIsOpen(false);
  };

  return (
    <div className={cn('relative w-full', className)} ref={containerRef}>
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            {icon}
          </div>
        )}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={cn(
            'w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
            icon && 'pl-10',
            error ? 'border-destructive' : 'border-gray-300',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
            disabled && 'cursor-not-allowed opacity-50'
          )}
          disabled={disabled}
          name={name}
          required={required}
          id={id}
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground"
        >
          <ChevronsUpDown className="h-4 w-4" />
        </button>
      </div>

      {isOpen && filteredSuggestions.length > 0 && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-input bg-white shadow-md animate-in fade-in-80">
          <div className="py-1">
            {filteredSuggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className={cn(
                  'flex cursor-pointer items-center px-3 py-2 hover:bg-gray-100',
                  inputValue === suggestion.text && 'bg-gray-100'
                )}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.icon && <span className="mr-2">{suggestion.icon}</span>}
                <div className="flex-1">
                  <div className="text-sm font-medium">{suggestion.text}</div>
                  {suggestion.secondaryText && (
                    <div className="text-xs text-gray-500">{suggestion.secondaryText}</div>
                  )}
                </div>
                {inputValue === suggestion.text && <Check className="ml-2 h-4 w-4" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
