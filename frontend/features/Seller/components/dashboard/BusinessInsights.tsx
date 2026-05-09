import React, { useMemo } from 'react';
import { Animated, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Polyline, Defs, LinearGradient, Stop, Path } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SellerDashboardStats } from '../../../../lib/sellerApi';

interface BusinessInsightsProps {
  stats: SellerDashboardStats | null;
  loading?: boolean;
}

const Sparkline: React.FC<{ data: number[] }> = ({ data }) => {
  const { points, fillPath } = useMemo(() => {
    if (data.length === 0) {
      return { points: '0,32 100,32', fillPath: 'M0,32 L100,32 L100,32 L0,32 Z' };
    }
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = Math.max(max - min, 1);
    
    const pts = data
      .map((value, index) => {
        const x = (index / Math.max(data.length - 1, 1)) * 100;
        const y = 30 - ((value - min) / range) * 26;
        return `${x},${y}`;
      });

    const path = `M${pts[0]} ${pts.map(p => `L${p}`).join(' ')} L100,32 L0,32 Z`;
    
    return { points: pts.join(' '), fillPath: path };
  }, [data]);

  return (
    <View style={styles.sparklineContainer}>
      <Svg width="100%" height={32} viewBox="0 0 100 32" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
            <Stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </LinearGradient>
        </Defs>
        <Path d={fillPath} fill="url(#grad)" />
        <Polyline points={points} fill="none" stroke="#10b981" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </View>
  );
};

const BusinessInsights: React.FC<BusinessInsightsProps> = ({ stats, loading = false }) => {
  const router = useRouter();

  if (loading) {
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.headerLeft}>
            <View style={styles.sectionIndicator} />
            <Text style={styles.sectionTitle}>Thông tin kinh doanh</Text>
          </View>
        </View>
        <View style={styles.grid}>
          {[1, 2, 3, 4].map(i => <View key={i} style={styles.skeletonCard} />)}
        </View>
      </View>
    );
  }

  const cards = [
    {
      id: 'revenue',
      title: 'Doanh thu hôm nay',
      value: `đ${(stats?.todayRevenue ?? 0).toLocaleString('vi-VN')}`,
      description: 'Xu hướng 7 ngày',
      icon: 'cash-outline',
      iconColor: '#10b981',
    },
    {
      id: 'orders',
      title: 'Đơn hàng mới',
      value: (stats?.todayOrders ?? 0).toString(),
      description: 'Đơn phát sinh',
      icon: 'cart-outline',
      iconColor: '#3498db',
    },
    {
      id: 'conversion',
      title: 'Tỷ lệ chuyển đổi',
      value: `${stats?.conversionRate ?? 0}%`,
      description: 'Theo lượt truy cập',
      icon: 'trending-up-outline',
      iconColor: '#9b59b6',
    },
    {
      id: 'avg',
      title: 'Giá trị đơn TB',
      value: `đ${Math.round((stats?.averageOrderValue ?? 0)).toLocaleString('vi-VN')}`,
      description: 'Trung bình mỗi đơn',
      icon: 'wallet-outline',
      iconColor: '#f39c12',
    },
  ];

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.sectionIndicator} />
          <Text style={styles.sectionTitle}>Thông tin kinh doanh</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/seller-revenue')}>
          <Text style={styles.viewDetailText}>Xem chi tiết</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        {cards.map((card) => (
          <View key={card.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconWrapper, { backgroundColor: `${card.iconColor}10` }]}>
                <Ionicons name={card.icon as any} size={16} color={card.iconColor} />
              </View>
              <Text style={styles.cardTitle}>{card.title}</Text>
            </View>
            <Text style={styles.cardValue}>{card.value}</Text>
            <Text style={styles.cardDescription}>{card.description}</Text>
            {card.id === 'revenue' && <Sparkline data={stats?.revenueHistory ?? []} />}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIndicator: {
    width: 3,
    height: 16,
    backgroundColor: '#7C5CFF',
    borderRadius: 2,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1B1530',
  },
  viewDetailText: {
    fontSize: 13,
    color: '#7C5CFF',
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  card: {
    width: '48.2%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    minHeight: 128,
    shadowColor: '#1B1530',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(27, 21, 48, 0.03)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 12,
    color: '#A29DBA',
    fontWeight: '600',
    flex: 1,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1B1530',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 11,
    color: '#A29DBA',
    fontWeight: '500',
  },
  sparklineContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 32,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    overflow: 'hidden',
  },
  skeletonCard: {
    width: '48.2%',
    height: 128,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#F1F5FF',
  },
});

export default BusinessInsights;
