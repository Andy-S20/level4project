/* eslint-disable react-native/no-inline-styles */
import {View} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';

const LoaderModal = props => {
  return (
    <Modal
      isVisible={props.isLoaderOpen}
      onBackdropPress={() => props.setIsLoaderOpen(false)}
      onBackButtonPress={() => props.setIsLoaderOpen(false)}
      style={{
        height: 250,
        alignItems: 'center',
      }}>
      <View style={{height: 200, width: 200, alignItems: 'center'}}>
        <LottieView
          source={require('../Assets/fire-loader.json')}
          autoPlay
          loop
        />
      </View>
    </Modal>
  );
};

export default LoaderModal;
