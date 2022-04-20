/* eslint-disable no-alert */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useAuthState} from 'react-firebase-hooks/auth';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import ChallengeModal from './ChallengeModal';
import analytics from '@react-native-firebase/analytics';
import Modal from 'react-native-modal';

const Challenge = ({navigation}) => {
  const [user] = useAuthState(firebase.auth());

  const [currentUser, setCurrentUser] = useState('');

  const [challengedUser, setChallengedUser] = useState({});

  const [otherUsers, setOtherUsers] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const [requestModalMessage, setrequestModalMessage] = useState('');

  const startRecording = async item => {
    navigation.navigate('Timer', {
      requestData: item,
      currentUser,
      challengedUser,
      isSentByMe: false,
    });
  };

  const startChallenge = async item => {
    navigation.navigate('Timer', {
      requestData: item,
      currentUser,
      challengedUser,
      isSentByMe: true,
    });
  };

  const rejectChallenge = async request => {
    const userReference = firestore().collection('users').doc(user.uid);
    const challengedUserReference = firestore()
      .collection('users')
      .doc(request.uid);
    const snapShot = await userReference.get();
    const challengedUserSnapShot = await challengedUserReference.get();
    let tempChallenges = snapShot.data().challenges;
    let tempChallengedChallenges =
      challengedUserSnapShot?.data()?.challenges || [];
    let updatedChallengesCurrentUser = tempChallenges.filter(
      item => item.uniqueId !== request?.uniqueId,
    );
    let updatedChallengesChallengedUser = tempChallengedChallenges.filter(
      item => item.uniqueId !== request?.uniqueId,
    );
    let tempRequests = snapShot
      ?.data()
      ?.requests.filter(item => item.uniqueId !== request?.uniqueId);
    let tempChallengedRequests = challengedUserSnapShot
      ?.data()
      ?.requests.filter(item => item.uniqueId !== request?.uniqueId);
    userReference.update({
      requests: tempRequests,
      challenges: updatedChallengesCurrentUser,
    });
    challengedUserReference.update({
      requests: tempChallengedRequests,
      challenges: updatedChallengesChallengedUser,
    });
    // alert('Challenge has been declined');
    setIsRequestModalOpen(true);
    setrequestModalMessage('You declined the challenge');
    const updatedUserReference = firestore().collection('users').doc(user.uid);
    const updatedSnapShot = await updatedUserReference.get();
    setCurrentUser(updatedSnapShot.data());
    // requests
  };

  const sendRequest = async () => {
    if (challengedUser?.userName) {
      const {uid, userName} = challengedUser;

      let uniqueId = Math.random();

      const userReference = firestore().collection('users').doc(user.uid);
      const snapShot = await userReference.get();

      const challengedUserReference = firestore().collection('users').doc(uid);
      const challengedSnapShot = await challengedUserReference.get();

      let tempRequests = snapShot.data().requests;

      let tempChallenges = snapShot.data().challenges || [];

      let tempChallengedRequests = challengedSnapShot.data().requests;

      let tempChallengedChallenges = challengedSnapShot.data().challenges || [];

      tempRequests?.push({
        uniqueId,
        uid,
        userName,
        status: 'sent',
        sentByMe: true,
      });

      tempChallengedRequests?.push({
        uid: user.uid,
        userName: currentUser?.userName,
        status: 'sent',
        sentByMe: false,
        uniqueId,
      });

      tempChallenges?.push({
        date: new Date(),
        uniqueId,
        challenger: snapShot?.data()?.userName,
        challengerId: snapShot?.data()?.uid,
        challengerSteps: 0,

        challenged: challengedSnapShot?.data().userName,
        challengedId: challengedSnapShot?.data().uid,
        challengedSteps: 0,

        isAccepted: true,
      });

      tempChallengedChallenges?.push({
        date: new Date(),
        uniqueId,
        challenger: snapShot?.data()?.userName,
        challengerId: snapShot?.data()?.uid,
        challengerSteps: 0,

        challenged: challengedSnapShot?.data().userName,
        challengedId: challengedSnapShot?.data().uid,
        challengedSteps: 0,

        isAccepted: true,
      });

      userReference.update({
        requests: tempRequests,
        challenges: tempChallenges,
      });
      challengedUserReference.update({
        requests: tempChallengedRequests,
        challenges: tempChallengedChallenges,
      });
      // alert(`You have requested a Challenge to ${challengedUser?.userName} `);
      setIsRequestModalOpen(true);

      setrequestModalMessage(`You sent a challenge 
    request to ${challengedUser?.userName}`);

      await analytics().logEvent('request_click', {
        userId: user.uid,
        userEmail: user.email,
        userName: currentUser?.userName,
      });
    } else {
      // alert('Pick a user');

      setIsRequestModalOpen(true);

      setrequestModalMessage('Select a user before sending a request');

      // await analytics().logLogin({method: 'email'});

      await analytics().logEvent('request_click', {
        userId: user.uid,
        userEmail: user.email,
        userName: currentUser?.userName,
      });
    }
  };

  // const setUserAnalyticsValues = async () => {
  //   await analytics().setUserId(user.uid);
  //   await analytics().setUserProperty('user_email', user.email);
  // };

  useEffect(() => {
    getCurrentUser();
    getOtherUsers();
    listenToChangeRequests();

    // setUserAnalyticsValues();
  }, []);

  // console.log(route.params);

  // if (route.params.isTimerFinshed) {
  //   setIsRequestModalOpen(true);
  //   setrequestModalMessage('Time’s up! Challenge is over');
  // }

  const getCurrentUser = async () => {
    const userReference = firestore().collection('users').doc(user.uid);
    const snapShot = await userReference.get();
    setCurrentUser(snapShot.data());
  };

  const getOtherUsers = () => {
    let tempTeamCode = '';
    let tempUserName = '';

    firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then(querySnapshot => {
        tempTeamCode = querySnapshot.data().team;
        tempUserName = querySnapshot.data().userName;
        firestore()
          .collection('users')
          .get()
          .then(querySnapshots => {
            let tempUserData = [];
            querySnapshots.forEach(documentSnapshot => {
              if (documentSnapshot?.data().team === tempTeamCode) {
                if (documentSnapshot?.data().userName !== tempUserName) {
                  tempUserData.push(documentSnapshot?.data());
                }
              }
            });
            setOtherUsers(tempUserData);
          });
      });
  };

  const listenToChangeRequests = async () => {
    firestore()
      .collection('users')
      .doc(user.uid)
      .onSnapshot(snapshot => {
        setCurrentUser(snapshot.data());
      });
  };

  return (
    <ScrollView style={{backgroundColor: '#101010'}}>
      {/* <View style={{padding: 10, margin: 10}}>
        <Text style={{fontFamily:'Poppins-SemiBold',color: 'black', fontSize: 20}}>
          Challenge
        </Text>
      </View> */}
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          margin: 10,
        }}>
        <View>
          <View
            style={{
              width: 100,
              height: 100,
              margin: 10,
              borderRadius: 10,
            }}>
            <Image
              source={
                currentUser?.profilePicUrl
                  ? {uri: currentUser?.profilePicUrl}
                  : require('../Assets/defaultLogo.png')
              }
              style={{
                width: 100,
                height: 100,
                borderRadius: 5,
                resizeMode: 'contain',
              }}
            />
          </View>

          <View
            style={{
              backgroundColor: '#161616',
              padding: 10,
              margin: 10,
              alignItems: 'center',
              borderRadius: 10,
            }}>
            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                color: 'white',
                fontSize: 16,
              }}>
              {currentUser && currentUser.userName}
            </Text>
          </View>
        </View>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Text
            style={{
              fontFamily: 'Poppins-SemiBold',
              color: 'white',
              fontSize: 24,
            }}>
            VS
          </Text>
        </View>
        <View>
          <View
            style={{
              width: 100,
              height: 100,
              margin: 10,
              borderRadius: 10,
            }}>
            <Image
              source={
                challengedUser?.profilePicUrl
                  ? {uri: challengedUser?.profilePicUrl}
                  : require('../Assets/defaultLogo.png')
              }
              style={{
                width: 100,
                height: 100,
                borderRadius: 5,
                resizeMode: 'contain',
              }}
            />
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: '#C80000',
              padding: 10,
              margin: 10,
              alignItems: 'center',
              borderRadius: 10,
            }}
            onPress={async () => {
              setIsModalOpen(true);
              await analytics().logEvent('select_user', {
                userId: user.uid,
                userEmail: user.email,
                userName: currentUser?.userName,
              });
            }}>
            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                color: 'white',
                fontSize: 16,
              }}>
              {challengedUser?.userName
                ? challengedUser?.userName
                : 'Select User'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          justifyContent: 'center',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#C80000',
            padding: 10,
            paddingHorizontal: 20,
            margin: 10,
            alignItems: 'center',
            borderRadius: 20,
          }}
          onPress={sendRequest}>
          <Text
            style={{
              fontFamily: 'Poppins-SemiBold',
              color: 'white',
              fontSize: 16,
            }}>
            Request
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{padding: 10, margin: 10, marginBottom: 0}}>
        <Text
          style={{
            fontFamily: 'Poppins-SemiBold',
            color: 'white',
            fontSize: 20,
          }}>
          Sent Challenges
        </Text>
      </View>

      {currentUser?.requests?.filter(item => item.sentByMe).length !== 0 ? (
        currentUser?.requests?.map(item => {
          return (
            <View key={Math.random()}>
              {item.sentByMe && (
                <View
                  style={{
                    padding: 10,
                    margin: 10,
                    backgroundColor: '#161616',
                    borderRadius: 20,
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      padding: 10,
                      margin: 10,
                      fontSize: 20,
                      color: 'white',
                      fontFamily: 'Poppins-SemiBold',
                    }}>
                    {item.userName}
                  </Text>
                  <View>
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#C80000',
                        padding: 10,
                        paddingHorizontal: 20,
                        margin: 10,
                        alignItems: 'center',
                        borderRadius: 10,
                      }}
                      onPress={() => startChallenge(item)}>
                      <Text
                        style={{
                          color: 'white',
                          fontFamily: 'Poppins-SemiBold',
                          fontSize: 16,
                        }}>
                        Accept
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          );
        })
      ) : (
        <View
          style={{
            // alignItems: 'center',
            justifyContent: 'flex-start',
            margin: 10,
            marginTop: 0,
            padding: 10,
            // marginTop: 20,
          }}>
          <Text
            style={{
              fontSize: 16,
              color: '#C80000',
              fontFamily: 'Poppins-SemiBold',
            }}>
            You have not challenged anyone yet
          </Text>
        </View>
      )}

      <View style={{padding: 10, margin: 10}}>
        <Text
          style={{
            fontFamily: 'Poppins-SemiBold',
            color: 'white',
            fontSize: 20,
          }}>
          Challenge Requests
        </Text>
      </View>

      {currentUser?.requests?.filter(item => !item.sentByMe).length !== 0 ? (
        currentUser?.requests?.map(item => {
          return (
            <View key={Math.random()}>
              {!item.sentByMe && (
                <View
                  style={{
                    padding: 10,
                    margin: 10,
                    backgroundColor: '#161616',
                    borderRadius: 20,
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      padding: 10,
                      margin: 10,
                      fontSize: 20,
                      fontFamily: 'Poppins-SemiBold',
                      color: 'white',
                    }}>
                    {item.userName}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#C80000',
                        padding: 10,
                        margin: 10,
                        paddingHorizontal: 20,

                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 10,
                      }}
                      onPress={() => startRecording(item)}>
                      <Text
                        style={{
                          fontFamily: 'Poppins-SemiBold',
                          color: 'white',
                          fontSize: 16,
                        }}>
                        Accept
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#C80000',
                        padding: 10,
                        margin: 10,
                        paddingHorizontal: 20,

                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 10,
                      }}
                      onPress={() => rejectChallenge(item)}>
                      <Text
                        style={{
                          fontFamily: 'Poppins-SemiBold',
                          color: 'white',
                          fontSize: 16,
                        }}>
                        Decline
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          );
        })
      ) : (
        <View
          style={{
            margin: 10,
            marginTop: 0,
            padding: 10,
          }}>
          <Text
            style={{
              fontSize: 16,
              color: '#C80000',
              fontFamily: 'Poppins-SemiBold',
            }}>
            No one has challenged you yet
          </Text>
        </View>
      )}
      <View style={{alignItems: 'center'}}>
        <TouchableOpacity
          style={{
            padding: 5,
            paddingHorizontal: 20,
            alignItems: 'center',
            margin: 10,
            backgroundColor: '#C80000',
            width: 300,
            borderRadius: 20,
          }}
          onPress={() =>
            navigation.navigate('PastChallenges', {
              currentUser: currentUser,
              userId: user.uid,
            })
          }>
          <Text
            style={{
              color: 'white',
              fontSize: 18,
              fontFamily: 'Poppins-SemiBold',
            }}>
            View Challenge details
          </Text>
        </TouchableOpacity>
      </View>
      <ChallengeModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        otherUsers={otherUsers}
        setChallengedUser={setChallengedUser}
      />
      <Modal
        isVisible={isRequestModalOpen}
        onBackdropPress={() => setIsRequestModalOpen(false)}
        onBackButtonPress={() => setIsRequestModalOpen(false)}>
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
              {requestModalMessage}
            </Text>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Challenge;

const styles = StyleSheet.create({});
