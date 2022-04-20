/* eslint-disable react-native/no-inline-styles */
import {Text, View, Image} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';

const SurvivalLogModal = props => {
  return (
    <Modal
      isVisible={props.isModalOpen}
      onBackdropPress={() => {
        props.setIsModalOpen(false);
        props.setIsRip(false);
      }}
      onBackButtonPress={() => {
        props.setIsModalOpen(false);
        props.setIsRip(false);
      }}>
      <View
        style={{
          backgroundColor: '#161616',
          borderColor: '#8E8888',
          borderWidth: 6,
          height: 300,
          borderRadius: 10,
        }}>
        <View style={{margin: 5, marginTop: 20, alignItems: 'center'}}>
          <Image
            source={
              props.isRip
                ? require('../Assets/RIP.png')
                : require('../Assets/Zombie.png')
            }
            style={{width: 100, height: 100}}
          />
        </View>
        <View style={{alignItems: 'center'}}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'Poppins-SemiBold',
              marginVertical: 20,
              color: 'white',
              textAlign: 'center',
            }}>
            Survival Log: Day {props.userSurvivedDays}
          </Text>
          <View style={{width: 200}}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'Poppins-SemiBold',
                color: 'white',
                textAlign: 'center',
              }}>
              {props.isRip
                ? 'Your team did not survive the night'
                : 'Reach the safe point to surive the night'}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SurvivalLogModal;
