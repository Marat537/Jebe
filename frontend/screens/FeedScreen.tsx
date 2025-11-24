import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  ViewToken,
  RefreshControl,
  Alert,
} from 'react-native';
import VideoPlayer from '../components/VideoPlayer';
import CommentsModalNew from '../components/CommentsModalNew';
import VideoFeedHeader from '../components/VideoFeedHeader';
import api from '../utils/api';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface VideoData {
  id: string;
  video_url: string;
  title: string;
  author: string;
  likes_count: number;
  comments_count: number;
  views: number;
  is_liked: boolean;
}

export default function FeedScreen() {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [commentsModalVisible, setCommentsModalVisible] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    setLoading(true);
    try {
      const response = await api.get('/videos/feed');
      setVideos(response.data);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load videos');
      console.error('Error loading videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setActiveVideoIndex(viewableItems[0].index || 0);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleCommentPress = (videoId: string) => {
    setSelectedVideoId(videoId);
    setCommentsModalVisible(true);
  };

  const handleCommentAdded = () => {
    // Update comment count for the video
    if (selectedVideoId) {
      setVideos(prevVideos =>
        prevVideos.map(video =>
          video.id === selectedVideoId
            ? { ...video, comments_count: video.comments_count + 1 }
            : video
        )
      );
    }
  };

  const handleVideoLiked = (videoId: string, liked: boolean) => {
    setVideos(prevVideos =>
      prevVideos.map(video =>
        video.id === videoId
          ? {
              ...video,
              is_liked: liked,
              likes_count: liked ? video.likes_count + 1 : video.likes_count - 1,
            }
          : video
      )
    );
  };

  const renderItem = ({ item, index }: { item: VideoData; index: number }) => (
    <VideoPlayer
      videoData={item}
      isActive={index === activeVideoIndex}
      onCommentPress={() => handleCommentPress(item.id)}
      onVideoLiked={(liked) => handleVideoLiked(item.id, liked)}
    />
  );

  const handleSearchPress = () => {
    Alert.alert('搜索', '搜索功能即将推出');
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={videos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        snapToInterval={SCREEN_HEIGHT}
        decelerationRate="fast"
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadVideos}
            tintColor="#5B4FFF"
          />
        }
      />

      <VideoFeedHeader
        onMenuPress={() => {}}
        onSearchPress={handleSearchPress}
      />

      {selectedVideoId && (
        <CommentsModal
          visible={commentsModalVisible}
          videoId={selectedVideoId}
          onClose={() => setCommentsModalVisible(false)}
          onCommentAdded={handleCommentAdded}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
