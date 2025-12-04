// // // // // // import { useEffect, useRef } from "react";

// // // // // // const MapPicker = ({ onSelect, defaultLat = 28.6139, defaultLng = 77.2090 }) => {
// // // // // //   const mapRef = useRef<HTMLDivElement>(null);

// // // // // //   useEffect(() => {
// // // // // //     const interval = setInterval(() => {
// // // // // //       if (window.google) {
// // // // // //         clearInterval(interval);

// // // // // //         const map = new google.maps.Map(mapRef.current!, {
// // // // // //           center: { lat: defaultLat, lng: defaultLng },
// // // // // //           zoom: 14
// // // // // //         });

// // // // // //         const marker = new google.maps.Marker({
// // // // // //           position: { lat: defaultLat, lng: defaultLng },
// // // // // //           map,
// // // // // //           draggable: true
// // // // // //         });

// // // // // //         marker.addListener("dragend", () => {
// // // // // //           const pos = marker.getPosition();
// // // // // //           onSelect({
// // // // // //             lat: pos!.lat(),
// // // // // //             lng: pos!.lng(),
// // // // // //           });
// // // // // //         });
// // // // // //       }
// // // // // //     }, 100);
// // // // // //   }, []);

// // // // // //   return <div ref={mapRef} className="w-full h-96 rounded-md" />;
// // // // // // };

// // // // // // export default MapPicker;


// // // // // import { useEffect, useRef } from "react";
// // // // // import L from "leaflet";
// // // // // import "leaflet/dist/leaflet.css";

// // // // // const MapPicker = ({ onSelect, defaultLat = 28.6139, defaultLng = 77.2090 }) => {
// // // // //   const mapRef = useRef<HTMLDivElement>(null);

// // // // //   useEffect(() => {
// // // // //     const map = L.map(mapRef.current!).setView([defaultLat, defaultLng], 14);

// // // // //     L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
// // // // //       attribution: "© OpenStreetMap contributors",
// // // // //     }).addTo(map);

// // // // //     const marker = L.marker([defaultLat, defaultLng], { draggable: true }).addTo(map);

// // // // //     marker.on("dragend", () => {
// // // // //       const pos = marker.getLatLng();
// // // // //       onSelect({ lat: pos.lat, lng: pos.lng });
// // // // //     });
// // // // //   }, []);

// // // // //   return <div ref={mapRef} className="w-full h-96 rounded-md" />;
// // // // // };

// // // export default MapPicker;
// // import { useEffect, useRef, useState } from "react";
// // import L from "leaflet";
// // import "leaflet/dist/leaflet.css";

// // const MapPicker = ({ onSelect, defaultLat = 28.6139, defaultLng = 77.2090 }) => {
// //   const mapRef = useRef<HTMLDivElement>(null);
// //   const [map, setMap] = useState<L.Map | null>(null);
// //   const [marker, setMarker] = useState<L.Marker | null>(null);
// //   const [query, setQuery] = useState("");
// //   const [results, setResults] = useState<any[]>([]);

// //   // Initialize map
// //   useEffect(() => {
// //     if (!mapRef.current || map) return;

// //     const newMap = L.map(mapRef.current).setView([defaultLat, defaultLng], 14);

// //     L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
// //       attribution: "© OpenStreetMap contributors",
// //     }).addTo(newMap);

// //     const newMarker = L.marker([defaultLat, defaultLng], {
// //       draggable: true,
// //     }).addTo(newMap);

// //     newMarker.on("dragend", () => {
// //       const pos = newMarker.getLatLng();
// //       onSelect({ lat: pos.lat, lng: pos.lng });
// //     });

// //     setMap(newMap);
// //     setMarker(newMarker);
// //   }, []);

// //   // Search locations using Nominatim
// //   const searchLocation = async (text: string) => {
// //     setQuery(text);

// //     if (text.length < 3) {
// //       setResults([]);
// //       return;
// //     }

// //     const res = await fetch(
// //       `https://nominatim.openstreetmap.org/search?format=json&q=${text}`
// //     );
// //     const data = await res.json();
// //     setResults(data);
// //   };

// //   // Move marker when selecting a search result
// //   const handleSelectResult = (place: any) => {
// //     const lat = parseFloat(place.lat);
// //     const lon = parseFloat(place.lon);

