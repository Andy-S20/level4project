/* eslint-disable react-native/no-inline-styles */
import {View, Text} from 'react-native';
import React from 'react';
import dayjs from 'dayjs';
const TodayDate = ({currentScreen}) => {
  var date = new Date();
  return (
    <View style={{padding: 5}}>
      <Text
        style={{fontFamily: 'Poppins-SemiBold', color: 'white', fontSize: 18}}>
        {currentScreen}
      </Text>
      <Text
        style={{
          fontSize: 15,
          color: '#FFC59B',
          fontFamily: 'Poppins-Medium',
        }}>
        {dayjs(date).format('DD')} {dayjs(date).format('dddd')}{' '}
        {dayjs(date).format('MMMM')}
      </Text>
    </View>
  );
};

export default TodayDate;
