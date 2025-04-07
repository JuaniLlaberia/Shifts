// 'use client';

// import dynamic from 'next/dynamic';
// import { ReactNode, useCallback, useRef, useState } from 'react';
// import { Loader2, Search } from 'lucide-react';
// import { toast } from 'sonner';
// import { LatLngTuple } from 'leaflet';

// import { Input } from '@/components/ui/input';
// import { useServerActionMutation } from '@/hooks/use-server-actions';
// import { createLocation as createLocationAction } from '@/actions/location/create-location';
// import { updateLocation as updateLocationAction } from '@/actions/location/update-location';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from '../ui/dialog';
// import { Button } from '../ui/button';
// import InputWrapper from '../ui/input-wrapper';
// import { LocationWithNumberCoords } from '@/app/(business-routes)/business/[businessId]/(dashboard-routes)/settings/locations/(Components)/locations-list';

// const Map = dynamic(() => import('@/components/ui/map'), {
//   loading: () => (
//     <div className='flex flex-col items-center justify-center w-full h-full gap-2'>
//       <Loader2 className='size-6 animate-spin text-muted-foreground' />
//       <p className='text-sm font-medium text-muted-foreground'>Loading map</p>
//     </div>
//   ),
//   ssr: false,
// });

// type LocationFormType = {
//   businessId: string;
//   locationData?: LocationWithNumberCoords;
//   children?: ReactNode;
//   onSuccess?: () => void;
// };

// const LocationForm = ({
//   businessId,
//   locationData,
//   onSuccess,
//   children,
// }: LocationFormType) => {
//   const updateMode = Boolean(locationData?.id);

//   const [isOpen, setIsOpen] = useState<boolean>(false);

//   const [address, setAddress] = useState<string>(locationData?.address || '');
//   const [coordinates, setCoordinates] = useState<LatLngTuple | null>(
//     updateMode ? [locationData?.latitude, locationData?.longitude] : null
//   );
//   const [isResolvingAddress, setIsResolvingAddress] = useState<boolean>(false);
//   const [isSearchingCoordinates, setIsSearchingCoordinates] =
//     useState<boolean>(false);

//   const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

//   const { mutate: createLocation, isPending: isCreating } =
//     useServerActionMutation(createLocationAction, {
//       onSuccess: () => {
//         onSuccess?.();
//         setIsOpen(false);
//       },
//       onError: error => toast.error(error.message),
//     });
//   const { mutate: updateLocation, isPending: isUpdating } =
//     useServerActionMutation(updateLocationAction, {
//       onSuccess: () => {
//         onSuccess?.();
//         setIsOpen(false);
//       },
//       onError: error => toast.error(error.message),
//     });

//   const handleLocation = useCallback(async (position: LatLngTuple) => {
//     setCoordinates(position);
//     setIsResolvingAddress(true);

//     try {
//       const url = new URL('https://nominatim.openstreetmap.org/reverse');
//       url.searchParams.append('format', 'json');
//       url.searchParams.append('lat', position[0].toString());
//       url.searchParams.append('lon', position[1].toString());

//       const response = await fetch(url.toString());
//       if (!response.ok) throw new Error('HTTP error');

//       const data = await response.json();
//       const fetchedAddress = data.display_name || 'Address not found';
//       setAddress(fetchedAddress);
//     } catch {
//       toast.error('Failed to get address', {
//         description: 'Please enter it manually or try again!',
//       });
//     } finally {
//       setIsResolvingAddress(false);
//     }
//   }, []);

//   const handleAddress = useCallback((value: string) => {
//     setAddress(value);

//     if (searchTimeoutRef.current) {
//       clearTimeout(searchTimeoutRef.current);
//     }

//     // Don't search if address is too short
//     if (value.length < 3) return;

//     searchTimeoutRef.current = setTimeout(async () => {
//       setIsSearchingCoordinates(true);

//       try {
//         const url = new URL('https://nominatim.openstreetmap.org/search');
//         url.searchParams.append('format', 'json');
//         url.searchParams.append('q', value);
//         url.searchParams.append('limit', '1');

