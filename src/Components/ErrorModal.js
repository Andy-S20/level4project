/* eslint-disable react-native/no-inline-styles */
import {Text, View, Image, Dimensions} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';

const fullWidth = Dimensions.get('screen').width;

const ErrorModal = props => {
  return (
    <Modal
      isVisible={props.errorModal}
      onBackdropPress={() => props.setErrorModal(false)}
      onBackButtonPress={() => props.setErrorModal(false)}
      style={{
        backgroundColor: 'transparent',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View
        style={{
          backgroundColor: '#161616',
          borderRadius: 20,
          borderColor: '#8E8888',
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 6,
          padding: 10,
          height: 250,
          width: fullWidth / 1.3,
        }}>
        <View style={{marginBottom: 30}}>
          <Image
            source={require('../Assets/Zombie.png')}
            style={{width: 80, height: 80}}
          />
        </View>
        <Text
          style={{
            fontSize: 16,
            color: 'white',
            fontFamily: 'Poppins-SemiBold',
          }}>
          {props.errorMessage}
        </Text>
      </View>
    </Modal>
  );
};

export default ErrorModal;
