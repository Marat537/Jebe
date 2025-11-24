import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

export default function Index() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    if (!loading && user) {
      router.replace('/(tabs)');
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF0050" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showLogin ? (
        <LoginScreen onSwitchToRegister={() => setShowLogin(false)} />
      ) : (
        <RegisterScreen onSwitchToLogin={() => setShowLogin(true)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
