import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Leaflet + Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Mock data for members
const memberLocations = [
  {
    id: 1,
    name: "이석호 (Peter)",
    powerTeam: "마케팅/IT",
    businessName: "디지털 마케팅 자동화",
    lat: 37.503,
    lng: 127.040,
    address: "서울 강남구 테헤란로 123"
  },
  {
    id: 2,
    name: "김철수",
    powerTeam: "전문직 (노무)",
    businessName: "가나다 노무법인",
    lat: 37.491,
    lng: 127.014,
    address: "서울 서초구 서초대로 456"
  },
  {
    id: 3,
    name: "이영희",
    powerTeam: "전문직 (세무)",
    businessName: "영희 세무회계",
    lat: 37.498,
    lng: 127.027,
    address: "서울 강남구 강남대로 789"
  },
  {
    id: 4,
    name: "박민수",
    powerTeam: "부동산/건축",
    businessName: "튼튼 종합건설",
    lat: 37.511,
    lng: 127.059,
    address: "서울 강남구 영동대로 101"
  }
];

export default function BusinessMap() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ paddingBottom: '16px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>BNI 엑설런트 비즈니스 맵</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          멤버들의 사업장 위치를 지도에서 확인하고 손쉽게 원투원 미팅을 잡아보세요.
          (현재는 샘플 데이터가 연동되어 있습니다.)
        </p>
      </div>

      <div style={{ flex: 1, borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
        <MapContainer 
          center={[37.500, 127.036]} 
          zoom={13} 
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {memberLocations.map(member => (
            <Marker key={member.id} position={[member.lat, member.lng]}>
              <Popup>
                <div style={{ textAlign: 'center', minWidth: '150px' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#000' }}>{member.name} 대표</div>
                  <div style={{ color: '#666', fontSize: '12px', margin: '4px 0' }}>{member.powerTeam}</div>
                  <div style={{ color: 'var(--accent-color)', fontWeight: 500 }}>{member.businessName}</div>
                  <div style={{ color: '#888', fontSize: '11px', marginTop: '4px' }}>{member.address}</div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
