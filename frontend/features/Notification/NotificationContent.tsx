import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { TabModel, NotificationItemModel } from './notification.types';
import { TABS } from './notification.mock';
import NotificationCard from './NotificationCard';
import { getNotifications } from '../../lib/notificationApi';

export default function NotificationContent() {
  const [activeTab, setActiveTab] = useState<string>('ORDER');
  const [notifications, setNotifications] = useState<NotificationItemModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchNotifications = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const filteredData = useMemo(() => {
    return notifications.filter((item) => item.type === activeTab);
  }, [activeTab, notifications]);

  const recentNotifications = useMemo(() => filteredData.filter((i) => !i.isOlder), [filteredData]);
  const olderNotifications = useMemo(() => filteredData.filter((i) => i.isOlder), [filteredData]);

  const renderTab = (item: TabModel) => {
    const isActive = activeTab === item.id;
    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.tabItem, isActive && styles.tabItemActive]}
        onPress={() => setActiveTab(item.id)}
      >
        <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Feather name="bell-off" size={48} color="#CBD5E1" />
      <Text style={styles.emptyTitle}>Chưa có thông báo nào</Text>
      <Text style={styles.emptySubtitle}>Các cập nhật mới sẽ hiển thị tại đây</Text>
    </View>
  );

  const renderContent = () => {
    if (isLoading && !isRefreshing) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF4747" />
        </View>
      );
    }

    if (filteredData.length === 0) {
      return (
        <FlatList
          data={[]}
          renderItem={null}
          ListEmptyComponent={renderEmptyState()}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={() => fetchNotifications(true)} colors={['#FF4747']} />
          }
        />
      );
    }

    const listData: any[] = [];
    if (recentNotifications.length > 0) {
      listData.push(...recentNotifications);
    }
    if (olderNotifications.length > 0) {
      listData.push({ isSectionHeader: true, title: 'THÔNG BÁO CŨ HƠN', id: 'section-older' });
      listData.push(...olderNotifications);
    }

    return (
      <FlatList
        data={listData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          if (item.isSectionHeader) {
            return (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>{item.title}</Text>
              </View>
            );
          }
          return <NotificationCard item={item} />;
        }}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={() => fetchNotifications(true)} colors={['#FF4747']} />
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabsWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.tabsContainer}
        >
          {TABS.map(renderTab)}
        </ScrollView>
      </View>

      {/* List */}
      <View style={styles.listWrapper}>
        {renderContent()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  tabsWrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tabsContainer: {
    paddingHorizontal: 8,
  },
  tabItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: '#FF4747',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#FF4747',
    fontWeight: '600',
  },
  listWrapper: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingBottom: 24,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#F5F5F5',
  },
  sectionHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
  },
});
