import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import SettingItem from '../../components/SettingItem';
import * as Haptics from 'expo-haptics';

export default function NotificationsSettings() {
  const router = useRouter();
  const [likeNotif, setLikeNotif] = useState(true);
  const [commentNotif, setCommentNotif] = useState(true);
  const [followNotif, setFollowNotif] = useState(true);
  const [messageNotif, setMessageNotif] = useState(true);
  const [liveNotif, setLiveNotif] = useState(true);
  const [systemNotif, setSystemNotif] = useState(true);
  const [sound, setSound] = useState(true);
  const [vibrate, setVibrate] = useState(true);

  const handleToggle = (setter: any, value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setter(!value);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>通知设置</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>推送通知</Text>
          <SettingItem title="点赞通知" type="switch" value={likeNotif} onValueChange={() => handleToggle(setLikeNotif, likeNotif)} />
          <SettingItem title="评论通知" type="switch" value={commentNotif} onValueChange={() => handleToggle(setCommentNotif, commentNotif)} />
          <SettingItem title="关注通知" type="switch" value={followNotif} onValueChange={() => handleToggle(setFollowNotif, followNotif)} />
          <SettingItem title="私信通知" type="switch" value={messageNotif} onValueChange={() => handleToggle(setMessageNotif, messageNotif)} />
          <SettingItem title="直播开播提醒通知" type="switch" value={liveNotif} onValueChange={() => handleToggle(setLiveNotif, liveNotif)} />
          <SettingItem title="系统消息通知" type="switch" value={systemNotif} onValueChange={() => handleToggle(setSystemNotif, systemNotif)} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>声音与震动</Text>
          <SettingItem title="通知声音" type="switch" value={sound} onValueChange={() => handleToggle(setSound, sound)} />
          <SettingItem title="通知震动" type="switch" value={vibrate} onValueChange={() => handleToggle(setVibrate, vibrate)} />
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