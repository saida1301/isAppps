import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  Pressable,
} from 'react-native';
import {borderRadius, spacing} from '../assets/themes';
const {width} = Dimensions.get('screen');
const Data = [
  {id: '1', content: 'lorem', viewed: false},
  {id: '2', content: 'lorem morem', viewed: false},
  {id: '3', content: 'lorem porem', viewed: false},
  {id: '4', content: 'lorem vjniujgv', viewed: false},
  {id: '5', content: 'lorem ofijnhrutg', viewed: false},
];

const Card = ({image, viewed}: any) => {
  const [isViewed, setIsViewed] = useState(viewed);

  const handleOnPress = () => {
    setIsViewed(true);
  };

  return (
    <Pressable style={{paddingVertical: 20}}     onPress={handleOnPress}>
      <View style={styles.card}>
        <Image source={image} style={{width: 300, height: 300}} />
      </View>
    </Pressable>
  );
};

const CaruselSlider = () => {
  const cardWidth = 350;
  const spacing = 1;
  const containerWidth = cardWidth + spacing * 1.2;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}>
      {Data.map(item => (
        <View
          style={[styles.cardContainer, {maxWidth: containerWidth}]}
          key={item.id}>
          <Card title={item.image} />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: spacing.small,
  },
  cardContainer: {
    flexDirection: 'column',
    marginHorizontal: spacing.small,
  },
  card: {
    width: '100%',
    height: 160,
    backgroundColor: '#fff',
    borderRadius: borderRadius.small,
    padding: spacing.medium,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 3,
    borderColor: '#8843E1',
  },
});

export default CaruselSlider;