// //     if (map && marker) {
// //       map.setView([lat, lon], 16);
// //       marker.setLatLng([lat, lon]);
// //     }

// //     onSelect({ lat, lng: lon });
// //     setResults([]);
// //     setQuery(place.display_name);
// //   };

// //   return (
// //     <div className="relative w-full h-full">
// //       {/* Search Box */}
// //       <div className="absolute top-4 left-4 right-4 z-[1000]">
// //         <input
// //           type="text"
// //           value={query}
// //           onChange={(e) => searchLocation(e.target.value)}
// //           className="w-full p-2 rounded-md shadow bg-white border"
// //           placeholder="Search for a location..."
// //         />

// //         {/* Suggestions list */}
// //         {results.length > 0 && (
// //           <div className="mt-2 bg-white shadow rounded-md max-h-60 overflow-y-auto">
// //             {results.map((place) => (
// //               <div
// //                 key={place.place_id}
// //                 className="p-2 hover:bg-gray-100 cursor-pointer border-b"
// //                 onClick={() => handleSelectResult(place)}
// //               >
// //                 {place.display_name}
// //               </div>
// //             ))}
// //           </div>
// //         )}
// //       </div>

// //       {/* Map */}
// //       <div ref={mapRef} className="w-full h-96 rounded-md" />
// //     </div>
// //   );
// // };

// // export default MapPicker;

// // // import { useEffect, useRef, useState } from "react";
// // // import L from "leaflet";
// // // import "leaflet/dist/leaflet.css";

// // // interface MapPickerProps {
// // //   defaultLat?: number;
// // //   defaultLng?: number;
// // //   zoom?: number;
// // //   onSelect: (coords: { lat: number; lng: number }) => void;
// // // }

// // // const MapPicker: React.FC<MapPickerProps> = ({
// // //   defaultLat = 28.6139, // New Delhi default
// // //   defaultLng = 77.209,
// // //   zoom = 13,
// // //   onSelect,
// // // }) => {
// // //   const mapRef = useRef<HTMLDivElement>(null);
// // //   const leafletMapRef = useRef<L.Map | null>(null);
// // //   const [marker, setMarker] = useState<L.Marker | null>(null);

// // //   useEffect(() => {
// // //     if (!mapRef.current) return;

// // //     // Initialize map
// // //     leafletMapRef.current = L.map(mapRef.current).setView([defaultLat, defaultLng], zoom);

// // //     L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
// // //       attribution:
// // //         '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
// // //     }).addTo(leafletMapRef.current);

// // //     // Initial marker
// // //     const initialMarker = L.marker([defaultLat, defaultLng], { draggable: true }).addTo(
// // //       leafletMapRef.current
// // //     );
// // //     setMarker(initialMarker);

// // //     // Drag event
// // //     initialMarker.on("dragend", (e) => {
// // //       const pos = e.target.getLatLng();
// // //       onSelect({ lat: pos.lat, lng: pos.lng });
// // //     });

// // //     // Click on map
// // //     leafletMapRef.current.on("click", (e: L.LeafletMouseEvent) => {
// // //       const { lat, lng } = e.latlng;
// // //       if (marker) {
// // //         marker.setLatLng([lat, lng]);
// // //       } else {
// // //         const newMarker = L.marker([lat, lng], { draggable: true }).addTo(leafletMapRef.current!);
// // //         newMarker.on("dragend", (e) => {
// // //           const pos = e.target.getLatLng();
// // //           onSelect({ lat: pos.lat, lng: pos.lng });
// // //         });
// // //         setMarker(newMarker);
// // //       }
// // //       onSelect({ lat, lng });
// // //     });

// // //     return () => {
// // //       leafletMapRef.current?.remove();
// // //     };
// // //   }, []);

// // //   return <div ref={mapRef} className="w-full h-[400px] rounded-lg" />;
// // // };

// // // export default MapPicker;

// // import { useEffect, useRef, useState } from "react";
// // import L from "leaflet";
// // import "leaflet/dist/leaflet.css";

// // interface MapPickerProps {
// //   defaultLat?: number;
// //   defaultLng?: number;
// //   zoom?: number;
// //   onSelect: (coords: { lat: number; lng: number }) => void;
// // }

