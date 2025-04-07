'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import {
  MapContainer,
  Marker,
  TileLayer,
  useMapEvents,
  useMap,
} from 'react-leaflet';
import { LatLngTuple, divIcon } from 'leaflet';

const createCustomIcon = () => {
  return divIcon({
    className: '',
    html: `
        <div class="relative">
          <div class="absolute -left-[15px] -top-[42px] w-[30px] h-[30px] bg-black rounded-tl-full rounded-tr-full rounded-bl-none rounded-br-full rotate-[315deg] shadow-md transform-gpu transition-transform duration-200 hover:scale-110 hover:bg-red-500">
            <div class="absolute left-[6px] top-[6px] w-[18px] h-[18px] bg-white rounded-full"></div>
          </div>
          <div class="absolute -left-[7px] -top-[34px] w-[14px] h-[14px] rounded-full animate-ping bg-white/50 z-[-1]"></div>
        </div>
      `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    popupAnchor: [0, -42],
  });
};

// Component to handle clicks on the map
const LocationMarker = ({
  position,
  setPosition,
}: {
  position: LatLngTuple;
  setPosition?: (newPosition: LatLngTuple) => void;
}) => {
  useMapEvents({
    click(e) {
      if (setPosition) {
        const newPos: LatLngTuple = [e.latlng.lat, e.latlng.lng];
        setPosition(newPos);
      }
    },
  });

  const customIcon = createCustomIcon();

  return position ? <Marker position={position} icon={customIcon} /> : null;
};

// Component to update map view when position changes
const ChangeView = ({ center }: { center: LatLngTuple }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center);
    }
  }, [center, map]);
  return null;
};

type MapProps = {
  initialZoom: number;
  onLocationSelect?: (newPosition: LatLngTuple) => void;
  position?: LatLngTuple | null;
};

const Map = ({
  initialZoom = 12,
  onLocationSelect,
  position: externalPosition,
}: MapProps) => {
  const [position, setPosition] = useState<LatLngTuple>([51.505, -0.09]);
  const [isLoadingGeo, setIsLoadingGeo] = useState<boolean>(false);

  // Handle position selection
  const handlePositionChange = useCallback(
    (newPosition: LatLngTuple) => {
      setPosition(newPosition);
      if (onLocationSelect) {
        onLocationSelect(newPosition);
      }
    },
    [onLocationSelect]
  );

  // Set coordinates if they come from parent component
  useEffect(() => {
    if (externalPosition) {
      setPosition(externalPosition);
    }
  }, [externalPosition]);

  // Get user's current location
  useEffect(() => {
    if (externalPosition) return;

    if (navigator.geolocation) {
      setIsLoadingGeo(true);
      navigator.geolocation.getCurrentPosition(
        location => {
          setIsLoadingGeo(false);
          const { latitude, longitude } = location.coords;
          handlePositionChange([latitude, longitude]);
        },
        error => {
          console.error('Error getting location:', error);
        },
        { timeout: 10000 }
      );
    }
  }, [handlePositionChange, externalPosition]);

  return (
    <MapContainer
      center={position}
      zoom={initialZoom}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%', borderRadius: '8px' }}
      dragging={onLocationSelect ? true : false}
    >
      {isLoadingGeo ? (
        <div className='flex flex-col items-center justify-center w-full h-full gap-2'>
          <Loader2 className='size-6 animate-spin text-muted-foreground' />
          <p className='text-sm font-medium text-muted-foreground'>
            Loading location
          </p>
        </div>
      ) : (
        <>
          <TileLayer url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png' />
          <ChangeView center={position} />
          <LocationMarker
            position={position}
            setPosition={onLocationSelect && handlePositionChange}
          />
        </>
      )}
    </MapContainer>
  );
};

export default Map;
