// src/components/SchoolInfo.tsx

// This code initializes the map in an effect hook and reinitializes it whenever the mapType 
//state changes. The getStyleUrl function returns the appropriate style URL based on the selected map type. 
//When '3Dbuildings' is selected, a 3D buildings layer is added to the map. Each time the map type changes, the map is re-created to apply the new style.


import React, { useState, useEffect, useRef } from 'react';
import * as BABYLON from '@babylonjs/core'; // Importing Babylon.js for 3D rendering
import '@babylonjs/loaders'; // Importing loaders for Babylon.js
import '@babylonjs/materials'; // Importing materials for Babylon.js
import maplibregl from 'maplibre-gl'; // Importing Maplibre for map rendering

const MapComponent = () => {
    const [mapType, setMapType] = useState('topographic');
    const mapContainerRef = useRef(null); // Reference for the map container div
    const engineRef = useRef(null); // Reference to store Babylon Engine

    // Function to get style URL based on map type
    const getStyleUrl = (type) => {
        switch (type) {
            case 'topographic':
                return 'https://api.maptiler.com/maps/basic-v2/style.json?key=p47xAmvxV6awt2xre9CN';
                case 'satellite':
                    return 'https://api.maptiler.com/maps/satellite/style.json?key=p47xAmvxV6awt2xre9CN';
                case '3Dbuildings':
                    return 'https://api.maptiler.com/maps/e3502d9d-91d8-41e3-ab8d-de7965bc0fde/style.json?key=p47xAmvxV6awt2xre9CN';
                case 'Terrain':
                    return 'https://api.maptiler.com/maps/winter-v2/style.json?key=p47xAmvxV6awt2xre9CN';
                default:
                return 'https://api.maptiler.com/maps/basic-v2/style.json?key=p47xAmvxV6awt2xre9CN';
        }
    };

    // useEffect hook for setting up the Maplibre map and Babylon.js scene
    useEffect(() => {
        // Initialize Maplibre map
        const map = new maplibregl.Map({
            container: mapContainerRef.current, // Reference to the map container
            style: getStyleUrl(mapType), // Map style based on the current map type
            center: [148.9819, -35.3981], // Example center coordinates
            zoom: 18, // Initial zoom level
            pitch: 60 // Initial pitch
        });

        // Configuration for the Babylon.js custom layer
        const customLayer = {
            id: '3d-model', // Unique ID for the custom layer
            type: 'custom', // Type of the layer
            renderingMode: '3d', // Rendering mode
            onAdd: function (map, gl) {

                // Function called when the layer is added to the map
                // Initialize the Babylon.js engine with the WebGL context from Maplibre
                const engine = new BABYLON.Engine(gl, true, {
                    useHighPrecisionMatrix: true,
                    preserveDrawingBuffer: true
                });
                const scene = new BABYLON.Scene(engine);

                // Set up a simple Babylon.js camera
                const camera = new BABYLON.Camera("camera", new BABYLON.Vector3(0, 0, 0), scene);
                camera.minZ = 0.1; // Set a minimum Z value for the camera

                // Set up Babylon.js light
                const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
                light.intensity = 0.7;

                // Load a 3D model or create Babylon.js objects here
                // Create a plane in Babylon on which the map will be displayed
                const mapPlane = BABYLON.MeshBuilder.CreatePlane("mapPlane", { size: 10 }, scene);
                const mapMaterial = new BABYLON.StandardMaterial("mapMaterial", scene);
                mapPlane.material = mapMaterial;

                // Store the engine reference for resizing
                engineRef.current = engine;
            },
            render: function (gl, matrix) {
                // Update the Babylon.js camera projection matrix
                const cameraMatrix = BABYLON.Matrix.FromArray(matrix);
                this.camera.freezeProjectionMatrix(cameraMatrix);
                
                // Render the Babylon.js scene
                this.scene.render();
            }
        };

        // Add the custom layer when the map style is loaded
        map.on('load', () => {
            map.addLayer(customLayer);
        });
        // Function to handle browser window resize events
        const handleResize = () => {
            if (engineRef.current) {
                engineRef.current.resize();
            }
        };

        // Add window resize event listener
        window.addEventListener('resize', handleResize);

        // Cleanup function for when the component unmounts
        return () => {
            // Remove the map and clean up resources
            map.remove();

            // Remove the resize event listener
            window.removeEventListener('resize', handleResize);

            // Dispose of the Babylon.js engine
            if (engineRef.current) {
                engineRef.current.dispose();
            }
        };
        }, [mapType]); // Depend on mapType to re-run the effect when it changes

        // Function to handle map type changes
        const handleMapTypeChange = (type) => {
            setMapType(type);
        };

    return (
        <div>
            <select onChange={(e) => handleMapTypeChange(e.target.value)} style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000 }}>
            <option value="topographic">Topographic Map</option>
                <option value="satellite">Satellite Map</option>
                <option value="3Dbuildings">3D Building Map</option>
                <option value="Terrain">Terrain Map</option>
            </select>
            <div id="map" ref={mapContainerRef} style={{ width: '100%', height: '100%' }}></div>
        </div>
    );
};

