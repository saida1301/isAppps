import React, { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

const withInternetCheck = WrappedComponent => {
  return function WithInternetCheck(props) {
    const [isConnected, setIsConnected] = useState(true);

    useEffect(() => {
      const unsubscribe = NetInfo.addEventListener(state => {
        setIsConnected(state.isConnected);
      });

      return () => {
        unsubscribe();
      };
    }, []);

    return <WrappedComponent {...props} isConnected={isConnected} />;
  };
};

export default withInternetCheck;