// // const MapPicker: React.FC<MapPickerProps> = ({
// //   defaultLat = 28.6139,
// //   defaultLng = 77.209,
// //   zoom = 13,
// //   onSelect,
// // }) => {
// //   const mapRef = useRef<HTMLDivElement>(null);
// //   const leafletMapRef = useRef<L.Map | null>(null);
// //   const [marker, setMarker] = useState<L.Marker | null>(null);

// //   useEffect(() => {
// //   if (leafletMapRef.current) {
// //     setTimeout(() => {
// //       leafletMapRef.current?.invalidateSize();
// //     }, 200); // slight delay ensures the dialog is rendered
// //   }
// // }, []);

// //   // Initialize map
// //   useEffect(() => {
// //     if (!mapRef.current) return;

// //     leafletMapRef.current = L.map(mapRef.current).setView([defaultLat, defaultLng], zoom);

// //     L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
// //       attribution:
// //         '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
// //     }).addTo(leafletMapRef.current);

// //     // Initial marker
// //     const initialMarker = L.marker([defaultLat, defaultLng], { draggable: true }).addTo(
// //       leafletMapRef.current
// //     );
// //     setMarker(initialMarker);

// //     // Drag marker
// //     initialMarker.on("dragend", (e) => {
// //       const pos = e.target.getLatLng();
// //       onSelect({ lat: pos.lat, lng: pos.lng });
// //     });

// //     // Click on map
// //     leafletMapRef.current.on("click", (e: L.LeafletMouseEvent) => {
// //       const { lat, lng } = e.latlng;
// //       if (marker) {
// //         marker.setLatLng([lat, lng]);
// //       } else {
// //         const newMarker = L.marker([lat, lng], { draggable: true }).addTo(leafletMapRef.current!);
// //         newMarker.on("dragend", (e) => {
// //           const pos = e.target.getLatLng();
// //           onSelect({ lat: pos.lat, lng: pos.lng });
// //         });
// //         setMarker(newMarker);
// //       }
// //       onSelect({ lat, lng });
// //     });

// //     return () => {
// //       leafletMapRef.current?.remove();
// //     };
// //   }, []);

// //   // Handle use current location
// //   const handleUseCurrentLocation = () => {
// //     if (!navigator.geolocation) {
// //       alert("Geolocation is not supported by your browser");
// //       return;
// //     }

// //     navigator.geolocation.getCurrentPosition(
// //       (position) => {
// //         const { latitude, longitude } = position.coords;
// //         if (marker) {
// //           marker.setLatLng([latitude, longitude]);
// //         } else if (leafletMapRef.current) {
// //           const newMarker = L.marker([latitude, longitude], { draggable: true }).addTo(
// //             leafletMapRef.current
// //           );
// //           newMarker.on("dragend", (e) => {
// //             const pos = e.target.getLatLng();
// //             onSelect({ lat: pos.lat, lng: pos.lng });
// //           });
// //           setMarker(newMarker);
// //         }

// //         leafletMapRef.current?.setView([latitude, longitude], 15);
// //         onSelect({ lat: latitude, lng: longitude });
// //       },
// //       (err) => {
// //         console.error(err);
// //         alert("Unable to fetch your location");
// //       }
// //     );
// //   };

// //   return (
// //     <div className="relative">
// //       <button
// //   type="button"
// //   onClick={handleUseCurrentLocation}
// //   className="absolute z-50 top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded shadow hover:bg-blue-700"
// // >
// //   Use My Location
// // </button>
// //      <div ref={mapRef} className="w-full h-[400px] rounded-lg z-0" />

// //     </div>
// //   );
// // };

// // export default MapPicker;
// import { useEffect, useRef, useState } from "react";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// interface MapPickerProps {
//   defaultLat?: number;
//   defaultLng?: number;
//   zoom?: number;
//   onSelect: (coords: { lat: number; lng: number }) => void;
// }

// const MapPicker: React.FC<MapPickerProps> = ({
//   defaultLat = 28.6139,
//   defaultLng = 77.209,
//   zoom = 13,
//   onSelect,
// }) => {
//   const mapRef = useRef<HTMLDivElement>(null);
//   const leafletMapRef = useRef<L.Map | null>(null);
//   const [marker, setMarker] = useState<L.Marker | null>(null);

//   const [query, setQuery] = useState("");
//   const [results, setResults] = useState<any[]>([]);

