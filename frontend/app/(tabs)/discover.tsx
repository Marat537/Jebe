import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function Discover() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>好友</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="person-add" size={24} color="#5B4FFF" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.emptyState}>
          <Ionicons name="people-outline" size={80} color="#666" />
          <Text style={styles.emptyTitle}>还没有好友</Text>
          <Text style={styles.emptySubtitle}>添加好友，查看他们的精彩视频</Text>
          <TouchableOpacity style={styles.findFriendsButton}>
            <Ionicons name="search" size={20} color="#FFF" />
            <Text style={styles.findFriendsText}>发现好友</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#666',
    fontSize: 16,
  },
});