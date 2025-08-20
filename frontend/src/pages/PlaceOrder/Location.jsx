import React, { useState, useEffect, useRef } from 'react';
import './Location.css';

const Location = ({ onLocationSelect, onClose }) => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    // Wait for component to mount and DOM to be ready
    const initMap = async () => {
      // Wait for the ref to be available
      let attempts = 0;
      const maxAttempts = 20;
      
      while (!mapRef.current && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
      
      if (mapRef.current) {
        initializeMap();
      } else {
        setError('Map container not found after waiting');
        setIsLoading(false);
      }
    };

    initMap();

    return () => {
      if (map) {
        try {
          map.remove();
        } catch (err) {
          console.error('Error removing map:', err);
        }
      }
    };
  }, []);

  const initializeMap = async () => {
    try {
      console.log('Initializing map...');
      console.log('mapRef.current:', mapRef.current);
      
      // Double-check that the container exists
      if (!mapRef.current) {
        console.error('Map container still not found');
        setError('Map container not found');
        setIsLoading(false);
        return;
      }

      // Check if Leaflet is available
      if (!window.L) {
        console.log('Loading Leaflet...');
        await loadLeaflet();
        // Wait a bit more for Leaflet to be fully ready
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      if (!window.L) {
        throw new Error('Leaflet failed to load');
      }

      console.log('Leaflet loaded, creating map...');

      // Default to Vijayawada coordinates
      let lat = 16.5062;
      let lng = 80.6480;

      // Try to get user's location
      try {
        if (navigator.geolocation) {
          console.log('Getting user location...');
          const position = await getCurrentPosition();
          lat = position.coords.latitude;
          lng = position.coords.longitude;
          console.log('Got user location:', lat, lng);
        }
      } catch (geoError) {
        console.log('Geolocation failed, using default location');
      }

      createMap(lat, lng);
    } catch (err) {
      console.error('Error initializing map:', err);
      setError(`Failed to load map: ${err.message}`);
      setIsLoading(false);
    }
  };

  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        { timeout: 5000, enableHighAccuracy: false }
      );
    });
  };

  const loadLeaflet = () => {
    return new Promise((resolve, reject) => {
      // Load CSS
      const cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(cssLink);

      // Load JS
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Leaflet'));
      document.head.appendChild(script);
    });
  };

  const createMap = (lat, lng) => {
    try {
      console.log('Creating map with coordinates:', lat, lng);
      console.log('Map container element:', mapRef.current);
      
      // Ensure container exists and has dimensions
      if (!mapRef.current) {
        throw new Error('Map container is null');
      }

      // Clear any existing map
      if (map) {
        console.log('Removing existing map');
        map.remove();
      }

      // Ensure the container has dimensions
      const containerRect = mapRef.current.getBoundingClientRect();
      console.log('Container dimensions:', containerRect);
      
      if (containerRect.width === 0 || containerRect.height === 0) {
        console.warn('Container has no dimensions, forcing size');
        mapRef.current.style.width = '100%';
        mapRef.current.style.height = '300px';
      }

      // Create map with explicit options
      console.log('Creating Leaflet map...');
      const mapInstance = window.L.map(mapRef.current, {
        center: [lat, lng],
        zoom: 13,
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        dragging: true
      });

      console.log('Map instance created:', mapInstance);

      // Add tile layer
      console.log('Adding tile layer...');
      const tileLayer = window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      });
      
      tileLayer.addTo(mapInstance);

      // Add marker
      console.log('Adding marker...');
      const markerInstance = window.L.marker([lat, lng], {
        draggable: true
      });
      
      markerInstance.addTo(mapInstance);

      // Event handlers
      markerInstance.on('dragend', function(e) {
        const position = e.target.getLatLng();
        console.log('Marker dragged to:', position);
        reverseGeocode(position.lat, position.lng);
      });

      mapInstance.on('click', function(e) {
        const { lat, lng } = e.latlng;
        console.log('Map clicked at:', lat, lng);
        markerInstance.setLatLng([lat, lng]);
        reverseGeocode(lat, lng);
      });

      // Force map to resize/refresh
      setTimeout(() => {
        mapInstance.invalidateSize();
      }, 100);

      setMap(mapInstance);
      setMarker(markerInstance);
      
      console.log('Map created successfully');
      
      // Get address for initial location
      reverseGeocode(lat, lng);
      setIsLoading(false);

    } catch (err) {
      console.error('Error creating map:', err);
      setError(`Failed to create map: ${err.message}`);
      setIsLoading(false);
    }
  };

  // const reverseGeocode = async (lat, lng) => {
  //   try {
  //     const response = await fetch(
  //       `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`
  //     );
      
  //     if (!response.ok) {
  //       throw new Error('Geocoding failed');
  //     }

  //     const data = await response.json();
      
  //     if (data && data.address) {
  //       const address = data.address;
  //       const locationData = {
  //         lat,
  //         lng,
  //         street: `${address.house_number || ''} ${address.road || address.neighbourhood || ''}`.trim(),
  //         city: address.city || address.town || address.village || address.suburb || '',
  //         state: address.state || address.region || '',
  //         zipCode: address.postcode || '',
  //         country: address.country || '',
  //         fullAddress: data.display_name || `${lat}, ${lng}`
  //       };
  //       setSelectedLocation(locationData);
  //     }
  //   } catch (error) {
  //     console.error('Reverse geocoding failed:', error);
  //     // Set basic location data even if geocoding fails
  //     setSelectedLocation({
  //       lat,
  //       lng,
  //       street: '',
  //       city: '',
  //       state: '',
  //       zipCode: '',
  //       country: '',
  //       fullAddress: `Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`
  //     });
  //   }
  // };

  const reverseGeocode = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`
    );

    if (!response.ok) {
      throw new Error('Geocoding failed');
    }

    const data = await response.json();
    const address = data.address || {};

    const locationData = {
      lat,
      lng,
      street: `${address.house_number || ''} ${address.road || address.neighbourhood || ''}`.trim(),
      city: address.city || address.town || address.village || address.suburb || '',
      state: address.state || address.region || '',
      zipCode: address.postcode || '',  // May be empty — fallback next
      country: address.country || '',
      fullAddress: data.display_name || `${lat}, ${lng}`
    };

    // Optional: fallback to zip from fullAddress if missing
    if (!locationData.zipCode && locationData.fullAddress) {
      const zipMatch = locationData.fullAddress.match(/\b\d{5,6}\b/);
      if (zipMatch) {
        locationData.zipCode = zipMatch[0];
      }
    }

    setSelectedLocation(locationData);
  } catch (error) {
    console.error('Reverse geocoding failed:', error);
    setSelectedLocation({
      lat,
      lng,
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      fullAddress: `Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`
    });
  }
};


  const handleConfirm = () => {
    if (selectedLocation && onLocationSelect) {
      onLocationSelect(selectedLocation);
    }
    if (onClose) {
      onClose();
    }
  };

  if (error) {
    return (
      <div className="location-popup">
        <div className="location-modal">
          <div className="location-header">
            <h3>Select Location</h3>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          <div className="error-message">
            <p>{error}</p>
            <button onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  }

  return (
  <div className="location-popup">
    <div className="location-modal">
      <div className="location-header">
        <h3>Select Your Location</h3>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      {/* Always render the map container so it's available in the DOM */}
      <div className="location-content">
        <div className="map-container">
          <div ref={mapRef} className="map"></div>
        </div>

        {isLoading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading map...</p>
            <small>This may take a few seconds</small>
          </div>
        ) : (
          <>
            {selectedLocation && (
              <div className="location-details">
                <p><strong>Selected Address:</strong></p>
                <p className="address-text">{selectedLocation.fullAddress}</p>
              </div>
            )}

            <div className="location-actions">
              <button 
                className="confirm-btn" 
                onClick={handleConfirm}
                disabled={!selectedLocation}
              >
                Confirm Location
              </button>
              <button className="cancel-btn" onClick={onClose}>
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  </div>
);
}
export default Location;