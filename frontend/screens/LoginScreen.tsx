import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

interface LoginScreenProps {
  onSwitchToRegister: () => void;
}

export default function LoginScreen({ onSwitchToRegister }: LoginScreenProps) {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loginMode, setLoginMode] = useState<'phone' | 'email'>('phone');

  const handleLogin = async () => {
    if (!identifier || !password) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert('提示', '请填写所有字段');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    try {
      await login(identifier, password);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('登录失败', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('即将推出', `${provider} 登录功能正在开发中`);
  };

  const toggleLoginMode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLoginMode(loginMode === 'phone' ? 'email' : 'phone');
    setIdentifier(''); // 清空输入框
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>登陆</Text>
            <Text style={styles.brandName}>vyzo</Text>
            <Text style={styles.slogan}>your world , your vyzo</Text>
          </View>
        </View>

        <View style={styles.form}>
          <View style={[
            styles.inputWrapper,
            focusedField === 'identifier' && styles.inputWrapperFocused
          ]}>
            <View style={styles.inputContainer}>
              <Ionicons 
                name={loginMode === 'phone' ? 'call-outline' : 'mail-outline'} 
                size={20} 
                color="#999" 
                style={styles.inputIcon} 
              />
              <TextInput
                style={styles.input}
                placeholder={loginMode === 'phone' ? '手机号码登录' : '邮箱登录'}
                placeholderTextColor="#999"
                value={identifier}
                onChangeText={setIdentifier}
                keyboardType={loginMode === 'email' ? 'email-address' : 'phone-pad'}
                autoCapitalize="none"
                onFocus={() => setFocusedField('identifier')}
                onBlur={() => setFocusedField(null)}
              />
            </View>
          </View>

          <TouchableOpacity 
            style={styles.switchModeButton}
            onPress={toggleLoginMode}
            activeOpacity={0.7}
          >
            <Text style={styles.switchModeText}>
              {loginMode === 'phone' 
                ? '没有电话号码？没关系，用邮箱' 
                : '没有邮箱？没关系，用电话号码'}
            </Text>
          </TouchableOpacity>

          <View style={[
            styles.inputWrapper,
            focusedField === 'password' && styles.inputWrapperFocused
          ]}>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="密码"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#6B5FFF', '#5B4FFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.loginButtonGradient}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.loginButtonText}>登录</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>或使用</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => handleSocialLogin('Google')}
            activeOpacity={0.7}
          >
            <Ionicons name="logo-google" size={24} color="#4285F4" />
            <Text style={styles.socialButtonText}>Google 登陆</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.socialButton, styles.appleButton]}
            onPress={() => handleSocialLogin('Apple')}
            activeOpacity={0.7}
          >
            <Ionicons name="logo-apple" size={24} color="#FFF" />
            <Text style={[styles.socialButtonText, styles.appleButtonText]}>Apple id 登陆</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerLink}
            onPress={onSwitchToRegister}
            activeOpacity={0.7}
          >
            <Text style={styles.registerLinkText}>
              没有账号？！！<Text style={styles.registerLinkBold}>去注册一个！！！</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>这里放点app政策 和 版本</Text>
          <Text style={styles.versionText}>版本 1.0.0</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    letterSpacing: 1,
  },
  brandName: {
    fontSize: 52,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 3,
    marginBottom: 8,
  },
  slogan: {
    fontSize: 15,
    color: '#666',
    letterSpacing: 0.5,
  },
  form: {
    width: '100%',
  },
  inputWrapper: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: '#FFF',
    shadowColor: '#5B4FFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputWrapperFocused: {
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E8E8E8',
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#000',
    fontSize: 15,
    paddingVertical: 16,
  },
  loginButton: {
    borderRadius: 16,
    marginTop: 8,
    marginBottom: 24,
    shadowColor: '#5B4FFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  loginButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    borderRadius: 16,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    color: '#999',
    marginHorizontal: 16,
    fontSize: 13,
  },
  socialButton: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  appleButton: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  socialButtonText: {
    color: '#000',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 12,
  },
  appleButtonText: {
    color: '#FFF',
  },
  registerLink: {
    marginTop: 24,
    alignItems: 'center',
    paddingVertical: 8,
  },
  registerLinkText: {
    color: '#666',
    fontSize: 14,
  },
  registerLinkBold: {
    color: '#5B4FFF',
    fontWeight: '600',
  },
  footer: {
    marginTop: 48,
    alignItems: 'center',
  },
  footerText: {
    color: '#999',
    fontSize: 12,
    marginBottom: 8,
  },
  versionText: {
    color: '#CCC',
    fontSize: 11,
  },
});