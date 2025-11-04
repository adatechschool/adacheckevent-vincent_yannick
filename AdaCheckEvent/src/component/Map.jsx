import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export const Map = ({coordinates, element}) => {
  return (
    <div className="text-center m-auto p-2" style={{height: 'auto', width: '50%'}}>


    <MapContainer center={coordinates} zoom={20} style={{ height: '50vh', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      <Marker position={coordinates}>
        <Popup>{element.address_street}</Popup>
      </Marker>
    </MapContainer> 
        </div>
  );
}
