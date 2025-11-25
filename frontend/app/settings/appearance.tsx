import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import SettingItem from '../../components/SettingItem';
import * as Haptics from 'expo-haptics';

export default function AppearanceSettings() {
  const router = useRouter();
  const [theme, setTheme] = useState('深色模式');
  const [fontSize, setFontSize] = useState('中');
  const [autoPlay, setAutoPlay] = useState(true);
  const [autoFullscreen, setAutoFullscreen] = useState(false);

  const handleThemeSelect = () => {
    Alert.alert('选择主题', '', [
      { text: '浅色模式', onPress: () => { setTheme('浅色模式'); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } },
      { text: '深色模式', onPress: () => { setTheme('深色模式'); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } },
      { text: '跟随系统', onPress: () => { setTheme('跟随系统'); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } },
      { text: '取消', style: 'cancel' }
    ]);
  };

  const handleFontSizeSelect = () => {
    Alert.alert('选择字体大小', '', [
      { text: '小', onPress: () => { setFontSize('小'); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } },
      { text: '中', onPress: () => { setFontSize('中'); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } },
      { text: '大', onPress: () => { setFontSize('大'); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } },
      { text: '取消', style: 'cancel' }
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>外观与显示</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>主题</Text>
          <SettingItem title="主题模式" type="text" value={theme} onPress={handleThemeSelect} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>字体与界面</Text>
          <SettingItem title="字体大小" type="text" value={fontSize} onPress={handleFontSizeSelect} />
          <SettingItem title="视频自动播放" type="switch" value={autoPlay} onValueChange={(v) => { setAutoPlay(v); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }} />
          <SettingItem title="自动进入全屏播放" type="switch" value={autoFullscreen} onValueChange={(v) => { setAutoFullscreen(v); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }} />
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