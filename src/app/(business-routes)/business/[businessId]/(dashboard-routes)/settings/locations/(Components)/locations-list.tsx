'use client';

import dynamic from 'next/dynamic';
import { Location } from '@prisma/client';
import { Loader2, MapPin, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import LocationForm from '@/components/special/location-form';
import LocationsActions from './locations-actions';

const Map = dynamic(() => import('@/components/ui/map'), {
  loading: () => (
    <div className='flex flex-col items-center justify-center w-full h-full gap-2'>
      <Loader2 className='size-6 animate-spin text-muted-foreground' />
      <p className='text-sm font-medium text-muted-foreground'>Loading map</p>
    </div>
  ),
  ssr: false,
});

export type LocationWithNumberCoords = Omit<
  Location,
  'latitude' | 'longitude'
> & {
  latitude: number;
  longitude: number;
};

type LocationsListProps = {
  locations: LocationWithNumberCoords[];
  businessId: string;
};

const LocationsList = ({ locations, businessId }: LocationsListProps) => {
  return (
    <div className='p-8 pt-2 space-y-4'>
      <ul className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3'>
        {locations.map(location => (
          <li
            key={location.id}
            className='relative flex flex-col max-w-xl p-3 border border-border rounded-xl bg-background group'
          >
            <div className='w-full h-48 bg-gray-50 rounded-lg border border-border overflow-hidden'>
              <Map
                initialZoom={16}
                position={[location.latitude, location.longitude]}
              />
            </div>
            <div className='space-y-1 px-1'>
              <h3 className='flex items-center gap-2 font-medium mt-4'>
                <MapPin className='size-4 shrink-0' /> {location.name}
              </h3>
              <p className='text-sm text-muted-foreground line-clamp-3'>
                {location.address}
              </p>
            </div>
            <LocationsActions locationData={location} />
          </li>
        ))}
      </ul>
      <LocationForm businessId={businessId}>
        <Button size='sm'>
          <Plus className='size-4 mr-1' />
          Add Location
        </Button>
      </LocationForm>
    </div>
  );
};

export default LocationsList;
