axios
    .get("http://45.19.182.21:8003/models/covid_article_location.json")
    .then(res => {
        const geoData = res.data
        load_map(geoData)
    })

function load_map(geo_data) {
    console.log(geo_data)
    var l = geo_data.length
    var features = new Array(l)
    for (let i = 0; i < l; i++) {
        let coordinates = ol.proj.transform(
            [parseFloat(geo_data[i].lon), parseFloat(geo_data[i].lat)],
            "EPSG:4326",
            "EPSG:3857"
        )
        let attr = {
            attribute: geo_data[i].title,
            link: geo_data[i].url,
            place: geo_data[i].place_name,
        }
        features[i] = new ol.Feature({
            geometry: new ol.geom.Point(coordinates),
            attribute: attr,
        })
    }

    let source = new ol.source.Vector({
        features: features,
    })

    let clusterSource = new ol.source.Cluster({
        distance: 40,
        source: source,
    })

    var styleCache = {}
    var layerVetor = new ol.layer.Vector({
        source: clusterSource,
        style: function (feature, resolution) {
            var size = feature.get("features").length
            var style = styleCache[size]
            if (!style) {
                style = [
                    new ol.style.Style({
                        image: new ol.style.Icon(
                            /** @type {olx.style.IconOptions} */ ({
                                anchor: [0.5, 60],
                                anchorOrigin: "top-right",
                                anchorXUnits: "fraction",
                                anchorYUnits: "pixels",
                                offsetOrigin: "top-right",
                                offset: [0, 1],
                                scale: 0.1,
                                opacity: 0.75,
                                src: "circle.png",
                            })
                        ),
                        text: new ol.style.Text({
                            text: size.toString(),
                            fill: new ol.style.Fill({
                                color: "red",
                            }),
                        }),
                    }),
                ]
                styleCache[size] = style
            }
            return style
        },
    })
    const map = new ol.Map({
        view: new ol.View({
            center: [0, 0],
            zoom: 2,
        }),
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM(),
            }),
        ],
        target: "js-map",
        controls: ol.control
            .defaults()
            .extend([
                new ol.control.FullScreen(),
                new ol.control.OverviewMap(),
                new ol.control.Zoom(),
                new ol.control.MousePosition(),
            ]),
    })
    map.addLayer(layerVetor)

    var container = document.getElementById("popup")
    var content = document.getElementById("popup-content")
    var closer = document.getElementById("popup-closer")

    var popup = new ol.Overlay(
        /** @type {olx.OverlayOptions} */ ({
            element: container,
            autoPan: true,
            positioning: "bottom-center",
            stopEvent: true,
            autoPanAnimation: {
                duration: 250,
            },
        })
    )
    map.addOverlay(popup)

    closer.onclick = function () {
        popup.setPosition(undefined)
        closer.blur()
        return false
    }

    function addFeatrueInfo(info, link, placeName) {
        var elementDiv1 = document.createElement("a")
        elementDiv1.className = "markerText"
        elementDiv1.setAttribute("href", link)
        elementDiv1.setAttribute("target", "_blank")
        var elementDiv2 = document.createElement("div")
        setInnerText(elementDiv2, placeName)
        //elementDiv.innerText = info.att.text;
        setInnerText(elementDiv1, info)
        content.appendChild(elementDiv1)
        content.appendChild(elementDiv2)
    }

    function setInnerText(element, text) {
        if (typeof element.textContent == "string") {
            element.textContent = text
        } else {
            element.innerText = text
        }
    }

    layerVetor.on("click", function (evt) {
        var geometry = evt.Feature
        console.log(geometry)
    })

    map.on("click", function (evt) {
        popup.setPosition(undefined)
        closer.blur()
        // return false
        var coordinate = evt.coordinate

        var feature = map.forEachFeatureAtPixel(evt.pixel, function (
            feature,
            layerVetor
        ) {
            return feature
        })
        console.log(feature.getProperties().features[0].values_.attribute)
        var featuer_attr = feature.getProperties().features[0].values_.attribute
        var featuerInfo = featuer_attr.attribute
        var featuerLink = featuer_attr.link
        var featuerPlace = featuer_attr.place
        console.log(featuerInfo)
        console.log(featuerLink)

        if (feature) {
            content.innerHTML = ""
            addFeatrueInfo(featuerInfo, featuerLink, featuerPlace)
            if (popup.getPosition() == undefined) {
                popup.setPosition(coordinate)
            }
        }
    })

    map.on("pointermove", function (e) {
        var pixel = map.getEventPixel(e.originalEvent)
        var hit = map.hasFeatureAtPixel(pixel)
        map.getTargetElement().style.cursor = hit ? "pointer" : ""
    })
}
