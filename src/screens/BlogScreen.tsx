import {
  Button,
  ImageBackground,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme
} from 'react-native';
import React, {ReactNode, useEffect, useState} from 'react';
import blogs from '../services/data/blogs.json';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../assets/themes';

import moment from 'moment';
import { useTranslation } from 'react-i18next';
import BlogSliderCard from '../components/BlogSliderCard';
import LoadingScreen from '../components/LoadingScreen';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';


const ITEMS_PER_PAGE = 3;
const BlogScreen = () => {
  // const [blogs, setblogs] = useState([])
  const isDarkMode = useColorScheme() === 'dark';
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const handlePress = (blogId) => {
    navigation.navigate('blogInner', {blogId});
  };

  
  const [currentPage, setCurrentPage] = useState(1);
  const [sortedBlogs, setSortedBlogs] = useState(blogs);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const totalItems = sortedBlogs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  

  const handlePage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
let  visibleBlogs = []
  visibleBlogs = sortedBlogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  useEffect(() => {
    // Simulating an async data fetching process
    setTimeout(() => {
      setLoading(false); // Set loading to false when data is fetched
    }, 5000);
  }, []);
  const {t} = useTranslation();
  if (loading) {
    return <LoadingScreen />;
  } else {
  return (
    <ScrollView style={{ backgroundColor: isDarkMode ? '#131313' : '#F4F9FD' }}>

  
      <Text
        style={{
          color: isDarkMode ? "#FDFDFD" : "#161C2D",
          fontSize: 18,
          fontWeight: 'bold',
          marginHorizontal: 12,
          marginTop: 20,
          textAlign: 'center',
          marginBottom: 12,
        }}>
 {t('oxunanlar')}
      </Text>
      <View style={{flex:1, marginBottom:50}}>
        <BlogSliderCard />
      </View>
      {visibleBlogs.reduceRight((total, item, index, arr) => (
        <View
          style={{
            marginHorizontal: 12,
            flexDirection: 'row',
            justifyContent: 'space-around',
          
          }}>
          <View style={styles.card}>
          <ImageBackground
  source={{ uri: `https://1is.az${arr[index * 3]?.image}` }}
  style={{ width: 175, height: 295 }}
  resizeMode='cover'
>
  <View style={styles.overlay} />
  <View style={styles.textContainer}>
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: '100%',
      }}
    >
      <Text
        style={{
          color: 'white',
          fontSize: 14,
          fontWeight: '600',
        }}
      >
        {moment(arr[index * 3]?.created_at).format('DD.MM.YYYY')}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <FontAwesomeIcon name="eye" size={14} color="white" />
        <Text
          style={{
            color: 'white',
            fontSize: 14,
            fontWeight: '600',
            marginLeft: 5,
          }}
        >
          {arr[index * 3]?.view}
        </Text>
      </View>
    </View>
    <Text style={styles.title}>
      {arr[index * 3]?.title_az.length > 20
        ? arr[index * 3]?.title_az.substring(0, 20) + '...'
        : arr[index * 3]?.title_az}
    </Text>
    <Pressable
      onPress={() => handlePress(arr[index * 3]?.id)}
      style={styles.button}
    >
      <Text style={styles.buttonText}>{t('more')}</Text>
    </Pressable>
  </View>
</ImageBackground>
          </View>
          <View style={{flexDirection: 'column', rowGap: 20}}>
            <View style={[styles.card2]}>
            <ImageBackground
  source={{ uri: `https://1is.az${arr[index * 3 + 1]?.image}` }}
  style={{ width: 165, height: 137 }}
  resizeMode='cover'
>
  <View style={styles.overlay} />
  <View style={styles.textContainer}>
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        // marginVertical: 130,
      }}
    >
      <Text
        style={{
          color: 'white',
          fontSize: 10,
          fontWeight: '600',
        }}
      >
        {' '}
        {moment(arr[index * 3 + 1]?.created_at).format('DD.MM.YYYY')}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <FontAwesomeIcon name="eye" size={14} color="white" />
        <Text
          style={{
            color: 'white',
            fontSize: 14,
            fontWeight: '600',
            marginLeft: 5,
          }}
        >
          {arr[index * 3 + 1]?.view}
        </Text>
      </View>
    </View>
    <Text style={styles.title}>
      {arr[index * 3 + 1]?.title_az.length > 20
        ? arr[index * 3 + 1]?.title_az.substring(0, 20) + '...'
        : arr[index * 3 + 1]?.title_az}
    </Text>
    <Pressable
      onPress={() => handlePress(arr[index * 3 + 1]?.id)}
      style={styles.button}
    >
      <Text style={styles.buttonText}>{t('more')}</Text>
    </Pressable>
  </View>
</ImageBackground>
            </View>
            <View style={styles.card2}>
            <ImageBackground
  source={{ uri: `https://1is.az${arr[index * 3 + 2]?.image}` }}
  style={{ width: 165, height: 137 }}
  resizeMode='cover'
>
  <View style={styles.overlay} />
  <View style={styles.textContainer}>
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 20,
      }}
    >
      <Text
        style={{
          color: 'white',
          fontSize: 10,
          fontWeight: '600',
        }}
      >
        {' '}
        {moment(arr[index * 3 + 2]?.created_at).format('DD.MM.YYYY')}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <FontAwesomeIcon name="eye" size={14} color="red" />
        <Text
          style={{
            color: 'white',
            fontSize: 10,
            fontWeight: '600',
            marginLeft: 5,
          }}
        >
          {arr[index * 3 + 2]?.view}
        </Text>
      </View>
    </View>
    <Text style={styles.title}>
      {arr[index * 3 + 2]?.title_az.length > 20
        ? arr[index * 3 + 2]?.title_az.substring(0, 20) + '...'
        : arr[index * 3 + 2]?.title_az}
    </Text>
    <Pressable
      onPress={() => handlePress(arr[index * 3 + 2]?.id)}
      style={styles.button}
    >
      <Text style={styles.buttonText}>{t('more')}</Text>
    </Pressable>
  </View>
