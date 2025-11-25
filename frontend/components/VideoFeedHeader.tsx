import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

interface VideoFeedHeaderProps {
  onMenuPress: () => void;
}

export default function VideoFeedHeader({ onMenuPress }: VideoFeedHeaderProps) {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  
  const handleSearchPress = () => {
    router.push('/search');
  };

  const menuItems = [
    { icon: 'settings-outline', title: '设置', onPress: () => console.log('设置') },
    { icon: 'time-outline', title: '历史记录', onPress: () => console.log('历史记录') },
    { icon: 'create-outline', title: '创造者中心', onPress: () => console.log('创造者中心') },
    { icon: 'download-outline', title: '离线模式', onPress: () => console.log('离线模式') },
  ];

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setMenuVisible(true)}
        >
          <View style={styles.menuIcon}>
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.searchButton} onPress={handleSearchPress}>
          <Ionicons name="search" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={menuVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <SafeAreaView style={styles.menuModal} edges={['left']}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.menuHeader}>
                <Text style={styles.menuTitle}>工具栏</Text>
                <TouchableOpacity onPress={() => setMenuVisible(false)}>
                  <Ionicons name="close" size={28} color="#FFF" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.menuContent}>
                {menuItems.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.menuItem}
                    onPress={() => {
                      item.onPress();
                      setMenuVisible(false);
                    }}
                  >
                    <Ionicons name={item.icon as any} size={24} color="#FFF" />
                    <Text style={styles.menuItemText}>{item.title}</Text>
                    <Ionicons name="chevron-forward" size={20} color="#666" />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </TouchableOpacity>
          </SafeAreaView>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    zIndex: 10,
  },
  menuButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    width: 24,
    gap: 4,
  },
  menuLine: {
    height: 3,
    backgroundColor: '#FFF',
    borderRadius: 2,
  },
  searchButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  menuModal: {
    width: '75%',
    height: '100%',
    backgroundColor: '#1a1a1a',
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  menuTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  menuContent: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  menuItemText: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
    marginLeft: 16,
  },
});
