import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const StarRatingg = ({ rating, onRate }:any) => {
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const name = i <= rating ? 'star' : 'star-outline';
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => onRate(i)}
          activeOpacity={0.7}
        >
          {i <= rating ? (
            <Image
              source={require('AwesomeProject/src/assets/images/filled-star.webp')}
              style={{ width: 20, height: 20, }}
            />
          ) : (
            <Image
              source={require('AwesomeProject/src/assets/images/not-filled-star.webp')}
              style={{ width: 20, height: 20 ,  }}
            />
          )}
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return <View style={styles.container}>{renderStars()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
marginRight:20,
    paddingRight:20
  },
});

export default StarRatingg;