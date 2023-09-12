import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
} from 'react-native';
import { colors, spacing } from '../assets/themes';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBullhorn, faCalculator, faCode, faWrench, faLineChart, faBriefcase, faShoppingCart, faGlasses, faUser, faGlobe, faCutlery, faTruck, faGavel, faMedkit, faUniversity, faLeaf, faBuilding, faPaintBrush, faRandom, faSuitcase, faLifeRing, faUsers } from '@fortawesome/free-solid-svg-icons';
import i18n from '../i18n';

const CategoryItem = () => {
  const [numToShow, setNumToShow] = useState(4);
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [cardWidth, setCardWidth] = useState(calculateCardWidth);

  // Function to calculate responsive card width
  function calculateCardWidth() {
    const screenWidth = Dimensions.get('window').width;
    return (screenWidth - spacing.large * 3) / 2;
  }

  // Function to handle orientation changes
  const handleOrientationChange = () => {
    setCardWidth(calculateCardWidth());
  };

  useEffect(() => {
    axios
      .get(`https://movieappi.onrender.com/categories-with-count`)
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('API call failed:', error);
      });
  }, []);

  useEffect(() => {
    Dimensions.addEventListener('change', handleOrientationChange);
    return () => {
     
    };
  }, []);

  const iconMapping = {
    'fa fa-calculator': faCalculator,
    'fa fa-user': faUser,
    'fa fa-globe': faGlobe,
    'fa fa-bullhorn': faBullhorn,
    'fa fa-code': faCode,
    'fa fa-wrench': faWrench,
    'fa fa-line-chart': faLineChart,
    'fa fa-briefcase': faBriefcase,
    'fa fa-shopping-cart': faShoppingCart,
    'fa fa-glass': faGlasses,
    'fa fa-cutlery': faCutlery,
    'fa fa-truck': faTruck,
    'fa fa-gavel': faGavel,
    'fa fa-medkit': faMedkit,
    'fa fa-university': faUniversity,
    'fa fa-leaf': faLeaf,
    'fa fa-building': faBuilding,
    'fa fa-paint-brush': faPaintBrush,
    'fa fa-random': faRandom,
    'fa fa-suitcase': faSuitcase,
    'fa fa-life-ring': faLifeRing,
    'fa fa-users': faUsers,
  };

  const handlePress = (categoryId) => {
    navigation.navigate('CategoryInner', { categoryId });
  };

  const renderCategoryCard = (category, index) => {
    const icon = iconMapping[category.icon] || null;
    const vacancyCountForCategory = category.vacancy_count ?? '...';
    const titleKeyByLanguage = {
      az: 'title_az',
      en: 'title_en',
      tr: 'title_tr',
      ru: 'title_ru',
    };
    return (
      <TouchableOpacity
        key={category.id}
        style={[
          styles.card,
          {
            backgroundColor: isDarkMode ? '#0D0D0D' : '#FDFDFD',
            // Add shadow styles based on the isDarkMode value
            shadowColor: isDarkMode ? '#FFF' : '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDarkMode ? 0.5 : 0.2, // Adjust these values
            shadowRadius: isDarkMode ? 3 : 1, // Adjust these values
            elevation: isDarkMode ? 3 : 1, // Adjust these values
            
            marginLeft: index % 2 === 0 ? 0 : 5,
            // Elevation is for Android shadow
          },
        ]}
        onPress={() => handlePress(category.id)}
      >
   <View style={[styles.iconBackground , {    backgroundColor: isDarkMode ? '#1B1523'  : "#ECDDFF",}]}>
  {icon && (
    <FontAwesomeIcon icon={icon} style={styles.icon} size={20} />
  )}
</View>


        <View style={styles.textbox}>
          <Text key={category.id} style={[styles.text, { color: isDarkMode ? '#FDFDFD' : 'black' }]}>
          {t(category[titleKeyByLanguage[i18n.language]])}
          </Text>
        </View>
        <View
          style={[
            styles.hover,
            {
              borderBottomColor: 'rgba(136, 67, 225, 0.8)',
              position: 'absolute',
              borderBottomWidth: 3,
              width: 45,
              left: cardWidth - 40,
            },
          ]}
        >
          <Text
            style={{ color: isDarkMode ? '#FDFDFD' : 'black', left: 6, top: 18 }}
          >
            {vacancyCountForCategory}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {data.slice(0, numToShow).map(renderCategoryCard)}
      </View>
      {numToShow < data.length ? (
        <TouchableOpacity style={styles.button} onPress={() => setNumToShow(numToShow + 4)}>
          <Text style={styles.buttonText}>{t('more')}</Text>
          
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={() => setNumToShow(4)}>
          <Text style={styles.buttonText}>{t('less')}</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

export default CategoryItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: spacing.large,
    paddingTop: 20,
  },
  card: {
    position: 'relative',
    width: '48%',
    height: 145,
    backgroundColor: colors.white,
    marginBottom: spacing.medium,
  },
  iconBackground: {
 // Replace 'yourBackgroundColor' with the desired background color
    width: 40, // Adjust width as needed
    height: 40, // Adjust height as needed
    borderRadius: 20, // Make this half of the width/height for a circle shape
    justifyContent: 'center',
    alignItems: 'center',
    alignContent:"center",
    alignSelf:"center", bottom:20, 
    padding:10
  },
  
  icon: {
    color: colors.primary,
    fontSize: 20, // Adjust the font size as needed
  },
  text: {
    textAlign: 'center',
    marginTop: spacing.medium,
    alignSelf: 'center',
    fontSize: 14,
    fontWeight: '500',
    color: 'black',
  },
  textbox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.medium,
    alignSelf: 'center',
  },
  hover: {
    position: 'absolute',
    borderRightColor: 'rgba(136, 67, 225, 0.8)',
    borderEndWidth: 3,
    height: 45,
    bottom: 0,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.medium,
    borderRadius: 1,
    alignSelf: 'center',
    marginTop: spacing.small,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.white,
    marginRight: 10,
  },
});