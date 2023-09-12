import React from 'react';
import { Text, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../assets/themes';

const TabIcon = ({ focused, iconName, title }:any) => {
  // Define the active and inactive colors
  const activeColor = colors.white;
 const inactiveColor = 'rgba(224, 204, 236, 0.70)';

  // Define the active and inactive styles for icon and text
  const iconStyle = focused ? { color: activeColor } : { color: inactiveColor };
  const textStyle = focused
    ? { color: activeColor, fontSize: 10, fontWeight: '500' }
    : { color: inactiveColor, fontSize: 10, fontWeight: '500' };

  return (
    <>
      <Icon name={iconName} size={30} style={iconStyle} />
      <Text style={textStyle}>{title}</Text>
    </>
  );
};

export default TabIcon;