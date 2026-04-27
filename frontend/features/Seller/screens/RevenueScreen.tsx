import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { sellerApi, SellerRevenue } from '@/lib/sellerApi';
import Svg, { Rect, G, Text as SvgText, Line } from 'react-native-svg';

const { width } = Dimensions.get('window');

const RevenueScreen: React.FC = () => {
  const router = useRouter();
  const [revenue, setRevenue] = useState<SellerRevenue | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRevenue = async () => {
    try {
      const data = await sellerApi.getRevenue();
      setRevenue(data);
    } catch (error) {
      console.error('Failed to fetch revenue:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRevenue();
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#e74c3c" />
        </View>
      </SafeAreaView>
    );
  }

  const chartData = revenue?.monthly || [];
  const maxRevenue = Math.max(...chartData.map((d) => d.revenue), 1);
  const chartHeight = 200;
  const barWidth = (width - 64) / Math.max(chartData.length, 6);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Phân tích doanh thu</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Total Revenue Card */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Tổng doanh thu tích lũy</Text>
          <Text style={styles.totalValue}>
            đ{(revenue?.totalRevenue ?? 0).toLocaleString('vi-VN')}
          </Text>
          <View style={styles.badge}>
            <Ionicons name="trending-up" size={14} color="#10b981" />
            <Text style={styles.badgeText}>+12.5% so với tháng trước</Text>
          </View>
        </View>

        {/* Chart Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Biểu đồ doanh thu tháng</Text>
          <View style={styles.chartContainer}>
            <Svg width={width - 32} height={chartHeight + 40}>
              <G y={chartHeight}>
                {chartData.map((item, index) => {
                  const barHeight = (item.revenue / maxRevenue) * chartHeight;
                  const x = index * (barWidth + 8) + 16;
                  return (
                    <G key={index}>
                      <Rect
                        x={x}
                        y={-barHeight}
                        width={barWidth}
                        height={barHeight}
                        fill="#F73658"
                        rx={4}
                      />
                      <SvgText
                        x={x + barWidth / 2}
                        y={20}
                        fontSize="10"
                        fill="#94a3b8"
                        textAnchor="middle"
                      >
                        T{item.month}
                      </SvgText>
                    </G>
                  );
                })}
                <Line x1="0" y1="0" x2={width - 32} y2="0" stroke="#e2e8f0" strokeWidth="1" />
              </G>
            </Svg>
          </View>
        </View>

        {/* Data Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chi tiết theo tháng</Text>
          <View style={styles.tableCard}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, { flex: 1 }]}>Tháng</Text>
              <Text style={[styles.tableHeaderText, { flex: 2, textAlign: 'right' }]}>Doanh thu</Text>
            </View>
            {chartData.reverse().map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 1 }]}>Tháng {item.month}, {item.year}</Text>
                <Text style={[styles.tableCell, { flex: 2, textAlign: 'right', fontWeight: '700' }]}>
                  đ{item.revenue.toLocaleString('vi-VN')}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
  },
  totalCard: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  totalLabel: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  totalValue: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: 'flex-start',
    gap: 6,
  },
  badgeText: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '700',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  tableCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  tableHeaderText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
    alignItems: 'center',
  },
  tableCell: {
    fontSize: 14,
    color: '#334155',
  },
});

export default RevenueScreen;
