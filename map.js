var Main;

import Map from "https://js.arcgis.com/5.1/@arcgis/core/Map.js";
import Graphic from "https://js.arcgis.com/5.1/@arcgis/core/Graphic.js";
import GraphicsLayer from "https://js.arcgis.com/5.1/@arcgis/core/layers/GraphicsLayer.js";
import ElevationLayer from "https://js.arcgis.com/5.1/@arcgis/core/layers/ElevationLayer.js";
import SceneView from "https://js.arcgis.com/5.1/@arcgis/core/views/SceneView.js";
import Festivals from "./Festivals.js";
import Breweries from "./Breweries.js";

Main = (function () {

    const elevationLayer = new ElevationLayer({
        url: "http://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer"
    });

    const map = new Map({
        basemap: "hybrid",
        ground: {
            layers: [elevationLayer]
        }
    });

    const view = new SceneView({
        container: "map",
        viewingMode: "local",
        map: map,
        camera: {
            position: {
                x: -122.13,
                y: 44.57,
                z: 2000000,
                spatialReference: {
                    wkid: 4326
                }
            },
            heading: 0,
            tilt: 0
        },
        popup: {
            dockEnabled: true,
            dockOptions: {
                breakpoint: false
            }
        },
        environment: {
            lighting: {
                directShadowsEnabled: false
            }
        }
    });

    const breweriesLayer = new GraphicsLayer({
        title: "Breweries"
    });

    const festivalsLayer = new GraphicsLayer({
        title: "Festivals"
    });

    map.addMany([
        breweriesLayer,
        festivalsLayer
    ]);

    function addMarkers(locations, color, layer) {

        locations.forEach(location => {

            const graphic = new Graphic({
                geometry: {
                    type: "point",
                    longitude: location.lon,
                    latitude: location.lat
                },

                symbol: {
                    type: "simple-marker",
                    color: color,
                    size: 10,
                    outline: {
                        color: "white",
                        width: 1
                    }
                },

                attributes: {
                    name: location.name,
                    info: location.info,
                    description: location.description
                },

                popupTemplate: {
                    title: "{name}",
                    content: "{info}{description}"
                }
            });

            layer.add(graphic);
        });
    }

    addMarkers(Festivals, "red", festivalsLayer);
    addMarkers(Breweries, "blue", breweriesLayer);

    document.getElementById("breweries").addEventListener("change", e => {
        breweriesLayer.visible = e.target.checked;
    });

    document.getElementById("festivals").addEventListener("change", e => {
        festivalsLayer.visible = e.target.checked;
    });

})();