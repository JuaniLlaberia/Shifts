'use client';

import { useState } from 'react';
import { Edit3, MoreHorizontal, Trash2 } from 'lucide-react';
import { useParams } from 'next/navigation';

import LocationForm from '@/components/special/location-form';
import DeleteLocationDialog from './delete-location-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LocationWithNumberCoords } from './locations-list';

type LocationActionsProps = {
  locationData: LocationWithNumberCoords;
};

const LocationsActions = ({ locationData }: LocationActionsProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { businessId } = useParams<{ businessId: string }>();

  return (
    <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='icon'
          className={cn(
            'absolute top-4 right-4 z-[500]',
            isMenuOpen
              ? 'flex'
              : 'opacity-0 group-hover:opacity-100 focus:opacity-100'
          )}
        >
          <span className='sr-only'>Open menu</span>
          <MoreHorizontal
            className='size-4 text-muted-foreground'
            strokeWidth={1.5}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        side='bottom'
        className='z-[500]'
        avoidCollisions={true}
      >
        <LocationForm
          businessId={businessId}
          locationData={locationData}
          onClose={() => setIsMenuOpen(false)}
        >
          <DropdownMenuItem onSelect={e => e.preventDefault()}>
            <Edit3 className='size-3.5 mr-1' />
            Edit Location
          </DropdownMenuItem>
        </LocationForm>

        <DeleteLocationDialog
          businessId={businessId}
          locationId={locationData.id}
          onClose={() => setIsMenuOpen(false)}
        >
          <DropdownMenuItem
            className='hover:text-red-400! hover:[&_svg]:stroke-red-400 hover:cursor-pointer'
            onSelect={e => e.preventDefault()}
          >
            <Trash2 className='size-3.5 mr-1' />
            Delete Location
          </DropdownMenuItem>
        </DeleteLocationDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LocationsActions;
