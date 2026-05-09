import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TodoItem from '../TodoItem';
import { SellerTodoStats } from '../../../../lib/sellerApi';

type TodoRouteTarget = 'unpaid' | 'to-ship' | 'cancelled' | 'returns' | 'out-of-stock';

interface TodoListProps {
  todoStats: SellerTodoStats | undefined;
  onItemPress?: (target: TodoRouteTarget) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todoStats, onItemPress }) => {
  const todoData = todoStats ? [
    {
      id: '0',
      title: 'Đơn cần xác nhận',
      description: 'Cần xác nhận ngay',
      count: todoStats.ordersToConfirm,
      routeTarget: 'unpaid' as const,
      icon: 'clipboard-outline' as const,
      iconBgColor: '#ef476f',
      countColor: '#ef476f',
    },
    {
      id: '1',
      title: 'Đơn cần giao',
      description: 'Xử lý trong 24h',
      count: todoStats.ordersToShip,
      routeTarget: 'to-ship' as const,
      icon: 'cube-outline' as const,
      iconBgColor: '#3498db',
      countColor: '#3498db',
    },
    {
      id: '2',
      title: 'Đơn bị huỷ',
      description: 'Cần xem xét',
      count: todoStats.cancelledOrders,
      routeTarget: 'cancelled' as const,
      icon: 'close-circle-outline' as const,
      iconBgColor: '#e74c3c',
      countColor: '#e74c3c',
    },
    {
      id: '3',
      title: 'Yêu cầu trả hàng',
      description: 'Cần xác minh',
      count: todoStats.returnRequests,
      routeTarget: 'returns' as const,
      icon: 'return-up-back-outline' as const,
      iconBgColor: '#f39c12',
      countColor: '#2c3e50',
    },
    {
      id: '4',
      title: 'Hết hàng',
      description: 'Nhập thêm ngay',
      count: todoStats.outOfStockProducts,
      routeTarget: 'out-of-stock' as const,
      icon: 'alert-circle-outline' as const,
      iconBgColor: '#95a5a6',
      countColor: '#2c3e50',
    },
  ] : [];
  const hasPendingTasks = todoData.some((item) => item.count > 0);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionIndicator, { backgroundColor: '#3498db' }]} />
        <Text style={styles.sectionTitle}>Danh sách việc cần làm</Text>
      </View>
      
      <View style={styles.todoContainer}>
        {!hasPendingTasks ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Tuyệt vời! Không có việc cần xử lý</Text>
            <Text style={styles.emptyText}>Khi có đơn mới hoặc cần cảnh báo, mục này sẽ cập nhật ngay.</Text>
          </View>
        ) : null}
        {todoData
          .filter((item) => item.count > 0)
          .map((item) => (
          <TodoItem 
            key={item.id}
            title={item.title}
            description={item.description}
            count={item.count}
            icon={item.icon}
            iconBgColor={item.iconBgColor}
            countColor={item.countColor}
            onPress={() => onItemPress?.(item.routeTarget)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIndicator: {
    width: 3,
    height: 16,
    borderRadius: 2,
    marginRight: 10,
    backgroundColor: '#7C5CFF',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1B1530',
  },
  todoContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#1B1530',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(27, 21, 48, 0.03)',
  },
  emptyState: {
    padding: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1B1530',
  },
  emptyText: {
    marginTop: 6,
    fontSize: 13,
    color: '#A29DBA',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default TodoList;
