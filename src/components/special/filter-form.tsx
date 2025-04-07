'use client';

import { useEffect, useState } from 'react';
import { Filter, Plus, Trash2, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useQueryString } from '@/hooks/use-query-string';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';

export type Filter = {
  label: string;
  field: string;
  options: string[];
};

type SelectedFilter = {
  id: string;
  field: string;
  value: string;
};

const FiltersForm = ({ filters }: { filters: Filter[] }) => {
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilter[]>([]);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const createQueryString = useQueryString();

  useEffect(() => {
    const newFilters: SelectedFilter[] = [];

    // Process each filter field
    filters.forEach(filter => {
      const paramValue = searchParams.get(filter.field);
      if (paramValue) {
        // Split comma-separated values and create a filter for each
        const values = paramValue.split(',');
        values.forEach(value => {
          // Only add if it's a valid option for this field
          if (filter.options.includes(value)) {
            newFilters.push({
              id: `${filter.field}-${value}-${Date.now()}-${Math.random()}`,
              field: filter.field,
              value: value,
            });
          }
        });
      }
    });

    setSelectedFilters(newFilters);
  }, [searchParams, filters]);

  const handleCreateFilter = () => {
    setSelectedFilters(prev => [
      ...prev,
      { id: Date.now().toString(), field: '', value: '' },
    ]);
  };

  const handleDeleteFilter = (id: string) => {
    const filterToRemove = selectedFilters.find(f => f.id === id);
    setSelectedFilters(prev => prev.filter(filter => filter.id !== id));

    if (filterToRemove?.field && filterToRemove?.value) {
      // Get all current filters for this field
      const remainingFilters = selectedFilters
        .filter(f => f.id !== id && f.field === filterToRemove.field)
        .map(f => f.value);

      // If no more filters for this field, remove the parameter
      // Otherwise, update with remaining values
      if (remainingFilters.length === 0) {
        router.push(
          pathname + '?' + createQueryString(filterToRemove.field, '')
        );
      } else {
        router.push(
          pathname +
            '?' +
            createQueryString(filterToRemove.field, remainingFilters.join(','))
        );
      }
    }
  };

  const handleUpdateFilter = (
    id: string,
    type: 'field' | 'value',
    newValue: string
  ) => {
    setSelectedFilters(prev =>
      prev.map(filter => {
        if (filter.id === id) {
          // If changing the field, reset the value
          if (type === 'field') {
            return { ...filter, field: newValue, value: '' };
          }
          return { ...filter, [type]: newValue };
        }
        return filter;
      })
    );

    const updatedFilter = selectedFilters.find(f => f.id === id);
    if (updatedFilter) {
      const finalField = type === 'field' ? newValue : updatedFilter.field;
      const finalValue = type === 'value' ? newValue : updatedFilter.value;

      if (finalField && finalValue) {
        // Get all values for this field, including the new one
        const allValuesForField = selectedFilters
          .filter(f => f.id !== id && f.field === finalField)
          .map(f => f.value);

        // Add the new value if it's a value update
        if (type === 'value') {
          allValuesForField.push(finalValue);
        }

        // Update URL with all values for this field
        router.push(
          pathname +
            '?' +
            createQueryString(finalField, allValuesForField.join(','))
        );
      }
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size='sm'
          variant='outline'
          className={cn(
            'text-muted-foreground text-xs',
            selectedFilters.length >= 1 &&
              'bg-amber-200/15! border-amber-200! text-amber-400! hover:bg-amber-200/35!'
          )}
        >
          <Filter className='size-3.5 mr-1' />
          {selectedFilters.length || null} Filter
          {selectedFilters.length >= 1 && (
            <span
              className=' hover:bg-amber-200 p-0.5 rounded-full'
              onClick={e => {
                e.preventDefault();
                setSelectedFilters([]);
                router.push(pathname);
              }}
            >
              <X className='size-4' strokeWidth={2} />
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto'>
        <div className='min-w-[415px] space-y-4'>
          <div className='flex items-center justify-between'>
            <h2 className='font-medium'>Filters</h2>
            <Button
              size='sm'
              variant='ghost'
              className='text-muted-foreground'
              onClick={() => {
                setSelectedFilters([]);
                router.push(pathname);
              }}
            >
              Clear all
            </Button>
          </div>

          <ul className='space-y-2'>
            {selectedFilters.length > 0 ? (
              selectedFilters.map(filter => (
                <li className='flex items-center gap-2' key={filter.id}>
                  <Select
                    value={filter.field}
                    onValueChange={value =>
                      handleUpdateFilter(filter.id, 'field', value)
                    }
                  >
                    <SelectTrigger className='w-[180px]'>
                      <SelectValue placeholder='Select field' />
                    </SelectTrigger>
                    <SelectContent>
                      {filters.map(f => (
                        <SelectItem key={f.field} value={f.field}>
                          {f.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={filter.value}
                    onValueChange={value =>
                      handleUpdateFilter(filter.id, 'value', value)
                    }
                    disabled={!filter.field}
                  >
                    <SelectTrigger className='w-[180px]'>
                      <SelectValue placeholder='Select value' />
                    </SelectTrigger>
                    <SelectContent>
                      {filter.field &&
                        filters
                          .find(f => f.field === filter.field)
                          ?.options.map(option => (
                            <SelectItem
                              key={option}
                              value={option}
                              className='capitalize'
                            >
                              {option}
                            </SelectItem>
                          ))}
                    </SelectContent>
                  </Select>

                  <Button
                    size='icon'
                    variant='ghost'
                    className='text-muted-foreground shrink-0'
                    onClick={() => handleDeleteFilter(filter.id)}
                  >
                    <Trash2 className='size-4' strokeWidth={1.5} />
                  </Button>
                </li>
              ))
            ) : (
              <p className='text-sm text-muted-foreground text-center py-2'>
                No filters applied
              </p>
            )}
          </ul>

          <Button size='sm' variant='outline' onClick={handleCreateFilter}>
            <Plus className='size-4 mr-1.5' strokeWidth={1.5} />
            Add filter
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FiltersForm;
