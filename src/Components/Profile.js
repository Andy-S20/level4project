/* eslint-disable no-alert */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  PermissionsAndroid,
  TextInput,
  Share,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import Modal from 'react-native-modal';
import {useAuthState} from 'react-firebase-hooks/auth';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import ErrorModal from './ErrorModal';
import {Picker} from '@react-native-picker/picker';

const options = [
  {label: '1k', value: 1000},
  {label: '2k', value: 2000},
  {label: '3k', value: 3000},
  {label: '4k', value: 4000},
  {label: '5k', value: 5000},
  {label: '6k', value: 6000},
  {label: '7k', value: 7000},
  {label: '8k', value: 8000},
  {label: '9k', value: 9000},
  {label: '10k', value: 10000},
];

const Profile = ({navigation}) => {
  const [photo, setPhoto] = useState(null);

  const [userName, setUserName] = useState('');

  const [imageModalOpen, setImageModalOpen] = useState(false);

  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [userTeam, setUserTeam] = useState('');

  const [userTeamCode, setUserTeamCode] = useState('');

  const [userStepGoals, setUserStepGoals] = useState('');

  const [openStepModal, setOpenStepModal] = useState(false);

  const [user] = useAuthState(firebase.auth());


  const ImagePickerModal = () => {
    return (
      <Modal
        isVisible={imageModalOpen}
        onBackdropPress={() => setImageModalOpen(false)}
        onBackButtonPress={() => setImageModalOpen(false)}>
        <View
          style={{
            backgroundColor: '#161616',
            borderWidth: 6,
            borderColor: '#8E8888',
            padding: 10,
            height: 375,
            borderRadius: 20,
          }}>
          <View
            style={{
              margin: 5,
              marginTop: 30,
              alignItems: 'center',
              marginBottom: 20,
            }}>
            <Image
              source={require('../Assets/Camera.png')}
              style={{width: '50%', height: 100}}
            />
          </View>

          <View style={{alignItems: 'center'}}>
            <TouchableOpacity
              onPress={selectFileFromCamera}
              style={{
                alignItems: 'center',
                backgroundColor: '#C80000',
                width: '70%',
                padding: 15,
                margin: 10,
                border: 'none',
                borderRadius: 20,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'Poppins-Bold',
                  color: 'white',
                }}>
                Take a Photo
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{alignItems: 'center'}}>
            <TouchableOpacity
              onPress={selectFileFromLibrary}
              style={{
                alignItems: 'center',
                backgroundColor: '#C80000',
                width: '70%',
                padding: 15,
                margin: 10,
                border: 'none',
                borderRadius: 20,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'Poppins-Bold',
                  color: 'white',
                }}>
                Choose from Gallery
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const selectFileFromLibrary = async () => {
    var options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchImageLibrary(options, res => {
      if (res.didCancel) {
        setImageModalOpen(false);
        setErrorModal(true);
        setErrorMessage('Cancelled');
        // alert('Cancelled');
      } else if (res.error) {
        setErrorModal(true);
        setErrorMessage(`'ImagePicker Error: ', ${res.error}`);
        // alert('ImagePicker Error: ', res.error);
      } else if (res.customButton) {
        // alert('User tapped custom button: ', res.customButton);
        // alert(res.customButton);
        setErrorModal(true);
        setErrorMessage(`'User tapped custom button: ', ${res.customButton}`);
      } else {
        let source = res.assets[0].uri;
        setPhoto(source);
        setImageModalOpen(false);
      }
    });
  };

  const selectFileFromCamera = async () => {
    var options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchCamera(options, res => {
      if (res.didCancel) {
        // alert('Cancelled');
        setImageModalOpen(false);

        setErrorModal(true);
        setErrorMessage('Cancelled');
      } else if (res.error) {
        // alert('ImagePicker Error: ', res.error);
        setErrorModal(true);
        setErrorMessage(`'ImagePicker Error: ', ${res.error}`);
      } else if (res.customButton) {
        alert('User tapped custom button: ', res.customButton);
        // alert(res.customButton);
        setErrorModal(true);
        setErrorMessage(`'User tapped custom button: ', ${res.customButton}`);
      } else {
        let source = res.assets[0].uri;
        setPhoto(source);
        setImageModalOpen(false);
      }
    });
  };
  const requestCameraPermission = async () => {
    try {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
        title: 'App Camera Permission',
        message: 'App needs access to your camera ',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      });
    } catch (err) {
      console.warn(err);
    }
  };
  useEffect(() => {
    requestCameraPermission();
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    const userReference = firestore().collection('users').doc(user.uid);
    const snapShot = await userReference.get();

    setUserName(snapShot?.data()?.userName);

    setUserTeam(snapShot?.data()?.team);

    setPhoto(snapShot?.data().profilePicUrl);

    setUserTeamCode(snapShot?.data().team);

    setUserStepGoals(snapShot?.data()?.stepGoals);
  };

  const updateTeamGoals = async () => {
    let tempTeam = [];

    if (userStepGoals > 0) {
      firestore()
        .collection('teams')
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(documentSnapshot => {
            if (documentSnapshot?.data()?.teamCode === userTeamCode) {
              tempTeam.push({
                id: documentSnapshot?.id,
                teamGoals: documentSnapshot?.data()?.teamGoals,
                uid: user.uid,
              });
              const tempGoals = tempTeam[0]?.teamGoals?.map(item => {
                if (item.id === user.uid) {
                  return {...item, stepGoals: userStepGoals};
                } else return item;
              });

              updateTeamUserValues(tempTeam, tempGoals);
            }
          });
        });
    } else {
      alert('Enter Step Goals');
    }
  };

  const updateTeamUserValues = async (tempTeam, tempGoals) => {
    await firestore()
      .collection('teams')
      .doc(tempTeam[0].id)
      .update({teamGoals: tempGoals});

    await firestore()
      .collection('users')
      .doc(user.uid)
      .update({stepGoals: userStepGoals});

    setOpenStepModal(false);
    setProfileModalOpen(true);
  };

  const updateUser = async () => {
    if (userName.length <= 0) {
      // alert('Please Enter User Name');
      setErrorModal(true);
      setErrorMessage('Enter your name ');
      return;
    }

    if (userName.length > 6) {
      // alert('Username should be less than 6 characters');
      setErrorModal(true);
      setErrorMessage('Username should be less than 6 characters');
      return null;
    }

    setProfileModalOpen(true);

    const userReference = firestore().collection('users').doc(user.uid);

    await userReference.update({
      userName: userName,
      profilePicUrl: photo,
    });
    // alert('Profile Updated');
  };
  const signOut = async () => {
    auth()
      .signOut()
      .then(() => {
        navigation.navigate('IntroSlider');
      });
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `Join your friends team on Thrive Fitness with this team code: ${userTeam}.`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#101010',
      }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{marginVertical: 20, alignItems: 'center'}}>
          <Text
            style={{
              color: 'white',
              fontFamily: 'Poppins-SemiBold',
              fontSize: 24,
            }}>
            {userName}
          </Text>
        </View>
        <TouchableOpacity
          style={{alignItems: 'center'}}
          onPress={async () => {
            setImageModalOpen(true);
          }}>
          {!photo ? (
            <Image
              source={require('../Assets/defaultLogo.png')}
              style={{
                width: 150,
                height: 150,
                resizeMode: 'contain',
                borderRadius: 100,
              }}
            />
          ) : (
            <Image
              source={{uri: photo}}
              style={{
                width: 150,
                height: 150,
                resizeMode: 'contain',
                borderRadius: 100,
              }}
            />
          )}
        </TouchableOpacity>

        <TextInput
          placeholder="Enter a new name"
          value={userName}
          style={{
            borderRadius: 20,
            borderWidth: 1,
            padding: 10,
            margin: 10,
            width: 200,
            fontFamily: 'Poppins-SemiBold',
            backgroundColor: '#FDFDFD',
            marginVertical: 15,
          }}
          onChangeText={e => {
            setUserName(e);
          }}
        />
        <TouchableOpacity
          style={{
            alignItems: 'center',
            backgroundColor: '#C80000',
            padding: 10,
            margin: 10,
            width: 200,
            borderRadius: 20,
          }}
          onPress={() => updateUser()}>
          <Text
            style={{
              fontSize: 15,
              color: 'white',
              fontFamily: 'Poppins-SemiBold',
            }}>
            Update Profile
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            alignItems: 'center',
            backgroundColor: '#C80000',
            padding: 10,
            margin: 10,
            width: 200,
            borderRadius: 20,
          }}
          onPress={() => {
            setOpenStepModal(true);
          }}>
          <Text
            style={{
              fontSize: 15,
              color: 'white',
              fontFamily: 'Poppins-SemiBold',
            }}>
            Update Step Goal
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            alignItems: 'center',
            backgroundColor: '#C80000',
            padding: 10,
            margin: 10,
            width: 200,
            borderRadius: 20,
          }}
          onPress={() => onShare()}>
          <Text
            style={{
              fontSize: 15,
              color: 'white',
              fontFamily: 'Poppins-SemiBold',
            }}>
            Invite Friends
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => signOut()}
          style={{
            backgroundColor: 'transparent',
            width: 200,
            padding: 15,
            margin: 10,
            borderRadius: 20,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: 'white',
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: 15,
              fontFamily: 'Poppins-SemiBold',
            }}>
            Sign Out
          </Text>
        </TouchableOpacity>
        <ImagePickerModal />
        <ErrorModal
          errorModal={errorModal}
          setErrorModal={setErrorModal}
          errorMessage={errorMessage}
        />
        <Modal
          isVisible={profileModalOpen}
          onBackdropPress={() => setProfileModalOpen(false)}
          onBackButtonPress={() => setProfileModalOpen(false)}>
          <View
            style={{
              backgroundColor: '#161616',
              borderColor: '#8E8888',
              borderWidth: 6,
              height: 275,
              borderRadius: 10,
            }}>
            <View style={{margin: 5, marginTop: 30}}>
              <Image
                source={require('../Assets/Sword.png')}
                style={{width: '100%', height: 100}}
              />
            </View>
            <View style={{marginVertical: 10}}>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: 'Poppins-SemiBold',
                  marginVertical: 20,
                  color: 'white',
                  textAlign: 'center',
                }}>
                Profile Updated
              </Text>
            </View>
          </View>
        </Modal>
        <Modal
          isVisible={openStepModal}
          onBackdropPress={() => setOpenStepModal(false)}
          onBackButtonPress={() => setOpenStepModal(false)}>
          <View
            style={{
              backgroundColor: '#161616',
              borderColor: '#8E8888',
              borderWidth: 6,
              height: 350,
              borderRadius: 10,
            }}>
            <View style={{margin: 5, marginTop: 30, alignItems: 'center'}}>
              <Image
                source={require('../Assets/heart.png')}
                style={{width: 100, height: 100}}
              />
            </View>
            <View style={{alignItems: 'center'}}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 15,
                  fontFamily: 'Poppins-SemiBold',
                }}>
                Select your fitness level
              </Text>
            </View>
            <View
              style={{
                marginVertical: 10,
                // alignItems: 'center',
                backgroundColor: 'white',
                margin: 10,
              }}>
              <Picker
                placeholder="Select Fitness"
                selectedValue={userStepGoals}
                itemTextStyle={{color: 'red'}}
                itemStyle={{
                  backgroundColor: 'grey',
                  color: 'blue',
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 17,
                }}
                onValueChange={itemValue => setUserStepGoals(itemValue)}>
                {options.map(item => {
                  return (
                    <Picker.Item
                      key={item.label}
                      label={item.label}
                      value={item.value}
                    />
                  );
                })}
              </Picker>
            </View>
            <View style={{alignItems: 'center'}}>
              <TouchableOpacity
                onPress={() => updateTeamGoals()}
                style={{
                  alignItems: 'center',
                  backgroundColor: '#C80000',
                  padding: 10,
                  margin: 10,
                  width: 200,
                  borderRadius: 20,
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 15,
                    fontFamily: 'Poppins-SemiBold',
                  }}>
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
