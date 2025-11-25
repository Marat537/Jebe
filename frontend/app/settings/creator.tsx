import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import SettingItem from '../../components/SettingItem';
import * as Haptics from 'expo-haptics';

export default function CreatorSettings() {
  const router = useRouter();
  const [resolution, setResolution] = useState('1080p');
  const [beautyLevel, setBeautyLevel] = useState('中');
  const [defaultFilter, setDefaultFilter] = useState('自然');
  const [liveQuality, setLiveQuality] = useState('高');

  const handleResolutionSelect = () => {
    Alert.alert('拍摄分辨率', '', [
      { text: '720p', onPress: () => { setResolution('720p'); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } },
      { text: '1080p', onPress: () => { setResolution('1080p'); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } },
      { text: '4K', onPress: () => { setResolution('4K'); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } },
      { text: '取消', style: 'cancel' }
    ]);
  };

  const handleBeautySelect = () => {
    Alert.alert('美颜等级', '', [
      { text: '关闭', onPress: () => { setBeautyLevel('关闭'); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } },
      { text: '低', onPress: () => { setBeautyLevel('低'); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } },
      { text: '中', onPress: () => { setBeautyLevel('中'); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } },
      { text: '高', onPress: () => { setBeautyLevel('高'); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } },
      { text: '取消', style: 'cancel' }
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>创作者工具</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>创作偏好</Text>
          <SettingItem title="默认拍摄分辨率" type="text" value={resolution} onPress={handleResolutionSelect} />
          <SettingItem title="默认美颜等级" type="text" value={beautyLevel} onPress={handleBeautySelect} />
          <SettingItem title="默认滤镜" type="text" value={defaultFilter} onPress={() => Alert.alert('提示', '滤镜选择即将推出')} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>直播设置</Text>
          <SettingItem title="直播封面管理" onPress={() => Alert.alert('提示', '直播封面管理即将推出')} />
          <SettingItem title="礼物特效预览" onPress={() => Alert.alert('提示', '礼物特效预览即将推出')} />
          <SettingItem title="直播黑名单" onPress={() => Alert.alert('提示', '直播黑名单即将推出')} />
          <SettingItem title="优先画质" type="text" value={liveQuality} onPress={() => Alert.alert('选择画质', '', [{ text: '高' }, { text: '中' }, { text: '低' }])} />
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