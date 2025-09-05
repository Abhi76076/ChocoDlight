import React, { useState, useEffect, useRef } from 'react';
import { Activity, Cpu, HardDrive, Wifi, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import apiService from '../services/api';

interface PerformanceMetric {
  id: string;
  metric_type: string;
  value: number;
  metadata?: any;
  created_at: string;
}

interface PerformanceMonitorProps {
  sessionId?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  sessionId,
  autoRefresh = true,
  refreshInterval = 5000
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMetrics, setCurrentMetrics] = useState({
    pageLoadTime: 0,
    memoryUsage: 0,
    cpuUsage: 0,
    networkRequests: 0
  });
  const [alerts, setAlerts] = useState<string[]>([]);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    loadMetrics();
    startPerformanceMonitoring();

    if (autoRefresh) {
      intervalRef.current = setInterval(loadMetrics, refreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      stopPerformanceMonitoring();
    };
  }, [sessionId, autoRefresh, refreshInterval]);

  const loadMetrics = async () => {
    try {
      const data = await apiService.getPerformanceMetrics('1 hour');
      setMetrics(data);
      analyzeMetrics(data);
    } catch (error) {
      console.error('Error loading performance metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const startPerformanceMonitoring = () => {
    // Monitor page load performance
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
      setCurrentMetrics(prev => ({ ...prev, pageLoadTime }));

      // Log to database
      logMetric('page_load', pageLoadTime, {
        navigationStart: timing.navigationStart,
        loadEventEnd: timing.loadEventEnd
      });
    }

    // Monitor memory usage
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const memoryUsage = memory.usedJSHeapSize / memory.totalJSHeapSize * 100;
      setCurrentMetrics(prev => ({ ...prev, memoryUsage }));

      logMetric('memory_usage', memoryUsage, {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize
      });
    }

    // Monitor network requests
    monitorNetworkRequests();
  };

  const stopPerformanceMonitoring = () => {
    // Clean up any observers or timers
  };

  const monitorNetworkRequests = () => {
    // Monitor fetch requests
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = Date.now();
      try {
        const response = await originalFetch(...args);
        const duration = Date.now() - startTime;

        logMetric('api_response', duration, {
          url: args[0],
          method: args[1]?.method || 'GET',
          status: response.status
        });

        setCurrentMetrics(prev => ({
          ...prev,
          networkRequests: prev.networkRequests + 1
        }));

        return response;
      } catch (error) {
        const duration = Date.now() - startTime;
        logMetric('api_error', duration, {
          url: args[0],
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        throw error;
      }
    };
  };

  const logMetric = async (type: string, value: number, metadata?: any) => {
    try {
      await apiService.logPerformanceMetric({
        metric_type: type,
        value,
        metadata,
        session_id: sessionId
      });
    } catch (error) {
      console.error('Error logging metric:', error);
    }
  };

  const analyzeMetrics = (data: PerformanceMetric[]) => {
    const newAlerts: string[] = [];

    // Analyze page load times
    const pageLoadMetrics = data.filter(m => m.metric_type === 'page_load');
    if (pageLoadMetrics.length > 0) {
      const avgLoadTime = pageLoadMetrics.reduce((sum, m) => sum + m.value, 0) / pageLoadMetrics.length;
      if (avgLoadTime > 3000) {
        newAlerts.push(`High page load time: ${avgLoadTime.toFixed(0)}ms`);
      }
    }

    // Analyze memory usage
    const memoryMetrics = data.filter(m => m.metric_type === 'memory_usage');
    if (memoryMetrics.length > 0) {
      const latestMemory = memoryMetrics[memoryMetrics.length - 1].value;
      if (latestMemory > 80) {
        newAlerts.push(`High memory usage: ${latestMemory.toFixed(1)}%`);
      }
    }

    // Analyze API response times
    const apiMetrics = data.filter(m => m.metric_type === 'api_response');
    if (apiMetrics.length > 0) {
      const slowRequests = apiMetrics.filter(m => m.value > 1000);
      if (slowRequests.length > 0) {
        newAlerts.push(`${slowRequests.length} slow API requests detected`);
      }
    }

    setAlerts(newAlerts);
  };

  const getMetricTrend = (type: string) => {
    const typeMetrics = metrics.filter(m => m.metric_type === type);
    if (typeMetrics.length < 2) return null;

    const recent = typeMetrics.slice(-5);
    const older = typeMetrics.slice(-10, -5);

    if (older.length === 0) return null;

    const recentAvg = recent.reduce((sum, m) => sum + m.value, 0) / recent.length;
    const olderAvg = older.reduce((sum, m) => sum + m.value, 0) / older.length;

    const change = ((recentAvg - olderAvg) / olderAvg) * 100;
    return change;
  };

  const MetricCard: React.FC<{
    title: string;
    value: string;
    icon: React.ReactNode;
    trend?: number | null;
    color?: string;
  }> = ({ title, value, icon, trend, color = 'blue' }) => (
    <div className={`bg-white p-4 rounded-lg shadow border-l-4 border-${color}-500`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`p-2 bg-${color}-100 rounded-lg mr-3`}>
            {icon}
          </div>
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </div>
        {trend !== undefined && trend !== null && (
          <div className={`flex items-center ${trend > 0 ? 'text-red-500' : 'text-green-500'}`}>
            {trend > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
            <span className="text-sm">{Math.abs(trend).toFixed(1)}%</span>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Performance Monitor
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={loadMetrics}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="p-4 bg-yellow-50 border-b">
          <div className="flex items-center mb-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2" />
            <span className="text-sm font-medium text-yellow-800">Performance Alerts</span>
          </div>
          <ul className="text-sm text-yellow-700 space-y-1">
            {alerts.map((alert, index) => (
              <li key={index}>• {alert}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Current Metrics */}
      <div className="p-6">
        <h4 className="text-md font-semibold mb-4">Current Metrics</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Page Load Time"
            value={`${currentMetrics.pageLoadTime}ms`}
            icon={<Activity className="w-5 h-5 text-blue-600" />}
            trend={getMetricTrend('page_load')}
            color="blue"
          />
          <MetricCard
            title="Memory Usage"
            value={`${currentMetrics.memoryUsage.toFixed(1)}%`}
            icon={<HardDrive className="w-5 h-5 text-green-600" />}
            trend={getMetricTrend('memory_usage')}
            color="green"
          />
          <MetricCard
            title="Network Requests"
            value={currentMetrics.networkRequests.toString()}
            icon={<Wifi className="w-5 h-5 text-purple-600" />}
            color="purple"
          />
          <MetricCard
            title="Active Sessions"
            value={metrics.length > 0 ? '1' : '0'}
            icon={<Cpu className="w-5 h-5 text-orange-600" />}
            color="orange"
          />
        </div>
      </div>

      {/* Metrics History */}
      <div className="p-6 border-t">
        <h4 className="text-md font-semibold mb-4">Recent Metrics</h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {metrics.slice(-10).reverse().map((metric) => (
            <div key={metric.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center">
                <span className="text-sm font-medium capitalize">
                  {metric.metric_type.replace('_', ' ')}
                </span>
                <span className="ml-2 text-xs text-gray-500">
                  {new Date(metric.created_at).toLocaleTimeString()}
                </span>
              </div>
              <div className="text-sm font-semibold">
                {metric.metric_type.includes('time') || metric.metric_type.includes('response')
                  ? `${metric.value.toFixed(0)}ms`
                  : metric.metric_type.includes('memory')
                  ? `${metric.value.toFixed(1)}%`
                  : metric.value.toFixed(2)
                }
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
