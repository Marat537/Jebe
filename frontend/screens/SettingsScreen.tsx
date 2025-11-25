import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

interface SettingSection {
  id: string;
  title: string;
  icon: any;
  route: string;
  color: string;
}

export default function SettingsScreen() {
  const router = useRouter();

  const sections: SettingSection[] = [
    {
      id: 'account',
      title: '账号与安全',
      icon: 'person-circle-outline',
      route: '/settings/account',
      color: '#5B4FFF',
    },
    {
      id: 'privacy',
      title: '隐私设置',
      icon: 'lock-closed-outline',
      route: '/settings/privacy',
      color: '#FF6B6B',
    },
    {
      id: 'notifications',
      title: '通知设置',
      icon: 'notifications-outline',
      route: '/settings/notifications',
      color: '#4ECDC4',
    },
    {
      id: 'appearance',
      title: '外观与显示',
      icon: 'color-palette-outline',
      route: '/settings/appearance',
      color: '#FFD93D',
    },
    {
      id: 'general',
      title: '通用设置',
      icon: 'settings-outline',
      route: '/settings/general',
      color: '#95E1D3',
    },
    {
      id: 'creator',
      title: '创作者工具',
      icon: 'videocam-outline',
      route: '/settings/creator',
      color: '#F38181',
    },
    {
      id: 'safety',
      title: '安全中心',
      icon: 'shield-checkmark-outline',
      route: '/settings/safety',
      color: '#AA96DA',
    },
    {
      id: 'about',
      title: '关于 Vyzo',
      icon: 'information-circle-outline',
      route: '/settings/about',
      color: '#FCBAD3',
    },
  ];

  const handlePress = (route: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(route);
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>设置</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionsContainer}>
          {sections.map((section) => (
            <TouchableOpacity
              key={section.id}
              style={styles.sectionItem}
              onPress={() => handlePress(section.route)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: section.color + '20' }]}>
                <Ionicons name={section.icon} size={28} color={section.color} />
              </View>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Vyzo v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  sectionsContainer: {
    padding: 16,
    gap: 12,
  },
  sectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  versionText: {
    fontSize: 13,
    color: '#999',
  },
});
