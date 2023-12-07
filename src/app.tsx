import * as React from 'react';
import { useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import Map, {
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl
} from 'react-map-gl';
import Panel from './panel';
import Pin from './pin';

import PROVIDERS from '../providers.json';

const TOKEN = 'pk.eyJ1IjoiY2hyaXN0aW5lLWNvcXVpaGVhbHRoIiwiYSI6ImNscGkwb2wwMDA4bmgyanAybjRvaXczazgifQ.qIYaXwZnP_Lmyi98FcNFZQ'; // Set your mapbox token here

export default function App() {
  const [popupInfo, setPopupInfo] = useState(null);
  const [selectedProviders, setSelectedProviders] = useState(PROVIDERS);

  const pins = useMemo(
    () =>
      selectedProviders.map((provider, index) => (
        provider.coordinates && <Marker
          key={`marker-${index}`}
          longitude={provider.coordinates.lon}
          latitude={provider.coordinates.lat}
          anchor="bottom"
          onClick={e => {
            // If we let the click event propagates to the map, it will immediately close the popup
            // with `closeOnClick: true`
            e.originalEvent.stopPropagation();
            setPopupInfo(provider);
          }}
        >
          <Pin />
        </Marker>
      )),
    [selectedProviders]
  );

  function searchProviders(providers, searchTerm) {
    return providers.filter(provider => {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      return Object.values(provider).some(value =>
        value.toString().toLowerCase().includes(lowerCaseSearchTerm)
      );
    });
  }

  function handleSearchInput(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      const searchValue = event.target.value;
      console.log("Search value: ", searchValue);
      console.log("search result: ", searchProviders(PROVIDERS, searchValue));
      // setPopupInfo(searchProviders(PROVIDERS, searchValue));
      setSelectedProviders(searchProviders(PROVIDERS, searchValue));
    }
  }

  window.onload = function () {
    const searchBox = document.querySelector('.search-box');
    searchBox.addEventListener('keypress', handleSearchInput);
  };

  return (
    <>
      <Map
        initialViewState={{
          latitude: 18.44,
          longitude: -66,
          zoom: 8,
          bearing: 0,
          pitch: 0
        }}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        mapboxAccessToken={TOKEN}
      >
        <GeolocateControl position="top-left" />
        <FullscreenControl position="top-left" />
        <NavigationControl position="top-left" />
        <ScaleControl />

        {pins}

        {popupInfo && !isNaN(popupInfo.coordinates.lat) && !isNaN(popupInfo.coordinates.lon) && (
          <Popup
            anchor="top"
            longitude={Number(popupInfo.coordinates.lon)}
            latitude={Number(popupInfo.coordinates.lat)}
            onClose={() => setPopupInfo(null)}
          >
            <div>
              <b>
                Provider Name:
              </b>
              <div>
                {`${popupInfo.firstName}, ${popupInfo.lastName}`}
              </div>
              <b>
                Language:
              </b>
              <div>
                {popupInfo.language.join(' ')}
              </div>
              <b>
                Phone Number
              </b>
              <div>
                <a href={`tel:+1${popupInfo.phoneNumber}`}>+1 {popupInfo.phoneNumber}</a>
              </div>
              <b>
                Address:
              </b>
              <div>
                <a href={`https://www.google.com/maps/search/${popupInfo.address}`}>{popupInfo.address}</a>
              </div>
              <b>
                Bussiness Hour:
              </b>
              {popupInfo.businessHour.map((timestap) => {
                return (
                  <div>
                    {`${timestap.day}: ${timestap.hours}`}
                  </div>
                )
              })}

            </div>
          </Popup>
        )}
      </Map>
      <div class="search-container">
        <span class="search-icon">&#9906;</span>
        <input type="text" class="search-box" placeholder="Search" />
      </div>
      <Panel />
    </>
  );
}

export function renderToDom(container) {
  createRoot(container).render(<App />);
}
