import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SettingItemProps {
  title: string;
  subtitle?: string;
  type?: 'navigation' | 'switch' | 'text';
  value?: any;
  onPress?: () => void;
  onValueChange?: (value: any) => void;
  icon?: any;
}

export default function SettingItem({
  title,
  subtitle,
  type = 'navigation',
  value,
  onPress,
  onValueChange,
  icon,
}: SettingItemProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={type === 'switch' ? 1 : 0.7}
      disabled={type === 'switch'}
    >
      <View style={styles.left}>
        {icon && <Ionicons name={icon} size={20} color="#666" style={styles.icon} />}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
      
      <View style={styles.right}>
        {type === 'navigation' && (
          <Ionicons name="chevron-forward" size={20} color="#999" />
        )}
        {type === 'switch' && (
          <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{ false: '#E8E8E8', true: '#5B4FFF' }}
            thumbColor="#FFF"
          />
        )}
        {type === 'text' && value && (
          <Text style={styles.valueText}>{value}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    color: '#000',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  right: {
    marginLeft: 12,
  },
  valueText: {
    fontSize: 14,
    color: '#666',
  },
});
