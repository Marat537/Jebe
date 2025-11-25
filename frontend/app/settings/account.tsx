import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import SettingItem from '../../components/SettingItem';
import * as Haptics from 'expo-haptics';

export default function AccountSettings() {
  const router = useRouter();
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [nickname, setNickname] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');

  const handleSave = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('保存成功', '账号信息已更新');
    setEditing(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>账号与安全</Text>
        <TouchableOpacity onPress={editing ? handleSave : () => setEditing(true)} activeOpacity={0.7}>
          <Text style={styles.editButton}>{editing ? '保存' : '编辑'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>账号信息</Text>
          {editing ? (
            <View style={styles.editContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>昵称</Text>
                <TextInput
                  style={styles.input}
                  value={nickname}
                  onChangeText={setNickname}
                  placeholder="请输入昵称"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>简介</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={bio}
                  onChangeText={setBio}
                  placeholder="请输入简介"
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>
          ) : (
            <>
              <SettingItem title="昵称" type="text" value={user?.username} />
              <SettingItem title="用户名 (UID)" type="text" value={`@${user?.username}`} />
              <SettingItem title="头像" onPress={() => Alert.alert('提示', '头像上传功能即将推出')} />
              <SettingItem title="简介" type="text" value={user?.bio || '暂无简介'} />
              <SettingItem title="更改邮箱" type="text" value={user?.email} onPress={() => Alert.alert('提示', '邮箱修改功能即将推出')} />
              <SettingItem title="更改电话号码" onPress={() => Alert.alert('提示', '电话号码修改功能即将推出')} />
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>安全设置</Text>
          <SettingItem title="修改密码" icon="lock-closed-outline" onPress={() => Alert.alert('提示', '密码修改功能即将推出')} />
          <SettingItem title="两步验证 (2FA)" icon="shield-checkmark-outline" onPress={() => Alert.alert('提示', '2FA功能即将推出')} />
          <SettingItem title="登录设备管理" subtitle="查看和注销其他设备" icon="phone-portrait-outline" onPress={() => Alert.alert('提示', '设备管理功能即将推出')} />
          <SettingItem title="第三方登录管理" subtitle="Google / Apple / Facebook" icon="link-outline" onPress={() => Alert.alert('提示', '第三方登录管理即将推出')} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>账号管理</Text>
          <SettingItem title="切换账号" icon="swap-horizontal-outline" onPress={() => Alert.alert('提示', '切换账号功能即将推出')} />
          <SettingItem title="账号数据导出 (GDPR)" icon="download-outline" onPress={() => Alert.alert('提示', '数据导出功能即将推出')} />
          <SettingItem title="删除账号" icon="trash-outline" onPress={() => Alert.alert('警告', '删除账号功能即将推出', [{ text: '取消' }, { text: '确定', style: 'destructive' }])} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E8E8E8' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  editButton: { fontSize: 16, color: '#5B4FFF', fontWeight: '600' },
  content: { flex: 1 },
  section: { marginTop: 16 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#666', paddingHorizontal: 16, marginBottom: 8 },
  editContainer: { backgroundColor: '#FFF', padding: 16 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, color: '#666', marginBottom: 8 },
  input: { backgroundColor: '#F5F5F5', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, fontSize: 15, color: '#000' },
  textArea: { height: 80, textAlignVertical: 'top' },
});