//         const response = await fetch(url.toString());
//         if (!response.ok) {
//           throw new Error(`Failed to search location: ${response.statusText}`);
//         }

//         const data = await response.json();
//         console.log(data);

//         if (data.length > 0) {
//           const { lat, lon } = data[0];
//           const newPosition: LatLngTuple = [parseFloat(lat), parseFloat(lon)];
//           setCoordinates(newPosition);
//         } else {
//           toast.warning('Address not found', {
//             description:
//               'Try a more specific address or select location on map',
//           });
//         }
//       } catch (error) {
//         const errorMessage =
//           error instanceof Error ? error.message : 'Unknown error';
//         toast.error('Failed to search location', {
//           description: `Please try a different address or select on map. (${errorMessage})`,
//         });
//       } finally {
//         setIsSearchingCoordinates(false);
//       }
//     }, 800);
//   }, []);

//   const handleSubmit = () => {
//     if (!coordinates) return toast.error('Please select a location in the map');
//     if (!address.trim()) return toast.error('Please provide an address');

//     if (updateMode)
//       updateLocation({
//         locationId: locationData?.id as string,
//         name: 'Default location',
//         address,
//         latitude: coordinates[0],
//         longitude: coordinates[1],
//         businessId,
//       });
//     else
//       createLocation({
//         name: 'Default location',
//         address,
//         latitude: coordinates[0],
//         longitude: coordinates[1],
//         businessId,
//         isOnboarding: false,
//       });
//   };

//   const isLoading = isCreating || isUpdating;

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogTrigger asChild>
//         {children || <Button size='sm'>Open form</Button>}
//       </DialogTrigger>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>
//             {updateMode ? 'Edit' : 'Create new'} Location
//           </DialogTitle>
//           <DialogDescription>
//             {updateMode
//               ? 'Make changes to an existing business location.'
//               : 'Set up a new place for your business operations.'}
//           </DialogDescription>
//         </DialogHeader>
//         <InputWrapper label='Location name' inputId='name'>
//           <Input
//             id='name'
//             placeholder='Your location name (e.g. Main location)'
//           />
//         </InputWrapper>
//         <InputWrapper label='Your address' inputId='address'>
//           <div className='relative'>
//             <Input
//               id='address'
//               placeholder='Your business address'
//               type='text'
//               className='pl-10'
//               value={address}
//               onChange={e => handleAddress(e.target.value)}
//               disabled={
//                 isResolvingAddress || isSearchingCoordinates || isLoading
//               }
//             />
//             <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
//               {isResolvingAddress ? (
//                 <Loader2 className='size-4 animate-spin text-muted-foreground' />
//               ) : (
//                 <Search className='size-4 text-muted-foreground' />
//               )}
//             </div>
//           </div>
//         </InputWrapper>
//         <div className='w-full h-48 bg-gray-50 rounded-lg border border-border overflow-hidden'>
//           <Map
//             initialZoom={12}
//             onLocationSelect={handleLocation}
//             position={coordinates}
//           />
//         </div>
//         <DialogFooter>
//           <Button disabled={isLoading} size='sm' variant='outline'>
//             Close
//           </Button>
//           <Button disabled={isLoading} size='sm' onClick={handleSubmit}>
//             {updateMode ? 'Update' : 'Create'}{' '}
//             {isLoading && <Loader2 className='size-4 ml-1 animate-spin' />}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default LocationForm;
'use client';

import dynamic from 'next/dynamic';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Loader2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { LatLngTuple } from 'leaflet';

import InputWrapper from '../ui/input-wrapper';
import { Input } from '@/components/ui/input';
import { useServerActionMutation } from '@/hooks/use-server-actions';
import { createLocation as createLocationAction } from '@/actions/location/create-location';
import { updateLocation as updateLocationAction } from '@/actions/location/update-location';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { LocationWithNumberCoords } from '@/app/(business-routes)/business/[businessId]/(dashboard-routes)/settings/locations/(Components)/locations-list';

