import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View, Pressable, ImageBackground } from 'react-native';
import Swiper from 'react-native-swiper';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

const { width: screenWidth } = Dimensions.get('window');

const BlogSliderCard = ({route}:any) => {
  const [entries, setEntries] = useState<any[]>([]);
  const navigation = useNavigation();
  const handlePress = (blogId) => {
    navigation.navigate('blogInner', {blogId});
    console.log(blogId)
  };
const {t} = useTranslation()

  

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('https://movieappi.onrender.com/blogs');
        const data = response.data;
  
        const filteredBlogs = data.filter((blog: { view: number }) => blog.view > 100);
        
        // Sort filteredBlogs in descending order based on creation date
        const sortedBlogs = filteredBlogs.sort((a, b) =>
          moment(a.view).diff(moment(b.view))
        );
        
        setEntries(sortedBlogs);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };
  
    fetchBlogs();
  }, []);
  

  return (
    <View style={styles.container}>
      <Swiper
        loop={true}
        autoplay={true}
        autoplayTimeout={3}

        showsPagination={false}
        containerStyle={styles.swiperContainer}>
        {entries.map((item, index) => {
          console.log('Item:', item);
          return (
            <View key={index} style={styles.swiperSlide}>
              <ImageBackground
                source={{ uri: `https://1is.az${item?.image}` }}
                style={styles.imageBackground}>
                {/* Overlay with opacity */}
                <View style={styles.overlay} />

                <View style={styles.infoContainer}>
                  <View style={styles.dateContainer}>
                    <Text style={styles.date}>
                      {moment(item?.created_at).format('DD.MM.YYYY')}
                    </Text>
                  </View>
                  <View style={styles.viewContainer}>
                    <Text style={styles.viewCount}>{item?.view}</Text>
                  </View>
                </View>

                <View style={styles.titleContainer}>
                  <Text style={styles.title}>{item?.title_az}</Text>
                </View>

<Pressable
  style={styles.button}
  onPress={() => handlePress(item.id)}>
  <Text style={styles.buttonText}>{t('more')}</Text>
</Pressable>
              </ImageBackground>
            </View>
          );
        })}
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swiperContainer: {
    height: screenWidth - 160,
  },
  swiperSlide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageBackground: {
    width: screenWidth - 40,
    height: screenWidth - 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
  },
  dateContainer: {

    padding: 5,
    borderRadius: 5,
  },
  date: {
    color: 'white',
    fontSize: 12,
  },
  viewContainer: {

    padding: 5,
    borderRadius: 5,
  },
  viewCount: {
    color: 'white',
    fontSize: 12,
  },
  titleContainer: {
    position: 'absolute',
    top: '45%', // Adjust this value to your preference
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    maxWidth: '70%',
  },
  button: {
    position: 'absolute',
    bottom: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'white',
    width: 100,
    height: 40,
    backgroundColor: '#8843E1',
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    paddingHorizontal: 1,
  },
  // Overlay with opacity
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the opacity as needed
  },
});

export default BlogSliderCard;