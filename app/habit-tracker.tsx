"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  AreaChart,
  Area,
  Cell,
} from "recharts"
import Image from "next/image"

// Types
type Habit = {
  id: string
  name: string
  icon: string
  category: "Productive" | "Sport" | "Relax" | "Have Fun"
  target: number
  unit: string
  frequency: "daily" | "weekly"
  streak: number
  timeSpent: number
  completed: boolean
  location?: string
  steps?: string[]
  history: {
    date: string
    value: number
    completed: boolean
  }[]
  color: string
  improvement: number
}

type Stat = {
  id: string
  name: string
  icon: string
  value: number
  unit: string
  target: number
  history: {
    date: string
    value: number
  }[]
  color: string
}

type User = {
  name: string
  avatar: string
  joinDate: string
  streakDays: number
  longestStreak: number
  totalCompletions: number
}

type TimeSlot = {
  day: number
  startTime: string
  endTime: string
}

// Mock Data Generator
const generateMockData = () => {
  const today = new Date()
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(today.getDate() - i)
    return date.toISOString().split("T")[0]
  }).reverse()

  const mockHabits: Habit[] = [
    {
      id: "1",
      name: "Morning Workout",
      icon: "🏋️",
      category: "Sport",
      target: 60,
      unit: "minutes",
      frequency: "daily",
      streak: 4,
      timeSpent: 45,
      completed: false,
      location: "Sinus Sport",
      steps: [
        "Start by standing with your feet shoulder-width apart and arms down at your sides.",
        "Take a step forward with your right leg and bend your right knee.",
        "Complete 10 reps for 3 sets.",
      ],
      history: last30Days.map((date) => ({
        date,
        value: Math.random() > 0.3 ? Math.floor(Math.random() * 70) + 20 : 0,
        completed: Math.random() > 0.3,
      })),
      color: "#22c55e",
      improvement: 1.5,
    },
    {
      id: "2",
      name: "Meditation",
      icon: "🧘",
      category: "Relax",
      target: 20,
      unit: "minutes",
      frequency: "daily",
      streak: 7,
      timeSpent: 15,
      completed: false,
      history: last30Days.map((date) => ({
        date,
        value: Math.random() > 0.2 ? Math.floor(Math.random() * 25) + 5 : 0,
        completed: Math.random() > 0.2,
      })),
      color: "#8b5cf6",
      improvement: 2.3,
    },
    {
      id: "3",
      name: "Coding Practice",
      icon: "💻",
      category: "Productive",
      target: 90,
      unit: "minutes",
      frequency: "daily",
      streak: 12,
      timeSpent: 60,
      completed: false,
      history: last30Days.map((date) => ({
        date,
        value: Math.random() > 0.25 ? Math.floor(Math.random() * 100) + 30 : 0,
        completed: Math.random() > 0.25,
      })),
      color: "#3b82f6",
      improvement: 1.5,
    },
    {
      id: "4",
      name: "Reading",
      icon: "📚",
      category: "Relax",
      target: 30,
      unit: "minutes",
      frequency: "daily",
      streak: 5,
      timeSpent: 20,
      completed: false,
      history: last30Days.map((date) => ({
        date,
        value: Math.random() > 0.4 ? Math.floor(Math.random() * 45) + 10 : 0,
        completed: Math.random() > 0.4,
      })),
      color: "#ec4899",
      improvement: 1.5,
    },
    {
      id: "5",
      name: "Gaming Session",
      icon: "🎮",
      category: "Have Fun",
      target: 90,
      unit: "minutes",
      frequency: "weekly",
      streak: 2,
      timeSpent: 60,
      completed: false,
      history: last30Days.map((date) => ({
        date,
        value: Math.random() > 0.6 ? Math.floor(Math.random() * 120) + 30 : 0,
        completed: Math.random() > 0.6,
      })),
      color: "#f59e0b",
      improvement: 1.5,
    },
    {
      id: "6",
      name: "Chill Meditation",
      icon: "😌",
      category: "Relax",
      target: 30,
      unit: "minutes",
      frequency: "daily",
      streak: 3,
      timeSpent: 0,
      completed: false,
      location: "Home sweet home",
      history: last30Days.map((date) => ({
        date,
        value: Math.random() > 0.3 ? Math.floor(Math.random() * 35) + 10 : 0,
        completed: Math.random() > 0.3,
      })),
      color: "#8b5cf6",
      improvement: 1.5,
    },
  ]

  const mockStats: Stat[] = [
    {
      id: "1",
      name: "Sleep",
      icon: "😴",
      value: 7.5,
      unit: "hours",
      target: 8,
      color: "#8b5cf6",
      history: last30Days.map((date) => ({
        date,
        value: 5 + Math.random() * 4,
      })),
    },
    {
      id: "2",
      name: "Water",
      icon: "💧",
      value: 6,
      unit: "glasses",
      target: 8,
      color: "#3b82f6",
      history: last30Days.map((date) => ({
        date,
        value: Math.floor(Math.random() * 10) + 1,
      })),
    },
    {
      id: "3",
      name: "Screen Time",
      icon: "📱",
      value: 3.5,
      unit: "hours",
      target: 3,
      color: "#ec4899",
      history: last30Days.map((date) => ({
        date,
        value: 1 + Math.random() * 5,
      })),
    },
    {
      id: "4",
      name: "Steps",
      icon: "👣",
      value: 7500,
      unit: "steps",
      target: 10000,
      color: "#f59e0b",
      history: last30Days.map((date) => ({
        date,
        value: Math.floor(Math.random() * 12000) + 2000,
      })),
    },
  ]

  const user: User = {
    name: "Alex Johnson",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    joinDate: "2023-01-15",
    streakDays: 12,
    longestStreak: 21,
    totalCompletions: 127,
  }

  return { habits: mockHabits, stats: mockStats, user }
}

export default function Habito() {
  // State
  const [view, setView] = useState<"landing" | "dashboard" | "activity" | "profile" | "schedule" | "stats">("landing")
  const [mockData, setMockData] = useState(() => generateMockData())
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null)
  const [selectedStat, setSelectedStat] = useState<Stat | null>(null)
  const [waterIntake, setWaterIntake] = useState<number>(6)
  const [sleepHours, setSleepHours] = useState<number>(7.5)
  const [sleepQuality, setSleepQuality] = useState<number>(4)
  const [screenTime, setScreenTime] = useState<number>(210) // in minutes
  const [showAddHabitModal, setShowAddHabitModal] = useState<boolean>(false)
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false)
  const [newHabit, setNewHabit] = useState<{
    name: string
    category: "Productive" | "Sport" | "Relax" | "Have Fun"
    target: number
    unit: string
    frequency: "daily" | "weekly"
  }>({
    name: "",
    category: "Productive",
    target: 30,
    unit: "minutes",
    frequency: "daily",
  })
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("08:00")
  const [showNotification, setShowNotification] = useState<boolean>(false)
  const [notificationMessage, setNotificationMessage] = useState<string>("")
  const [dateRange, setDateRange] = useState<"week" | "month" | "year">("week")
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false)

  // Refs
  const timelineRef = useRef<HTMLDivElement>(null)
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Effects
  useEffect(() => {
    // Check for dark mode preference
    if (typeof window !== "undefined") {
      const darkModePreference = window.matchMedia("(prefers-color-scheme: dark)").matches
      setIsDarkMode(darkModePreference)
    }
  }, [])

  useEffect(() => {
    // Update timeline scroll position based on current time
    if (view === "dashboard" && timelineRef.current) {
      const now = new Date()
      const currentHour = now.getHours()
      const currentMinute = now.getMinutes()
      const totalMinutes = currentHour * 60 + currentMinute

      // Assuming timeline starts at 7:00 (420 minutes) and each hour is 100px
      const scrollPosition = (totalMinutes - 420) * (100 / 60)

      if (scrollPosition > 0) {
        timelineRef.current.scrollLeft = scrollPosition
      }
    }
  }, [view])

  // Handlers
  const showNotificationWithTimeout = (message: string) => {
    setNotificationMessage(message)
    setShowNotification(true)

    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current)
    }

    notificationTimeoutRef.current = setTimeout(() => {
      setShowNotification(false)
    }, 3000)
  }

  const handleDateChange = (date: Date) => {
    setSelectedDate(date)
  }

  const handleHabitClick = (habit: Habit) => {
    setSelectedHabit(habit)
    setView("activity")
  }

  const handleCompleteHabit = (habit: Habit) => {
    // Update habit
    setMockData((prev) => {
      const updatedHabits = prev.habits.map((h) => {
        if (h.id === habit.id) {
          const today = new Date().toISOString().split("T")[0]

          // Update today's entry or add a new one
          const updatedHistory = [...h.history]
          const todayIndex = updatedHistory.findIndex((entry) => entry.date === today)

          if (todayIndex >= 0) {
            updatedHistory[todayIndex] = {
              ...updatedHistory[todayIndex],
              value: habit.target,
              completed: true,
            }
          } else {
            updatedHistory.push({
              date: today,
              value: habit.target,
              completed: true,
            })
          }

          return {
            ...h,
            completed: true,
            timeSpent: habit.target,
            streak: h.streak + 1,
            history: updatedHistory,
          }
        }
        return h
      })

      return {
        ...prev,
        habits: updatedHabits,
      }
    })

    // Show notification
    showNotificationWithTimeout(`Great job! You've completed ${habit.name}!`)

    // Go back to dashboard
    setView("dashboard")
  }

  const handleHabitCheck = (habitId: string, value: number) => {
    setMockData((prev) => {
      const updatedHabits = prev.habits.map((habit) => {
        if (habit.id === habitId) {
          const today = new Date().toISOString().split("T")[0]
          const completed = value >= habit.target

          // Update today's entry or add a new one
          const updatedHistory = [...habit.history]
          const todayIndex = updatedHistory.findIndex((entry) => entry.date === today)

          if (todayIndex >= 0) {
            updatedHistory[todayIndex] = {
              ...updatedHistory[todayIndex],
              value,
              completed,
            }
          } else {
            updatedHistory.push({
              date: today,
              value,
              completed,
            })
          }

          // Calculate new streak
          let newStreak = habit.streak
          if (completed && !habit.completed) {
            newStreak = habit.streak + 1
          }

          return {
            ...habit,
            history: updatedHistory,
            streak: newStreak,
            timeSpent: value,
            completed,
          }
        }
        return habit
      })

      return {
        ...prev,
        habits: updatedHabits,
      }
    })

    showNotificationWithTimeout(`Habit updated successfully!`)
  }

  const handleAddWater = () => {
    if (waterIntake < 8) {
      const newWaterIntake = waterIntake + 1
      setWaterIntake(newWaterIntake)

      // Update stat
      setMockData((prev) => {
        const updatedStats = prev.stats.map((stat) => {
          if (stat.name === "Water") {
            const today = new Date().toISOString().split("T")[0]

            // Update today's entry or add a new one
            const updatedHistory = [...stat.history]
            const todayIndex = updatedHistory.findIndex((entry) => entry.date === today)

            if (todayIndex >= 0) {
              updatedHistory[todayIndex] = {
                ...updatedHistory[todayIndex],
                value: newWaterIntake,
              }
            } else {
              updatedHistory.push({
                date: today,
                value: newWaterIntake,
              })
            }

            return {
              ...stat,
              value: newWaterIntake,
              history: updatedHistory,
            }
          }
          return stat
        })

        return {
          ...prev,
          stats: updatedStats,
        }
      })

      // Show notification
      showNotificationWithTimeout(`Water intake updated: ${newWaterIntake}/8 glasses`)
    }
  }

  const handleUpdateSleep = (hours: number, quality: number) => {
    setSleepHours(hours)
    setSleepQuality(quality)

    // Update stat
    setMockData((prev) => {
      const updatedStats = prev.stats.map((stat) => {
        if (stat.name === "Sleep") {
          const today = new Date().toISOString().split("T")[0]

          // Update today's entry or add a new one
          const updatedHistory = [...stat.history]
          const todayIndex = updatedHistory.findIndex((entry) => entry.date === today)

          if (todayIndex >= 0) {
            updatedHistory[todayIndex] = {
              ...updatedHistory[todayIndex],
              value: hours,
            }
          } else {
            updatedHistory.push({
              date: today,
              value: hours,
            })
          }

          return {
            ...stat,
            value: hours,
            history: updatedHistory,
          }
        }
        return stat
      })

      return {
        ...prev,
        stats: updatedStats,
      }
    })

    // Show notification
    showNotificationWithTimeout(`Sleep data updated: ${hours} hours, quality: ${quality}/5`)
  }

  const handleUpdateScreenTime = (minutes: number) => {
    setScreenTime(minutes)

    // Update stat
    setMockData((prev) => {
      const updatedStats = prev.stats.map((stat) => {
        if (stat.name === "Screen Time") {
          const today = new Date().toISOString().split("T")[0]

          // Update today's entry or add a new one
          const updatedHistory = [...stat.history]
          const todayIndex = updatedHistory.findIndex((entry) => entry.date === today)

          if (todayIndex >= 0) {
            updatedHistory[todayIndex] = {
              ...updatedHistory[todayIndex],
              value: minutes / 60, // Convert to hours for consistency
            }
          } else {
            updatedHistory.push({
              date: today,
              value: minutes / 60,
            })
          }

          return {
            ...stat,
            value: minutes / 60,
            history: updatedHistory,
          }
        }
        return stat
      })

      return {
        ...prev,
        stats: updatedStats,
      }
    })

    showNotificationWithTimeout(`Screen time updated: ${Math.floor(minutes / 60)}h ${minutes % 60}m`)
  }

  const handleAddHabit = () => {
    if (newHabit.name.trim() === "") {
      showNotificationWithTimeout("Please enter a habit name")
      return
    }

    const newId = (mockData.habits.length + 1).toString()
    const icons = ["🏋️", "🧘", "💻", "📚", "🎮", "🎨", "🎯", "🚶", "🧠", "✍️"]
    const randomIcon = icons[Math.floor(Math.random() * icons.length)]
    const colors = ["#22c55e", "#8b5cf6", "#3b82f6", "#ec4899", "#f59e0b", "#06b6d4"]
    const randomColor = colors[Math.floor(Math.random() * colors.length)]

    const today = new Date()
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(today.getDate() - i)
      return date.toISOString().split("T")[0]
    }).reverse()

    const habit: Habit = {
      id: newId,
      name: newHabit.name,
      icon: randomIcon,
      category: newHabit.category,
      target: newHabit.target,
      unit: newHabit.unit,
      frequency: newHabit.frequency,
      streak: 0,
      timeSpent: 0,
      completed: false,
      history: last30Days.map((date) => ({
        date,
        value: 0,
        completed: false,
      })),
      color: randomColor,
      improvement: 0,
    }

    setMockData((prev) => ({
      ...prev,
      habits: [...prev.habits, habit],
    }))

    // Reset form
    setNewHabit({
      name: "",
      category: "Productive",
      target: 30,
      unit: "minutes",
      frequency: "daily",
    })

    // Close modal
    setShowAddHabitModal(false)

    // Show notification
    showNotificationWithTimeout(`New habit "${habit.name}" added!`)
  }

  const handleUpdateStat = (statId: string, value: number) => {
    setMockData((prev) => {
      const updatedStats = prev.stats.map((stat) => {
        if (stat.id === statId) {
          const today = new Date().toISOString().split("T")[0]

          // Update today's entry or add a new one
          const updatedHistory = [...stat.history]
          const todayIndex = updatedHistory.findIndex((entry) => entry.date === today)

          if (todayIndex >= 0) {
            updatedHistory[todayIndex] = {
              ...updatedHistory[todayIndex],
              value,
            }
          } else {
            updatedHistory.push({
              date: today,
              value,
            })
          }

          return {
            ...stat,
            value,
            history: updatedHistory,
          }
        }
        return stat
      })

      return {
        ...prev,
        stats: updatedStats,
      }
    })

    showNotificationWithTimeout(`Stat updated successfully!`)
  }

  // Helper functions
  const getLastNDays = (n: number) => {
    const result = []
    const today = new Date()

    for (let i = n - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(today.getDate() - i)
      result.push(date.toISOString().split("T")[0])
    }

    return result
  }

  const getFilteredData = (data: { date: string; value: number }[], days: number) => {
    const lastNDays = getLastNDays(days)
    return lastNDays.map((date) => {
      const entry = data.find((d) => d.date === date)
      return {
        date,
        value: entry ? entry.value : 0,
      }
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const calculateCompletionRate = (habit: Habit) => {
    const last7Days = habit.history.slice(-7)
    const completedDays = last7Days.filter((day) => day.completed).length
    return (completedDays / 7) * 100
  }

  const calculateOverallProgress = () => {
    const totalHabits = mockData.habits.length
    if (totalHabits === 0) return 0

    let totalCompletionRate = 0
    mockData.habits.forEach((habit) => {
      totalCompletionRate += calculateCompletionRate(habit)
    })

    return totalCompletionRate / totalHabits
  }

  const getTodayValue = (habit: Habit) => {
    const today = new Date().toISOString().split("T")[0]
    const todayEntry = habit.history.find((entry) => entry.date === today)
    return todayEntry ? todayEntry.value : 0
  }

 // const getWeeklyAverage = (stat: Stat) => {
  //  const last7Days = stat.history.slice(-7)
    //const sum = last7Days.reduce((acc, day) => acc + day.value, 0)
    //return (sum / 7).toFixed(1)
  //}

  // Calendar generation
  const generateCalendar = () => {
    const currentDate = new Date(selectedDate)
    const month = currentDate.getMonth()
    const year = currentDate.getFullYear()

    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="text-center py-2 text-gray-400"></div>)
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i)
      const isToday =
        date.getDate() === new Date().getDate() &&
        date.getMonth() === new Date().getMonth() &&
        date.getFullYear() === new Date().getFullYear()

      const isSelected =
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear()

      // Check if there are any completed habits for this date
      const dateStr = date.toISOString().split("T")[0]
      const hasCompletedHabits = mockData.habits.some((habit) =>
        habit.history.some((entry) => entry.date === dateStr && entry.completed),
      )

      days.push(
        <div
          key={i}
          className={`text-center py-2 cursor-pointer transition-all duration-200 ${
            isSelected
              ? "bg-green-500 text-white rounded-full"
              : isToday
                ? "border border-green-500 rounded-full"
                : hasCompletedHabits
                  ? "text-green-500 font-medium"
                  : ""
          }`}
          onClick={() => handleDateChange(date)}
        >
          <div className="text-sm">{i}</div>
          <div className="text-xs">{date.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 1)}</div>
        </div>,
      )
    }

    return days
  }

  // Get habits for the selected date
  const getHabitsForSelectedDate = () => {
    const day = selectedDate.getDay()

    // For demo purposes, assign schedules based on day of week
    const schedules: Record<string, TimeSlot[]> = {
      "1": [
        { day: 1, startTime: "07:30", endTime: "08:30" },
        { day: 3, startTime: "07:30", endTime: "08:30" },
        { day: 5, startTime: "07:30", endTime: "08:30" },
      ],
      "2": [
        { day: 1, startTime: "21:00", endTime: "21:20" },
        { day: 2, startTime: "21:00", endTime: "21:20" },
        { day: 3, startTime: "21:00", endTime: "21:20" },
      ],
      "3": [
        { day: 1, startTime: "10:00", endTime: "11:30" },
        { day: 2, startTime: "10:00", endTime: "11:30" },
        { day: 3, startTime: "10:00", endTime: "11:30" },
      ],
      "4": [
        { day: 1, startTime: "19:30", endTime: "20:00" },
        { day: 3, startTime: "19:30", endTime: "20:00" },
        { day: 5, startTime: "19:30", endTime: "20:00" },
      ],
      "5": [
        { day: 5, startTime: "20:00", endTime: "21:30" },
        { day: 6, startTime: "20:00", endTime: "21:30" },
      ],
      "6": [{ day: 3, startTime: "09:00", endTime: "09:30" }],
    }

    return mockData.habits
      .filter((habit) => {
        const habitSchedule = schedules[habit.id] || []
        return habitSchedule.some((s) => s.day === day)
      })
      .sort((a, b) => {
        const aSchedule = schedules[a.id] || []
        const bSchedule = schedules[b.id] || []
        const aTime = aSchedule.find((s) => s.day === day)?.startTime || "00:00"
        const bTime = bSchedule.find((s) => s.day === day)?.startTime || "00:00"
        return aTime.localeCompare(bTime)
      })
      .map((habit) => ({
        ...habit,
        schedule: schedules[habit.id] || [],
      }))
  }

  // Calculate category totals
  const calculateCategoryTotals = () => {
    const categories = ["Productive", "Sport", "Relax", "Have Fun"] as const
    const totals: Record<string, { minutes: number; improvement: number }> = {}

    categories.forEach((category) => {
      const categoryHabits = mockData.habits.filter((h) => h.category === category)
      const minutes = categoryHabits.reduce((sum, habit) => sum + habit.timeSpent, 0)
      const avgImprovement =
        categoryHabits.length > 0
          ? categoryHabits.reduce((sum, habit) => sum + habit.improvement, 0) / categoryHabits.length
          : 0

      totals[category] = { minutes, improvement: avgImprovement }
    })

    return totals
  }

  // Format time
  const formatTime = (minutes: number): string => {
    const hrs = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hrs}hrs ${mins}min`
  }

  // Generate time slots for timeline
  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 7; hour <= 22; hour++) {
      const formattedHour = hour.toString().padStart(2, "0")
      slots.push(`${formattedHour}:00`)
      slots.push(`${formattedHour}:30`)
    }
    return slots
  }

  const timeSlots = generateTimeSlots()

  // Components
  const Navbar = () => (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${isDarkMode ? "bg-gray-900" : "bg-white"} shadow-md px-4 py-3`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-2xl"
          >
            📊
          </motion.div>
          <h1 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            habito<span className="text-green-500">.</span>
          </h1>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <button
            onClick={() => setView("dashboard")}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              view === "dashboard"
                ? `${isDarkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"}`
                : `${isDarkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"}`
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setView("stats")}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              view === "stats"
                ? `${isDarkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"}`
                : `${isDarkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"}`
            }`}
          >
            Stats
          </button>
          <button
            onClick={() => setView("schedule")}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              view === "schedule"
                ? `${isDarkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"}`
                : `${isDarkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"}`
            }`}
          >
            Schedule
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-full ${isDarkMode ? "bg-gray-800 text-yellow-400" : "bg-gray-100 text-gray-600"}`}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>

          <button
            onClick={() => setShowSettingsModal(true)}
            className={`p-2 rounded-full ${isDarkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"}`}
            aria-label="Settings"
          >
            ⚙️
          </button>

          <div className="relative">
            <button className="flex items-center focus:outline-none" onClick={() => setView("profile")}>
              <Image
                src={mockData.user.avatar || "/placeholder.svg"}
                alt="User avatar"
                width={32}
                height={32}
                className="rounded-full border-2 border-green-500"
              />
            </button>
          </div>

          <button className="md:hidden" onClick={() => setShowMobileMenu(!showMobileMenu)} aria-label="Toggle menu">
            {showMobileMenu ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden ${isDarkMode ? "bg-gray-900" : "bg-white"} mt-2 py-2`}
          >
            <div className="flex flex-col space-y-2 px-4">
              <button
                onClick={() => {
                  setView("dashboard")
                  setShowMobileMenu(false)
                }}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  view === "dashboard"
                    ? `${isDarkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"}`
                    : `${isDarkMode ? "text-gray-300" : "text-gray-600"}`
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  setView("stats")
                  setShowMobileMenu(false)
                }}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  view === "stats"
                    ? `${isDarkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"}`
                    : `${isDarkMode ? "text-gray-300" : "text-gray-600"}`
                }`}
              >
                Stats
              </button>
              <button
                onClick={() => {
                  setView("schedule")
                  setShowMobileMenu(false)
                }}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  view === "schedule"
                    ? `${isDarkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"}`
                    : `${isDarkMode ? "text-gray-300" : "text-gray-600"}`
                }`}
              >
                Schedule
              </button>
              <button
                onClick={() => {
                  setView("profile")
                  setShowMobileMenu(false)
                }}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  view === "profile"
                    ? `${isDarkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"}`
                    : `${isDarkMode ? "text-gray-300" : "text-gray-600"}`
                }`}
              >
                Profile
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )

  // Landing Page
  const LandingPage = () => (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <div className="flex-1 max-w-6xl mx-auto p-6 md:p-8 lg:p-12 overflow-y-auto">
        <div className="flex justify-between items-center mb-12">
          <div className="text-2xl font-bold">
            habito<span className="text-green-500">.</span>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-full ${isDarkMode ? "bg-gray-800 text-yellow-400" : "bg-gray-100 text-gray-600"}`}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? "☀️" : "🌙"}
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Tracking <br />
              Several <span className="text-green-500">Habits</span> <br />
              at Once.
            </h1>
            <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} mb-8`}>
              Keeps track of your movement throughout the day and encourages you to meet your goals.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-500 text-white font-medium py-3 px-8 rounded-full shadow-lg hover:bg-green-600 transition-all duration-200"
              onClick={() => setView("dashboard")}
            >
              Get Started
            </motion.button>
          </div>
          <div className="relative">
            <div className="w-full h-80 md:h-96 relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute top-0 left-0 w-full h-full"
              >
                <svg viewBox="0 0 400 400" className="w-full h-full">
                  <circle cx="200" cy="200" r="150" fill={isDarkMode ? "#1f2937" : "#ecfdf5"} />
                  <g transform="translate(120, 120)">
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      d="M0,0 L160,0 L160,160 L0,160 Z"
                      fill="none"
                      stroke={isDarkMode ? "#e5e7eb" : "#000"}
                      strokeWidth="2"
                    />
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: 1 }}
                      d="M40,80 L70,110 L120,60"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <g transform="translate(180, 220)">
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, delay: 1.2 }}
                      d="M0,0 L100,0 L100,100 L0,100 Z"
                      fill="none"
                      stroke={isDarkMode ? "#e5e7eb" : "#000"}
                      strokeWidth="2"
                    />
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: 1.5 }}
                      d="M25,50 L75,50 M50,25 L50,75"
                      fill="none"
                      stroke={isDarkMode ? "#e5e7eb" : "#000"}
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                  </g>
                  <g transform="translate(100, 180)">
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, delay: 1.7 }}
                      d="M0,0 L120,0 L120,30 L0,30 Z"
                      fill="none"
                      stroke={isDarkMode ? "#e5e7eb" : "#000"}
                      strokeWidth="2"
                    />
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: 2 }}
                      d="M10,15 L110,15"
                      fill="none"
                      stroke={isDarkMode ? "#e5e7eb" : "#000"}
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </g>
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                    <path
                      d="M200,120 C220,120 240,130 250,150 C260,170 270,190 290,200 C270,210 260,230 250,250 C240,270 220,280 200,280 C180,280 160,270 150,250 C140,230 130,210 110,200 C130,190 140,170 150,150 C160,130 180,120 200,120 Z"
                      fill="#22c55e"
                    />
                    <circle cx="170" cy="180" r="10" fill={isDarkMode ? "#e5e7eb" : "#000"} />
                    <path
                      d="M190,220 C200,230 220,230 230,220"
                      fill="none"
                      stroke={isDarkMode ? "#e5e7eb" : "#000"}
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </motion.g>
                </svg>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className={`p-6 rounded-xl ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-sm`}>
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">Track Your Progress</h3>
            <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Monitor your habits with beautiful charts and visualizations that show your progress over time.
            </p>
          </div>
          <div className={`p-6 rounded-xl ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-sm`}>
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-2">Set Achievable Goals</h3>
            <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Create custom goals for each habit and track your completion rate to stay motivated.
            </p>
          </div>
          <div className={`p-6 rounded-xl ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-sm`}>
            <div className="text-3xl mb-4">🔔</div>
            <h3 className="text-xl font-bold mb-2">Smart Reminders</h3>
            <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Never miss a habit with customizable reminders that help you stay on track.
            </p>
          </div>
        </div>
      </div>

      <footer className={`py-6 ${isDarkMode ? "bg-gray-900 text-gray-400" : "bg-gray-100 text-gray-600"}`}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">© {new Date().getFullYear()} Habito. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )

  // Dashboard
  const Dashboard = () => {
    const categoryTotals = calculateCategoryTotals()

    return (
      <div className="space-y-8 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className={`text-2xl font-bold mb-1 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              Welcome back, {mockData.user.name}!
            </h2>
            <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <div className={`px-4 py-2 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
              <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Current Streak</p>
              <p className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                {mockData.user.streakDays} days
              </p>
            </div>
            <div className={`px-4 py-2 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
              <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Completions</p>
              <p className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                {mockData.user.totalCompletions}
              </p>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-sm p-4 mb-6`}>
          <div className="flex justify-between items-center mb-4">
            <button
              className="p-2"
              onClick={() => {
                const prevMonth = new Date(selectedDate)
                prevMonth.setMonth(prevMonth.getMonth() - 1)
                setSelectedDate(prevMonth)
              }}
            >
              &lt;
            </button>
            <h2 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              {selectedDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </h2>
            <button
              className="p-2"
              onClick={() => {
                const nextMonth = new Date(selectedDate)
                nextMonth.setMonth(nextMonth.getMonth() + 1)
                setSelectedDate(nextMonth)
              }}
            >
              &gt;
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className={`text-center text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                {day}
              </div>
            ))}
            {generateCalendar()}
          </div>
        </div>

        {/* Overall Progress */}
        <div className={`p-6 rounded-xl shadow-sm ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>Overall Progress</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setDateRange("week")}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  dateRange === "week"
                    ? "bg-green-500 text-white"
                    : `${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-600"}`
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setDateRange("month")}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  dateRange === "month"
                    ? "bg-green-500 text-white"
                    : `${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-600"}`
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setDateRange("year")}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  dateRange === "year"
                    ? "bg-green-500 text-white"
                    : `${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-600"}`
                }`}
              >
                Year
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/3 flex justify-center mb-6 md:mb-0">
              <div className="relative">
                <ResponsiveContainer width={180} height={180}>
                  <RadialBarChart
                    innerRadius="70%"
                    outerRadius="100%"
                    data={[{ name: "Progress", value: calculateOverallProgress() }]}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <RadialBar background dataKey="value" fill="#22c55e" cornerRadius={30} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                      {Math.round(calculateOverallProgress())}%
                    </p>
                    <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Completion</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-2/3 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={mockData.habits.map((habit) => ({
                    name: habit.name,
                    ...getFilteredData(
                      habit.history.map((h) => ({ date: h.date, value: h.completed ? 100 : 0 })),
                      dateRange === "week" ? 7 : dateRange === "month" ? 30 : 90,
                    ).reduce((acc, day) => {
                      acc[day.date] = day.value
                      return acc
                    }, {}),
                  }))}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#E5E7EB"} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => formatDate(date)}
                    stroke={isDarkMode ? "#9CA3AF" : "#6B7280"}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
                      borderColor: isDarkMode ? "#374151" : "#E5E7EB",
                      color: isDarkMode ? "#FFFFFF" : "#000000",
                    }}
                  />
                  <Legend />
                  {mockData.habits.map((habit, index) => (
                    <Line
                      key={habit.id}
                      type="monotone"
                      dataKey={(entry) =>
                        entry[getLastNDays(dateRange === "week" ? 7 : dateRange === "month" ? 30 : 90)[index]]
                      }
                      name={habit.name}
                      stroke={habit.color}
                      activeDot={{ r: 8 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Category Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {Object.entries(categoryTotals).map(([category, data]) => (
            <div key={category} className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-sm p-4`}>
              <div className="flex justify-between items-center mb-2">
                <h3 className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>{category}</h3>
                <span className="text-xs text-green-500 font-medium">+{data.improvement.toFixed(1)}%</span>
              </div>
              <div className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                {formatTime(data.minutes)}
              </div>
            </div>
          ))}
        </div>

        {/* Today's Habits */}
        <div className={`p-6 rounded-xl shadow-sm ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Today's Habits
          </h3>
          <div className="space-y-4">
            {mockData.habits.map((habit) => {
              const todayValue = getTodayValue(habit)
              const progress = Math.min(100, (todayValue / habit.target) * 100)

              return (
                <div key={habit.id} className="flex items-center">
                  <div className="mr-3 text-xl">{habit.icon}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <p className={`font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>{habit.name}</p>
                      <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        {todayValue} / {habit.target} {habit.unit}
                      </p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div
                        className="h-2.5 rounded-full"
                        style={{
                          width: `${progress}%`,
                          backgroundColor: habit.color,
                        }}
                      ></div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleHabitCheck(habit.id, todayValue + Math.ceil(habit.target / 5))}
                    className="ml-4 p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                    aria-label="Increment habit"
                  >
                    +
                  </button>
                </div>
              )
            })}
          </div>
          <button
            onClick={() => setShowAddHabitModal(true)}
            className="mt-6 w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center justify-center"
          >
            <span className="mr-2">+</span> Add New Habit
          </button>
        </div>

        {/* Timeline */}
        <div className="mb-6">
          <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Today's Schedule
          </h3>
          <div
            ref={timelineRef}
            className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-sm p-4 overflow-x-auto`}
          >
            <div className="flex space-x-4 min-w-max">
              {timeSlots.map((time, index) => (
                <div
                  key={time}
                  className={`flex flex-col items-center w-24 ${
                    selectedTimeSlot === time
                      ? "text-green-500 font-medium"
                      : isDarkMode
                        ? "text-gray-400"
                        : "text-gray-600"
                  }`}
                  onClick={() => setSelectedTimeSlot(time)}
                >
                  <div className="text-sm">{time}</div>
                  <div
                    className={`h-1 w-full mt-2 ${
                      selectedTimeSlot === time ? "bg-green-500" : isDarkMode ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  ></div>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-4">
              {getHabitsForSelectedDate().map((habit) => {
                const scheduleForToday = habit.schedule.find((s) => s.day === selectedDate.getDay())
                if (!scheduleForToday) return null

                const startTime = scheduleForToday.startTime
                const startHour = Number.parseInt(startTime.split(":")[0])
                const startMinute = Number.parseInt(startTime.split(":")[1])

                const endTime = scheduleForToday.endTime
                const endHour = Number.parseInt(endTime.split(":")[0])
                const endMinute = Number.parseInt(endTime.split(":")[1])

                const startIndex = (startHour - 7) * 2 + (startMinute >= 30 ? 1 : 0)
                const endIndex = (endHour - 7) * 2 + (endMinute >= 30 ? 1 : 0)
                const width = (endIndex - startIndex) * 24

                return (
                  <div
                    key={habit.id}
                    className="relative flex items-center h-16 cursor-pointer"
                    onClick={() => handleHabitClick(habit)}
                  >
                    <div className="absolute left-0 flex items-center space-x-2">
                      {habit.category === "Sport" && (
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-green-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                        </div>
                      )}
                      {habit.category === "Productive" && (
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-blue-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                          </svg>
                        </div>
                      )}
                      {habit.category === "Relax" && (
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-purple-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                            />
                          </svg>
                        </div>
                      )}
                      {habit.category === "Have Fun" && (
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-yellow-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                      )}
                      <div>
                        <div className={`font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>{habit.name}</div>
                        <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                          {habit.location || habit.category}
                        </div>
                      </div>
                    </div>
                    <div
                      className="absolute h-2 bg-green-500 rounded-full"
                      style={{
                        left: `${startIndex * 24}px`,
                        width: `${width}px`,
                      }}
                    ></div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Water Intake */}
          <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-sm p-4`}>
            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              Water Intake
            </h3>
            <div className="flex justify-between items-center mb-4">
              <div className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                {waterIntake}
                <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"} ml-1`}>/ 8</span>
              </div>
              <button
                className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
                onClick={handleAddWater}
              >
                +
              </button>
            </div>
            <div className="flex space-x-1 mb-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-8 rounded-md ${i < waterIntake ? "bg-blue-400" : isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
                ></div>
              ))}
            </div>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getFilteredData(mockData.stats.find((s) => s.name === "Water")?.history || [], 7)}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#374151" : "#E5E7EB"} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => formatDate(date)}
                    stroke={isDarkMode ? "#9CA3AF" : "#6B7280"}
                  />
                  <YAxis stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
                      borderColor: isDarkMode ? "#374151" : "#E5E7EB",
                      color: isDarkMode ? "#FFFFFF" : "#000000",
                    }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#93c5fd" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sleep Tracker */}
          <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-sm p-4`}>
            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              Sleep Tracker
            </h3>
            <div className="flex justify-between items-center mb-4">
              <div className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                {sleepHours}
                <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"} ml-1`}>hrs</span>
              </div>
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 ${i < sleepQuality ? "text-yellow-400" : isDarkMode ? "text-gray-600" : "text-gray-300"}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    onClick={() => handleUpdateSleep(sleepHours, i + 1)}
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            <div className="flex items-center mb-4">
              <input
                type="range"
                min="0"
                max="12"
                step="0.5"
                value={sleepHours}
                onChange={(e) => handleUpdateSleep(Number.parseFloat(e.target.value), sleepQuality)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getFilteredData(mockData.stats.find((s) => s.name === "Sleep")?.history || [], 7)}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#374151" : "#E5E7EB"} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => formatDate(date)}
                    stroke={isDarkMode ? "#9CA3AF" : "#6B7280"}
                  />
                  <YAxis stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
                      borderColor: isDarkMode ? "#374151" : "#E5E7EB",
                      color: isDarkMode ? "#FFFFFF" : "#000000",
                    }}
                  />
                  <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Screen Time */}
          <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-sm p-4`}>
            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}>Screen Time</h3>
            <div className={`text-3xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              {Math.floor(screenTime / 60)}
              <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"} ml-1`}>hrs</span>{" "}
              {screenTime % 60}
              <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"} ml-1`}>min</span>
            </div>
            <div className="flex items-center mb-4">
              <input
                type="range"
                min="0"
                max="720"
                step="15"
                value={screenTime}
                onChange={(e) => handleUpdateScreenTime(Number.parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={getFilteredData(mockData.stats.find((s) => s.name === "Screen Time")?.history || [], 7)}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#374151" : "#E5E7EB"} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => formatDate(date)}
                    stroke={isDarkMode ? "#9CA3AF" : "#6B7280"}
                  />
                  <YAxis stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
                      borderColor: isDarkMode ? "#374151" : "#E5E7EB",
                      color: isDarkMode ? "#FFFFFF" : "#000000",
                    }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#ec4899" fill="#fbcfe8" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Steps */}
          <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-sm p-4`}>
            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}>Steps</h3>
            <div className="flex justify-between items-center mb-4">
              <div className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                {mockData.stats.find((s) => s.name === "Steps")?.value.toLocaleString()}
                <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"} ml-1`}>/ 10,000</span>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-sm ${
                  mockData.stats.find((s) => s.name === "Steps")?.value >= 10000
                    ? "bg-green-100 text-green-800"
                    : mockData.stats.find((s) => s.name === "Steps")?.value >= 7000
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {mockData.stats.find((s) => s.name === "Steps")?.value >= 10000
                  ? "Goal Reached!"
                  : `${Math.round((mockData.stats.find((s) => s.name === "Steps")?.value || 0) / 100)}% of Goal`}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-4">
              <div
                className="h-2.5 rounded-full bg-orange-500"
                style={{
                  width: `${Math.min(100, ((mockData.stats.find((s) => s.name === "Steps")?.value || 0) / 10000) * 100)}%`,
                }}
              ></div>
            </div>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getFilteredData(mockData.stats.find((s) => s.name === "Steps")?.history || [], 7)}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#374151" : "#E5E7EB"} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => formatDate(date)}
                    stroke={isDarkMode ? "#9CA3AF" : "#6B7280"}
                  />
                  <YAxis stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
                      borderColor: isDarkMode ? "#374151" : "#E5E7EB",
                      color: isDarkMode ? "#FFFFFF" : "#000000",
                    }}
                  />
                  <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Line type="monotone" dataKey={() => 10000} stroke="#9CA3AF" strokeDasharray="5 5" name="Target" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Stats View
  const StatsView = () => (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>Your Stats</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setDateRange("week")}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              dateRange === "week"
                ? "bg-green-500 text-white"
                : `${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-600"}`
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setDateRange("month")}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              dateRange === "month"
                ? "bg-green-500 text-white"
                : `${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-600"}`
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setDateRange("year")}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              dateRange === "year"
                ? "bg-green-500 text-white"
                : `${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-600"}`
            }`}
          >
            Year
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockData.stats.map((stat) => (
          <motion.div
            key={stat.id}
            whileHover={{ y: -5 }}
            className={`p-6 rounded-xl shadow-sm ${isDarkMode ? "bg-gray-800" : "bg-white"} cursor-pointer`}
            onClick={() => setSelectedStat(stat)}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{stat.icon}</span>
                <div>
                  <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                    {stat.name}
                  </h3>
                  <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Target: {stat.target} {stat.unit} daily
                  </p>
                </div>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-sm ${
                  stat.value >= stat.target
                    ? "bg-green-100 text-green-800"
                    : stat.value >= stat.target * 0.7
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {stat.value >= stat.target ? "On Track" : "Below Target"}
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Today</p>
                <p className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                  {stat.value} / {stat.target} {stat.unit}
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="h-2.5 rounded-full"
                  style={{
                    width: `${Math.min(100, (stat.value / stat.target) * 100)}%`,
                    backgroundColor: stat.color,
                  }}
                ></div>
              </div>
            </div>

            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={getFilteredData(stat.history, dateRange === "week" ? 7 : dateRange === "month" ? 30 : 90)}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#E5E7EB"} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => formatDate(date)}
                    stroke={isDarkMode ? "#9CA3AF" : "#6B7280"}
                  />
                  <YAxis stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
                      borderColor: isDarkMode ? "#374151" : "#E5E7EB",
                      color: isDarkMode ? "#FFFFFF" : "#000000",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={stat.color}
                    strokeWidth={2}
                    dot={{ r: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        ))}
      </div>

      <div className={`p-6 rounded-xl shadow-sm ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>Weekly Overview</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={getLastNDays(7).map((date) => {
                const statValues = {}
                mockData.stats.forEach((stat) => {
                  const entry = stat.history.find((h) => h.date === date)
                  statValues[stat.name] = entry ? entry.value : 0
                })
                return {
                  date,
                  ...statValues,
                }
              })}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#E5E7EB"} />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => formatDate(date)}
                stroke={isDarkMode ? "#9CA3AF" : "#6B7280"}
              />
              <YAxis stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
                  borderColor: isDarkMode ? "#374151" : "#E5E7EB",
                  color: isDarkMode ? "#FFFFFF" : "#000000",
                }}
              />
              <Legend />
              {mockData.stats.map((stat) => (
                <Bar key={stat.id} dataKey={stat.name} fill={stat.color} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={`p-6 rounded-xl shadow-sm ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
          Habits Completion
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={mockData.habits.map((habit) => ({
                name: habit.name,
                completionRate: calculateCompletionRate(habit),
                color: habit.color,
              }))}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              layout="vertical"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={true}
                vertical={false}
                stroke={isDarkMode ? "#374151" : "#E5E7EB"}
              />
              <XAxis type="number" domain={[0, 100]} stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} />
              <YAxis dataKey="name" type="category" stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} width={100} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
                  borderColor: isDarkMode ? "#374151" : "#E5E7EB",
                  color: isDarkMode ? "#FFFFFF" : "#000000",
                }}
                formatter={(value) => [`${Math.round(value)}%`, "Completion Rate"]}
              />
              <Bar dataKey="completionRate" radius={[0, 4, 4, 0]}>
                {mockData.habits.map((habit, index) => (
                  <Cell key={`cell-${index}`} fill={habit.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )

  // Schedule View
  const ScheduleView = () => (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>Your Schedule</h2>
        <button
          onClick={() => setShowAddHabitModal(true)}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center"
        >
          <span className="mr-2">+</span> Add Habit
        </button>
      </div>

      {/* Calendar */}
      <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-sm p-4 mb-6`}>
        <div className="flex justify-between items-center mb-4">
          <button
            className="p-2"
            onClick={() => {
              const prevMonth = new Date(selectedDate)
              prevMonth.setMonth(prevMonth.getMonth() - 1)
              setSelectedDate(prevMonth)
            }}
          >
            &lt;
          </button>
          <h2 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            {selectedDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </h2>
          <button
            className="p-2"
            onClick={() => {
              const nextMonth = new Date(selectedDate)
              nextMonth.setMonth(nextMonth.getMonth() + 1)
              setSelectedDate(nextMonth)
            }}
          >
            &gt;
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className={`text-center text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              {day}
            </div>
          ))}
          {generateCalendar()}
        </div>
      </div>

      {/* Daily Schedule */}
      <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-sm p-4`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
          {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </h3>

        <div className="space-y-4">
          {getHabitsForSelectedDate().length > 0 ? (
            getHabitsForSelectedDate().map((habit) => {
              const scheduleForToday = habit.schedule.find((s) => s.day === selectedDate.getDay())
              if (!scheduleForToday) return null

              return (
                <div
                  key={habit.id}
                  className={`p-4 rounded-lg border-l-4 ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}
                  style={{ borderLeftColor: habit.color }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{habit.icon}</span>
                      <div>
                        <h4 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>{habit.name}</h4>
                        <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                          {scheduleForToday.startTime} - {scheduleForToday.endTime}
                        </p>
                        {habit.location && (
                          <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                            📍 {habit.location}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`px-3 py-1 rounded-full text-xs ${
                          habit.completed
                            ? "bg-green-100 text-green-800"
                            : isDarkMode
                              ? "bg-gray-600 text-gray-300"
                              : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {habit.completed ? "Completed" : "Pending"}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleHabitClick(habit)
                        }}
                        className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className={`p-8 text-center ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              <p className="mb-4">No habits scheduled for this day.</p>
              <button
                onClick={() => setShowAddHabitModal(true)}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              >
                Add a Habit
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Weekly Overview */}
      <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-sm p-4`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>Weekly Overview</h3>

        <div className="grid grid-cols-7 gap-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => {
            const habitsForDay = mockData.habits.filter((habit) => {
              // For demo purposes, assign schedules based on day of week
              const schedules: Record<string, TimeSlot[]> = {
                "1": [
                  { day: 1, startTime: "07:30", endTime: "08:30" },
                  { day: 3, startTime: "07:30", endTime: "08:30" },
                  { day: 5, startTime: "07:30", endTime: "08:30" },
                ],
                "2": [
                  { day: 1, startTime: "21:00", endTime: "21:20" },
                  { day: 2, startTime: "21:00", endTime: "21:20" },
                  { day: 3, startTime: "21:00", endTime: "21:20" },
                ],
                "3": [
                  { day: 1, startTime: "10:00", endTime: "11:30" },
                  { day: 2, startTime: "10:00", endTime: "11:30" },
                  { day: 3, startTime: "10:00", endTime: "11:30" },
                ],
                "4": [
                  { day: 1, startTime: "19:30", endTime: "20:00" },
                  { day: 3, startTime: "19:30", endTime: "20:00" },
                  { day: 5, startTime: "19:30", endTime: "20:00" },
                ],
                "5": [
                  { day: 5, startTime: "20:00", endTime: "21:30" },
                  { day: 6, startTime: "20:00", endTime: "21:30" },
                ],
                "6": [{ day: 3, startTime: "09:00", endTime: "09:30" }],
              }

              return schedules[habit.id]?.some((s) => s.day === index) || false
            })

            return (
              <div
                key={day}
                className={`p-3 rounded-lg ${
                  index === selectedDate.getDay()
                    ? "bg-green-500 text-white"
                    : isDarkMode
                      ? "bg-gray-700"
                      : "bg-gray-100"
                }`}
              >
                <div className="text-center mb-2 font-medium">{day}</div>
                <div className="space-y-1">
                  {habitsForDay.map((habit) => (
                    <div
                      key={habit.id}
                      className={`text-xs p-1 rounded ${
                        isDarkMode && index !== selectedDate.getDay()
                          ? "bg-gray-600 text-gray-300"
                          : !isDarkMode && index !== selectedDate.getDay()
                            ? "bg-white text-gray-800"
                            : "bg-white bg-opacity-20 text-white"
                      }`}
                    >
                      {habit.icon} {habit.name}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  // Activity View
  const ActivityView = () => {
    if (!selectedHabit) return null

    return (
      <div className="pb-20">
        <div className="flex items-center mb-6">
          <button className="mr-4" onClick={() => setView("dashboard")}>
            &lt;
          </button>
          <h2 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>Activity</h2>
        </div>

        {/* Time Slots */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex space-x-4 min-w-max">
            {timeSlots.map((time, index) => (
              <div
                key={time}
                className={`flex flex-col items-center w-24 ${
                  selectedTimeSlot === time
                    ? "text-green-500 font-medium"
                    : isDarkMode
                      ? "text-gray-400"
                      : "text-gray-600"
                }`}
                onClick={() => setSelectedTimeSlot(time)}
              >
                <div className="text-sm">{time}</div>
                <div
                  className={`h-1 w-full mt-2 ${
                    selectedTimeSlot === time ? "bg-green-500" : isDarkMode ? "bg-gray-700" : "bg-gray-200"
                  }`}
                ></div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Details */}
        <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-sm p-4 mb-6`}>
          <div className="flex items-center mb-4">
            {selectedHabit.category === "Sport" && (
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            )}
            {selectedHabit.category === "Productive" && (
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
            )}
            {selectedHabit.category === "Relax" && (
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-purple-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              </div>
            )}
            {selectedHabit.category === "Have Fun" && (
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-yellow-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            )}
            <div>
              <h3 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                {selectedHabit.name}
              </h3>
              <div className="flex items-center text-sm text-gray-500">
                <div className="mr-4">{selectedHabit.location || selectedHabit.category}</div>
                <div className="mr-4">
                  {selectedDate.toLocaleDateString("en-US", { day: "2-digit", month: "long" })}
                </div>
                <div>
                  {selectedHabit.target} {selectedHabit.unit}
                </div>
              </div>
            </div>
          </div>

          {/* Activity Report */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className={`font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>Activity Report</h4>
              <div className="text-xs font-medium px-2 py-1 bg-green-100 text-green-800 rounded-full">
                +{selectedHabit.improvement.toFixed(1)}%
              </div>
            </div>
            <div className={`h-40 ${isDarkMode ? "bg-gray-700" : "bg-green-50"} rounded-lg p-2`}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={getFilteredData(
                    selectedHabit.history.map((h) => ({ date: h.date, value: h.value })),
                    7,
                  )}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#E5E7EB"} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => formatDate(date)}
                    stroke={isDarkMode ? "#9CA3AF" : "#6B7280"}
                  />
                  <YAxis stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
                      borderColor: isDarkMode ? "#374151" : "#E5E7EB",
                      color: isDarkMode ? "#FFFFFF" : "#000000",
                    }}
                    formatter={(value) => [`${value} ${selectedHabit.unit}`, selectedHabit.name]}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={selectedHabit.color}
                    strokeWidth={2}
                    dot={{ r: 4, fill: selectedHabit.color }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey={() => selectedHabit.target}
                    stroke="#9CA3AF"
                    strokeDasharray="5 5"
                    name="Target"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Details */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className={`font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>Details</h4>
              <button className={`text-gray-400 ${isDarkMode ? "hover:text-gray-300" : "hover:text-gray-600"}`}>
                +
              </button>
            </div>
            {selectedHabit.steps && (
              <div className="space-y-2">
                {selectedHabit.steps.map((step, index) => (
                  <div
                    key={index}
                    className={`flex items-start p-2 ${isDarkMode ? "bg-gray-700" : "bg-green-50"} rounded-lg`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                        selectedHabit.completed
                          ? "bg-green-500 text-white"
                          : isDarkMode
                            ? "bg-gray-600 border border-gray-500"
                            : "bg-white border border-gray-300"
                      }`}
                    >
                      {selectedHabit.completed && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{step}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Streak */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className={`font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>Current Streak</h4>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedHabit.streak > 5
                    ? "bg-green-100 text-green-800"
                    : selectedHabit.streak > 2
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                }`}
              >
                {selectedHabit.streak} days
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {Array.from({ length: 7 }).map((_, i) => {
                const date = new Date()
                date.setDate(date.getDate() - i)
                const dateStr = date.toISOString().split("T")[0]
                const entry = selectedHabit.history.find((h) => h.date === dateStr)
                const completed = entry?.completed || false

                return (
                  <div
                    key={i}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm ${
                      completed ? `text-white` : isDarkMode ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-500"
                    }`}
                    style={completed ? { backgroundColor: selectedHabit.color } : {}}
                  >
                    {i === 0 ? "T" : i === 1 ? "Y" : date.getDate()}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Complete Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-3 rounded-lg font-medium ${
              selectedHabit.completed
                ? isDarkMode
                  ? "bg-gray-700 text-gray-400"
                  : "bg-gray-200 text-gray-500"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
            onClick={() => !selectedHabit.completed && handleCompleteHabit(selectedHabit)}
            disabled={selectedHabit.completed}
          >
            {selectedHabit.completed ? "Completed" : "Complete"}
          </motion.button>
        </div>
      </div>
    )
  }

  // Profile View
  const ProfileView = () => (
    <div className="pb-20">
      <div className="flex items-center mb-6">
        <button className="mr-4" onClick={() => setView("dashboard")}>
          &lt;
        </button>
        <h2 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>Profile</h2>
      </div>

      <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-sm p-4 mb-6`}>
        <div className="flex items-center mb-6">
          <div
            className="w-16 h-16 rounded-full bg-cover bg-center mr-4"
            style={{ backgroundImage: `url(${mockData.user.avatar})` }}
          ></div>
          <div>
            <h3 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              {mockData.user.name}
            </h3>
            <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              {mockData.user.streakDays} day streak
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <button
            className={`flex items-center justify-between w-full p-3 rounded-lg ${
              isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-50 hover:bg-gray-100"
            }`}
            onClick={() => setShowSettingsModal(true)}
          >
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 ${isDarkMode ? "text-gray-400" : "text-gray-500"} mr-3`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className={isDarkMode ? "text-white" : "text-gray-800"}>Settings</span>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button
            className={`flex items-center justify-between w-full p-3 rounded-lg ${
              isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-50 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 ${isDarkMode ? "text-gray-400" : "text-gray-500"} mr-3`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <span className={isDarkMode ? "text-white" : "text-gray-800"}>Statistics</span>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-sm p-4 mb-6`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>Your Stats</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
            <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"} mb-1`}>Joined</p>
            <p className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              {new Date(mockData.user.joinDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
            <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"} mb-1`}>Longest Streak</p>
            <p className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              {mockData.user.longestStreak} days
            </p>
          </div>

          <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
            <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"} mb-1`}>Total Completions</p>
            <p className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              {mockData.user.totalCompletions}
            </p>
          </div>

          <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
            <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"} mb-1`}>Current Streak</p>
            <p className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              {mockData.user.streakDays} days
            </p>
          </div>
        </div>
      </div>

      <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-sm p-4`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>Achievements</h3>

        <div className="space-y-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-xl">🔥</span>
            </div>
            <div>
              <h4 className={`font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>Streak Master</h4>
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                Maintain a streak of 7 days or more
              </p>
            </div>
            <div className="ml-auto">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-xl">🚀</span>
            </div>
            <div>
              <h4 className={`font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>Early Bird</h4>
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                Complete a habit before 8 AM for 5 days
              </p>
            </div>
            <div className="ml-auto">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-xl">🧠</span>
            </div>
            <div>
              <h4 className={`font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>Mindfulness Guru</h4>
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                Complete meditation habits 10 times
              </p>
            </div>
            <div className="ml-auto">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                <span className={`text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>7/10</span>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-xl">💪</span>
            </div>
            <div>
              <h4 className={`font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>Fitness Fanatic</h4>
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                Complete workout habits 20 times
              </p>
            </div>
            <div className="ml-auto">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                <span className={`text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>12/20</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Modals
  const StatDetailModal = () => {
    if (!selectedStat) return null

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        onClick={() => setSelectedStat(null)}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          className={`w-full max-w-2xl rounded-xl p-6 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center">
              <span className="text-3xl mr-4">{selectedStat.icon}</span>
              <div>
                <h3 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                  {selectedStat.name}
                </h3>
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Target: {selectedStat.target} {selectedStat.unit} daily
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedStat(null)}
              className={`p-2 rounded-full ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h4 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>Current Value</h4>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedStat.value >= selectedStat.target
                    ? "bg-green-100 text-green-800"
                    : selectedStat.value >= selectedStat.target * 0.7
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {selectedStat.value} {selectedStat.unit}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-4">
              <div
                className="h-2.5 rounded-full"
                style={{
                  width: `${Math.min(100, (selectedStat.value / selectedStat.target) * 100)}%`,
                  backgroundColor: selectedStat.color,
                }}
              ></div>
            </div>
            <div className="flex justify-center space-x-4 mt-4">
              <button
                onClick={() => handleUpdateStat(selectedStat.id, Math.max(0, selectedStat.value - 1))}
                className={`px-4 py-2 rounded-lg ${
                  isDarkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                - Decrease
              </button>
              <button
                onClick={() => handleUpdateStat(selectedStat.id, selectedStat.value + 1)}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              >
                + Increase
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h4 className={`font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>30-Day History</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={getFilteredData(selectedStat.history, 30)}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#E5E7EB"} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => formatDate(date)}
                    stroke={isDarkMode ? "#9CA3AF" : "#6B7280"}
                  />
                  <YAxis stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
                      borderColor: isDarkMode ? "#374151" : "#E5E7EB",
                      color: isDarkMode ? "#FFFFFF" : "#000000",
                    }}
                    formatter={(value) => [`${value} ${selectedStat.unit}`, selectedStat.name]}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={selectedStat.color}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey={() => selectedStat.target}
                    stroke="#9CA3AF"
                    strokeDasharray="5 5"
                    name="Target"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mb-6">
            <h4 className={`font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>Weekly Distribution</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getFilteredData(selectedStat.history, 7)}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#E5E7EB"} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => formatDate(date)}
                    stroke={isDarkMode ? "#9CA3AF" : "#6B7280"}
                  />
                  <YAxis stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
                      borderColor: isDarkMode ? "#374151" : "#E5E7EB",
                      color: isDarkMode ? "#FFFFFF" : "#000000",
                    }}
                    formatter={(value) => [`${value} ${selectedStat.unit}`, selectedStat.name]}
                  />
                  <Bar dataKey="value" fill={selectedStat.color} name={selectedStat.name} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setSelectedStat(null)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isDarkMode
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  const AddHabitModal = () => {
    if (!showAddHabitModal) return null

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        onClick={() => setShowAddHabitModal(false)}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          className={`w-full max-w-md rounded-xl p-6 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>Add New Habit</h3>
            <button
              onClick={() => setShowAddHabitModal(false)}
              className={`p-2 rounded-full ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="habit-name"
                className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Habit Name
              </label>
              <input
                type="text"
                id="habit-name"
                value={newHabit.name}
                onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                className={`w-full px-3 py-2 rounded-md border ${
                  isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                } focus:outline-none focus:ring-2 focus:ring-green-500`}
                placeholder="e.g., Meditation, Reading, Exercise"
              />
            </div>

            <div>
              <label
                htmlFor="habit-category"
                className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Category
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setNewHabit({ ...newHabit, category: "Productive" })}
                  className={`py-2 rounded-md transition-colors ${
                    newHabit.category === "Productive"
                      ? "bg-blue-500 text-white"
                      : isDarkMode
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Productive
                </button>
                <button
                  onClick={() => setNewHabit({ ...newHabit, category: "Sport" })}
                  className={`py-2 rounded-md transition-colors ${
                    newHabit.category === "Sport"
                      ? "bg-green-500 text-white"
                      : isDarkMode
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Sport
                </button>
                <button
                  onClick={() => setNewHabit({ ...newHabit, category: "Relax" })}
                  className={`py-2 rounded-md transition-colors ${
                    newHabit.category === "Relax"
                      ? "bg-purple-500 text-white"
                      : isDarkMode
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Relax
                </button>
                <button
                  onClick={() => setNewHabit({ ...newHabit, category: "Have Fun" })}
                  className={`py-2 rounded-md transition-colors ${
                    newHabit.category === "Have Fun"
                      ? "bg-yellow-500 text-white"
                      : isDarkMode
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Have Fun
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="habit-target"
                className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Target Value
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  id="habit-target"
                  min="1"
                  value={newHabit.target}
                  onChange={(e) => setNewHabit({ ...newHabit, target: Number.parseInt(e.target.value) || 1 })}
                  className={`w-1/3 px-3 py-2 rounded-md border ${
                    isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-green-500`}
                />
                <input
                  type="text"
                  value={newHabit.unit}
                  onChange={(e) => setNewHabit({ ...newHabit, unit: e.target.value })}
                  className={`w-2/3 px-3 py-2 rounded-md border ${
                    isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-green-500`}
                  placeholder="minutes, times, pages, etc."
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                Frequency
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setNewHabit({ ...newHabit, frequency: "daily" })}
                  className={`flex-1 py-2 rounded-md transition-colors ${
                    newHabit.frequency === "daily"
                      ? "bg-green-500 text-white"
                      : isDarkMode
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Daily
                </button>
                <button
                  onClick={() => setNewHabit({ ...newHabit, frequency: "weekly" })}
                  className={`flex-1 py-2 rounded-md transition-colors ${
                    newHabit.frequency === "weekly"
                      ? "bg-green-500 text-white"
                      : isDarkMode
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Weekly
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={() => setShowAddHabitModal(false)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isDarkMode
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleAddHabit}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              Add Habit
            </button>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  const SettingsModal = () => {
    if (!showSettingsModal) return null

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        onClick={() => setShowSettingsModal(false)}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          className={`w-full max-w-md rounded-xl p-6 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>Settings</h3>
            <button
              onClick={() => setShowSettingsModal(false)}
              className={`p-2 rounded-full ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className={`text-lg font-medium mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}>Appearance</h4>
              <div className="flex items-center justify-between">
                <span className={`${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Dark Mode</span>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    isDarkMode ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                      isDarkMode ? "translate-x-6" : "translate-x-0"
                    }`}
                  ></div>
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={() => setShowSettingsModal(false)}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  const Notification = () => {
    if (!showNotification) return null

    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-4 right-4 z-50 px-4 py-3 rounded-lg bg-green-500 text-white shadow-lg"
      >
        {notificationMessage}
      </motion.div>
    )
  }

  // Mobile Navigation
  const MobileNav = () => (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
      <div
        className={`flex justify-around items-center py-2 ${isDarkMode ? "bg-gray-900" : "bg-white"} border-t ${isDarkMode ? "border-gray-800" : "border-gray-200"}`}
      >
        <button
          onClick={() => setView("dashboard")}
          className={`p-2 rounded-full ${view === "dashboard" ? "text-green-500" : isDarkMode ? "text-gray-400" : "text-gray-600"}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </button>
        <button
          onClick={() => setView("stats")}
          className={`p-2 rounded-full ${view === "stats" ? "text-green-500" : isDarkMode ? "text-gray-400" : "text-gray-600"}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2"
            />
          </svg>
        </button>
        <button onClick={() => setShowAddHabitModal(true)} className="p-2 rounded-full bg-green-500 text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
        <button
          onClick={() => setView("schedule")}
          className={`p-2 rounded-full ${view === "schedule" ? "text-green-500" : isDarkMode ? "text-gray-400" : "text-gray-600"}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </button>
        <button
          onClick={() => setView("profile")}
          className={`p-2 rounded-full ${view === "profile" ? "text-green-500" : isDarkMode ? "text-gray-400" : "text-gray-600"}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </button>
      </div>
    </div>
  )

  // Main Render
  return (
    <div
      className={`min-h-screen pt-14 md:pt-16 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}
    >
      {view !== "landing" && <Navbar />}

      <div className="container mx-auto px-4 pt-4">
        {view === "landing" && <LandingPage />}
        {view === "dashboard" && <Dashboard />}
        {view === "stats" && <StatsView />}
        {view === "schedule" && <ScheduleView />}
        {view === "activity" && <ActivityView />}
        {view === "profile" && <ProfileView />}
      </div>

      {view !== "landing" && <MobileNav />}

      <AnimatePresence>
        {selectedStat && <StatDetailModal />}
        {showAddHabitModal && <AddHabitModal />}
        {showSettingsModal && <SettingsModal />}
        {showNotification && <Notification />}
      </AnimatePresence>
    </div>
  )
}
