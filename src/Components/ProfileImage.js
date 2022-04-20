/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useAuthState} from 'react-firebase-hooks/auth';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';

const ProfileImage = ({navigation}) => {
  const [user] = useAuthState(firebase.auth());

  const [profilePhoto, setProfilePhoto] = useState(null);

  useEffect(() => {
    getUserProfilePhoto();
    listenToChange();
  }, []);

  const listenToChange = async () => {
    firestore()
      .collection('users')
      .doc(user.uid)
      .onSnapshot(snapshot => {
        setProfilePhoto(snapshot?.data()?.profilePicUrl);
      });
  };

  const getUserProfilePhoto = async () => {
    const userReference = firestore().collection('users').doc(user.uid);
    const snapShot = await userReference.get();

    setProfilePhoto(snapShot?.data()?.profilePicUrl);
  };

  return (
    <View>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <Image
          source={
            profilePhoto
              ? {uri: profilePhoto}
              : require('../Assets/defaultLogo.png')
          }
          style={{height: 50, width: 50, borderRadius: 100}}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ProfileImage;

const styles = StyleSheet.create({});
