/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  Image,
  Dimensions,
} from 'react-native';
import MapView, {Marker, AnimatedRegion} from 'react-native-maps';
import haversine from 'haversine';
import Geolocation from '@react-native-community/geolocation';
import MapViewDirections from 'react-native-maps-directions';

const LATITUDE_DELTA = 0.009;
const LONGITUDE_DELTA = 0.009;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const fullWidth = Dimensions.get('screen').width;

var mapStyle = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#1d2c4d',
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#8ec3b9',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#1a3646',
      },
    ],
  },
  {
    featureType: 'administrative.country',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#4b6878',
      },
    ],
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#64779e',
      },
    ],
  },
  {
    featureType: 'administrative.province',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#4b6878',
      },
    ],
  },
  {
    featureType: 'landscape.man_made',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#334e87',
      },
    ],
  },
  {
    featureType: 'landscape.natural',
    elementType: 'geometry',
    stylers: [
      {
        color: '#023e58',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      {
        color: '#283d6a',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#6f9ba5',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#1d2c4d',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#023e58',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#3C7680',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#304a7d',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#98a5be',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#1d2c4d',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#2c6675',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#255763',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#b0d5ce',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#023e58',
      },
    ],
  },
  {
    featureType: 'transit',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#98a5be',
      },
    ],
  },
  {
    featureType: 'transit',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#1d2c4d',
      },
    ],
  },
  {
    featureType: 'transit.line',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#283d6a',
      },
    ],
  },
  {
    featureType: 'transit.station',
    elementType: 'geometry',
    stylers: [
      {
        color: '#3a4762',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#0e1626',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#4e6d70',
      },
    ],
  },
];

class AnimatedMarkers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      latitude: LATITUDE,
      longitude: LONGITUDE,
      routeCoordinates: [],
      distanceTravelled: 0,
      prevLatLng: {},
      mapSnapshot: '',
      coordinate: new AnimatedRegion({
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: 0,
        longitudeDelta: 0,
      }),
    };
  }

  componentDidMount() {
    const {coordinate} = this.state;

    this.watchID = Geolocation.watchPosition(
      position => {
        const {routeCoordinates, distanceTravelled} = this.state;
        const {latitude, longitude} = position.coords;

        const newCoordinate = {
          latitude,
          longitude,
        };

        if (Platform.OS === 'android') {
          if (this.marker) {
            this.marker.animateMarkerToCoordinate(newCoordinate, 500);
          }
        } else {
          coordinate.timing(newCoordinate).start();
        }

        this.map.animateToRegion({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        });

        this.setState({
          latitude: latitude,
          longitude: longitude,
          routeCoordinates: routeCoordinates.concat([newCoordinate]),
          distanceTravelled:
            distanceTravelled + this.calcDistance(newCoordinate),
          prevLatLng: newCoordinate,
        });

        this.props.setMapData({
          latitude: latitude,
          longitude: longitude,
          routeCoordinates: routeCoordinates.concat([newCoordinate]),
          distanceTravelled:
            distanceTravelled + this.calcDistance(newCoordinate),
          // mapSnapshot: this.state.mapSnapshot,
        });
      },
      error => console.log(error),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
        distanceFilter: 10,
      },
    );
  }

  componentWillUnmount() {
    Geolocation.clearWatch(this.watchID);
  }

  getMapRegion = () => ({
    latitude: this.state.latitude,
    longitude: this.state.longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  calcDistance = newLatLng => {
    const {prevLatLng} = this.state;
    return haversine(prevLatLng, newLatLng) || 0;
  };

  onRegionChange = region => {
    // console.log(region);

    const {latitude, longitude} = region;

    const newCoordinate = {
      latitude,
      longitude,
    };

    // this.setState({
    //   latitude: region.latitude,
    //   longitude: region.longitude,
    //   routeCoordinates: this.state.routeCoordinates.concat([newCoordinate]),
    //   distanceTravelled:
    //     this.state.distanceTravelled + this.calcDistance(newCoordinate),
    //   prevLatLng: newCoordinate,
    // });
  };

  takePhotoOfMap = () => {
    const snapshot = this.map.takeSnapshot({
      width: 300,
      height: 300,
      format: 'png',
      quality: 1,
      result: 'file',
    });
    snapshot.then(uri => {
      this.setState({mapSnapshot: uri});
    });
  };

  render() {
    return (
      <View style={{flexDirection: 'column', justifyContent: 'flex-start'}}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={{
              backgroundColor: '#161616',
              margin: 10,
              borderRadius: 20,
              width: fullWidth - 50,
              alignItems: 'center',
              padding: 5,
              marginBottom: 100,
            }}>
            <Text
              style={{
                color: 'white',
                fontFamily: 'Poppins-Bold',
                fontSize: 30,
              }}>
              {parseFloat(this.state.distanceTravelled).toFixed(2)} km
              {/* -{' '} */}
              {/* {parseFloat(
                parseFloat(this.state.distanceTravelled).toFixed(2) /
                  this.props.secondsLeft,
              ).toFixed(2) * 3600}{' '}
              km/h */}
            </Text>
            <View>
              <Text
                style={{
                  color: '#9D0208',
                  fontFamily: 'Poppins-Bold',
                  fontSize: 16,
                }}>
                {' '}
                Distance
                {/* - Speed */}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <MapView
            customMapStyle={mapStyle}
            ref={map => {
              this.map = map;
            }}
            style={styles.map}
            darkModeAllowed={true}
            userInterfaceStyle={'dark'}
            // provider={PROVIDER_GOOGLE}
            showUserLocation
            followUserLocation
            loadingEnabled
            zoomControlEnabled={true}
            showsCompass={true}
            onRegionChangeComplete={region => this.onRegionChange(region)}
            // region={this.getMapRegion()}
          >
            {/* <Polyline coordinates={this.state.routeCoordinates} strokeWidth={5} /> */}
            <Marker.Animated
              ref={marker => {
                this.marker = marker;
              }}
              coordinate={this.state.coordinate}>
              <Image
                source={require('../Assets/defaultLogo.png')}
                style={{height: 40, width: 40, borderRadius: 100}}
              />
            </Marker.Animated>
            <MapViewDirections
              strokeColor={'#9D0208'}
              strokeWidth={6}
              origin={this.state.routeCoordinates[0]}
              destination={
                this.state.routeCoordinates[
                  this.state.routeCoordinates.length - 1
                ]
              }
              apikey={'AIzaSyCpIgcDoviS190Uq3EzOB5LprfaxF-53Iw'}
            />
          </MapView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    margin: 20,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    height: 350,
    marginTop: 125,
  },
  bubble: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    marginVertical: 20,
    marginBottom: 100,
    zIndex: 100,
    alignItems: 'center',
  },
});

export default AnimatedMarkers;