//   // Initialize map
//   useEffect(() => {
//     if (!mapRef.current || leafletMapRef.current) return;

//     const map = L.map(mapRef.current).setView([defaultLat, defaultLng], zoom);

//     L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//       attribution:
//         '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//     }).addTo(map);

//     const initialMarker = L.marker([defaultLat, defaultLng], { draggable: true }).addTo(map);
//     initialMarker.on("dragend", (e) => {
//       const pos = e.target.getLatLng();
//       onSelect({ lat: pos.lat, lng: pos.lng });
//     });

//     map.on("click", (e: L.LeafletMouseEvent) => {
//       const { lat, lng } = e.latlng;
//       if (marker) {
//         marker.setLatLng([lat, lng]);
//       } else {
//         const newMarker = L.marker([lat, lng], { draggable: true }).addTo(map);
//         newMarker.on("dragend", (e) => {
//           const pos = e.target.getLatLng();
//           onSelect({ lat: pos.lat, lng: pos.lng });
//         });
//         setMarker(newMarker);
//       }
//       onSelect({ lat, lng });
//     });

//     leafletMapRef.current = map;
//     setMarker(initialMarker);

//     // Fix map size in modals/dialogs
//     setTimeout(() => map.invalidateSize(), 300);
//   }, []);

//   // Handle current location
//   const handleUseCurrentLocation = () => {
//     if (!navigator.geolocation) {
//       alert("Geolocation not supported");
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         const { latitude, longitude } = pos.coords;
//         if (marker) {
//           marker.setLatLng([latitude, longitude]);
//         } else if (leafletMapRef.current) {
//           const newMarker = L.marker([latitude, longitude], { draggable: true }).addTo(
//             leafletMapRef.current
//           );
//           newMarker.on("dragend", (e) => {
//             const pos = e.target.getLatLng();
//             onSelect({ lat: pos.lat, lng: pos.lng });
//           });
//           setMarker(newMarker);
//         }
//         leafletMapRef.current?.setView([latitude, longitude], 15);
//         onSelect({ lat: latitude, lng: longitude });
//       },
//       () => alert("Unable to fetch location")
//     );
//   };

//   // Search locations
//   const searchLocation = async (text: string) => {
//     setQuery(text);
//     if (text.length < 3) return setResults([]);

//     const res = await fetch(
//       `https://nominatim.openstreetmap.org/search?format=json&q=${text}`
//     );
//     const data = await res.json();
//     setResults(data);
//   };

//   const handleSelectResult = (place: any) => {
//     const lat = parseFloat(place.lat);
//     const lon = parseFloat(place.lon);

//     if (leafletMapRef.current) {
//       leafletMapRef.current.setView([lat, lon], 16);
//     }

//     if (marker) {
//       marker.setLatLng([lat, lon]);
//     } else if (leafletMapRef.current) {
//       const newMarker = L.marker([lat, lon], { draggable: true }).addTo(leafletMapRef.current);
//       newMarker.on("dragend", (e) => {
//         const pos = e.target.getLatLng();
//         onSelect({ lat: pos.lat, lng: pos.lng });
//       });
//       setMarker(newMarker);
//     }

//     onSelect({ lat, lng: lon });
//     setResults([]);
//     setQuery(place.display_name);
//   };

//   return (
//     <div className="relative w-full h-[400px]">
//       {/* Search Box */}
//       <div className="absolute top-4 left-4 right-4 z-50">
//         <input
//           type="text"
//           value={query}
//           onChange={(e) => searchLocation(e.target.value)}
//           className="w-full p-2 rounded-md shadow bg-white border"
//           placeholder="Search location..."
//         />
//         {results.length > 0 && (
//           <div className="mt-2 bg-white shadow rounded-md max-h-60 overflow-y-auto">
//             {results.map((place) => (
//               <div
//                 key={place.place_id}
//                 className="p-2 hover:bg-gray-100 cursor-pointer border-b"
//                 onClick={() => handleSelectResult(place)}
//               >
//                 {place.display_name}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Use My Location */}
//       <button
//         type="button"
//         onClick={handleUseCurrentLocation}
//         className="absolute top-4 right-4 z-50 bg-blue-600 text-white px-3 py-1 rounded shadow hover:bg-blue-700"
//       >
//         Use My Location
//       </button>

