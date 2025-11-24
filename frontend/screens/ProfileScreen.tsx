import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      '退出登录',
      '确定要退出登录吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '退出',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  const toggleDarkMode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsDarkMode(!isDarkMode);
  };

  const handleMenuPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('菜单', '菜单功能即将推出');
  };

  const handleEditBio = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('编辑简介', '编辑个人简介功能即将推出');
  };

  const handleTabPress = (tabName: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('标签', `${tabName}功能即将推出`);
  };

  const handleSettingPress = (settingName: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(settingName, `${settingName}功能即将推出`);
  };

  const bgColor = isDarkMode ? '#000' : '#FAFAFA';
  const textColor = isDarkMode ? '#FFF' : '#000';
  const secondaryTextColor = isDarkMode ? '#999' : '#666';
  const cardBgColor = isDarkMode ? '#1a1a1a' : '#FFF';
  const borderColor = isDarkMode ? '#333' : '#E8E8E8';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="menu" size={28} color={textColor} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={[styles.avatarContainer, { borderColor: borderColor }]}>
            <Ionicons name="person" size={60} color={secondaryTextColor} />
          </View>
          
          <Text style={[styles.username, { color: textColor }]}>@{user?.username || 'user123'}</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: textColor }]}>0</Text>
              <Text style={[styles.statLabel, { color: secondaryTextColor }]}>关注</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: textColor }]}>0</Text>
              <Text style={[styles.statLabel, { color: secondaryTextColor }]}>粉丝</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: textColor }]}>0</Text>
              <Text style={[styles.statLabel, { color: secondaryTextColor }]}>赞</Text>
            </View>
          </View>

          <TouchableOpacity style={[styles.editBioButton, { borderColor: borderColor }]}>
            <Ionicons name="add" size={16} color={secondaryTextColor} />
            <Text style={[styles.editBioText, { color: secondaryTextColor }]}>
              添加个人简介 · 
              <Ionicons name="eye-outline" size={14} /> 
              我的账号主要关于...
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity style={styles.tab}>
            <Ionicons name="grid-outline" size={24} color={textColor} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Ionicons name="albums-outline" size={24} color={secondaryTextColor} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Ionicons name="repeat-outline" size={24} color={secondaryTextColor} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Ionicons name="bookmark-outline" size={24} color={secondaryTextColor} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Ionicons name="scan-outline" size={24} color={secondaryTextColor} />
          </TouchableOpacity>
        </View>

        <View style={[styles.settingsSection, { backgroundColor: cardBgColor }]}>
          <TouchableOpacity style={[styles.settingItem, { borderBottomColor: borderColor }]}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={24} color={textColor} />
              <Text style={[styles.settingText, { color: textColor }]}>通知</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={secondaryTextColor} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItem, { borderBottomColor: borderColor }]}>
            <View style={styles.settingLeft}>
              <Ionicons name="shield-checkmark-outline" size={24} color={textColor} />
              <Text style={[styles.settingText, { color: textColor }]}>隐私</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={secondaryTextColor} />
          </TouchableOpacity>

          <View style={[styles.settingItem, { borderBottomColor: borderColor }]}>
            <View style={styles.settingLeft}>
              <Ionicons name="moon-outline" size={24} color={textColor} />
              <Text style={[styles.settingText, { color: textColor }]}>夜间模式</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#E8E8E8', true: '#5B4FFF' }}
              thumbColor="#FFF"
            />
          </View>

          <TouchableOpacity style={[styles.settingItem, { borderBottomColor: borderColor }]}>
            <View style={styles.settingLeft}>
              <Ionicons name="help-circle-outline" size={24} color={textColor} />
              <Text style={[styles.settingText, { color: textColor }]}>帮助与支持</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={secondaryTextColor} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.settingItem, { borderBottomWidth: 0 }]}
            onPress={handleLogout}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="log-out-outline" size={24} color="#FF0050" />
              <Text style={[styles.settingText, { color: '#FF0050' }]}>退出登录</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#FF0050" />
          </TouchableOpacity>
        </View>

        <Text style={[styles.version, { color: secondaryTextColor }]}>Vyzo v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  username: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#333',
  },
  editBioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 8,
  },
  editBioText: {
    fontSize: 13,
    marginLeft: 6,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  settingsSection: {
    marginTop: 24,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 16,
  },
  version: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 32,
  },
});
