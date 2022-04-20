/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import {useAuthState} from 'react-firebase-hooks/auth';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import dayjs from 'dayjs';
import LoaderModal from './LoaderModal';
import ErrorModal from './ErrorModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const fullWidth = Dimensions.get('screen').width;

const createdAt = dayjs(new Date()).format('DD/MM/YYYY');
const lastLoginAt = dayjs(new Date()).format('DD/MM/YYYY');

const FindTeam = ({navigation}) => {
  const [teamCode, setTeamCode] = useState('');
  const [userName, setUserName] = useState('');

  const [user] = useAuthState(firebase.auth());
  const [isLoaderOpen, setIsLoaderOpen] = useState(false);

  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const signOut = () => {
    setIsLoaderOpen(true);
    auth()
      .signOut()
      .then(() => {
        setIsLoaderOpen(false);
        navigation.navigate('IntroSlider');
      });
  };

  const createTeam = async () => {
    if (teamCode === '' || userName === '') {
      // alert('Enter a Team Code and User Name');
      setErrorModal(true);

      setErrorMessage('Enter your name and team code');
      return null;
    }

    if (userName.length > 6) {
      // alert('Username should be less than 6 characters');
      setErrorModal(true);
      setErrorMessage('Username should be less than 6 characters');
      return null;
    }

    setIsLoaderOpen(true);

    let tempTeamsId = [];
    let tempUserNames = [];

    await firestore()
      .collection('teams')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          tempTeamsId.push(documentSnapshot?.data()?.teamCode);
        });
      });

    await firestore()
      .collection('users')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          tempUserNames.push(documentSnapshot?.data()?.userName);
        });
      });

    if (tempUserNames.includes(userName) && tempTeamsId.includes(teamCode)) {
      // alert('User Name and Team Code Already Exist');

      setErrorModal(true);
      setErrorMessage('User Name and Team Code Already Exist');
      setIsLoaderOpen(false);

      return;
    }
    if (tempUserNames.includes(userName)) {
      // alert('User Name Already Exists');
      setIsLoaderOpen(false);
      setErrorModal(true);
      setErrorMessage('User Name Already Exists');
      return;
    }

    if (tempTeamsId.includes(teamCode)) {
      // alert('Team Already Exists');

      setErrorModal(true);
      setErrorMessage('Team Already Exists');
      setIsLoaderOpen(false);

      return;
    }

    if (!tempUserNames.includes(userName) && !tempTeamsId.includes(teamCode)) {
      firestore()
        .collection('teams')
        .add({
          teamCode: teamCode,
          members: [{id: user.uid, email: user.email, userName: userName}],
          createdAt,
          lastLoginAt,
          survivedDays: 0,
          teamGoals: [{id: user.uid, email: user.email, stepGoals: 1000}],

          // +

          // [1,2,4,6]

          //[{id:112,name:'Thrive',marks:95},{},{}]
        })
        .then(() => {
          navigateToActivity();
          setIsLoaderOpen(false);
        });

      firestore()
        .collection('users')
        .doc(user.uid)
        .update({team: teamCode, userName: userName});
      return;
    }
  };

  const joinTeam = async () => {
    if (teamCode === '' || userName === '') {
      // alert('Enter your name and team code');

      setErrorModal(true);
      setErrorMessage('Enter your name and team code');
      return;
    }

    if (userName.length > 6) {
      // alert('Username should be less than 6 characters');

      setErrorModal(true);
      setErrorMessage('Username should be less than 6 characters');
      return null;
    }
    setIsLoaderOpen(true);

    firestore()
      .collection('users')
      .doc(user.uid)
      .update({team: teamCode, userName: userName});
    let tempTeamsId = [];

    let tempTeams = [];

    await firestore()
      .collection('teams')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          if (documentSnapshot.data()?.teamCode) {
            let data = documentSnapshot.data();
            tempTeams.push({...data, id: documentSnapshot.id});
            tempTeamsId.push(documentSnapshot.data()?.teamCode);
          }
        });
      });

    if (tempTeamsId.includes(teamCode)) {
      let selectedTeam = tempTeams
        .map(item => {
          if (item.teamCode === teamCode) {
            return item;
          } else {
            return null;
          }
        })
        .filter(item => item !== null)[0];

      if (selectedTeam.members.length >= 4) {
        // alert('Maximum members allowed is 4');
        setIsLoaderOpen(false);
        setErrorModal(true);
        setErrorMessage('Maximum members allowed is 4');
        return null;
      } else {
        let tempMembers = selectedTeam.members;
        let tempMembersGoals = selectedTeam.teamGoals;

        tempMembers.push({id: user.uid, email: user.email, userName: userName});

        tempMembersGoals.push({
          id: user.uid,
          email: user.email,
          stepGoals: 1000,
        });

        firestore()
          .collection('teams')
          .doc(selectedTeam.id)
          .update({members: tempMembers, teamGoals: tempMembersGoals});
        setIsLoaderOpen(false);

        navigateToActivity();
      }
    } else {
      setIsLoaderOpen(false);
      // alert('Team Does not exist');
      setErrorModal(true);
      setErrorMessage('Team Does not exist');
    }
  };

  function rand(min, max) {
    var offset = min;
    var range = max - min + 1;

    var randomNumber = Math.floor(Math.random() * range) + offset;
    return randomNumber;
  }

  const joinRandomTeam = async () => {
    if (userName === '') {
      // alert('Enter a User Name');

      setErrorModal(true);
      setErrorMessage('Enter user name');
      return;
    }
    if (userName.length > 6) {
      // alert('Username should be less than 6 characters');
      setErrorModal(true);
      setErrorMessage('Username should be less than 6 characters');
      return null;
    }
    setIsLoaderOpen(true);

    let tempTeamsId = [];

    let tempTeams = [];

    let tempRandomTeams = [];

    let tempUserNames = [];

    await firestore()
      .collection('users')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          tempUserNames.push(documentSnapshot?.data()?.userName);
        });
      });

    if (tempUserNames.includes(userName)) {
      // alert('User Name already exist');

      setErrorModal(true);
      setErrorMessage('User Name already exist');
      setIsLoaderOpen(false);

      return;
    }

    const teamValues = await firestore().collection('teams').get();

    teamValues.forEach(documentSnapshot => {
      if (documentSnapshot.data().members.length >= 4) {
        return;
      }

      if (documentSnapshot.data().members.length < 4) {
        tempRandomTeams.push(documentSnapshot.data()?.teamCode);
      }
      if (documentSnapshot.data()?.teamCode) {
        let data = documentSnapshot.data();
        tempTeams.push({...data, id: documentSnapshot.id});
        tempTeamsId.push(documentSnapshot.data()?.teamCode);
      }
    });

    let randomNumber = rand(0, tempTeamsId.length - 1);

    let randomTeamId = tempRandomTeams
      ? tempRandomTeams.filter(item => item !== '')[randomNumber]
      : null;

    if (randomTeamId) {
      let selectedTeam = tempTeams
        .map(item => {
          if (item.teamCode === randomTeamId) {
            return item;
          } else {
            return null;
          }
        })
        .filter(item => item !== null)[0];

      let tempMembers = selectedTeam.members;
      let tempMembersGoals = selectedTeam.teamGoals;

      tempMembers.push({id: user.uid, email: user.email, userName: userName});
      tempMembersGoals.push({id: user.uid, email: user.email, stepGoals: 1000});

      firestore()
        .collection('teams')
        .doc(selectedTeam.id)
        .update({members: tempMembers, teamGoals: tempMembersGoals});
      setIsLoaderOpen(false);

      firestore()
        .collection('users')
        .doc(user.uid)
        .update({team: randomTeamId, userName: userName});
      navigateToActivity();
    } else {
      setIsLoaderOpen(false);

      // alert('All teams are full');

      setErrorModal(true);
      setErrorMessage('All teams are full');
    }
  };

  const navigateToActivity = () => {
    storeData();
    navigation.navigate('Activity');
  };

  const storeData = async () => {
    try {
      await AsyncStorage.setItem('isNewUser', 'true');
      console.log('set');
    } catch (e) {
      console.log(e);
    }
    // getData();
  };


  // const getData = async () => {
  //   // console.log(1);
  //   // setIsModalOpen(true);

  //   AsyncStorage.getItem('isNewUser').then(item => console.log(item, 12));

  //   const currentUser = await AsyncStorage.getItem('isNewUser');

  //   console.log(currentUser);

  //   // const value = await AsyncStorage.getItem('isNewUser');
  //   // console.log(JSON.stringify(value), 1);

  //   // if (value !== null) {
  //   //   // setIsModalOpen(true);
  //   // }
  //   // removeValue();
  // };

  useEffect(() => {
    // firestore()
    //   .collection('users')
    //   .doc(user.uid)
    //   .get()
    //   .then(querySnapshot => {
    //     if (querySnapshot?.data()?.team !== '') {
    //       // navigateToActivity()
    //     }
    //   });
  }, []);

  return (
    <SafeAreaView style={{backgroundColor: '#101010', flex: 1}}>
      <StatusBar backgroundColor="#161616" />
      <View style={{padding: 10, backgroundColor: '#161616', marginBottom: 20}}>
        <Text
          style={{
            fontSize: 20,
            fontFamily: 'Poppins-SemiBold',
            color: 'white',
          }}>
          Find a Team
        </Text>
      </View>
      <View
        style={{
          backgroundColor: '#101010',
          marginTop: 20,
        }}>
        <View style={{alignItems: 'center'}}>
          <TextInput
            value={userName}
            onChangeText={e => setUserName(e)}
            placeholder="Enter Your Name"
            placeholderTextColor="#7E7878"
            style={{
              backgroundColor: '#FDFDFD',
              margin: 10,
              padding: 10,
              borderRadius: 20,
              width: fullWidth / 1.5,
              marginTop: 20,
              color: '#7E7878',
              fontFamily: 'Poppins-Medium',
              marginBottom: 0,
            }}
          />
        </View>

        <View style={{alignItems: 'center', marginVertical: 15}}>
          <View>
            <TouchableOpacity
              onPress={() => joinRandomTeam()}
              style={{
                backgroundColor: '#C80000',
                width: 200,
                padding: 15,
                margin: 10,
                borderRadius: 20,
                alignItems: 'center',
                marginBottom: 20,
                marginTop: 5,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 15,
                  fontFamily: 'Poppins-SemiBold',
                }}>
                Join Random Team
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{alignItems: 'center'}}>
          <Text
            style={{
              color: 'white',
              fontSize: 15,
              fontFamily: 'Poppins-SemiBold',
            }}>
            Have a code?
          </Text>
        </View>

        <View style={{alignItems: 'center'}}>
          <TextInput
            maxLength={6}
            value={teamCode}
            onChangeText={e => setTeamCode(e)}
            keyboardType="numeric"
            placeholder="Enter your Team Code"
            placeholderTextColor="#7E7878"
            style={{
              backgroundColor: '#FDFDFD',
              margin: 10,
              padding: 10,
              borderRadius: 20,
              width: fullWidth / 1.5,
              color: '#7E7878',
              fontFamily: 'Poppins-Medium',
              marginTop: 10,
            }}
          />
        </View>
        <View style={{alignItems: 'center', marginVertical: 5}}>
          <View>
            <TouchableOpacity
              onPress={() => createTeam()}
              style={{
                backgroundColor: '#C80000',
                width: 200,
                padding: 15,
                margin: 10,
                borderRadius: 20,
                alignItems: 'center',
                marginBottom: 5,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 15,
                  fontFamily: 'Poppins-SemiBold',
                }}>
                Create Team
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{alignItems: 'center', marginVertical: 5}}>
          <View>
            <TouchableOpacity
              onPress={() => joinTeam()}
              style={{
                backgroundColor: '#C80000',
                width: 200,
                padding: 15,
                margin: 10,
                borderRadius: 20,
                alignItems: 'center',
                marginBottom: 5,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 15,
                  fontFamily: 'Poppins-SemiBold',
                }}>
                Join Team
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{alignItems: 'center', marginVertical: 5}}>
          <View>
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
          </View>
        </View>
      </View>
      <LoaderModal
        isLoaderOpen={isLoaderOpen}
        setIsLoaderOpen={setIsLoaderOpen}
      />
      <ErrorModal
        errorModal={errorModal}
        setErrorModal={setErrorModal}
        errorMessage={errorMessage}
      />
    </SafeAreaView>
  );
};

export default FindTeam;

// teams

// users
