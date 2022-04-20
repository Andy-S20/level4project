/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import React, {useEffect} from 'react';
import AppIntroSlider from 'react-native-app-intro-slider';
import LottieView from 'lottie-react-native';
import {useAuthState} from 'react-firebase-hooks/auth';
import firebase from '@react-native-firebase/app';

//Change to Dynamic Height and Width of Lottie View

const fullHeight = Dimensions.get('screen').height;

const IntroSlider = ({navigation}) => {
  const onDone = () => {
    navigation.navigate('Login');
  };
  const onSkip = () => {
    navigation.navigate('Login');
  };

  const [user, loading] = useAuthState(firebase.auth());

  useEffect(() => {
    if (user) {
      navigation.navigate('Login');
    }
  }, [user]);

  const RenderItem = ({item}) => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#101010',
          alignItems: 'center',
          justifyContent: 'space-around',
          paddingBottom: 100,
        }}>
        <View style={{alignItems: 'center'}}>
          <Image
            source={require('../Assets/IntroLogo.png')}
            style={{width: 150, height: 150}}
          />
        </View>
        <Text style={styles.introTitleStyle}>{item.title}</Text>
        <View
          style={{height: fullHeight * 0.25, width: 250, alignItems: 'center'}}>
          <LottieView source={item.image} autoPlay loop />
        </View>
        <View style={{margin: 10}}>
          <Text style={styles.introTextStyle}>{item.text}</Text>
          <Text style={styles.introTextStyle}>{item.textTwo}</Text>
        </View>
      </View>
    );
  };
  if (loading || user) {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          backgroundColor: '#101010',
        }}>
        <View style={{height: 200, width: 200}}>
          <LottieView
            source={require('../Assets/fire-loader.json')}
            autoPlay
            loop
          />
        </View>
      </View>
    );
  } else {
    return (
      <>
        <StatusBar backgroundColor="#101010" />

        <AppIntroSlider
          data={slides}
          renderItem={RenderItem}
          onDone={onDone}
          showSkipButton={true}
          onSkip={onSkip}
          showPrevButton={true}
          activeDotStyle={{backgroundColor: '#FF6F09'}}
          dotStyle={{backgroundColor: '#3D3636'}}
          renderNextButton={() => (
            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                color: 'white',
                fontSize: 16,
              }}>
              Next
            </Text>
          )}
          renderPrevButton={() => (
            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                color: 'white',
                fontSize: 16,
              }}>
              Back
            </Text>
          )}
          renderDoneButton={() => (
            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                color: 'white',
                fontSize: 16,
              }}>
              Done
            </Text>
          )}
          renderSkipButton={() => (
            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                color: 'white',
                fontSize: 16,
              }}>
              Skip
            </Text>
          )}
        />
      </>
    );
  }
};

export default IntroSlider;

const styles = StyleSheet.create({
  introTextStyle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    paddingVertical: 10,
    fontFamily: 'Poppins-SemiBold',
  },
  introTitleStyle: {
    fontSize: 25,
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'Poppins-Bold',
  },
});

const slides = [
  {
    key: 's1',
    text: 'A zombie virus has broken out in the city. Make it to the safe point by walking with your team to avoid getting infected. Zombies travel at midnight so ensure to get to safety before then.',
    textTwo:
      'The more people in your team the more likely you are to reach the team’s safe point.',
    title: 'Thrive as a Team',
    image: require('../Assets/night.json'),
  },
  {
    key: 's2',
    title: 'Disclaimer',
    text: 'Please note that if you have any health concerns that may worsen due to using the app you should not use it.',
    textTwo:
      'Please note if you experience any health concerns while using the app, stop using it and seek medical advice.',
    image: require('../Assets/warning.json'),
  },
  {
    key: 's3',
    title: 'Fitness Level',
    text: 'Customize your daily step goal according to your fitness level. Gradually increase your step goal in the settings page once you feel comfortable. Aim for 5K each day, then 10K.',
    textTwo:
      'The NHS recommends 30 minutes of activity each day. Reach this goal by challenging your team!',
    image: require('../Assets/walking.json'),
  },
];