export default MapComponent;



///////////////////////////////////////////////////////////////////////////////////////////////////////////
// import React, { useState, useEffect, useRef } from 'react';
// import maplibregl from 'maplibre-gl';

// const MapComponent = () => {
//   const [mapType, setMapType] = useState('topographic');
//   const mapContainer = useRef(null);
//   const map = useRef(null); // Reference to hold the map instance

//   // Initialize map
//   useEffect(() => {
//     if (map.current) return; // Initialize the map only once
//     map.current = new maplibregl.Map({
//       container: mapContainer.current,
//       version: 8,
//       style: 'https://api.maptiler.com/maps/basic-v2/style.json?key=p47xAmvxV6awt2xre9CN',
//       center: [6.953101, 50.935173],
//       zoom: 9,
//       pitch: 45,
//       bearing: -17.6,
//       antialias: true
//     });
//   }, []);

//   // Update map on selection
//   useEffect(() => {
//     if (!map.current) return;
//     let styleUrl;
//     switch (mapType) {
//         case 'topographic':
//           styleUrl = 'https://api.maptiler.com/maps/basic-v2/style.json?key=p47xAmvxV6awt2xre9CN'; // Replace with your topographic style URL
//           break;
//         case 'satellite':
//           styleUrl = 'https://api.maptiler.com/maps/satellite/style.json?key=p47xAmvxV6awt2xre9CN'; // Replace with your satellite style URL
//           break;
//         case '3Dbuildings': // Replace 'thirdType' with your third map type
//           styleUrl = 'https://api.maptiler.com/maps/basic-v2/style.json?key=p47xAmvxV6awt2xre9CN'; // Replace with your third style URL
//           break;
//         case 'Terrain': 
//           styleUrl = 'https://api.maptiler.com/maps/basic-v2/style.json?key=p47xAmvxV6awt2xre9CN'; // Replace with your 4th style URL
//           break;
//         default:
//           styleUrl = 'https://api.maptiler.com/maps/basic-v2/style.json?key=p47xAmvxV6awt2xre9CN'; // Default style URL
//       }
    
//       if (map) {
//         map.current.setStyle(styleUrl);
//       }
//     }, [mapType]);

//   return (
//     <div>
//       <select onChange={(e) => setMapType(e.target.value)} style={{ position: 'fixed', top: 0, left: 0 }}>
//         <option value="topographic">Topographic Map</option>
//           <option value="satellite">Satellite Map</option>
//           <option value="3Dbuildings">3Dbuilding Map</option>
//           <option value="Terrain">Terrain Map</option>
//       </select>
//       <div id="map" style={{ width: '100%', height: '400px' }} ref={mapContainer}></div>
//     </div>
//   );
// };

// export default MapComponent;



//////////////////////////////////////////////////////////////////////////////////////////////////
// type SchoolInfoProps = {
//     name: string;
//     address: string;
//     principal: string;
//   };
  
//   const SchoolInfo: React.FC<SchoolInfoProps> = ({ name, address, principal }) => (
//     <div>
//       <h1>{name}</h1>
//       <p>Address: {address}</p>
//       <p>Principal: {principal}</p>
//     </div>
//   );
  
//   export default SchoolInfo;


///////////////////////////////////////////////////////////////////////////////////////////////////////  
// import React, { useState } from 'react';

// const SchoolInfo: React.FC<SchoolInfoProps> = ({ name, address, principal }) => {
//   const [style, setStyle] = useState({ color: 'red', top: 0 });

//   const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     const value = event.target.value;
//     let newStyle = { color: 'red', top: 0 };

//     if (value === 'middle') {
//       newStyle = { color: 'blue', top: '50%' };
//     } else if (value === 'bottom') {
//       newStyle = { color: 'green', bottom: 0 };
//     }

//     setStyle(newStyle);
//   };

//   return (
//     <div>
//       <div style={{ position: 'fixed', top: 0, left: 0, zIndex: 1000 }}>
//         <select onChange={handleSelectChange}>
//           <option value="top">Top</option>
//           <option value="middle">Middle</option>
//           <option value="bottom">Bottom</option>
//         </select>
//       </div>
//       <div style={{ ...style, position: 'absolute' }}>
//         <h1>{name}</h1>
//         <p>Address: {address}</p>
//         <p>Principal: {principal}</p>
//       </div>
//     </div>
//   );
// };

// export default SchoolInfo;

//////////////////////////////////////////////////////////////////////////////////////////////