</ImageBackground>
            </View>
          </View>
        </View>
      ))}

      <View style={{marginBottom: 80}}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                handleNextPage={handleNextPage}
                handlePrevPage={handlePrevPage}
                handlePage={handlePage}
              />
              <View style={{alignSelf: 'center', paddingTop: 5}}>
                <Text style={{color: isDarkMode ? "#FDFDFD" : "#020202", fontSize: 14, fontWeight: '600'}}>
                  {' '}
                  {t('total')} {totalItems}
                </Text>
              </View>
      </View>
   
    </ScrollView>
  );
                    }
};

export default BlogScreen;

const styles = StyleSheet.create({
  card: {
    width: 180,
    height: 300,
    position: 'relative',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 12,
    marginBottom:30, 
    marginTop:-25
  },
  card2: {
    // width: 83,
    height: 137,
    position: 'relative',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the opacity as needed
  },
  textContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    zIndex: 2,
  },
  date: {
    color: '#fff',
    fontSize: 12,
    marginBottom: 5,
  },
  views: {
    color: '#fff',
    fontSize: 12,
    marginBottom: 5,
  },
  title: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    width: 95,
    height: 30,
    backgroundColor: colors.primary,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FDFDFD',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
  },
});
const Pagination = ({
  currentPage,
  totalPages,
  handleNextPage,
  handlePrevPage,
  handlePage,
}) => {
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  
  return (
    <View
      style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 16 }}>
      {currentPage > 1 && (
        <TouchableOpacity onPress={() => handlePrevPage(currentPage - 1)}>
          <Text style={paginationStyles.text}>{'<'}</Text>
        </TouchableOpacity>
      )}
      {pageNumbers.map((pageNumber) => {
        if (
          pageNumber === 1 ||
          pageNumber === currentPage ||
          pageNumber === totalPages ||
          (pageNumber > currentPage - 3 && pageNumber < currentPage + 3)
        ) {
          return (
            <TouchableOpacity
              key={pageNumber}
              onPress={() => handlePage(pageNumber)}>
              <Text
                style={[
                  paginationStyles.text,
                  pageNumber === currentPage
                    ? paginationStyles.activeText
                    : paginationStyles.inactiveText,
                ]}>
                {pageNumber}
              </Text>
            </TouchableOpacity>
          );
        } else if (
          (pageNumber === currentPage - 4 && currentPage > 4) ||
          (pageNumber === currentPage + 4 && currentPage < totalPages - 3)
        ) {
          return (
            <Text key={pageNumber} style={paginationStyles.text}>
              ...
            </Text>
          );
        }
      })}
      {currentPage < totalPages && (
        <TouchableOpacity onPress={() => handleNextPage(currentPage + 1)}>
          <Text style={paginationStyles.text}>{'>'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const paginationStyles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 8,
    color: '#8843E1',
    borderRadius: 5,
  },
  activeText: {
    backgroundColor: '#8843E1',
    color: 'white',
    paddingHorizontal: 5,
    paddingVertical: 7,
    borderRadius: 5,
  },
  inactiveText: {
    backgroundColor: 'white',
    color: 'black',
    paddingHorizontal: 5,
    paddingVertical: 7,
    borderRadius: 5,
  },
});