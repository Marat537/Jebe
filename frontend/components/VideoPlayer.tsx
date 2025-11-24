import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import api from '../utils/api';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

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

interface VideoPlayerProps {
  videoData: VideoData;
  isActive: boolean;
  onCommentPress: () => void;
  onVideoLiked: (liked: boolean) => void;
}

export default function VideoPlayer({
  videoData,
  isActive,
  onCommentPress,
  onVideoLiked,
}: VideoPlayerProps) {
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [liked, setLiked] = useState(videoData.is_liked);
  const [likesCount, setLikesCount] = useState(videoData.likes_count);
  const likeAnimation = useRef(new Animated.Value(1)).current;
  const [watchStartTime, setWatchStartTime] = useState<number>(Date.now());

  useEffect(() => {
    if (isActive) {
      videoRef.current?.playAsync();
      setWatchStartTime(Date.now());
    } else {
      videoRef.current?.pauseAsync();
      recordWatchTime();
    }
  }, [isActive]);

  useEffect(() => {
    setLiked(videoData.is_liked);
    setLikesCount(videoData.likes_count);
  }, [videoData]);

  const recordWatchTime = async () => {
    const watchDuration = (Date.now() - watchStartTime) / 1000;
    if (watchDuration > 1) {
      try {
        await api.post(`/videos/${videoData.id}/view`, {
          video_id: videoData.id,
          watch_duration: watchDuration,
        });
      } catch (error) {
        console.error('Error recording watch time:', error);
      }
    }
  };

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setIsLoading(!status.isPlaying && status.isBuffering);
      setIsPlaying(status.isPlaying);
    }
  };

  const togglePlayPause = async () => {
    if (isPlaying) {
      await videoRef.current?.pauseAsync();
    } else {
      await videoRef.current?.playAsync();
    }
  };

  const handleLike = async () => {
    try {
      if (liked) {
        await api.delete(`/videos/${videoData.id}/like`);
        setLiked(false);
        setLikesCount(prev => prev - 1);
        onVideoLiked(false);
      } else {
        await api.post(`/videos/${videoData.id}/like`);
        setLiked(true);
        setLikesCount(prev => prev + 1);
        onVideoLiked(true);
        
        // Animate like button
        Animated.sequence([
          Animated.timing(likeAnimation, {
            toValue: 1.3,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(likeAnimation, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ]).start();
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.videoContainer}
        activeOpacity={1}
        onPress={togglePlayPause}
      >
        <Video
          ref={videoRef}
          source={{ uri: videoData.video_url }}
          style={styles.video}
          resizeMode={ResizeMode.COVER}
          shouldPlay={isActive}
          isLooping
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        />

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF0050" />
          </View>
        )}

        {!isPlaying && !isLoading && (
          <View style={styles.playIconContainer}>
            <Ionicons name="play" size={64} color="rgba(255, 255, 255, 0.8)" />
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.overlay}>
        <View style={styles.videoInfo}>
          <Text style={styles.author}>@{videoData.author}</Text>
          <Text style={styles.title}>{videoData.title}</Text>
        </View>

        <View style={styles.actions}>
          <Animated.View style={{ transform: [{ scale: likeAnimation }] }}>
            <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
              <Ionicons
                name={liked ? 'heart' : 'heart-outline'}
                size={32}
                color={liked ? '#FF0050' : '#FFF'}
              />
              <Text style={styles.actionText}>{likesCount}</Text>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity style={styles.actionButton} onPress={onCommentPress}>
            <Ionicons name="chatbubble-outline" size={32} color="#FFF" />
            <Text style={styles.actionText}>{videoData.comments_count}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="eye-outline" size={32} color="#FFF" />
            <Text style={styles.actionText}>{videoData.views}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    position: 'relative',
  },
  videoContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  playIconContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 48,
  },
  videoInfo: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  author: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  title: {
    color: '#FFF',
    fontSize: 14,
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  actions: {
    justifyContent: 'flex-end',
    gap: 24,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    color: '#FFF',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
