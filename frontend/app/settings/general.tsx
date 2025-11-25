import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import SettingItem from '../../components/SettingItem';
import * as Haptics from 'expo-haptics';

export default function GeneralSettings() {
  const router = useRouter();
  const [language, setLanguage] = useState('中文');
  const [videoQuality, setVideoQuality] = useState('中');
  const [autoDownload, setAutoDownload] = useState('WiFi');

  const handleLanguageSelect = () => {
    Alert.alert('选择语言', '', [
      { text: 'English', onPress: () => { setLanguage('English'); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } },
      { text: '中文', onPress: () => { setLanguage('中文'); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } },
      { text: 'Қазақ тілі', onPress: () => { setLanguage('Қазақ тілі'); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } },
      { text: '取消', style: 'cancel' }
    ]);
  };

  const handleClearCache = () => {
    Alert.alert('清除缓存', '确定要清除所有缓存吗？', [
      { text: '取消', style: 'cancel' },
      { text: '确定', onPress: () => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); Alert.alert('成功', '缓存已清除'); } }
    ]);
  };

  const handleClearSearchHistory = () => {
    Alert.alert('清除搜索历史', '确定要清除搜索历史吗？', [
      { text: '取消', style: 'cancel' },
      { text: '确定', onPress: () => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); Alert.alert('成功', '搜索历史已清除'); } }
    ]);
  };

  const handleQualitySelect = () => {
    Alert.alert('选择画质', '', [
      { text: '低', onPress: () => { setVideoQuality('低'); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } },
      { text: '中', onPress: () => { setVideoQuality('中'); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } },
      { text: '高', onPress: () => { setVideoQuality('高'); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } },
      { text: '取消', style: 'cancel' }
    ]);
  };

  const handleAutoDownloadSelect = () => {
    Alert.alert('自动下载', '', [
      { text: 'WiFi', onPress: () => { setAutoDownload('WiFi'); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } },
      { text: '移动数据', onPress: () => { setAutoDownload('移动数据'); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } },
      { text: '关闭', onPress: () => { setAutoDownload('关闭'); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } },
      { text: '取消', style: 'cancel' }
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>通用设置</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>语言 (Language)</Text>
          <SettingItem title="应用语言" type="text" value={language} onPress={handleLanguageSelect} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>数据与缓存</Text>
          <SettingItem title="清除缓存" subtitle="释放存储空间" icon="trash-outline" onPress={handleClearCache} />
          <SettingItem title="清除搜索历史" icon="close-circle-outline" onPress={handleClearSearchHistory} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>下载设置</Text>
          <SettingItem title="视频下载清晰度" type="text" value={videoQuality} onPress={handleQualitySelect} />
          <SettingItem title="自动下载" type="text" value={autoDownload} onPress={handleAutoDownloadSelect} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E8E8E8' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  content: { flex: 1 },
  section: { marginTop: 16 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#666', paddingHorizontal: 16, marginBottom: 8 },
});