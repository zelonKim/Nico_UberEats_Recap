import React, { useEffect, useState } from "react";
import GoggleMapReact, { Position } from "google-map-react";
import { gql, useSubscription } from "@apollo/client";
import { FULL_ORDER_FRAGMENT } from "../../fragments";

const COOKED_ORDERS_SUBSCRIPTION = gql`
    subscription cookecOrders {
        cookedOrders {
            ...FullOrderParts
        }
    }
    ${FULL_ORDER_FRAGMENT}
`


interface ICoords {
  lat: number;
  lng: number;
}

export const Dashboard = () => {
  const [driverCoords, setDriverCoords] = useState<ICoords>({ lng: 0, lat: 0 });
  const [map, setMap] = useState<google.maps.Map>();
  const [maps, setMaps] = useState<any>();

  const onSuccess = ({ coords: { latitude, longitude } }: Position) => {
    setDriverCoords({ lat: latitude, lng: longitude });
  };

  const onError = (error: PositionError) => {
    console.log(error);
  };

  useEffect(() => {
    navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
    });
  }, []);

  useEffect(() => {
    if (map && maps) {
      map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        {
          location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng),
        },
        (results, status) => {
          console.log(results, status);
        }
      );
    }
  }, [driverCoords.lat, driverCoords.lng]);

  const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
    map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
    setMap(map);
    setMaps(maps);
  };

  const makeRoute = () => {
    if (map) {
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer({
        polylineOptions: {
            strokeColor: "#000",
            strokeOpacity: 1,
            strokeWeight: 3,
        }
      });
      directionsRenderer.setMap(map);
      directionsService.route(
        {
          origin: {
            location: new google.maps.LatLng(
              driverCoords.lat,
              driverCoords.lng
            ),
          },
        destination: {
            location: new google.maps.LatLng(driverCoords.lat + 0.05, driverCoords.lng + 0.05)
        },
        travelMode: google.maps.TravelMode.DRIVING
   }, (result, status) => {
        directionsRenderer.setDirections(result);
    }
)
  
}

const {data: cookedOrdersData} = useSubscription<cookedOrders>(COOKED_ORDERS_SUBSCRIPTION);

    useEffect(() => {
        if(cookedOrdersData?.cookedOrders.id) [
            makeRoute()
        ]
    }, [cookedOrdersData])

  return (
    <div>
      <div
        className="py-20 bg-gray-800 overflow-hidden"
        style={{ width: window.innerWidth, height: "50vh" }}
      >
        <GoggleMapReact
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={onApiLoaded}
          defaultZoom={16}
          defaultCenter={{
            lat: 37.5,
            lng: 126.9,
          }}
          bootstrapURLKeys={{ key: "gfjkdljsgjiojiojeiog4kljlfe3" }}
        >
          <div
            // @ts-ignore
            lat={driverCoords.lat}
            lng={driverCoords.lng}
          >
            🚖
          </div>
        </GoggleMapReact>
      </div>
      <button onClick={onGetRouteClick}>Get route</button>
    </div>
  );
}