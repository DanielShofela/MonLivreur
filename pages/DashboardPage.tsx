import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Order, NewOrder } from '../types';
import { Button, Input, Card, CardHeader, CardTitle, CardContent, Icon, cn } from '../components/ui';
import { motion, AnimatePresence } from 'framer-motion';
import DeliveryMap from '../components/DeliveryMap';

// #region --- Sub-Components ---

// Header Component
const Header: React.FC = () => {
    return (
      <header className={'fixed top-0 left-0 right-0 z-40 bg-card/80 backdrop-blur-md shadow-sm'}>
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center space-x-3">
            <Icon name="Bike" className="w-7 h-7 text-primary" />
            <h1 className="text-xl font-bold text-primary">QuickDeliver</h1>
          </div>
           <div className="flex items-center space-x-2">
            <button className="p-2 rounded-lg hover:bg-secondary relative">
                <Icon name="Bell" className="w-6 h-6" />
                <span className="absolute top-1.5 right-1.5 w-3 h-3 bg-red-500 rounded-full border-2 border-card"></span>
            </button>
          </div>
        </div>
      </header>
    );
};

// Order History Component
const OrderHistory: React.FC<{ orders: Order[], onRefresh: () => void }> = ({ orders, onRefresh }) => {
    const statusLabels: Record<string, string> = {
        pending: 'Order Placed',
        accepted: 'Rider Assigned',
        in_progress: 'In Transit',
        completed: 'Delivered',
        cancelled: 'Cancelled'
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Order History</h2>
            {orders.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    <Icon name="Package" className="w-12 h-12 mx-auto mb-4" />
                    <p>No past orders yet</p>
                </div>
            ) : (
                orders.map((order) => (
                    <motion.div key={order.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <Card className="p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">Order #{order.id.slice(0, 8)}</span>
                                <span className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="text-sm text-muted-foreground mb-2">{order.pickup} → {order.destination}</div>
                            <div className="flex items-center justify-between">
                                <span className={cn('px-2 py-1 rounded-full text-xs font-medium', order.status === 'completed' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500')}>{order.status}</span>
                                <span className="font-semibold">${order.price.toFixed(2)}</span>
                            </div>
                        </Card>
                    </motion.div>
                ))
            )}
        </div>
    );
};

// Profile Page Component
const ProfilePage: React.FC = () => {
    const { user, signOut } = useAuth();

    if (!user) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <p>Loading user profile...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Profile</h2>
            <Card className="p-6 shadow-xl">
                <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                            <Icon name="User" className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold">{user.email?.split('@')[0]}</h3>
                            <p className="text-muted-foreground">{user.email}</p>
                        </div>
                    </div>
                    <div className="pt-4 border-t">
                        <Button onClick={signOut} variant="secondary" className="w-full">
                            Sign Out
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

// #endregion

// Main Dashboard Component
const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('order');
  const [orders, setOrders] = useState<Order[]>([]);
  
  const menuItems = [
    { id: 'order', label: 'New Order', icon: 'Plus' },
    { id: 'tracking', label: 'Track', icon: 'Truck' },
    { id: 'history', label: 'History', icon: 'History' },
    { id: 'profile', label: 'Profile', icon: 'User' },
  ];

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('commandes')
      .select('*')
      .eq('client_id', user.id)
      .order('created_at', { ascending: false });
    setOrders(data || []);
  }, [user]);

  useEffect(() => {
    if (user) {
        fetchOrders();
        const channel = supabase.channel('public:commandes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'commandes' }, (payload) => {
                console.log('Change received!', payload)
                fetchOrders();
            })
            .subscribe();
        return () => { supabase.removeChannel(channel) };
    }
  }, [user, fetchOrders]);

  const renderContent = () => {
    switch (activeTab) {
      case 'order': return <DeliveryMap />;
      // case 'tracking': return <OrderTracker />;
      case 'history': return <OrderHistory orders={orders} onRefresh={fetchOrders} />;
      case 'profile': return <ProfilePage />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-secondary">
      <Header />
      
      <main className="pt-20 pb-24 px-4 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
            >
                {renderContent()}
            </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t z-40">
        <div className="flex h-16">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn('flex-1 flex flex-col items-center justify-center transition-colors', activeTab === item.id ? 'text-primary' : 'text-muted-foreground hover:text-primary')}
            >
              <Icon name={item.icon as any} className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;