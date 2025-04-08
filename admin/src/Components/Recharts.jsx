import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  format, 
  parseISO, 
  startOfMonth, 
  endOfMonth, 
  eachMonthOfInterval, 
  subMonths,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  subDays,
  subWeeks,
  isWithinInterval 
} from "date-fns";
import {
  BarChart, Bar, PieChart, Pie, LineChart, Line,
  Tooltip, XAxis, YAxis, CartesianGrid, Legend,
  ResponsiveContainer, Cell, AreaChart, Area
} from "recharts";
import { 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  Activity,
  BarChart2,
  Shield,
  Calendar,
  TrendingDown,
  Users,
  Filter,
  ChevronDown,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  BarChart as BarChartIcon,
  AreaChart as AreaChartIcon,
  Search,
  X,
  Download,
  RefreshCw,
  Sun,
  Moon,
  Coffee,
  Sunset,
  Zap,
  List,
  CheckCircle,
  AlertCircle,
  Menu
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useApi } from "../context/ApiContext";

const statusIcons = {
  'Pending': <Clock className="w-4 h-4 text-[#FF9F0A]" />,
  'Ongoing': <AlertCircle className="w-4 h-4 text-[#0A84FF]" />,
  'Resolved': <CheckCircle className="w-4 h-4 text-[#30D158]" />
};

const statusColors = {
  'Pending': 'bg-[#FF9F0A]/10 text-[#FF9F0A] border-[#FF9F0A]/20',
  'Ongoing': 'bg-[#0A84FF]/10 text-[#0A84FF] border-[#0A84FF]/20',
  'Resolved': 'bg-[#30D158]/10 text-[#30D158] border-[#30D158]/20'
};

const AnalyticsDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [selectedChartType, setSelectedChartType] = useState("line");
  const [selectedTimeRange, setSelectedTimeRange] = useState("monthly");
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { API_URL } = useApi();
  const [filters, setFilters] = useState({
    status: "",
    severity: "",
    priority: "",
    type: "",
    dateRange: "all",
    search: "",
    assignee: "",
    reporter: "",
    team: "",
    environment: "",
    resolution: ""
  });

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    axios
      .get(`${API_URL}/reports`)
      .then((response) => {
        const enrichedData = response.data.map(item => ({
          ...item,
          date: new Date(item.createdAt || new Date()).toISOString(),
        }));
        setData(enrichedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching reports:", error);
        setLoading(false);
      });
  };

  const getTimeOfDay = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    
    if (hours >= 6 && hours < 12) return 'morning';
    if (hours >= 12 && hours < 17) return 'afternoon';
    if (hours >= 17 && hours < 21) return 'evening';
    return 'night';
  };

  const colors = {
    primary: "#0A84FF",
    success: "#30D158",
    warning: "#FF9F0A",
    danger: "#FF453A",
    info: "#5E5CE6",
    neutral: "#636366",
    morning: "#FFD60A",
    afternoon: "#FF9F0A",
    evening: "#FF375F",
    night: "#5E5CE6"
  };

  const chartColors = [
    "#0A84FF",
    "#30D158",
    "#FF9F0A",
    "#FF453A",
    "#5E5CE6",
    "#FFD60A",
    "#64D2FF",
    "#66D4CF",
    "#BF5AF2",
    "#FF375F"
  ];

  const getMonthlyData = () => {
    const months = 6;
    const lastMonths = eachMonthOfInterval({
      start: subMonths(new Date(), months - 1),
      end: new Date()
    });

    return lastMonths.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      const monthData = getFilteredData().filter(item => {
        const itemDate = parseISO(item.date);
        return itemDate >= monthStart && itemDate <= monthEnd;
      });

      return {
        month: format(month, 'MMM yyyy'),
        count: monthData.length,
        critical: monthData.filter(item => item.severity === 'Critical').length,
        resolved: monthData.filter(item => item.status === 'Resolved').length,
        highPriority: monthData.filter(item => item.priority === 'High' || item.priority === 'Urgent').length,
      };
    });
  };

  const getDailyData = () => {
    const days = 7;
    const dailyData = [];
    
    for (let i = 0; i < days; i++) {
      const day = subDays(new Date(), i);
      const dayStart = startOfDay(day);
      const dayEnd = endOfDay(day);
      
      const dayData = getFilteredData().filter(item => {
        const itemDate = parseISO(item.date);
        return itemDate >= dayStart && itemDate <= dayEnd;
      });

      dailyData.unshift({
        date: format(day, 'EEE, MMM d'),
        count: dayData.length,
        critical: dayData.filter(item => item.severity === 'Critical').length,
        resolved: dayData.filter(item => item.status === 'Resolved').length,
      });
    }
    
    return dailyData;
  };

  const getWeeklyData = () => {
    const weeks = 6;
    const weeklyData = [];
    
    for (let i = 0; i < weeks; i++) {
      const weekStart = startOfWeek(subWeeks(new Date(), i));
      const weekEnd = endOfWeek(weekStart);
      
      const weekData = getFilteredData().filter(item => {
        const itemDate = parseISO(item.date);
        return itemDate >= weekStart && itemDate <= weekEnd;
      });

      weeklyData.unshift({
        week: `Week ${format(weekStart, 'w')} (${format(weekStart, 'MMM d')})`,
        count: weekData.length,
        critical: weekData.filter(item => item.severity === 'Critical').length,
        resolved: weekData.filter(item => item.status === 'Resolved').length,
      });
    }
    
    return weeklyData;
  };

  const getDetailedMetricData = () => {
    if (!selectedMonth || !selectedMetric) return [];

    const monthDate = parseISO(selectedMonth);
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);

    const filteredData = getFilteredData().filter(item => {
      const itemDate = parseISO(item.date);
      return itemDate >= monthStart && itemDate <= monthEnd;
    });

    switch (selectedMetric) {
      case 'severity':
        return getCounts('severity', filteredData);
      case 'priority':
        return getCounts('priority', filteredData);
      case 'type':
        return getCounts('type', filteredData);
      case 'status':
        return getCounts('status', filteredData);
      case 'environment':
        return getCounts('environment', filteredData);
      case 'team':
        return getCounts('team', filteredData);
      case 'time':
        return getTimeOfDayCounts(filteredData);
      default:
        return [];
    }
  };

  const getTimeOfDayCounts = (sourceData = data) => {
    const counts = sourceData.reduce((acc, report) => {
      const timeOfDay = getTimeOfDay(report.date);
      acc[timeOfDay] = (acc[timeOfDay] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(counts).map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value,
      color: colors[key]
    }));
  };

  const getCounts = (field, sourceData = data) => {
    const counts = sourceData.reduce((acc, report) => {
      if (report[field]) {
        acc[report[field]] = (acc[report[field]] || 0) + 1;
      }
      return acc;
    }, {});
    return Object.entries(counts).map(([key, value], index) => ({
      name: key,
      value,
      color: chartColors[index % chartColors.length],
    }));
  };

  const getFilteredData = () => {
    return data.filter(item => {
      const matchesStatus = !filters.status || item.status === filters.status;
      const matchesSeverity = !filters.severity || item.severity === filters.severity;
      const matchesPriority = !filters.priority || item.priority === filters.priority;
      const matchesType = !filters.type || item.type === filters.type;
      const matchesAssignee = !filters.assignee || item.assignee?.includes(filters.assignee);
      const matchesReporter = !filters.reporter || item.reporter?.includes(filters.reporter);
      const matchesTeam = !filters.team || item.team === filters.team;
      const matchesEnvironment = !filters.environment || item.environment === filters.environment;
      const matchesResolution = !filters.resolution || item.resolution === filters.resolution;
      const matchesSearch = !filters.search || 
        item.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.id?.toString().includes(filters.search);

      let matchesDateRange = true;
      if (filters.dateRange !== 'all') {
        const itemDate = parseISO(item.date);
        const now = new Date();
        
        switch (filters.dateRange) {
          case 'today':
            matchesDateRange = isWithinInterval(itemDate, {
              start: startOfDay(now),
              end: endOfDay(now)
            });
            break;
          case 'yesterday':
            matchesDateRange = isWithinInterval(itemDate, {
              start: startOfDay(subDays(now, 1)),
              end: endOfDay(subDays(now, 1))
            });
            break;
          case 'this-week':
            matchesDateRange = isWithinInterval(itemDate, {
              start: startOfWeek(now),
              end: endOfWeek(now)
            });
            break;
          case 'last-week':
            matchesDateRange = isWithinInterval(itemDate, {
              start: startOfWeek(subWeeks(now, 1)),
              end: endOfWeek(subWeeks(now, 1))
            });
            break;
          case 'this-month':
            matchesDateRange = isWithinInterval(itemDate, {
              start: startOfMonth(now),
              end: endOfMonth(now)
            });
            break;
          case 'last-month':
            matchesDateRange = isWithinInterval(itemDate, {
              start: startOfMonth(subMonths(now, 1)),
              end: endOfMonth(subMonths(now, 1))
            });
            break;
          case 'last-7-days':
            matchesDateRange = isWithinInterval(itemDate, {
              start: subDays(now, 7),
              end: now
            });
            break;
          case 'last-30-days':
            matchesDateRange = isWithinInterval(itemDate, {
              start: subDays(now, 30),
              end: now
            });
            break;
          case 'last-90-days':
            matchesDateRange = isWithinInterval(itemDate, {
              start: subDays(now, 90),
              end: now
            });
            break;
        }
      }

      const matchesTimeOfDay = selectedTimeOfDay === 'all' || 
                             getTimeOfDay(item.date) === selectedTimeOfDay;

      return matchesStatus && matchesSeverity && matchesPriority && 
             matchesType && matchesSearch && matchesDateRange && 
             matchesAssignee && matchesReporter && matchesTeam &&
             matchesEnvironment && matchesResolution && matchesTimeOfDay;
    });
  };

  const filterOptions = {
    status: ['Open', 'In Progress', 'Resolved', 'Closed', 'Reopened', 'Pending'],
    severity: ['Low', 'Medium', 'High', 'Critical', 'Blocker'],
    priority: ['Low', 'Medium', 'High', 'Urgent', 'Immediate'],
    type: ['Bug', 'Feature', 'Enhancement', 'Support', 'Task', 'Documentation'],
    environment: ['Development', 'Staging', 'Production', 'Test', 'UAT'],
    resolution: ['Fixed', 'Won\'t Fix', 'Duplicate', 'Cannot Reproduce', 'Done', 'Implemented'],
    dateRange: [
      { value: 'all', label: 'All Time' },
      { value: 'today', label: 'Today' },
      { value: 'yesterday', label: 'Yesterday' },
      { value: 'this-week', label: 'This Week' },
      { value: 'last-week', label: 'Last Week' },
      { value: 'this-month', label: 'This Month' },
      { value: 'last-month', label: 'Last Month' },
      { value: 'last-7-days', label: 'Last 7 Days' },
      { value: 'last-30-days', label: 'Last 30 Days' },
      { value: 'last-90-days', label: 'Last 90 Days' }
    ]
  };

  const timeOfDayOptions = [
    { value: 'all', label: 'All Times', icon: <Clock size={16} /> },
    { value: 'morning', label: 'Morning (6am-12pm)', icon: <Sun size={16} /> },
    { value: 'afternoon', label: 'Afternoon (12pm-5pm)', icon: <Coffee size={16} /> },
    { value: 'evening', label: 'Evening (5pm-9pm)', icon: <Sunset size={16} /> },
    { value: 'night', label: 'Night (9pm-6am)', icon: <Moon size={16} /> }
  ];

  const FilterSelect = ({ label, options, value, onChange, name }) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-[#98989d]">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className="p-2 rounded-lg bg-[#2c2c2e] border border-[#2c2c2e] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] text-white"
      >
        <option value="">All</option>
        {options.map((option, index) => (
          <option key={index} value={typeof option === 'string' ? option : option.value}>
            {typeof option === 'string' ? option : option.label}
          </option>
        ))}
      </select>
    </div>
  );

  const TimeOfDaySelector = ({ value, onChange }) => (
    <div className="flex gap-2 p-2 bg-[#2c2c2e] rounded-lg">
      {timeOfDayOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`p-2 rounded-md transition-all flex items-center gap-1 ${
            value === option.value ? "bg-[#0A84FF] text-white" : "hover:bg-[#1c1c1e] text-[#98989d]"
          }`}
          title={option.label}
        >
          {option.icon}
          <span className="hidden md:inline">{option.label.split(' ')[0]}</span>
        </button>
      ))}
    </div>
  );

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: "",
      severity: "",
      priority: "",
      type: "",
      dateRange: "all",
      search: "",
      assignee: "",
      reporter: "",
      team: "",
      environment: "",
      resolution: ""
    });
    setSelectedTimeOfDay("all");
  };

  const ChartTypeSelector = ({ onChange, value }) => (
    <div className="flex gap-2 p-2 bg-[#2c2c2e] rounded-lg">
      <button
        onClick={() => onChange("line")}
        className={`p-2 rounded-md transition-all ${
          value === "line" ? "bg-[#0A84FF] text-white" : "hover:bg-[#1c1c1e] text-[#98989d]"
        }`}
      >
        <LineChartIcon size={20} />
      </button>
      <button
        onClick={() => onChange("bar")}
        className={`p-2 rounded-md transition-all ${
          value === "bar" ? "bg-[#0A84FF] text-white" : "hover:bg-[#1c1c1e] text-[#98989d]"
        }`}
      >
        <BarChartIcon size={20} />
      </button>
      <button
        onClick={() => onChange("pie")}
        className={`p-2 rounded-md transition-all ${
          value === "pie" ? "bg-[#0A84FF] text-white" : "hover:bg-[#1c1c1e] text-[#98989d]"
        }`}
      >
        <PieChartIcon size={20} />
      </button>
      <button
        onClick={() => onChange("area")}
        className={`p-2 rounded-md transition-all ${
          value === "area" ? "bg-[#0A84FF] text-white" : "hover:bg-[#1c1c1e] text-[#98989d]"
        }`}
      >
        <AreaChartIcon size={20} />
      </button>
    </div>
  );

  const TimeRangeSelector = ({ value, onChange }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="p-2 rounded-lg bg-[#2c2c2e] border border-[#2c2c2e] text-white focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
    >
      <option value="daily">Daily</option>
      <option value="weekly">Weekly</option>
      <option value="monthly">Monthly</option>
    </select>
  );

  const StatCard = ({ title, value, icon: Icon, color, trend, index, onClick }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="relative backdrop-blur-xl bg-[#1c1c1e]/80 p-4 rounded-2xl shadow-lg border border-[#2c2c2e] cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-[#98989d] text-sm">{title}</p>
          <p className="text-2xl font-bold mt-2 text-white">
            {value}
          </p>
          {trend !== undefined && (
            <p className={`text-sm mt-2 flex items-center gap-1 ${
              trend >= 0 ? "text-[#30D158]" : "text-[#FF453A]"
            }`}>
              {trend >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              {Math.abs(trend)}%
            </p>
          )}
        </div>
        <div 
          className="p-3 rounded-xl" 
          style={{ backgroundColor: `${colors[color]}10` }}
        >
          <Icon style={{ color: colors[color] }} className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );

  const renderChart = (data, type) => {
    const xAxisKey = selectedTimeRange === 'daily' ? 'date' : 
                   selectedTimeRange === 'weekly' ? 'week' : 
                   'month';

    switch (type) {
      case "line":
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2c2c2e" />
            <XAxis dataKey={xAxisKey} stroke="#98989d" />
            <YAxis stroke="#98989d" />
            <Tooltip 
              contentStyle={{
                background: '#1c1c1e',
                borderRadius: '8px',
                border: '1px solid #2c2c2e',
                color: '#ffffff'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke={colors.primary} 
              name="Total Reports" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="critical" 
              stroke={colors.danger} 
              name="Critical" 
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="resolved" 
              stroke={colors.success} 
              name="Resolved" 
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        );
      case "bar":
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2c2c2e" />
            <XAxis dataKey={xAxisKey} stroke="#98989d" />
            <YAxis stroke="#98989d" />
            <Tooltip 
              contentStyle={{
                background: '#1c1c1e',
                borderRadius: '8px',
                border: '1px solid #2c2c2e',
                color: '#ffffff'
              }}
            />
            <Legend />
            <Bar 
              dataKey="count" 
              fill={colors.primary} 
              name="Total Reports" 
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="critical" 
              fill={colors.danger} 
              name="Critical" 
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="resolved" 
              fill={colors.success} 
              name="Resolved" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );
      case "pie":
        return (
          <PieChart>
            <Pie
              data={getCounts('type')}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {getCounts('type').map((entry, index) => (
                <Cell key={index} fill={chartColors[index % chartColors.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                background: '#1c1c1e',
                borderRadius: '8px',
                border: '1px solid #2c2c2e',
                color: '#ffffff'
              }}
            />
            <Legend />
          </PieChart>
        );
      case "area":
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2c2c2e" />
            <XAxis dataKey={xAxisKey} stroke="#98989d" />
            <YAxis stroke="#98989d" />
            <Tooltip 
              contentStyle={{
                background: '#1c1c1e',
                borderRadius: '8px',
                border: '1px solid #2c2c2e',
                color: '#ffffff'
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="count"
              stroke={colors.primary}
              fill={colors.primary}
              fillOpacity={0.2}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="critical"
              stroke={colors.danger}
              fill={colors.danger}
              fillOpacity={0.2}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="resolved"
              stroke={colors.success}
              fill={colors.success}
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </AreaChart>
        );
      default:
        return null;
    }
  };

  const DetailedView = () => (
    <AnimatePresence>
      {showDetailedView && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-[#1c1c1e] rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-auto border border-[#2c2c2e]"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">
                {selectedMetric?.charAt(0).toUpperCase() + selectedMetric?.slice(1)} Analysis
              </h3>
              <button
                onClick={() => setShowDetailedView(false)}
                className="text-[#98989d] hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                {selectedMetric === 'trend' ? (
                  <AreaChart data={getMonthlyData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2c2c2e" />
                    <XAxis dataKey="month" stroke="#98989d" />
                    <YAxis stroke="#98989d" />
                    <Tooltip 
                      contentStyle={{
                        background: '#1c1c1e',
                        borderRadius: '8px',
                        border: '1px solid #2c2c2e',
                        color: '#ffffff'
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke={colors.primary}
                      fill={colors.primary}
                      fillOpacity={0.1}
                    />
                    <Area
                      type="monotone"
                      dataKey="critical"
                      stroke={colors.danger}
                      fill={colors.danger}
                      fillOpacity={0.1}
                    />
                    <Area
                      type="monotone"
                      dataKey="resolved"
                      stroke={colors.success}
                      fill={colors.success}
                      fillOpacity={0.1}
                    />
                  </AreaChart>
                ) : (
                  <PieChart>
                    <Pie
                      data={getDetailedMetricData()}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={150}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {getDetailedMetricData().map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        background: '#1c1c1e',
                        borderRadius: '8px',
                        border: '1px solid #2c2c2e',
                        color: '#ffffff'
                      }}
                    />
                    <Legend />
                  </PieChart>
                )}
              </ResponsiveContainer>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const FiltersSection = () => (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="mb-6 overflow-hidden"
    >
      <div className="bg-[#1c1c1e]/80 backdrop-blur-xl p-6 rounded-xl shadow-lg border border-[#2c2c2e]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Filters</h3>
          <div className="flex gap-2">
            <button
              onClick={clearFilters}
              className="text-sm text-[#98989d] hover:text-white flex items-center gap-1"
            >
              <X size={16} />
              Clear Filters
            </button>
            <button
              onClick={fetchData}
              className="text-sm text-[#98989d] hover:text-white flex items-center gap-1"
            >
              <RefreshCw size={16} />
              Refresh Data
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="col-span-1 md:col-span-2 lg:col-span-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#98989d]" size={20} />
              <input
                type="text"
                placeholder="Search by title, description or ID..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#2c2c2e] border border-[#2c2c2e] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] text-white"
              />
            </div>
          </div>
          
          <FilterSelect
            label="Status"
            options={filterOptions.status}
            value={filters.status}
            onChange={handleFilterChange}
            name="status"
          />
          
          <FilterSelect
            label="Severity"
            options={filterOptions.severity}
            value={filters.severity}
            onChange={handleFilterChange}
            name="severity"
          />
          
          <FilterSelect
            label="Priority"
            options={filterOptions.priority}
            value={filters.priority}
            onChange={handleFilterChange}
            name="priority"
          />
          
          <FilterSelect
            label="Type"
            options={filterOptions.type}
            value={filters.type}
            onChange={handleFilterChange}
            name="type"
          />
          
          <FilterSelect
            label="Date Range"
            options={filterOptions.dateRange}
            value={filters.dateRange}
            onChange={handleFilterChange}
            name="dateRange"
          />
          
          <div className="flex flex-col gap-1">
            <label className="text-sm text-[#98989d]">Assignee</label>
            <input
              type="text"
              placeholder="Filter by assignee"
              value={filters.assignee}
              onChange={(e) => handleFilterChange('assignee', e.target.value)}
              className="p-2 rounded-lg bg-[#2c2c2e] border border-[#2c2c2e] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] text-white"
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-sm text-[#98989d]">Reporter</label>
            <input
              type="text"
              placeholder="Filter by reporter"
              value={filters.reporter}
              onChange={(e) => handleFilterChange('reporter', e.target.value)}
              className="p-2 rounded-lg bg-[#2c2c2e] border border-[#2c2c2e] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] text-white"
            />
          </div>
          
          <FilterSelect
            label="Environment"
            options={filterOptions.environment}
            value={filters.environment}
            onChange={handleFilterChange}
            name="environment"
          />
          
          <FilterSelect
            label="Resolution"
            options={filterOptions.resolution}
            value={filters.resolution}
            onChange={handleFilterChange}
            name="resolution"
          />
        </div>

        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-[#98989d]">
            Showing {getFilteredData().length} of {data.length} reports
          </p>
          <button 
            className="flex items-center gap-2 text-sm bg-[#0A84FF] text-white px-4 py-2 rounded-lg hover:bg-[#0A70D9] transition-colors"
            onClick={() => {
              console.log("Export data");
            }}
          >
            <Download size={16} />
            Export Data
          </button>
        </div>
      </div>
    </motion.div>
  );

  const ActionItem = ({ icon, title, value, color, onClick }) => (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="flex items-center gap-4 p-4 bg-[#1c1c1e]/80 rounded-xl cursor-pointer border border-[#2c2c2e]"
      onClick={onClick}
    >
      <div className={`p-3 rounded-lg bg-[${colors[color]}/10]`}>
        {React.cloneElement(icon, { className: `text-${colors[color]} w-5 h-5` })}
      </div>
      <div>
        <p className="text-sm text-[#98989d]">{title}</p>
        <p className="text-lg font-semibold text-white">{value}</p>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#1c1c1e]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#0A84FF] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#1c1c1e] p-4 sm:p-6"
    >
      <DetailedView />
      
      {/* Mobile Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Analytics Dashboard
            </h1>
            <p className="text-[#98989d] mt-1">
              Comprehensive analysis and insights
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-[#2c2c2e] hover:bg-[#0A84FF]/20"
            >
              <Menu size={20} className="text-white" />
            </button>
            <button
              onClick={fetchData}
              className="hidden md:flex p-2 rounded-lg bg-[#2c2c2e] hover:bg-[#0A84FF]/20 items-center gap-2"
            >
              <RefreshCw size={20} className="text-white" />
              <span className="text-white">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-0 bg-[#1c1c1e] z-50 p-4"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Menu</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-[#2c2c2e]"
              >
                <X size={20} className="text-white" />
              </button>
            </div>
            <div className="space-y-4">
              <button
                onClick={() => {
                  setShowFilters(!showFilters);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full p-4 text-left rounded-lg hover:bg-[#2c2c2e] flex items-center gap-2"
              >
                <Filter size={20} className="text-white" />
                <span className="text-white">Filters</span>
              </button>
              <button
                onClick={() => {
                  fetchData();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full p-4 text-left rounded-lg hover:bg-[#2c2c2e] flex items-center gap-2"
              >
                <RefreshCw size={20} className="text-white" />
                <span className="text-white">Refresh Data</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <StatCard
          title="Total Reports"
          value={getFilteredData().length}
          icon={BarChart2}
          color="primary"
          trend={12}
          index={0}
          onClick={() => {
            setSelectedMetric('trend');
            setShowDetailedView(true);
          }}
        />
        <StatCard
          title="Pending"
          value={getFilteredData().filter(item => item.status === "Pending").length}
          icon={AlertTriangle}
          color="danger"
          trend={8}
          index={1}
          onClick={() => {
            setSelectedMetric('severity');
            setShowDetailedView(true);
          }}
        />
        <StatCard
          title="Ongoing"
          value={getFilteredData().filter(item => item.status === "Ongoing").length}
          icon={Activity}
          color="warning"
          trend={5}
          index={3}
          onClick={() => {
            setSelectedMetric('priority');
            setShowDetailedView(true);
          }}
        />
        <StatCard
          title="Resolution Rate"
          value={`${((getFilteredData().filter(item => item.status === "Resolved").length / getFilteredData().length) * 100).toFixed(0)}%`}
          icon={TrendingUp}
          color="success"
          trend={15}
          index={2}
          onClick={() => {
            setSelectedMetric('status');
            setShowDetailedView(true);
          }}
        />
      </div>

      {/* Chart Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
          <ChartTypeSelector value={selectedChartType} onChange={setSelectedChartType} />
          <TimeOfDaySelector value={selectedTimeOfDay} onChange={setSelectedTimeOfDay} />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full sm:w-auto p-2 rounded-lg bg-[#2c2c2e] hover:bg-[#0A84FF]/20 transition-all flex items-center justify-center gap-2"
        >
          <Filter size={20} className="text-white" />
          <span className="text-white">{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
        </button>
      </div>

      {/* Filters Section */}
      <AnimatePresence>
        {showFilters && <FiltersSection />}
      </AnimatePresence>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1c1c1e]/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg h-full border border-[#2c2c2e]"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-white">
                <Calendar className="text-[#0A84FF]" />
                {selectedTimeRange === 'daily' ? 'Daily' : 
                 selectedTimeRange === 'weekly' ? 'Weekly' : 'Monthly'} Trend
              </h3>
              <div className="flex gap-2">
                <button 
                  className={`p-2 rounded-lg transition-colors ${
                    selectedTimeRange === 'daily' ? 'bg-[#0A84FF] text-white' : 'bg-[#2c2c2e] hover:bg-[#0A84FF]/20 text-white'
                  }`}
                  onClick={() => setSelectedTimeRange('daily')}
                >
                  Day
                </button>
                <button 
                  className={`p-2 rounded-lg transition-colors ${
                    selectedTimeRange === 'weekly' ? 'bg-[#0A84FF] text-white' : 'bg-[#2c2c2e] hover:bg-[#0A84FF]/20 text-white'
                  }`}
                  onClick={() => setSelectedTimeRange('weekly')}
                >
                  Week
                </button>
                <button 
                  className={`p-2 rounded-lg transition-colors ${
                    selectedTimeRange === 'monthly' ? 'bg-[#0A84FF] text-white' : 'bg-[#2c2c2e] hover:bg-[#0A84FF]/20 text-white'
                  }`}
                  onClick={() => setSelectedTimeRange('monthly')}
                >
                  Month
                </button>
              </div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                {renderChart(
                  selectedTimeRange === 'daily' ? getDailyData() : 
                  selectedTimeRange === 'weekly' ? getWeeklyData() : 
                  getMonthlyData(), 
                  selectedChartType
                )}
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1c1c1e]/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg h-full border border-[#2c2c2e]"
          >
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-white">
              <Zap className="text-[#0A84FF]" />
              Overall Actions
            </h3>
            <div className="grid gap-4">
              <ActionItem
                icon={<List size={20} />}
                title="Total Reports"
                value={getFilteredData().length}
                color="primary"
                onClick={() => {
                  setSelectedMetric('trend');
                  setShowDetailedView(true);
                }}
              />
              <ActionItem
                icon={<CheckCircle size={20} />}
                title="Resolved"
                value={getFilteredData().filter(item => item.status === 'Resolved').length}
                color="success"
                onClick={() => {
                  setSelectedMetric('status');
                  setShowDetailedView(true);
                }}
              />
              <ActionItem
                icon={<AlertCircle size={20} />}
                title="Critical Issues"
                value={getFilteredData().filter(item => item.severity === 'Critical').length}
                color="danger"
                onClick={() => {
                  setSelectedMetric('severity');
                  setShowDetailedView(true);
                }}
              />
              <ActionItem
                icon={<Activity size={20} />}
                title="High Priority"
                value={getFilteredData().filter(item => item.priority === 'High' || item.priority === 'Urgent').length}
                color="warning"
                onClick={() => {
                  setSelectedMetric('priority');
                  setShowDetailedView(true);
                }}
              />
            </div>

            <h3 className="text-lg font-semibold mt-8 mb-4 flex items-center gap-2 text-white">
              <Clock className="text-[#0A84FF]" />
              Time Distribution
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {timeOfDayOptions.filter(opt => opt.value !== 'all').map((time) => (
                <div 
                  key={time.value}
                  className={`p-3 rounded-lg transition-all flex items-center gap-2 ${
                    selectedTimeOfDay === time.value ? 'bg-[#0A84FF] text-white' : 'bg-[#2c2c2e] hover:bg-[#0A84FF]/20 text-white'
                  }`}
                  onClick={() => setSelectedTimeOfDay(time.value)}
                >
                  {time.icon}
                  <div>
                    <p className="font-semibold">
                      {getFilteredData().filter(item => 
                        selectedTimeOfDay === 'all' || getTimeOfDay(item.date) === time.value
                      ).length}
                    </p>
                    <p className="text-xs text-[#98989d]">{time.label.split(' ')[0]}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1c1c1e]/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-[#2c2c2e]"
        >
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-white">
            <PieChartIcon className="text-[#0A84FF]" />
            Issue Type Distribution
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getCounts('type')}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {getCounts('type').map((entry, index) => (
                    <Cell key={index} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    background: '#1c1c1e',
                    borderRadius: '8px',
                    border: '1px solid #2c2c2e',
                    color: '#ffffff'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1c1c1e]/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-[#2c2c2e]"
        >
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-white">
            <BarChart2 className="text-[#0A84FF]" />
            Severity vs Priority Analysis
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  {
                    name: 'Critical',
                    High: getFilteredData().filter(item => item.severity === 'Critical' && item.priority === 'High').length,
                    Urgent: getFilteredData().filter(item => item.severity === 'Critical' && item.priority === 'Urgent').length,
                    Medium: getFilteredData().filter(item => item.severity === 'Critical' && item.priority === 'Medium').length,
                    Low: getFilteredData().filter(item => item.severity === 'Critical' && item.priority === 'Low').length,
                  },
                  {
                    name: 'High',
                    High: getFilteredData().filter(item => item.severity === 'High' && item.priority === 'High').length,
                    Urgent: getFilteredData().filter(item => item.severity === 'High' && item.priority === 'Urgent').length,
                    Medium: getFilteredData().filter(item => item.severity === 'High' && item.priority === 'Medium').length,
                    Low: getFilteredData().filter(item => item.severity === 'High' && item.priority === 'Low').length,
                  },
                  {
                    name: 'Medium',
                    High: getFilteredData().filter(item => item.severity === 'Medium' && item.priority === 'High').length,
                    Urgent: getFilteredData().filter(item => item.severity === 'Medium' && item.priority === 'Urgent').length,
                    Medium: getFilteredData().filter(item => item.severity === 'Medium' && item.priority === 'Medium').length,
                    Low: getFilteredData().filter(item => item.severity === 'Medium' && item.priority === 'Low').length,
                  },
                  {
                    name: 'Low',
                    High: getFilteredData().filter(item => item.severity === 'Low' && item.priority === 'High').length,
                    Urgent: getFilteredData().filter(item => item.severity === 'Low' && item.priority === 'Urgent').length,
                    Medium: getFilteredData().filter(item => item.severity === 'Low' && item.priority === 'Medium').length,
                    Low: getFilteredData().filter(item => item.severity === 'Low' && item.priority === 'Low').length,
                  }
                ]}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#2c2c2e" />
                <XAxis dataKey="name" stroke="#98989d" />
                <YAxis stroke="#98989d" />
                <Tooltip 
                  contentStyle={{
                    background: '#1c1c1e',
                    borderRadius: '8px',
                    border: '1px solid #2c2c2e',
                    color: '#ffffff'
                  }}
                />
                <Legend />
                <Bar dataKey="Urgent" stackId="a" fill="#FF453A" name="Urgent" />
                <Bar dataKey="High" stackId="a" fill="#FF9F0A" name="High" />
                <Bar dataKey="Medium" stackId="a" fill="#0A84FF" name="Medium" />
                <Bar dataKey="Low" stackId="a" fill="#30D158" name="Low" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AnalyticsDashboard;