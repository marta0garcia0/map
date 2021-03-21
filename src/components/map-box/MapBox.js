import React, { useEffect, useState } from 'react';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';
import originLogo from './../../assets/pickUpMarker.svg';
import destinyLogo from './../../assets/dropOffMarker.svg';
import InputBox from '../input-box/InputBox';

const INIT_COORDINATES = {lat: 41.366142, lng: 2.157303};

const MapBox = (props) => {
  const [center, setCenter] = useState(INIT_COORDINATES);
  const [pickUpCoordinates, setPickUpCoordinates] = useState(null);
  const [dropOffCoordinates, setDropOffCoordinates] = useState(null);

  const setJobCreated = () => {
    setPickUpCoordinates(null);
    setDropOffCoordinates(null);
  };

  const setPickUp = (coordinates) => {
    setPickUpCoordinates(coordinates);
  };

  const setDropOff = (coordinates) => {
    setDropOffCoordinates(coordinates);
  };

  useEffect(() => {
		if (pickUpCoordinates && dropOffCoordinates) {
      setCenter({
        lat: pickUpCoordinates.lat - (pickUpCoordinates.lat - dropOffCoordinates.lat) / 2,
        lng: pickUpCoordinates.lng - (pickUpCoordinates.lng - dropOffCoordinates.lng) / 2,
      });
    } else if (pickUpCoordinates) {
      setCenter(pickUpCoordinates);
    } else if (dropOffCoordinates) {
      setCenter(pickUpCoordinates);
    }
  }, [pickUpCoordinates, dropOffCoordinates]);

  return (
    <>
      <InputBox setPickUp={setPickUp} setDropOff={setDropOff}
        setJobCreated={setJobCreated}/>
      <Map
        initialCenter={INIT_COORDINATES}
        center={center ? center : INIT_COORDINATES}
        google={props.google}
        className={'map'}
        zoom={14}
      >
        {pickUpCoordinates ?
          <Marker
            icon={originLogo}
            position={pickUpCoordinates} />
        : ''}
        {dropOffCoordinates ? 
          <Marker
            icon={destinyLogo}
            position={dropOffCoordinates} />
        : ''}
      </Map>
    </>
  );
}

export default GoogleApiWrapper( (props) => ({
  apiKey: process.env.REACT_APP_MAP_KEY,
}))(MapBox);