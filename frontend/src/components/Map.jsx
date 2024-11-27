import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polygon, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "leaflet/dist/leaflet.css";
import "react-leaflet-markercluster/dist/styles.min.css";
import L from "leaflet";
import "leaflet-editable";
import API from "../API";
import PropTypes from "prop-types";
import DocumentSidePanel from "./DocumentSidePanel";
import prescpritiveDocument_LKAB from "../public/icons/Prescriptive-document-LKAB.png";
import designDocument_LKAB from "../public/icons/Design-document-LKAB.png";
import actionDocument_LKAB from "../public/icons/Action-LKAB.png";
import informativeDocument_LKAB from "../public/icons/Informative-document-LKAB.png";
import technicalDocument_LKAB from "../public/icons/Technical-document-LKAB.png";
import prescriptiveDocument_Kommun from "../public/icons/Prescriptive-document-KOMMUN.png";
import informativeDocument_KommunResidents from "../public/icons/Informative-document-KOMMUN-RESIDENTS.png";
import designDocument_KommunWhiteArkitekter from "../public/icons/Design-document-KOMMUN-ARKITEKTER.png";
import getKirunaArea from "./KirunaArea";
import { iconMapping, getIconForDocument, defaultIcon } from "../utils/iconUtils";

const ZoomToMarker = ({ position, zoomLevel }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, zoomLevel || map.getZoom(), { duration: 1.5 }); // Default to current zoom if zoomLevel not provided
    }
  }, [position, zoomLevel, map]);

  return null;
};

ZoomToMarker.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  zoomLevel: PropTypes.number,
};

const MapKiruna = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [show, setShow] = useState(true);
  const kirunaPosition = [67.8400, 20.2253];
  const zoomLevel = 12;

  // Per gestire il Polygon dinamico
  const kirunaPolygonRef = useRef(null);

  useEffect(() => {
    API.getAllDocumentSnippets()
      .then(setDocuments)
      .catch((error) => console.error("Error fetching documents:", error));
  }, []);

  const handleDocumentClick = (document) => {
    API.getDocumentById(document.id)
      .then((response) => {
        setSelectedDocument(response);
        setShow(true);
      })
      .catch((error) => console.error("Error fetching document:", error));
  };

  const closeSidePanel = () => {
    setShow(false);
    setSelectedDocument(null);
  };

  const kirunaBorderCoordinates = getKirunaArea();

  return (
    <div style={{ display: "flex", height: "90vh", position: "relative" }}>
      <div style={{ flex: 2, position: "relative" }}>
        <MapContainer center={kirunaPosition} zoom={zoomLevel} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <MarkerClusterGroup>
            {documents.map((doc, index) => {
              const position = doc.geolocation.latitude ? [doc.geolocation.latitude, doc.geolocation.longitude] : kirunaPosition;

              return (
                <Marker
                  key={index}
                  position={position}
                  icon={getIconForDocument(doc.type, doc.stakeholders)}
                  eventHandlers={{
                    click: () => handleDocumentClick(doc),
                    mouseover: (e) => {
                      const marker = e.target;
                      // Showing the title of the document as a tooltip
                      marker.bindTooltip(doc.title, { 
                        permanent: false, 
                        offset: [2, -33],
                        direction: 'top',
                      }).openTooltip();
                      // Showing the polygon when mouseover on the document
                      if (doc.geolocation.municipality === "Entire municipality") {
                        const map = marker._map;
                        if (!kirunaPolygonRef.current) {
                          kirunaPolygonRef.current = L.polygon(kirunaBorderCoordinates, {
                            color: "purple",
                            weight: 3,
                            fillOpacity: 0.1,
                          }).addTo(map);
                        }
                      }
                    },
                    mouseout: (e) => {
                      const marker = e.target;
                      marker.closeTooltip();

                      // Removing the polygon when mouseout
                      if (kirunaPolygonRef.current) {
                        const map = marker._map;
                        map.removeLayer(kirunaPolygonRef.current);
                        kirunaPolygonRef.current = null;
                      }
                    },
                  }}
                />
              );
            })}
          </MarkerClusterGroup>
          {selectedDocument && selectedDocument.geolocation.latitude ? (
            <ZoomToMarker
              position={[
                selectedDocument.geolocation.latitude,
                selectedDocument.geolocation.longitude,
              ]}
              zoomLevel={15}
            />
          ) : (
            <ZoomToMarker position={kirunaPosition} zoomLevel={12} />
          )}
        </MapContainer>
      </div>

      {selectedDocument && show && (
        <DocumentSidePanel
          document={selectedDocument}
          onClose={closeSidePanel}
        />
      )}
    </div>
  );
};

export default MapKiruna;