//       {/* Map */}
//       <div ref={mapRef} className="w-full h-full rounded-lg z-0" />
//     </div>
//   );
// };

// export default MapPicker;
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapPickerProps {
  defaultLat?: number;
  defaultLng?: number;
  zoom?: number;
  onSelect: (coords: { lat: number; lng: number }) => void;
}

const MapPicker: React.FC<MapPickerProps> = ({
  defaultLat = 28.6139,
  defaultLng = 77.209,
  zoom = 13,
  onSelect,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const [marker, setMarker] = useState<L.Marker | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    // Initialize map without default zoom control
    leafletMapRef.current = L.map(mapRef.current, { zoomControl: false }).setView(
      [defaultLat, defaultLng],
      zoom
    );

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(leafletMapRef.current);

    // Add zoom control at bottom-right
    L.control.zoom({ position: "bottomright" }).addTo(leafletMapRef.current);

    // Add draggable marker
    const initialMarker = L.marker([defaultLat, defaultLng], { draggable: true }).addTo(
      leafletMapRef.current
    );
    setMarker(initialMarker);

    // Drag marker
    initialMarker.on("dragend", () => {
      const pos = initialMarker.getLatLng();
      onSelect({ lat: pos.lat, lng: pos.lng });
    });

    // Click map to place marker
    leafletMapRef.current.on("click", (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      if (marker) {
        marker.setLatLng([lat, lng]);
      } else {
        const newMarker = L.marker([lat, lng], { draggable: true }).addTo(leafletMapRef.current!);
        newMarker.on("dragend", (e) => {
          const pos = e.target.getLatLng();
          onSelect({ lat: pos.lat, lng: pos.lng });
        });
        setMarker(newMarker);
      }
      onSelect({ lat, lng });
    });

    // Fix map rendering issues
    setTimeout(() => leafletMapRef.current?.invalidateSize(), 200);

    return () => {
      leafletMapRef.current?.remove();
    };
  }, []);

  // Search locations using Nominatim
  const searchLocation = async (text: string) => {
    setQuery(text);
    if (text.length < 3) {
      setResults([]);
      return;
    }
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}`
      );
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  // Handle selecting a search result
  const handleSelectResult = (place: any) => {
    const lat = parseFloat(place.lat);
    const lng = parseFloat(place.lon);

    if (leafletMapRef.current && marker) {
      leafletMapRef.current.setView([lat, lng], 16);
      marker.setLatLng([lat, lng]);
    }

    onSelect({ lat, lng });
    setQuery(place.display_name);
    setResults([]);
  };

  // Handle "Use My Location"
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        if (marker) {
          marker.setLatLng([latitude, longitude]);
        } else if (leafletMapRef.current) {
          const newMarker = L.marker([latitude, longitude], { draggable: true }).addTo(
            leafletMapRef.current
          );
          newMarker.on("dragend", (e) => {
            const pos = e.target.getLatLng();
            onSelect({ lat: pos.lat, lng: pos.lng });
          });
          setMarker(newMarker);
        }

        leafletMapRef.current?.setView([latitude, longitude], 15);
        onSelect({ lat: latitude, lng: longitude });
      },
      (err) => {
        console.error(err);
        alert("Unable to fetch your location");
      }
    );
  };

  return (
    <div className="relative w-full h-[400px]">
      {/* Search Box */}
      <div className="absolute top-4 left-4 right-4 z-50">
        <input
          type="text"
          value={query}
          onChange={(e) => searchLocation(e.target.value)}
          placeholder="Search for a location..."
          className="w-full p-2 rounded-md shadow bg-white border"
        />
        {results.length > 0 && (
          <div className="mt-2 bg-white shadow rounded-md max-h-60 overflow-y-auto">
            {results.map((place) => (
              <div
                key={place.place_id}
                className="p-2 hover:bg-gray-100 cursor-pointer border-b"
                onClick={() => handleSelectResult(place)}
              >
                {place.display_name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Use My Location Button */}
      <button
        type="button"
        onClick={handleUseCurrentLocation}
        className="absolute top-16 right-4 z-50 bg-blue-600 text-white px-3 py-1 rounded shadow hover:bg-blue-700"
      >
        Use My Location
      </button>

      {/* Map */}
      <div ref={mapRef} className="w-full h-full rounded-md z-0" />
    </div>
  );
};

export default MapPicker;
