/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';

const ChallengeModal = props => {
  return (
    <Modal
      isVisible={props.isModalOpen}
      onBackdropPress={() => props.setIsModalOpen(false)}
      onBackButtonPress={() => props.setIsModalOpen(false)}>
      <View
        style={{
          backgroundColor: '#161616',
          borderColor: '#8E8888',
          borderWidth: 6,
          height:
            props?.otherUsers.length !== 0
              ? (props?.otherUsers.length - 1) * 80 + 350
              : 300,
          borderRadius: 10,
        }}>
        <View style={{margin: 5, marginTop: 20}}>
          <Image
            source={require('../Assets/Sword.png')}
            style={{width: '100%', height: 100}}
          />
        </View>
        <View style={{alignItems: 'center', marginVertical: 10}}>
          <Text
            style={{
              fontSize: 20,
              fontFamily: 'Poppins-SemiBold',
              marginVertical: 20,
              color: 'white',
              textAlign: 'center',
            }}>
            {' '}
            {props?.otherUsers.length !== 0
              ? 'Challenge your teammate'
              : 'You have no team members. Send the code to your friends.'}
          </Text>
        </View>
        <View style={{alignItems: 'center'}}>
          {props?.otherUsers?.map(item => {
            return (
              <TouchableOpacity
                key={item.uid}
                style={{
                  padding: 10,
                  margin: 10,
                  backgroundColor: '#C80000',
                  borderRadius: 20,
                  alignItems: 'center',
                  marginVertical: 10,
                  width: '80%',
                }}
                onPress={() => {
                  props.setChallengedUser(item);
                  props.setIsModalOpen(false);
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: 'Poppins-SemiBold',
                    color: 'white',
                  }}>
                  {item.userName}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </Modal>
  );
};

export default ChallengeModal;

const styles = StyleSheet.create({});
