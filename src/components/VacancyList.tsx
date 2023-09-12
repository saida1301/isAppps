import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';

const VacancyList = () => {
  const [vacancies, setVacancies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch vacancies here using your API endpoint
    fetchVacancies();
  }, []);

  const fetchVacancies = async () => {
    try {
      const response = await fetch('https://movieappi.onrender.com/vacancies');
      const data = await response.json();
      setVacancies(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching vacancies:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View>
      <FlatList
        data={vacancies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.title}</Text>
            <Text style={{ fontSize: 16 }}>{item.description}</Text>
            <Text style={{ fontSize: 14, color: '#888' }}>{item.city}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default VacancyList;
