import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Search, Check } from 'lucide-react';

export interface Select2Option {
  value: string;
  label: string;
  icon?: React.ReactNode;
  color?: string;
}

interface Select2Props {
  options: Select2Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;
  disabled?: boolean;
}

export function Select2({
  options,
  value,
  onChange,
  placeholder = 'Select an option...',
  searchable = true,
  disabled = false,
}: Select2Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  const filtered = search.trim()
    ? options.filter((o) =>
        o.label.toLowerCase().includes(search.toLowerCase())
      )
    : options;

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setSearch('');
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Auto-focus search input when opened
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      // Small delay for animation
      const t = setTimeout(() => searchInputRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [isOpen, searchable]);

  const handleSelect = useCallback(
    (optionValue: string) => {
      onChange(optionValue);
      setIsOpen(false);
      setSearch('');
    },
    [onChange]
  );

  const toggleOpen = useCallback(() => {
    if (!disabled) {
      setIsOpen((prev) => {
        if (prev) setSearch('');
        return !prev;
      });
    }
  }, [disabled]);

  return (
    <div ref={containerRef} className="relative">
      {/* ── Trigger Button ── */}
      <button
        type="button"
        onClick={toggleOpen}
        disabled={disabled}
        className={`
          group flex w-full items-center justify-between gap-2
          rounded-xl border bg-white px-4 py-3
          text-left text-[14px] font-semibold
          shadow-sm outline-none
          transition-all duration-200
          ${
            isOpen
              ? 'border-brand-blue ring-2 ring-brand-blue/25 shadow-[0_0_0_3px_rgba(75,137,205,0.08)]'
              : 'border-slate-200 hover:border-slate-300'
          }
          ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        `}
      >
        {selectedOption ? (
          <span className="flex items-center gap-2.5 truncate text-slate-700">
            {selectedOption.color && (
              <span
                className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: selectedOption.color }}
              />
            )}
            {selectedOption.icon}
            {selectedOption.label}
          </span>
        ) : (
          <span className="truncate text-slate-400">{placeholder}</span>
        )}

        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="shrink-0 text-slate-400 group-hover:text-slate-500"
        >
          <ChevronDown className="h-4.5 w-4.5" strokeWidth={2.2} />
        </motion.span>
      </button>

      {/* ── Dropdown Panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
            className="absolute left-0 right-0 top-[calc(100%+6px)] z-[100] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_12px_36px_rgba(15,23,42,0.12),0_4px_12px_rgba(15,23,42,0.06)]"
          >
            {/* ── Search Field ── */}
            {searchable && (
              <div className="border-b border-slate-100 p-2">
                <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
                  <Search
                    className="h-4 w-4 shrink-0 text-slate-400"
                    strokeWidth={2}
                  />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="w-full bg-transparent text-[13px] font-medium text-slate-700 placeholder:text-slate-400 outline-none"
                  />
                </div>
              </div>
            )}

            {/* ── Options List ── */}
            <div className="max-h-[220px] overflow-y-auto p-1.5 hrms-scroll">
              {filtered.length === 0 ? (
                <div className="px-3 py-6 text-center text-[13px] font-medium text-slate-400">
                  No results found
                </div>
              ) : (
                filtered.map((option, index) => {
                  const isSelected = option.value === value;
                  return (
                    <motion.button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option.value)}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.15,
                        delay: index * 0.03,
                        ease: 'easeOut',
                      }}
                      className={`
                        flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5
                        text-left text-[13.5px] font-semibold
                        transition-all duration-150
                        ${
                          isSelected
                            ? 'bg-brand-blue/8 text-brand-blue'
                            : 'text-slate-600 hover:bg-slate-50 active:bg-slate-100'
                        }
                      `}
                    >
                      {/* Color dot */}
                      {option.color && (
                        <span
                          className={`inline-block h-2.5 w-2.5 shrink-0 rounded-full transition-transform ${
                            isSelected ? 'scale-110' : ''
                          }`}
                          style={{ backgroundColor: option.color }}
                        />
                      )}

                      {/* Icon */}
                      {option.icon}

                      {/* Label */}
                      <span className="flex-1 truncate">{option.label}</span>

                      {/* Checkmark for selected */}
                      {isSelected && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 20,
                          }}
                        >
                          <Check
                            className="h-4 w-4 text-brand-blue"
                            strokeWidth={2.5}
                          />
                        </motion.span>
                      )}
                    </motion.button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
