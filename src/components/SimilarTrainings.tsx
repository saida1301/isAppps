import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';

const SimilarTrainings = ({ similarTrainings }:any) => {
  const { t } = useTranslation();
  const renderItem = ({ item }:any) => (
    <View style={styles.itemContainer}>
      <Image style={styles.image} source={{ uri: item.image }} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>{item.price}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>

      <FlatList
        data={similarTrainings}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    marginRight: 10,
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  textContainer: {
    marginTop: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 14,
    color: 'gray',
  },
});

export default SimilarTrainings;