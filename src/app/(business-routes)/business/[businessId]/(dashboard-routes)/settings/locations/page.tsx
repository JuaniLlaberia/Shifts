import { notFound } from 'next/navigation';
import { MapPin } from 'lucide-react';

import LocationsList from './(Components)/locations-list';
import { getLocations } from '@/access-data/location/get-locations';

const LocationsPage = async ({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) => {
  const { businessId } = await params;
  const locationsData = await getLocations({
    businessId,
    pageSize: 10,
    page: 1,
  });

  if (!locationsData.isAdmin) return notFound();

  const locations = locationsData.locations.map(location => ({
    ...location,
    latitude: Number(location.latitude),
    longitude: Number(location.longitude),
  }));

  return (
    <section className='relative'>
      <header className='p-8 pb-2'>
        <p className='text-xs flex items-center text-muted-foreground'>
          <MapPin className='size-3.5 mr-1' /> Settings / Locations
        </p>
        <h2 className='font-medium text-lg'>Business Locations</h2>
      </header>
      <LocationsList locations={locations} businessId={businessId} />
    </section>
  );
};

export default LocationsPage;
