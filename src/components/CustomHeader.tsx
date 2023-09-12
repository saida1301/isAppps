import {Animated, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import { spacing } from '../assets/themes';

const CustomHeader = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Image
        source={require('AwesomeProject/src/assets/images/launch_screen.webp')}
        style={[styles.image]}
      />
      <Pressable onPress={() => navigation.navigate('ProfileStack')}>
      <Image
        source={require('AwesomeProject/src/assets/images/Icon.png')}
        style={[styles.image]}
      />
      </Pressable>
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  image: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: spacing.medium,
    marginVertical:spacing.medium
  },
});