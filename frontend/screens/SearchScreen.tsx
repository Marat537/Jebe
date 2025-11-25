import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import api from '../utils/api';

interface SearchHistory {
  id: string;
  keyword: string;
  created_at: string;
}

interface HotSearch {
  keyword: string;
  count: number;
}

interface SearchResult {
  videos: any[];
  users: any[];
  total_count: number;
}

export default function SearchScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [hotSearches, setHotSearches] = useState<HotSearch[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: '综合' },
    { id: 'video', label: '视频' },
    { id: 'user', label: '账号' },
    { id: 'music', label: '音乐' },
    { id: 'topic', label: '话题' },
    { id: 'live', label: '直播' },
  ];

  useEffect(() => {
    loadSearchHistory();
    loadHotSearches();
  }, []);

  const loadSearchHistory = async () => {
    try {
      const response = await api.get('/search/history');
      setSearchHistory(response.data);
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  };

  const loadHotSearches = async () => {
    try {
      const response = await api.get('/search/hot');
      setHotSearches(response.data);
    } catch (error) {
      console.error('Error loading hot searches:', error);
    }
  };

  const handleSearch = async (keyword?: string) => {
    const searchKeyword = keyword || searchText;
    if (!searchKeyword.trim()) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLoading(true);

    try {
      // Save search history
      await api.post('/search/history', null, { params: { keyword: searchKeyword } });
      
      // Perform search
      const response = await api.get('/search', {
        params: { keyword: searchKeyword, category: activeCategory }
      });
      
      setSearchResults(response.data);
      loadSearchHistory(); // Refresh history
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHistory = async (historyId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await api.delete(`/search/history/${historyId}`);
      setSearchHistory(searchHistory.filter(h => h.id !== historyId));
    } catch (error) {
      console.error('Error deleting history:', error);
    }
  };

  const handleClearAllHistory = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await api.delete('/search/history');
      setSearchHistory([]);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  const handleHistoryClick = (keyword: string) => {
    setSearchText(keyword);
    handleSearch(keyword);
  };

  const handleCategoryChange = (categoryId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveCategory(categoryId);
    if (searchText.trim()) {
      handleSearch();
    }
  };

  const renderSearchInitial = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {/* Search History */}
      {searchHistory.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>搜索历史</Text>
            <View style={styles.sectionActions}>
              <TouchableOpacity onPress={handleClearAllHistory} style={styles.actionButton}>
                <Text style={styles.actionText}>删除全部</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.historyList}>
            {searchHistory.map((item) => (
              <View key={item.id} style={styles.historyItem}>
                <TouchableOpacity
                  style={styles.historyKeyword}
                  onPress={() => handleHistoryClick(item.keyword)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="time-outline" size={16} color="#666" />
                  <Text style={styles.historyText}>{item.keyword}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteHistory(item.id)}
                  style={styles.deleteButton}
                >
                  <Ionicons name="close" size={18} color="#666" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Hot Searches */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>热门话题</Text>
        </View>
        <View style={styles.hotList}>
          {hotSearches.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.hotItem}
              onPress={() => handleHistoryClick(item.keyword)}
              activeOpacity={0.7}
            >
              <Text style={[styles.hotRank, index < 3 && styles.hotRankTop]}>{index + 1}</Text>
              <Text style={styles.hotKeyword}>{item.keyword}</Text>
              <Ionicons name="flame" size={16} color="#FF6B6B" />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  const renderSearchResults = () => (
    <View style={styles.resultsContainer}>
      {/* Category Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.categoryTabs}
        contentContainerStyle={styles.categoryTabsContent}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryTab,
              activeCategory === cat.id && styles.categoryTabActive
            ]}
            onPress={() => handleCategoryChange(cat.id)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.categoryTabText,
              activeCategory === cat.id && styles.categoryTabTextActive
            ]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5B4FFF" />
        </View>
      ) : (
        <ScrollView style={styles.resultsList} showsVerticalScrollIndicator={false}>
          {searchResults && searchResults.total_count === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={64} color="#666" />
              <Text style={styles.emptyText}>没有找到相关内容</Text>
            </View>
          ) : (
            <>
              {searchResults?.videos && searchResults.videos.length > 0 && (
                <View style={styles.resultSection}>
                  <Text style={styles.resultSectionTitle}>视频 ({searchResults.videos.length})</Text>
                  {searchResults.videos.map((video) => (
                    <View key={video.id} style={styles.resultItem}>
                      <View style={styles.videoThumb}>
                        <Ionicons name="play-circle" size={40} color="#5B4FFF" />
                      </View>
                      <View style={styles.resultInfo}>
                        <Text style={styles.resultTitle}>{video.title}</Text>
                        <Text style={styles.resultMeta}>
                          @{video.author} · {video.views} 观看
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {searchResults?.users && searchResults.users.length > 0 && (
                <View style={styles.resultSection}>
                  <Text style={styles.resultSectionTitle}>用户 ({searchResults.users.length})</Text>
                  {searchResults.users.map((user) => (
                    <View key={user.id} style={styles.resultItem}>
                      <View style={styles.userAvatar}>
                        <Ionicons name="person" size={24} color="#666" />
                      </View>
                      <View style={styles.resultInfo}>
                        <Text style={styles.resultTitle}>@{user.username}</Text>
                        <Text style={styles.resultMeta}>{user.bio || '暂无简介'}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </>
          )}
        </ScrollView>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="搜索"
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={() => handleSearch()}
            returnKeyType="search"
          />
        </View>

        <TouchableOpacity 
          style={styles.searchButton}
          onPress={() => handleSearch()}
          activeOpacity={0.7}
        >
          <Ionicons name="search" size={24} color="#5B4FFF" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      {searchResults ? renderSearchResults() : renderSearchInitial()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    marginHorizontal: 12,
  },
  searchInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: '#000',
  },
  searchButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  sectionActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 13,
    color: '#666',
  },
  historyList: {
    gap: 8,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  historyKeyword: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  historyText: {
    fontSize: 14,
    color: '#333',
  },
  deleteButton: {
    padding: 4,
  },
  hotList: {
    gap: 8,
  },
  hotItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 12,
  },
  hotRank: {
    width: 20,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#999',
  },
  hotRankTop: {
    color: '#FF6B6B',
  },
  hotKeyword: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  resultsContainer: {
    flex: 1,
  },
  categoryTabs: {
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  categoryTabsContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 16,
  },
  categoryTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  categoryTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#5B4FFF',
  },
  categoryTabText: {
    fontSize: 15,
    color: '#666',
  },
  categoryTabTextActive: {
    color: '#5B4FFF',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsList: {
    flex: 1,
  },
  emptyContainer: {
    paddingVertical: 80,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 15,
    color: '#999',
  },
  resultSection: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  resultSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  resultItem: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  videoThumb: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resultInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  resultTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  resultMeta: {
    fontSize: 13,
    color: '#666',
  },
});
