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
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

interface LoginScreenProps {
  onSwitchToRegister: () => void;
}

export default function LoginScreen({ onSwitchToRegister }: LoginScreenProps) {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert('提示', '请填写所有字段');
      return;
    }

    setLoading(true);
    try {
      await login(identifier, password);
    } catch (error: any) {
      Alert.alert('登录失败', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    Alert.alert('即将推出', 'Google 登录功能正在开发中');
  };

  const handleAppleLogin = () => {
    Alert.alert('即将推出', 'Apple ID 登录功能正在开发中');
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
          <Text style={styles.logoText}>登陆</Text>
          <Text style={styles.brandName}>vyzo</Text>
          <Text style={styles.slogan}>your world , your vyzo</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="手机号码/Vyzo id 登陆"
              placeholderTextColor="#999"
              value={identifier}
              onChangeText={setIdentifier}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="密码"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.loginButtonText}>登录</Text>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>或使用</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.socialButton}
            onPress={handleGoogleLogin}
          >
            <Ionicons name="logo-google" size={24} color="#4285F4" />
            <Text style={styles.socialButtonText}>Google 登陆</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialButton}
            onPress={handleAppleLogin}
          >
            <Ionicons name="logo-apple" size={24} color="#000" />
            <Text style={styles.socialButtonText}>Apple id 登陆</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerLink}
            onPress={onSwitchToRegister}
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
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  brandName: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 2,
  },
  slogan: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#5B4FFF',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  input: {
    color: '#000',
    fontSize: 16,
    paddingVertical: 16,
  },
  loginButton: {
    backgroundColor: '#5B4FFF',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#DDD',
  },
  dividerText: {
    color: '#999',
    marginHorizontal: 16,
    fontSize: 14,
  },
  socialButton: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#DDD',
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  socialButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  registerLink: {
    marginTop: 24,
    alignItems: 'center',
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
    fontSize: 12,
  },
});
