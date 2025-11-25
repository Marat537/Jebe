import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import SettingItem from '../../components/SettingItem';
import * as Haptics from 'expo-haptics';

export default function PrivacySettings() {
  const router = useRouter();
  const [whoCanMessage, setWhoCanMessage] = useState('all');
  const [whoCanComment, setWhoCanComment] = useState('all');
  const [allowDownload, setAllowDownload] = useState(true);
  const [invisibleMode, setInvisibleMode] = useState(false);

  const handleToggle = (setter: any, value: boolean, name: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setter(!value);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>隐私设置</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>个人隐私</Text>
          <SettingItem title="谁可以给我发消息" type="text" value="所有人" onPress={() => Alert.alert('选择', '所有人 / 关注 / 无人', [{ text: '所有人' }, { text: '关注' }, { text: '无人' }])} />
          <SettingItem title="谁可以给我评论" type="text" value="所有人" onPress={() => Alert.alert('选择', '所有人 / 关注 / 关闭', [{ text: '所有人' }, { text: '关注' }, { text: '关闭' }])} />
          <SettingItem title="允许下载我的视频" type="switch" value={allowDownload} onValueChange={(v) => handleToggle(setAllowDownload, allowDownload, '下载')} />
          <SettingItem title="隐身模式" subtitle="别人看不到我的在线状态" type="switch" value={invisibleMode} onValueChange={(v) => handleToggle(setInvisibleMode, invisibleMode, '隐身')} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>内容隐私</Text>
          <SettingItem title="私密作品管理" subtitle="将视频设为私密" onPress={() => Alert.alert('提示', '私密作品管理即将推出')} />
          <SettingItem title="收藏的视频" subtitle="仅自己可见" onPress={() => Alert.alert('提示', '收藏管理即将推出')} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>屏蔽与黑名单</Text>
          <SettingItem title="屏蔽的用户列表" onPress={() => Alert.alert('提示', '屏蔽用户列表即将推出')} />
          <SettingItem title="屏蔽的声音 (音乐)" onPress={() => Alert.alert('提示', '屏蔽音乐即将推出')} />
          <SettingItem title="屏蔽的标签" onPress={() => Alert.alert('提示', '屏蔽标签即将推出')} />
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