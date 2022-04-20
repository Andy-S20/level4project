/* eslint-disable no-alert */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Image,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import {useAuthState} from 'react-firebase-hooks/auth';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import LottieView from 'lottie-react-native';
import LoaderModal from './LoaderModal';
import ErrorModal from './ErrorModal';

const Register = ({navigation}) => {
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [isLoaderOpen, setIsLoaderOpen] = useState(false);

  const [user, loading] = useAuthState(firebase.auth());

  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const errorImage = '../Assets/Zombie.png';

  const loginUser = () => {
    navigation.navigate('Login');
  };

  const onAuthStateChanged = async userAuth => {
    if (!userAuth) {
      return;
    }
    const userReference = firestore().collection('users').doc(userAuth.uid);
    const snapShot = await userReference.get();
    if (snapShot.exists) {
      navigation.navigate('Activity');
      const lastLoginAt = new Date();
      userReference.update({
        lastLoginAt: lastLoginAt,
      });
    }

    if (!snapShot.exists) {
      const {email, uid} = userAuth;
      const createdAt = new Date();
      const lastLoginAt = new Date();

      try {
        userReference
          .set({
            email,
            createdAt,
            lastLoginAt,
            uid,
            team: '',
            requests: [],
            profilePicUrl: '',
            stepGoals: 1000,
          })
          .then(async () => {
            setIsLoaderOpen(false);
            navigation.navigate('FindTeam');
          });
      } catch (error) {
        console.log(error);
      }
    }

    return () => userReference();
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return () => {
      subscriber;
    };
  }, []);

  const signUpUser = () => {
    if (email.length === 0 || password.length === 0) {
      setErrorModal(true);
      setErrorMessage(
        'Failed to register please double check your details and try again',
      );
      return null;
    }
    setIsLoaderOpen(true);
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        setIsLoaderOpen(false);
        navigation.navigate('FindTeam');
      })
      .catch(error => {
        setIsLoaderOpen(false);

        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        // alert(error);
        setErrorModal(true);
        setErrorMessage(
          'Failed to register please double check your details and try again',
        );
      });

    // alert(email + password);
  };
  if (loading || user) {
    return (
      <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
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
        <KeyboardAvoidingView
          behavior="position"
          keyboardVerticalOffset={-100}
          style={{
            alignItems: 'center',
            justifyContent: 'flex-start',
            flex: 1,
            backgroundColor: '#101010',
          }}>
          <StatusBar backgroundColor="#101010" />
          <View style={{height: 300}}>
            <Image
              source={require('../Assets/Logo.png')}
              style={{width: 250, height: 400, resizeMode: 'contain'}}
            />
          </View>
          <View style={{alignItems: 'center'}}>
            <TextInput
              value={email}
              onChangeText={e => setEmail(e)}
              placeholder="Email"
              placeholderTextColor="#7E7878"
              style={{
                backgroundColor: '#FDFDFD',
                margin: 10,
                padding: 15,
                borderRadius: 20,
                width: 250,
                marginTop: 20,
                color: '#7E7878',
                fontFamily: 'Poppins-Medium',
              }}
            />
            <TextInput
              value={password}
              onChangeText={e => setPassword(e)}
              placeholder="Password"
              secureTextEntry={true}
              placeholderTextColor="#7E7878"
              style={{
                backgroundColor: '#FDFDFD',
                margin: 10,
                padding: 15,
                borderRadius: 20,
                width: 250,
                marginBottom: 20,
                color: '#7E7878',
                fontFamily: 'Poppins-Medium',
              }}
            />
            <TouchableOpacity
              onPress={() => {
                signUpUser();
              }}
              style={{
                backgroundColor: '#C80000',
                width: 150,
                padding: 10,
                margin: 10,
                borderRadius: 20,
                alignItems: 'center',
                marginBottom: 20,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 19,
                  fontFamily: 'Poppins-SemiBold',
                }}>
                Register
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => loginUser()}>
              <Text
                style={{
                  color: '#FFFFFF',
                  fontFamily: 'Poppins-Medium',
                  fontSize: 17,
                }}>
                Already have an account?{' '}
                <Text
                  style={{textDecorationLine: 'underline', color: '#C80000'}}>
                  Login
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
        <LoaderModal
          setIsLoaderOpen={setIsLoaderOpen}
          isLoaderOpen={isLoaderOpen}
        />
        <ErrorModal
          errorModal={errorModal}
          errorImage={errorImage}
          setErrorModal={setErrorModal}
          errorMessage={errorMessage}
        />
      </>
    );
  }
};

export default Register;
