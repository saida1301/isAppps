import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  Switch,
  useColorScheme,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import LottieView from 'lottie-react-native';
// Assuming you have an action for updating categories
import SuccessAnimation from '../animations/success.json';
import { colors } from '../assets/themes';
import { updateCategories } from '../store/redux/categorySlice';

const EditCategoriesScreen = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [user_id, setUserId] = useState('');
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const email = useSelector(state => state.auth.email);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(useColorScheme() === 'dark');

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');

        if (storedUserId) {
          setUserId(storedUserId);
        } else {
          const response = await axios.get('https://movieappi.onrender.com/user');
          const data = response.data;
          const loggedInUser = data.find(user => user.email === email);

          if (loggedInUser) {
            setUserId(loggedInUser.id.toString());
            await AsyncStorage.setItem('userId', loggedInUser.id.toString());
          } else {
            console.error('User not found!');
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserId();
  }, [email]);

  useEffect(() => {
    const fetchUserSelectedCategories = async () => {
      try {
        const response = await axios.get(`https://movieappi.onrender.com/user/${user_id}`);
        const user = response.data;

        const selectedCategories = user.cat_id
          .filter((id, index, array) => id !== "0" && array.indexOf(id) === index)
          .map(Number);

        setSelectedCategories(selectedCategories);
      } catch (error) {
        console.error('Failed to fetch user selected categories:', error);
      }
    };

    fetchUserSelectedCategories();
  }, [user_id]);

  useEffect(() => {
    axios
      .get('https://movieappi.onrender.com/categories')
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error('API call failed:', error);
      });
  }, []);

  const toggleCategory = (categoryId) => {
    if (selectedCategories?.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const handleSave = () => {
    setIsLoading(true);
    axios
      .post('https://movieappi.onrender.com/update-category', {
        cat_id: selectedCategories,
        user_id: user_id,
      })
      .then((response) => {
        dispatch(updateCategories(selectedCategories)); // Assuming you have an action to update categories in Redux store
        setIsSuccessModalVisible(true);
        setTimeout(() => {
          setIsSuccessModalVisible(false);
        }, 1000);
        setIsLoading(false);
        console.log('Categories updated successfully:', response.data);
      })
      .catch((error) => {
        console.error('API call failed:', error.response.data);
      });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => toggleCategory(item.id)}
      style={[
        styles.categoryItem,
        {
          backgroundColor: selectedCategories?.includes(item.id)
            ? isDarkMode ? '#333' : colors.primary
            : isDarkMode ? '#222' : '#fff',
        },
      ]}
    >
      <Text
        style={[
          styles.categoryTitle,
          { color: isDarkMode ? '#fff' : '#333' },
        ]}
      >
        {item.title_az}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#222' : '#f5f5f5' }]}>
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>{t('aprove')}</Text>
      </TouchableOpacity>

      <Switch
        value={isDarkMode}
        onValueChange={setIsDarkMode}
        style={styles.darkModeSwitch}
      />

      <Modal visible={isSuccessModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <LottieView
              source={SuccessAnimation}
              style={styles.animation}
              autoPlay={true}
              loop={false}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  categoryItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    backgroundColor: '#fff', // You can adjust this color
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animation: {
    width: 150,
    height: 150,
  },
  categoryTitle: {
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 60,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  darkModeSwitch: {
    alignSelf: 'center',
    marginTop: 20,
  },
});

export default EditCategoriesScreen;