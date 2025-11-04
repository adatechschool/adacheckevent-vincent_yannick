import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export const Map = ({coordinates}) => {
  return (
    <div className="translate-x-[50%] p-2" style={{height: '50%', width: '50%'}}>


    <MapContainer center={coordinates} zoom={20} style={{ height: '50vh', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      <Marker position={coordinates}>
        <Popup>Paris !</Popup>
      </Marker>
    </MapContainer> 
        </div>
  );
}
