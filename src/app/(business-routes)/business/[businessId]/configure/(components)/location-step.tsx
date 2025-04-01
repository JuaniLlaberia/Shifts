'use client';

import dynamic from 'next/dynamic';
import { type ReactNode, useCallback, useRef, useState } from 'react';
import { CircleAlert, Loader2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { LatLngTuple } from 'leaflet';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useServerActionMutation } from '@/hooks/use-server-actions';
import { createLocation as createLocationAction } from '@/actions/location/create-location';

const Map = dynamic(() => import('@/components/ui/map'), {
  loading: () => (
    <div className='flex flex-col items-center justify-center w-full h-full gap-2'>
      <Loader2 className='size-6 animate-spin text-muted-foreground' />
      <p className='text-sm font-medium text-muted-foreground'>Loading map</p>
    </div>
  ),
  ssr: false,
});

type LocationStepProps = {
  children: ReactNode;
  handleChangeStep?: (step: number) => void;
  businessId: string;
};

const LocationStep = ({
  businessId,
  children,
  handleChangeStep,
}: LocationStepProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [address, setAddress] = useState<string>('');
  const [coordinates, setCoordinates] = useState<LatLngTuple | null>(null);
  const [isResolvingAddress, setIsResolvingAddress] = useState<boolean>(false);
  const [isSearchingCoordinates, setIsSearchingCoordinates] =
    useState<boolean>(false);

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { mutate: createLocation, isPending } = useServerActionMutation(
    createLocationAction,
    {
      onSuccess: () => {
        setIsOpen(false);
        handleChangeStep?.(1);
        toast.success('Location added successfully');
      },
      onError: error => toast.error(error.message),
    }
  );

  const handleLocation = useCallback(async (position: LatLngTuple) => {
    setCoordinates(position);
    setIsResolvingAddress(true);

    try {
      const url = new URL('https://nominatim.openstreetmap.org/reverse');
      url.searchParams.append('format', 'json');
      url.searchParams.append('lat', position[0].toString());
      url.searchParams.append('lon', position[1].toString());

      const response = await fetch(url.toString());
      if (!response.ok) throw new Error('HTTP error');

      const data = await response.json();
      const fetchedAddress = data.display_name || 'Address not found';
      setAddress(fetchedAddress);
    } catch {
      toast.error('Failed to get address', {
        description: 'Please enter it manually or try again!',
      });
    } finally {
      setIsResolvingAddress(false);
    }
  }, []);

  const handleAddress = useCallback((value: string) => {
    setAddress(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Don't search if address is too short
    if (value.length < 3) return;

    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearchingCoordinates(true);

      try {
        const url = new URL('https://nominatim.openstreetmap.org/search');
        url.searchParams.append('format', 'json');
        url.searchParams.append('q', value);
        url.searchParams.append('limit', '1');

        const response = await fetch(url.toString());
        if (!response.ok) {
          throw new Error(`Failed to search location: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data);

        if (data.length > 0) {
          const { lat, lon } = data[0];
          const newPosition: LatLngTuple = [parseFloat(lat), parseFloat(lon)];
          setCoordinates(newPosition);
        } else {
          toast.warning('Address not found', {
            description:
              'Try a more specific address or select location on map',
          });
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        toast.error('Failed to search location', {
          description: `Please try a different address or select on map. (${errorMessage})`,
        });
      } finally {
        setIsSearchingCoordinates(false);
      }
    }, 800);
  }, []);

  const handleSubmit = () => {
    if (!coordinates) return toast.error('Please select a location in the map');
    if (!address.trim()) return toast.error('Please provide an address');

    createLocation({
      name: 'Default location',
      address,
      latitude: coordinates[0],
      longitude: coordinates[1],
      businessId,
      isOnboarding: true,
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Configure your Location</AlertDialogTitle>
          <AlertDialogDescription>
            This is your business main location where users will punch in/out.{' '}
            <span className='font-medium'>
              You can change it later inside settings.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className='space-y-2.5 py-2.5'>
          <div className='relative'>
            <Input
              placeholder='Your business address'
              type='text'
              className='pl-10'
              value={address}
              onChange={e => handleAddress(e.target.value)}
              disabled={
                isResolvingAddress || isSearchingCoordinates || isPending
              }
            />
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              {isResolvingAddress ? (
                <Loader2 className='size-4 animate-spin text-muted-foreground' />
              ) : (
                <Search className='size-4 text-muted-foreground' />
              )}
            </div>
          </div>
          <div className='w-full h-48 bg-gray-50 rounded-lg border border-border overflow-hidden'>
            <Map
              initialZoom={12}
              onLocationSelect={handleLocation}
              position={coordinates}
            />
          </div>
        </div>

        <AlertDialogFooter className='w-full sm:justify-between items-center'>
          <p className='flex items-center gap-1.5 text-sm text-muted-foreground font-medium'>
            <CircleAlert className='size-4' />
            This step is required to proceed.
          </p>
          <Button
            disabled={
              isPending ||
              isResolvingAddress ||
              isSearchingCoordinates ||
              !coordinates ||
              !address
            }
            size='sm'
            onClick={handleSubmit}
          >
            Complete
            {isPending && <Loader2 className='size-4 ml-2 animate-spin' />}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LocationStep;