const Map = dynamic(() => import('@/components/ui/map'), {
  loading: () => (
    <div className='flex flex-col items-center justify-center w-full h-full gap-2'>
      <Loader2 className='size-6 animate-spin text-muted-foreground' />
      <p className='text-sm font-medium text-muted-foreground'>Loading map</p>
    </div>
  ),
  ssr: false,
});

interface LocationFormProps {
  businessId: string;
  locationData?: LocationWithNumberCoords;
  children?: ReactNode;
  onSuccess?: () => void;
}

interface LocationFormValues {
  name: string;
  address: string;
  coordinates: LatLngTuple | null;
}

// Geocoding service functions
const geocodingService = {
  async reverseGeocode(position: LatLngTuple): Promise<string> {
    const url = new URL('https://nominatim.openstreetmap.org/reverse');
    url.searchParams.append('format', 'json');
    url.searchParams.append('lat', position[0].toString());
    url.searchParams.append('lon', position[1].toString());

    const response = await fetch(url.toString());
    if (!response.ok) throw new Error('Failed to get address');

    const data = await response.json();
    return data.display_name || 'Address not found';
  },

  async forwardGeocode(address: string): Promise<LatLngTuple> {
    const url = new URL('https://nominatim.openstreetmap.org/search');
    url.searchParams.append('format', 'json');
    url.searchParams.append('q', address);
    url.searchParams.append('limit', '1');

    const response = await fetch(url.toString());
    if (!response.ok) throw new Error('Failed to search location');

    const data = await response.json();
    if (data.length === 0) throw new Error('Address not found');

    const { lat, lon } = data[0];
    return [parseFloat(lat), parseFloat(lon)];
  },
};

