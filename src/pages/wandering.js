import { useRef, useState } from "react";
import { DrawingManager, GoogleMap, Polygon, useJsApiLoader } from "@react-google-maps/api";

const WanderingPage = () => {
    const mapRef = useRef();
    const polygonRefs = useRef([]);
    const activePolygonIndex = useRef();
    const autocompleteRef = useRef();
    const drawingManagerRef = useRef();

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY,
        libraries: ["places", "drawing"],
    });

    const [polygons, setPolygons] = useState([[], []]);

    // NYC by default!
    const [center, setCenter] = useState({
        lat: 40.7,
        lng: -74,
    });

    // Full page!
    const containerStyle = {
        width: "100%",
        height: "100vh",
        marginTop: "-1rem",
    };

    const polygonOptions = {
        fillOpacity: 0.3,
        fillColor: "#F6A037",
        strokeColor: "#F6A037",
        strokeWeight: 2,
        draggable: true,
        editable: true,
    };

    const drawingManagerOptions = {
        polygonOptions: polygonOptions,
        drawingControl: true,
        drawingControlOptions: {
            position: window.google?.maps?.ControlPosition?.TOP_CENTER,
            drawingModes: [window.google?.maps?.drawing?.OverlayType?.POLYGON],
        },
    };

    const onLoadMap = (map) => {
        mapRef.current = map;
    };

    const onLoadPolygon = (polygon, index) => {
        polygonRefs.current[index] = polygon;
    };

    const onClickPolygon = (index) => {
        activePolygonIndex.current = index;
    };

    const onLoadAutocomplete = (autocomplete) => {
        autocompleteRef.current = autocomplete;
    };

    const onPlaceChanged = () => {
        const { geometry } = autocompleteRef.current.getPlace();
        const bounds = new window.google.maps.LatLngBounds();
        if (geometry.viewport) {
            bounds.union(geometry.viewport);
        } else {
            bounds.extend(geometry.location);
        }
        mapRef.current.fitBounds(bounds);
    };

    const onLoadDrawingManager = (drawingManager) => {
        drawingManagerRef.current = drawingManager;
    };

    const onOverlayComplete = ($overlayEvent) => {
        drawingManagerRef.current.setDrawingMode(null);
        if ($overlayEvent.type === window.google.maps.drawing.OverlayType.POLYGON) {
            const newPolygon = $overlayEvent.overlay
                .getPath()
                .getArray()
                .map((latLng) => ({ lat: latLng.lat(), lng: latLng.lng() }));
            const startPoint = newPolygon[0];
            newPolygon.push(startPoint);
            $overlayEvent.overlay?.setMap(null);
            setPolygons([...polygons, newPolygon]);
        }
    };

    const onEditPolygon = (index) => {
        const polygonRef = polygonRefs.current[index];
        if (polygonRef) {
            const coordinates = polygonRef
                .getPath()
                .getArray()
                .map((latLng) => ({ lat: latLng.lat(), lng: latLng.lng() }));

            const allPolygons = [...polygons];
            allPolygons[index] = coordinates;
            setPolygons(allPolygons);
        }
    };

    return isLoaded ? (
        <div className="map-container relative">
            <GoogleMap
                zoom={16}
                center={center}
                onLoad={onLoadMap}
                mapContainerStyle={containerStyle}
                onTilesLoaded={() => setCenter(null)}
            >
                <DrawingManager
                    onLoad={onLoadDrawingManager}
                    onOverlayComplete={onOverlayComplete}
                    options={drawingManagerOptions}
                />
                {polygons.map((iterator, index) => (
                    <Polygon
                        key={index}
                        onLoad={(event) => onLoadPolygon(event, index)}
                        onMouseDown={() => onClickPolygon(index)}
                        onMouseUp={() => onEditPolygon(index)}
                        onDragEnd={() => onEditPolygon(index)}
                        options={polygonOptions}
                        paths={iterator}
                        draggable
                        editable
                    />
                ))}
                <button
                    onClick={() => console.log(polygons)}
                    className="absolute top-10 right-32 text-3xl font-bold shadow-xl border-1 p-8 py-3 rounded-xl bg-orange-500 text-white"
                >
                    Save
                </button>
            </GoogleMap>
        </div>
    ) : null;
};

export default WanderingPage;
