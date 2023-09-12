import React, { useState } from 'react';
import { TextInput } from 'react-native';

const SearchInput = ({ onSearch }:any) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  return (
    <TextInput
      placeholder="Search trainings"
      value={searchQuery}
      onChangeText={setSearchQuery}
      onSubmitEditing={handleSearch}
    />
  );
};

export default SearchInput;