const LocationForm = ({
  businessId,
  locationData,
  onSuccess,
  children,
}: LocationFormProps) => {
  const isUpdateMode = Boolean(locationData?.id);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isResolvingAddress, setIsResolvingAddress] = useState<boolean>(false);
  const [isSearchingCoordinates, setIsSearchingCoordinates] =
    useState<boolean>(false);

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isAddressChangedByUserRef = useRef<boolean>(false);
  const geocodingInProgressRef = useRef<boolean>(false);

  const defaultValues: LocationFormValues = {
    name: locationData?.name || 'Untittled location',
    address: locationData?.address || '',
    coordinates: isUpdateMode
      ? [locationData!.latitude, locationData!.longitude]
      : null,
  };

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LocationFormValues>({
    defaultValues,
  });

  const address = watch('address');
  const coordinates = watch('coordinates');

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Clean up any pending operations when closing
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      setIsResolvingAddress(false);
      setIsSearchingCoordinates(false);
    }
    setIsOpen(open);
  };

  const { mutate: createLocation, isPending: isCreating } =
    useServerActionMutation(createLocationAction, {
      onSuccess: () => {
        onSuccess?.();
        setIsOpen(false);
        toast.success('Location created successfully');
      },
      onError: error => toast.error(error.message),
    });

  const { mutate: updateLocation, isPending: isUpdating } =
    useServerActionMutation(updateLocationAction, {
      onSuccess: () => {
        onSuccess?.();
        setIsOpen(false);
        toast.success('Location updated successfully');
      },
      onError: error => toast.error(error.message),
    });

  const handleLocationSelect = useCallback(
    async (position: LatLngTuple) => {
      // Prevent calling when another geocoding operation is in progress
      if (geocodingInProgressRef.current) return;

      geocodingInProgressRef.current = true;
      isAddressChangedByUserRef.current = false;
      setIsResolvingAddress(true);

      try {
        setValue('coordinates', position, { shouldValidate: true });
        const address = await geocodingService.reverseGeocode(position);
        setValue('address', address, { shouldValidate: true });
      } catch {
        toast.error('Failed to get address', {
          description: 'Please enter it manually or try again!',
        });
      } finally {
        setIsResolvingAddress(false);
        geocodingInProgressRef.current = false;
      }
    },
    [setValue]
  );

  const handleAddressChange = useCallback(
    (value: string) => {
      isAddressChangedByUserRef.current = true;
      setValue('address', value);
    },
    [setValue]
  );

  // Handle address changes with debounce
  useEffect(() => {
    if (!isAddressChangedByUserRef.current) return;

    if (!address || address.length < 3) return;

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      geocodingInProgressRef.current = true;
      setIsSearchingCoordinates(true);

      try {
        const coordinates = await geocodingService.forwardGeocode(address);
        setValue('coordinates', coordinates, { shouldValidate: true });
      } catch {
        toast.warning('Address not found', {
          description: 'Try a more specific address or select location on map',
        });
      } finally {
        setIsSearchingCoordinates(false);
        geocodingInProgressRef.current = false;
      }
    }, 800);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [address, setValue]);

  const onSubmit = (data: LocationFormValues) => {
    if (!data.coordinates) {
      toast.error('Please select a location on the map');
      return;
    }

    const payload = {
      name: data.name,
      address: data.address,
      latitude: data.coordinates[0],
      longitude: data.coordinates[1],
      businessId,
    };

    if (isUpdateMode) {
      updateLocation({
        ...payload,
        locationId: locationData!.id,
      });
    } else {
      createLocation({
        ...payload,
        isOnboarding: false,
      });
    }
  };

  const isFormDisabled =
    isSubmitting ||
    isResolvingAddress ||
    isSearchingCoordinates ||
    isUpdating ||
    isCreating;

  const isLoading = isUpdating || isCreating;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || <Button size='sm'>Open form</Button>}
      </DialogTrigger>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>
            {isUpdateMode ? 'Edit' : 'Create new'} Location
          </DialogTitle>
          <DialogDescription>
            {isUpdateMode
              ? 'Make changes to an existing business location.'
              : 'Set up a new place for your business operations.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <InputWrapper
            label='Location name'
            inputId='name'
            error={errors.name?.message}
          >
            <Controller
              name='name'
              control={control}
              rules={{ required: 'Location name is required' }}
              render={({ field }) => (
                <Input
                  id='name'
                  placeholder='Your location name (e.g. Main location)'
                  disabled={isFormDisabled}
                  {...field}
                />
              )}
            />
          </InputWrapper>

          <InputWrapper
            label='Your address'
            inputId='address'
            error={errors.address?.message}
          >
            <div className='relative'>
              <Controller
                name='address'
                control={control}
                rules={{ required: 'Address is required' }}
                render={({ field }) => (
                  <Input
                    id='address'
                    placeholder='Your business address'
                    type='text'
                    className='pl-10'
                    disabled={isFormDisabled}
                    value={field.value}
                    onChange={e => {
                      handleAddressChange(e.target.value);
                    }}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                )}
              />
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                {isResolvingAddress || isSearchingCoordinates ? (
                  <Loader2 className='size-4 animate-spin text-muted-foreground' />
                ) : (
                  <Search className='size-4 text-muted-foreground' />
                )}
              </div>
            </div>
          </InputWrapper>

          <InputWrapper
            label='Map location'
            inputId='map'
            error={errors.coordinates?.message}
          >
            <div className='w-full h-48 bg-gray-50 rounded-lg border border-border overflow-hidden'>
              <Map
                key={`map-${isOpen}`}
                initialZoom={12}
                onLocationSelect={handleLocationSelect}
                position={coordinates}
              />
            </div>
          </InputWrapper>

          <DialogFooter>
            <Button
              type='button'
              onClick={() => {
                setIsOpen(false);
                reset();
              }}
              disabled={isFormDisabled}
              size='sm'
              variant='outline'
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isFormDisabled} size='sm'>
              {isUpdateMode ? 'Update' : 'Create'}{' '}
              {isLoading && <Loader2 className='size-4 ml-1 animate-spin' />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LocationForm;
