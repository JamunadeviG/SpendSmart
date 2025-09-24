"use client"

import type React from "react"

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null
  onend: ((this: SpeechRecognition, ev: Event) => any) | null
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult
  length: number
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative
  length: number
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition
  new (): SpeechRecognition
}

import { useState, useEffect, useRef } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  DollarSign,
  TrendingUp,
  LucidePieChart,
  Target,
  ArrowUpRight,
  Plus,
  Edit,
  Trash2,
  Filter,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Mic,
  MicOff,
  Users,
  Lightbulb,
  BarChart3,
  Shield,
  Smartphone,
  ArrowRight,
  TrendingDown,
  Wallet,
  User,
  UserPlus,
  Bell,
  Settings,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

interface FamilyMember {
  id: string
  name: string
  email: string
  role: "primary" | "secondary"
}

interface Transaction {
  id: string
  description: string
  amount: number
  category: string
  type: "income" | "expense"
  date: string
  splitWith?: string[]
  notes?: string
  memberId?: string // Added member tracking
  memberName?: string // Added member name for display
}

interface Budget {
  id: string
  category: string
  limit: number
  spent: number
  period: "monthly" | "weekly"
}

interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  targetDate: string
  category: string
}

interface AIInsight {
  id: string
  type: "warning" | "suggestion" | "achievement"
  title: string
  description: string
  action?: string
}

export default function HomePage() {
  const [showLanding, setShowLanding] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [monthlyIncome, setMonthlyIncome] = useState("")
  const [currentLoan, setCurrentLoan] = useState("")
  const [token, setToken] = useState<string | null>(null)
  const [members, setMembers] = useState<Array<{ id: string; name: string }>>([])

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000"
  const { toast } = useToast()

  // Load authentication state from localStorage on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('authToken')
      const savedMembers = localStorage.getItem('authMembers')
      
      if (savedToken) {
        // Verify token is still valid
        try {
          const res = await fetch(`${API_BASE}/auth/me`, {
            headers: { Authorization: `Bearer ${savedToken}` },
          })
          
          if (res.ok) {
            setToken(savedToken)
            setIsAuthenticated(true)
            setShowLanding(false)
            
            if (savedMembers) {
              try {
                const parsedMembers = JSON.parse(savedMembers)
                setMembers(parsedMembers)
              } catch (error) {
                console.error('Error parsing saved members:', error)
              }
            }
          } else {
            // Token is invalid, clear localStorage
            localStorage.removeItem('authToken')
            localStorage.removeItem('authMembers')
          }
        } catch (error) {
          // Network error or invalid token, clear localStorage
          localStorage.removeItem('authToken')
          localStorage.removeItem('authMembers')
        }
      }
    }
    
    initializeAuth()
  }, [API_BASE])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) throw new Error("Login failed")
      const data = await res.json()
      const jwt = data.token as string
      setToken(jwt)
      const apiMembers: Array<{ key: "member1" | "member2"; name: string }> = data.account?.members || []
      const mapped = apiMembers
        .filter((m) => m && m.key && m.name && m.name.trim())
        .map((m) => ({ id: m.key, name: m.name }))
      setMembers(mapped)
      setIsAuthenticated(true)
      
      // Save to localStorage
      localStorage.setItem('authToken', jwt)
      localStorage.setItem('authMembers', JSON.stringify(mapped))
      
      toast({ title: "Logged in", description: "Welcome back!" })
    } catch (err) {
      toast({ title: "Login failed", description: "Please check your credentials.", variant: "destructive" as any })
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password || !name || !monthlyIncome) {
      toast({ title: "Missing info", description: "Please complete all required fields.", variant: "destructive" as any })
      return
    }
    if (password.length < 6) {
      toast({ title: "Weak password", description: "Password must be at least 6 characters.", variant: "destructive" as any })
      return
    }
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: name,
          email,
          password,
          member1Name: name
        }),
      })
      if (!res.ok) throw new Error("Register failed")
      const data = await res.json()
      const jwt = data.token as string
      setToken(jwt)
      const apiMembers: Array<{ key: "member1" | "member2"; name: string }> = data.account?.members || []
      const mapped = apiMembers
        .filter((m) => m && m.key && m.name && m.name.trim())
        .map((m) => ({ id: m.key, name: m.name }))
      setMembers(mapped)
      
      // Save to localStorage
      localStorage.setItem('authToken', jwt)
      localStorage.setItem('authMembers', JSON.stringify(mapped))

      // Create initial income transaction for member1
      if (jwt && monthlyIncome) {
        try {
          await fetch(`${API_BASE}/transactions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwt}`,
            },
            body: JSON.stringify({
              memberKey: "member1",
              amount: Number(monthlyIncome),
              type: "income",
              category: "Income",
              date: new Date().toISOString().slice(0, 10),
              notes: "Initial monthly income",
            }),
          })
        } catch {
          // ignore initial income failure
        }
      }

      setIsAuthenticated(true)
      toast({ title: "Account created", description: "We set an initial income entry for you." })
    } catch (err) {
      toast({ title: "Signup failed", description: "Please try again.", variant: "destructive" as any })
    }
  }

  if (showLanding) {
    return <LandingPage onGetStarted={() => setShowLanding(false)} />
  }

  if (isAuthenticated) {
    return (
      <FinanceDashboard
        userIncome={Number(monthlyIncome) || 0}
        userLoan={Number(currentLoan) || 0}
        members={members}
        token={token}
        apiBase={API_BASE}
        toast={toast}
        onLogout={() => {
          setIsAuthenticated(false)
          setToken(null)
          setMembers([])
          // Clear localStorage on logout
          localStorage.removeItem('authToken')
          localStorage.removeItem('authMembers')
          localStorage.removeItem('activeTab')
          localStorage.removeItem('currentMember')
          localStorage.removeItem('viewMode')
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h1>
          <p className="text-gray-600 dark:text-gray-400">Sign in to your account or create a new one</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Enter your credentials to access your account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
                    Login
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>Fill in your details to get started</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Primary Member Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter primary member name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthly-income">Monthly Income</Label>
                    <Input
                      id="monthly-income"
                      type="number"
                      placeholder="Enter your monthly income"
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="current-loan">Current Loan Amount (Optional)</Label>
                    <Input
                      id="current-loan"
                      type="number"
                      placeholder="Enter your current loan amount"
                      value={currentLoan}
                      onChange={(e) => setCurrentLoan(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
                    Create Account
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function LandingPage({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-8 w-8 text-emerald-600" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">FinanceTracker</span>
          </div>
          <Button
            onClick={onGetStarted}
            variant="outline"
            className="border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white bg-transparent"
          >
            Get Started
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 text-balance">
          Take Control of Your <span className="text-emerald-600">Financial Future</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto text-pretty">
          Track expenses, manage budgets, and achieve your financial goals with our comprehensive finance tracker.
        </p>
        <Button onClick={onGetStarted} size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8 py-3">
          Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Everything You Need to Manage Your Money
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <BarChart3 className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Smart Analytics</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get insights into your spending patterns with beautiful charts and AI-powered recommendations.
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Shield className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your financial data is encrypted and secure. We never share your information with third parties.
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Smartphone className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Mobile Ready</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Access your finances anywhere with our responsive design that works on all devices.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Ready to Get Started?</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Join thousands of users who have taken control of their finances with FinanceTracker.
            </p>
            <Button onClick={onGetStarted} size="lg" className="bg-emerald-600 hover:bg-emerald-700">
              Create Your Free Account
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

function FinanceDashboard({
  userIncome,
  userLoan,
  members,
  token,
  apiBase,
  onLogout,
  toast,
}: {
  userIncome: number
  userLoan: number
  members: Array<{ id: string; name: string }>
  token: string | null
  apiBase: string
  onLogout: () => void
  toast: any
}) {
  const [activeTab, setActiveTab] = useState<
    | "dashboard"
    | "transactions"
    | "budgets"
    | "goals"
    | "insights"
    | "profile"
    | "account"
  >("dashboard")

  // Persist activeTab to localStorage
  useEffect(() => {
    const savedTab = localStorage.getItem('activeTab')
    if (savedTab && ['dashboard', 'transactions', 'budgets', 'goals', 'insights', 'profile', 'account'].includes(savedTab)) {
      setActiveTab(savedTab as any)
    }
  }, [])

  // Save activeTab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('activeTab', activeTab)
  }, [activeTab])
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(
    members && members.length
      ? members.map((m, idx) => ({ id: m.id, name: m.name, email: "", role: idx === 0 ? "primary" : "secondary" }))
      : []
  )
  const [currentMember, setCurrentMember] = useState<string>(members?.[0]?.id || "")
  const [viewMode, setViewMode] = useState<"individual" | "family">("individual")

  // Persist currentMember and viewMode to localStorage
  useEffect(() => {
    const savedMember = localStorage.getItem('currentMember')
    const savedViewMode = localStorage.getItem('viewMode')
    
    if (savedMember && familyMembers.some(m => m.id === savedMember)) {
      setCurrentMember(savedMember)
    }
    
    if (savedViewMode && ['individual', 'family'].includes(savedViewMode)) {
      setViewMode(savedViewMode as 'individual' | 'family')
    }
  }, [familyMembers])

  // Save currentMember and viewMode to localStorage whenever they change
  useEffect(() => {
    if (currentMember) {
      localStorage.setItem('currentMember', currentMember)
    }
  }, [currentMember])

  useEffect(() => {
    localStorage.setItem('viewMode', viewMode)
  }, [viewMode])
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false)
  const [memberName, setMemberName] = useState("")
  const [memberEmail, setMemberEmail] = useState("")

  const [budgets, setBudgets] = useState<Budget[]>([])

  const [goals, setGoals] = useState<Goal[]>([])

  const [aiInsights] = useState<AIInsight[]>([
    {
      id: "1",
      type: "suggestion",
      title: "Welcome to FinanceTracker!",
      description: "Start by adding your first transaction to begin tracking your expenses.",
      action: "Add Transaction",
    },
    {
      id: "2",
      type: "suggestion",
      title: "Set Up Your Budget",
      description: "Create budgets for different categories to better manage your spending.",
      action: "Create Budget",
    },
  ])

  const [dailyQuote, setDailyQuote] = useState<{ text: string; author: string } | null>(null)

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch("https://api.quotable.io/random?tags=motivational,success,money")
        const data = await response.json()
        setDailyQuote({ text: data.content, author: data.author })
      } catch (error) {
        // Fallback quote if API fails
        setDailyQuote({
          text: "The real measure of your wealth is how much you'd be worth if you lost all your money.",
          author: "Benjamin Franklin",
        })
      }
    }
    fetchQuote()
  }, [])

  // Load user profile (user + account members)
  useEffect(() => {
    const loadProfile = async () => {
      if (!token) return
      try {
        const res = await fetch(`${apiBase}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) return
        const data = await res.json()
        setProfile(data)
        const members = data?.account?.members || []
        const m1 = members.find((m: any) => m.key === 'member1')
        const m2 = members.find((m: any) => m.key === 'member2')
        setMember1Edit(m1?.name || "")
        setMember2Edit(m2?.name || "")
      } catch {
        // ignore
      }
    }
    loadProfile()
  }, [token, apiBase])

  // Fetch transactions from backend when authenticated
  useEffect(() => {
    const load = async () => {
      if (!token) return
      try {
        const res = await fetch(`${apiBase}/transactions`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) return
        const data = await res.json()
        // Map backend transactions to UI model
        const memberNameMap = new Map(familyMembers.map((m) => [m.id, m.name]))
        const mapped: Transaction[] = data.map((t: any) => ({
          id: t._id,
          description: t.notes || t.category || "Transaction",
          amount: t.type === "expense" ? -Math.abs(Number(t.amount)) : Math.abs(Number(t.amount)),
          category: t.category,
          type: t.type,
          date: new Date(t.date).toISOString().slice(0, 10),
          notes: t.notes,
          memberId: t.memberKey,
          memberName: memberNameMap.get(t.memberKey) || t.memberKey,
        }))
        setTransactions(mapped)
      } catch {
        // ignore
      }
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  // Fetch budgets from backend when authenticated
  useEffect(() => {
    const loadBudgets = async () => {
      if (!token) return
      try {
        const res = await fetch(`${apiBase}/budgets`, { headers: { Authorization: `Bearer ${token}` } })
        if (res.ok) {
          const data = await res.json()
          const mapped: Budget[] = data.map((b: any) => ({
            id: b._id,
            category: b.category,
            limit: b.amount,
            spent: 0, // Will be calculated from transactions
            period: b.period,
          }))
          setBudgets(mapped)
        }
      } catch {
        // ignore
      }
    }
    loadBudgets()
  }, [token, apiBase])

  // Fetch goals from backend when authenticated
  useEffect(() => {
    const loadGoals = async () => {
      if (!token) return
      try {
        const res = await fetch(`${apiBase}/goals`, { headers: { Authorization: `Bearer ${token}` } })
        if (res.ok) {
          const data = await res.json()
          const mapped: Goal[] = data.map((g: any) => ({
            id: g._id,
            name: g.name,
            targetAmount: g.targetAmount,
            currentAmount: g.currentAmount,
            targetDate: new Date(g.deadline).toISOString().slice(0, 10),
            category: "General", // Backend doesn't have category field
          }))
          setGoals(mapped)
        }
      } catch {
        // ignore
      }
    }
    loadGoals()
  }, [token, apiBase])

  const [filterCategory, setFilterCategory] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [isAddBudgetDialogOpen, setIsAddBudgetDialogOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null)
  const [isAddGoalDialogOpen, setIsAddGoalDialogOpen] = useState(false)
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)

  // State to control visibility of transaction/budget forms from insights
  const [showTransactionForm, setShowTransactionForm] = useState(false)
  const [showBudgetForm, setShowBudgetForm] = useState(false)

  // Form states
  const [formDescription, setFormDescription] = useState("")
  const [formAmount, setFormAmount] = useState("")
  const [formCategory, setFormCategory] = useState("")
  const [formType, setFormType] = useState<"income" | "expense">("expense")
  const [formDate, setFormDate] = useState("")
  const [formNotes, setFormNotes] = useState("")
  const [formSplitWith, setFormSplitWith] = useState("")

  // Budget form states
  const [budgetCategory, setBudgetCategory] = useState("")
  const [budgetLimit, setBudgetLimit] = useState("")
  const [budgetPeriod, setBudgetPeriod] = useState<"monthly" | "weekly">("monthly")

  // Goal form states
  const [goalName, setGoalName] = useState("")
  const [goalTarget, setGoalTarget] = useState("")
  const [goalCurrent, setGoalCurrent] = useState("")
  const [goalDate, setGoalDate] = useState("")
  const [goalCategory, setGoalCategory] = useState("")

  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [newUsername, setNewUsername] = useState("")
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [member1Edit, setMember1Edit] = useState("")
  const [member2Edit, setMember2Edit] = useState("")
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const receiptInputRef = useRef<HTMLInputElement | null>(null)
  const [isScanning, setIsScanning] = useState(false)

  // Keep local familyMembers in sync with profile data so names render correctly
  useEffect(() => {
    const membersFromProfile = profile?.account?.members as Array<{ key?: string; id?: string; name?: string }> | undefined
    if (!membersFromProfile) return
    
    // Only process actual members from the database, don't create defaults
    const processedMembers = membersFromProfile
      .filter((m) => m && (m.key || m.id) && m.name && m.name.trim())
      .map((m, idx) => ({
        id: (m.key || m.id) as string,
        name: m.name!.trim(),
        email: '',
        role: idx === 0 ? 'primary' as const : 'secondary' as const
      }))

    if (processedMembers.length) {
      setFamilyMembers(processedMembers)
      if (!currentMember || !processedMembers.find((m) => m.id === currentMember)) {
        // Always default to member1 if it exists
        setCurrentMember(processedMembers[0].id)
      }
    }
  }, [profile])

  useEffect(() => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()

      recognitionInstance.continuous = false
      recognitionInstance.interimResults = false
      recognitionInstance.lang = "en-US"

      recognitionInstance.onstart = () => {
        setIsListening(true)
      }

      recognitionInstance.onend = () => {
        setIsListening(false)
      }

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase()
        parseVoiceInput(transcript)
      }

      recognitionInstance.onerror = (event) => {
        console.error("Speech recognition error:", event.error)
        setIsListening(false)
      }

      recognitionRef.current = recognitionInstance
    }
  }, [])

  const parseVoiceInput = (transcript: string) => {
    console.log("[v0] Voice transcript:", transcript)

    // Extract amount (look for numbers)
    const amountMatch = transcript.match(/(\d+(?:\.\d{2})?)/)
    if (amountMatch) {
      setFormAmount(amountMatch[1])
    }

    // Determine type (income vs expense)
    if (
      transcript.includes("income") ||
      transcript.includes("earned") ||
      transcript.includes("received") ||
      transcript.includes("salary")
    ) {
      setFormType("income")
    } else {
      setFormType("expense")
    }

    // Extract category based on keywords
    const categoryKeywords = {
      "Food & Dining": ["food", "restaurant", "lunch", "dinner", "breakfast", "meal", "grocery", "groceries"],
      Transportation: ["gas", "fuel", "uber", "taxi", "bus", "train", "transport"],
      Entertainment: ["movie", "cinema", "game", "entertainment", "fun", "party"],
      Shopping: ["shopping", "clothes", "shirt", "shoes", "buy", "purchase"],
      Utilities: ["electricity", "water", "internet", "phone", "utility", "bill"],
      Healthcare: ["doctor", "medicine", "hospital", "health", "medical"],
      Education: ["book", "course", "school", "education", "learning"],
      Other: [],
    }

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some((keyword) => transcript.includes(keyword))) {
        setFormCategory(category)
        break
      }
    }

    // Extract description (use the full transcript as description, cleaned up)
    const description = transcript
      .replace(/(\d+(?:\.\d{2})?)/g, "") // Remove numbers
      .replace(/(\$|dollars?|bucks?|cents?)/gi, "") // Remove currency words
      .replace(/(for|on|at|in|spent|paid|bought|of)/gi, "") // Remove common prepositions and verbs
      .trim()
      .replace(/\s+/g, " ") // Clean up extra spaces

    if (description) {
      setFormDescription(description.charAt(0).toUpperCase() + description.slice(1))
    }

    // Set today's date if not already set
    if (!formDate) {
      const today = new Date().toISOString().split("T")[0]
      setFormDate(today)
    }
  }

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in your browser")
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
    } else {
      recognitionRef.current.start()
    }
  }

  const categories = [
    "Food & Dining",
    "Transportation",
    "Utilities",
    "Entertainment",
    "Shopping",
    "Healthcare",
    "Income",
    "Investment",
    "Other",
  ]

  // Main navigation tabs for the dashboard
  const MAIN_TABS = ["dashboard", "transactions", "budgets", "goals", "insights"] as const
  type MainTab = typeof MAIN_TABS[number]

  const calculateSpentAmount = (category: string) => {
    return transactions
      .filter((t) => t.category === category && t.type === "expense")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)
  }

  const updatedBudgets = budgets.map((budget) => ({
    ...budget,
    spent: calculateSpentAmount(budget.category),
  }))

  const handleVoiceRecord = () => {
    handleVoiceInput()
  }

  // Map backend OCR category keywords to UI category values
  const mapOCRCategory = (raw: string | undefined): string => {
    if (!raw) return "Other"
    const v = raw.toLowerCase()
    if (v.includes("food") || v.includes("dining") || v.includes("grocery")) return "Food & Dining"
    if (v.includes("transport")) return "Transportation"
    if (v.includes("entertainment") || v.includes("movie") || v.includes("cinema")) return "Entertainment"
    if (v.includes("shopping") || v.includes("store") || v.includes("amazon") || v.includes("flipkart")) return "Shopping"
    if (v.includes("utility") || v.includes("electricity") || v.includes("water") || v.includes("internet") || v.includes("phone")) return "Utilities"
    if (v.includes("health")) return "Healthcare"
    if (v.includes("income")) return "Income"
    return "Other"
  }

  const triggerReceiptScan = () => {
    if (receiptInputRef.current) receiptInputRef.current.click()
  }

  const handleReceiptSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!token) {
      toast({ title: "Login required", description: "Please log in to scan receipts.", variant: "destructive" as any })
      return
    }
    try {
      setIsScanning(true)
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch(`${apiBase}/receipts/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      })
      if (!res.ok) throw new Error('Failed to scan receipt')
      const data = await res.json()
      const t = data.transaction as { description?: string; category?: string; type?: 'income'|'expense'; amount?: number; date?: string }
      if (t) {
        setFormDescription(t.description || '')
        setFormAmount((t.amount ?? 0).toString())
        setFormType(t.type || 'expense')
        setFormCategory(mapOCRCategory(t.category))
        setFormDate((t.date || new Date().toISOString().slice(0,10)))
        setIsAddDialogOpen(true)
        setShowTransactionForm(true)
        toast({ title: 'Receipt scanned', description: 'We prefilled the transaction form. Please review and save.' })
      }
    } catch (err) {
      toast({ title: 'Scan failed', description: 'Could not extract details from the receipt.', variant: 'destructive' as any })
    } finally {
      setIsScanning(false)
      if (receiptInputRef.current) receiptInputRef.current.value = ''
    }
  }

  // Derived: transactions scoped by view
  const scopedTransactions = viewMode === "family"
    ? transactions
    : transactions.filter((t) => {
        // Include transactions where the member is the primary owner
        if (t.memberId === currentMember) return true
        
        // Include split transactions where the current member is in the splitWith list
        if (t.splitWith && t.splitWith.includes(familyMembers.find(m => m.id === currentMember)?.name || "")) return true
        
        // Include split transactions where the member name matches (for temporary split IDs)
        if (t.memberId && t.memberId.startsWith("split_") && t.memberName === familyMembers.find(m => m.id === currentMember)?.name) return true
        
        return false
      })

  // Derived: filtered transactions for UI list
  const filteredTransactions = scopedTransactions.filter((t) => {
    const byCategory = filterCategory === "all" || t.category === filterCategory
    const byType = filterType === "all" || t.type === filterType
    return byCategory && byType
  })

  // Derived: totals
  const totalIncome = scopedTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Math.abs(Number(t.amount || 0)), 0)

  const totalExpenses = scopedTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Math.abs(Number(t.amount || 0)), 0)

  // Derived: monthly trend for last 6 months
  const monthlyData = (() => {
    const now = new Date()
    const months: { month: string; income: number; expenses: number; savings: number }[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
      const label = d.toLocaleString(undefined, { month: "short" })
      const inMonth = scopedTransactions.filter((t) => new Date(t.date).getFullYear() === d.getFullYear() && new Date(t.date).getMonth() === d.getMonth())
      const inc = inMonth.filter((t) => t.type === "income").reduce((s, t) => s + Math.abs(Number(t.amount || 0)), 0)
      const exp = inMonth.filter((t) => t.type === "expense").reduce((s, t) => s + Math.abs(Number(t.amount || 0)), 0)
      months.push({ month: label, income: inc, expenses: exp, savings: Math.max(inc - exp, 0) })
    }
    return months
  })()

  // Derived: weekly spending (last 7 days with data)
  const weeklySpending = (() => {
    const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const values = new Array(7).fill(0)
    
    // Get all expense transactions
    const expenseTransactions = scopedTransactions.filter(t => t.type === "expense")
    
    console.log('Weekly spending calculation:', {
      totalTransactions: scopedTransactions.length,
      expenseTransactions: expenseTransactions.length,
      transactions: expenseTransactions.map(t => ({
        description: t.description,
        amount: t.amount,
        date: t.date,
        category: t.category
      }))
    })
    
    // If we have expense transactions, show the last 7 days of data
    if (expenseTransactions.length > 0) {
      const now = new Date()
      
      // Calculate the last 7 days
      for (let i = 6; i >= 0; i--) {
        const dayDate = new Date(now)
        dayDate.setDate(now.getDate() - i)
        const dayOfWeek = dayDate.getDay()
        
        // Find expenses for this specific day
        const dayExpenses = expenseTransactions.filter(t => {
          const transactionDate = new Date(t.date)
          return transactionDate.toDateString() === dayDate.toDateString()
        })
        
        const dayTotal = dayExpenses.reduce((sum, t) => sum + Math.abs(Number(t.amount || 0)), 0)
        values[dayOfWeek] = dayTotal
        
        if (dayTotal > 0) {
          console.log(`${labels[dayOfWeek]} (${dayDate.toISOString().slice(0, 10)}): $${dayTotal}`)
        }
      }
    }
    
    const result = labels.map((label, idx) => ({ day: label, amount: values[idx] }))
    console.log('Weekly spending result:', result)
    return result
  })()

  // Derived: expense categories pie
  const expenseCategories = (() => {
    const map = new Map<string, number>()
    scopedTransactions.forEach((t) => {
      if (t.type !== "expense") return
      map.set(t.category, (map.get(t.category) || 0) + Math.abs(Number(t.amount || 0)))
    })
    const palette = ["#10b981", "#ef4444", "#3b82f6", "#f59e0b", "#8b5cf6", "#06b6d4", "#84cc16", "#e11d48"]
    return Array.from(map.entries()).map(([name, value], i) => ({ name, value, color: palette[i % palette.length] }))
  })()

  // Helpers
  function getBudgetStatus(b: Budget) {
    const percentage = b.limit > 0 ? (b.spent / b.limit) * 100 : 0
    if (percentage >= 100) return { color: "text-red-600" }
    if (percentage >= 80) return { color: "text-yellow-600" }
    return { color: "text-emerald-600" }
  }

  // Budgets filter helper (extend later if needed)
  function getFilteredBudgets(): Budget[] {
    // For now, budgets are global; in future this can filter by member/view
    return updatedBudgets
  }

  // Transaction form helpers
  const resetForm = () => {
    setFormDescription("")
    setFormAmount("")
    setFormCategory("")
    setFormType("expense")
    setFormDate("")
    setFormNotes("")
    setFormSplitWith("")
  }

  const handleAddTransaction = async () => {
    const splitWithMembers = formSplitWith ? formSplitWith.split(",").map((s) => s.trim()).filter(Boolean) : []
    const payload = {
      memberKey: currentMember,
      amount: Number(formAmount || 0),
      type: formType,
      category: formCategory || (formType === "income" ? "Income" : "Other"),
      date: formDate || new Date().toISOString().slice(0, 10),
      notes: formDescription || formNotes,
      splitWith: splitWithMembers,
    }
    try {
      if (token) {
        await fetch(`${apiBase}/transactions`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        })
        // reload
        const res = await fetch(`${apiBase}/transactions`, { headers: { Authorization: `Bearer ${token}` } })
        if (res.ok) {
          const data = await res.json()
          const memberNameMap = new Map(familyMembers.map((m) => [m.id, m.name]))
          const mapped: Transaction[] = data.map((t: any) => ({
            id: t._id,
            description: t.notes || t.category || "Transaction",
            amount: t.type === "expense" ? -Math.abs(Number(t.amount)) : Math.abs(Number(t.amount)),
            category: t.category,
            type: t.type,
            date: new Date(t.date).toISOString().slice(0, 10),
            notes: t.notes,
            splitWith: t.splitWith || [],
            memberId: t.memberKey,
            memberName: memberNameMap.get(t.memberKey) || t.memberKey,
          }))
          setTransactions(mapped)
        }
      } else {
        // Handle split transactions locally
        if (splitWithMembers.length > 0) {
          const totalMembers = 1 + splitWithMembers.length // current member + split members
          const splitAmount = payload.amount / totalMembers

          const newTransactions: Transaction[] = []

          // Add transaction for current member
          const currentMemberTx: Transaction = {
            id: String(Date.now()),
            description: payload.notes || payload.category,
            amount: payload.type === "expense" ? -Math.abs(splitAmount) : Math.abs(splitAmount),
            category: payload.category,
            type: payload.type,
            date: payload.date,
            notes: payload.notes,
            splitWith: payload.splitWith,
            memberId: currentMember,
            memberName: familyMembers.find((m) => m.id === currentMember)?.name || currentMember,
          }
          newTransactions.push(currentMemberTx)

          // Add transactions for split members
          splitWithMembers.forEach((memberName, index) => {
            const splitMemberTx: Transaction = {
              id: String(Date.now() + index + 1),
              description: `${payload.notes || payload.category} (split with ${familyMembers.find((m) => m.id === currentMember)?.name || currentMember})`,
              amount: payload.type === "expense" ? -Math.abs(splitAmount) : Math.abs(splitAmount),
              category: payload.category,
              type: payload.type,
              date: payload.date,
              notes: `Split transaction with ${memberName}`,
              splitWith: payload.splitWith,
              memberId: "split_" + memberName, // Temporary ID for split members
              memberName: memberName,
            }
            newTransactions.push(splitMemberTx)
          })

          setTransactions((prev) => [...newTransactions, ...prev])
          toast({ title: "Success", description: `Transaction added and split with ${splitWithMembers.join(", ")}` })
        } else {
          // Single transaction (no split)
          const newTx: Transaction = {
            id: String(Date.now()),
            description: payload.notes || payload.category,
            amount: payload.type === "expense" ? -Math.abs(payload.amount) : Math.abs(payload.amount),
            category: payload.category,
            type: payload.type,
            date: payload.date,
            notes: payload.notes,
            memberId: currentMember,
            memberName: familyMembers.find((m) => m.id === currentMember)?.name || currentMember,
          }
          setTransactions((prev) => [newTx, ...prev])
        }
      }
    } finally {
      resetForm()
    }
  }

  const startEdit = (tx: Transaction) => {
    setEditingTransaction(tx)
    setFormDescription(tx.description || "")
    setFormAmount(String(Math.abs(tx.amount)))
    setFormCategory(tx.category)
    setFormType(tx.type)
    setFormDate(tx.date)
    setFormNotes(tx.notes || "")
    setFormSplitWith(tx.splitWith?.join(", ") || "")
  }

  const handleDeleteTransaction = async (id: string) => {
    if (token) {
      await fetch(`${apiBase}/transactions/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } })
      const res = await fetch(`${apiBase}/transactions`, { headers: { Authorization: `Bearer ${token}` } })
      if (res.ok) {
        const data = await res.json()
        const memberNameMap = new Map(familyMembers.map((m) => [m.id, m.name]))
        const mapped: Transaction[] = data.map((t: any) => ({
          id: t._id,
          description: t.notes || t.category || "Transaction",
          amount: t.type === "expense" ? -Math.abs(Number(t.amount)) : Math.abs(Number(t.amount)),
          category: t.category,
          type: t.type,
          date: new Date(t.date).toISOString().slice(0, 10),
          notes: t.notes,
          memberId: t.memberKey,
          memberName: memberNameMap.get(t.memberKey) || t.memberKey,
        }))
        setTransactions(mapped)
      }
    } else {
      setTransactions((prev) => prev.filter((t) => t.id !== id))
    }
  }

  const handleEditTransaction = async () => {
    if (!editingTransaction) return
    const payload = {
      memberKey: editingTransaction.memberId || currentMember,
      amount: Number(formAmount || 0),
      type: formType,
      category: formCategory || editingTransaction.category,
      date: formDate || editingTransaction.date,
      notes: formDescription || formNotes,
    }
    if (token) {
      await fetch(`${apiBase}/transactions/${editingTransaction.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      })
      const res = await fetch(`${apiBase}/transactions`, { headers: { Authorization: `Bearer ${token}` } })
      if (res.ok) {
        const data = await res.json()
        const memberNameMap = new Map(familyMembers.map((m) => [m.id, m.name]))
        const mapped: Transaction[] = data.map((t: any) => ({
          id: t._id,
          description: t.notes || t.category || "Transaction",
          amount: t.type === "expense" ? -Math.abs(Number(t.amount)) : Math.abs(Number(t.amount)),
          category: t.category,
          type: t.type,
          date: new Date(t.date).toISOString().slice(0, 10),
          notes: t.notes,
          memberId: t.memberKey,
          memberName: memberNameMap.get(t.memberKey) || t.memberKey,
        }))
        setTransactions(mapped)
      }
    } else {
      setTransactions((prev) => prev.map((t) => t.id === editingTransaction.id ? {
        ...t,
        description: payload.notes || t.description,
        amount: payload.type === "expense" ? -Math.abs(payload.amount) : Math.abs(payload.amount),
        category: payload.category,
        type: payload.type,
        date: payload.date,
        notes: payload.notes,
      } : t))
    }
    setEditingTransaction(null)
    resetForm()
  }

  // Budget helpers (client-side)
  const resetBudgetForm = () => {
    setBudgetCategory("")
    setBudgetLimit("")
    setBudgetPeriod("monthly")
  }

  const handleAddBudget = async () => {
    const b: Budget = {
      id: String(Date.now()),
      category: budgetCategory || "Other",
      limit: Number(budgetLimit || 0),
      spent: 0,
      period: budgetPeriod,
    }
    
    try {
      if (token) {
        // Save to backend
        const payload = {
          memberKey: viewMode === "family" ? null : currentMember,
          category: b.category,
          amount: b.limit,
          period: b.period,
        }
        
        const res = await fetch(`${apiBase}/budgets`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        })
        
        if (res.ok) {
          const savedBudget = await res.json()
          b.id = savedBudget._id // Use backend ID
          toast({ title: "Success", description: "Budget created successfully!" })
        } else {
          throw new Error("Failed to save budget")
        }
      } else {
        // Local fallback
        toast({ title: "Success", description: "Budget created (local only)" })
      }
      
      setBudgets((prev) => [...prev, b])
      resetBudgetForm()
      setIsAddBudgetDialogOpen(false)
      setShowBudgetForm(false)
    } catch (error) {
      console.error('Budget creation error:', error)
      toast({ title: "Error", description: "Failed to create budget. Please try again.", variant: "destructive" as any })
    }
  }

  const startEditBudget = (b: Budget) => {
    setEditingBudget(b)
    setBudgetCategory(b.category)
    setBudgetLimit(String(b.limit))
    setBudgetPeriod(b.period)
  }

  const handleDeleteBudget = (id: string) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id))
  }

  const handleEditBudget = () => {
    if (!editingBudget) return
    setBudgets((prev) => prev.map((b) => b.id === editingBudget.id ? {
      ...b,
      category: budgetCategory || b.category,
      limit: Number(budgetLimit || b.limit),
      period: budgetPeriod,
    } : b))
    setEditingBudget(null)
    resetBudgetForm()
  }

  // Goal helpers (client-side)
  const resetGoalForm = () => {
    setGoalName("")
    setGoalTarget("")
    setGoalCurrent("")
    setGoalDate("")
    setGoalCategory("")
  }

  const handleAddGoal = async () => {
    const g: Goal = {
      id: String(Date.now()),
      name: goalName || "New Goal",
      targetAmount: Number(goalTarget || 0),
      currentAmount: Number(goalCurrent || 0),
      targetDate: goalDate || new Date().toISOString().slice(0, 10),
      category: goalCategory || "General",
    }
    
    try {
      if (token) {
        // Save to backend
        const payload = {
          memberKey: viewMode === "family" ? null : currentMember,
          name: g.name,
          targetAmount: g.targetAmount,
          currentAmount: g.currentAmount,
          deadline: g.targetDate,
        }
        
        const res = await fetch(`${apiBase}/goals`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        })
        
        if (res.ok) {
          const savedGoal = await res.json()
          g.id = savedGoal._id // Use backend ID
          toast({ title: "Success", description: "Goal created successfully!" })
        } else {
          throw new Error("Failed to save goal")
        }
      } else {
        // Local fallback
        toast({ title: "Success", description: "Goal created (local only)" })
      }
      
      setGoals((prev) => [...prev, g])
      resetGoalForm()
      setIsAddGoalDialogOpen(false)
    } catch (error) {
      console.error('Goal creation error:', error)
      toast({ title: "Error", description: "Failed to create goal. Please try again.", variant: "destructive" as any })
    }
  }

  const addFamilyMember = async () => {
    if (!memberName || !memberName.trim()) return
    const hasMember2 = familyMembers.some((m) => m.id === "member2")
    if (hasMember2) return
    
    try {
      const m1Name = familyMembers.find((m) => m.id === "member1")?.name || familyMembers[0]?.name || "Member 1"
      const requestBody = { 
        members: [ 
          { key: "member1", name: m1Name }, 
          { key: "member2", name: memberName.trim() } 
        ] 
      }
      
      console.log('Adding member with request:', requestBody)
      
      const res = await fetch(`${apiBase}/auth/members`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(requestBody)
      })
      
      if (res.ok) {
        const result = await res.json()
        console.log('Add member response:', result)
        
        // Refresh user data to get updated members
        const me = await fetch(`${apiBase}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
        if (me.ok) {
          const data = await me.json()
          const apiMembers: Array<{ key: "member1" | "member2"; name: string }> = data.account?.members || []
          const mapped = apiMembers.map((m) => ({ id: m.key, name: m.name, email: "", role: m.key === "member1" ? "primary" : "secondary" }))
          setFamilyMembers(mapped as any)
          setProfile(data)
          setCurrentMember("member2")
          toast({ title: "Success", description: `${memberName.trim()} has been added as a family member!` })
        }
      } else {
        const errorData = await res.json()
        console.error('Add member failed:', errorData)
        toast({ title: "Error", description: errorData.message || "Failed to add family member", variant: "destructive" as any })
      }
    } catch (error) {
      console.error('Add member error:', error)
      toast({ title: "Error", description: "Failed to add family member. Please try again.", variant: "destructive" as any })
    } finally {
      setMemberName("")
      setMemberEmail("")
      setIsAddMemberDialogOpen(false)
    }
  }

  const handleExport = (format: "csv" | "pdf") => {
    const data = transactions.map((t) => ({
      Date: t.date,
      Description: t.description,
      Category: t.category,
      Type: t.type,
      Amount: t.amount,
      Notes: t.notes || "",
      "Split With": t.splitWith?.join(", ") || "",
    }))

    if (format === "csv") {
      const csv = [Object.keys(data[0]).join(","), ...data.map((row) => Object.values(row).join(","))].join("\n")
      const blob = new Blob([csv], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "transactions.csv"
      a.click()
    }
    setIsExportDialogOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Header left section: logo + member selector + view toggle */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-8 w-8 text-emerald-600" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">FinanceTracker</h1>
              </div>

              <div className="flex items-center space-x-2 ml-8">
                <Select value={currentMember} onValueChange={setCurrentMember}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select member" />
                  </SelectTrigger>
                  <SelectContent>
                    {familyMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name || (member.id === 'member1' ? 'Member 1' : member.id === 'member2' ? 'Member 2' : member.id)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode(viewMode === "individual" ? "family" : "individual")}
                >
                  {viewMode === "individual" ? <Users className="h-4 w-4 mr-1" /> : <User className="h-4 w-4 mr-1" />}
                  {viewMode === "individual" ? "Family View" : "Individual"}
                </Button>
              </div>
            </div>

            {/* Header right section */}
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddMemberDialogOpen(true)}
                disabled={familyMembers.some((m) => m.id === 'member2')}
              >
                <UserPlus className="h-4 w-4 mr-1" />
                Add Member
              </Button>
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" aria-label="Settings">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setActiveTab("profile")}>Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("account")}>Account Details</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* Add Member Dialog */}
              <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Family Member</DialogTitle>
                    <DialogDescription>Enter the name for the additional family member.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="new-member-name">Member Name</Label>
                      <Input
                        id="new-member-name"
                        placeholder="e.g., Alex"
                        value={memberName}
                        onChange={(e) => setMemberName(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => { setIsAddMemberDialogOpen(false); setMemberName("") }}>Cancel</Button>
                    <Button
                      onClick={async () => {
                        const name = memberName.trim()
                        if (!name) return
                        setSaving(true); setMessage(null)
                        try {
                          const res = await fetch(`${apiBase}/auth/members`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                            body: JSON.stringify({ members: [ { key: 'member1', name: member1Edit || familyMembers[0]?.name || 'Member 1' }, { key: 'member2', name } ] })
                          })
                          if (res.ok) {
                            setMessage('Member added')
                            const me = await fetch(`${apiBase}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
                            if (me.ok) {
                              const data = await me.json()
                              setProfile(data)
                              const apiMembers: Array<{ key: 'member1' | 'member2'; name: string }> = data?.account?.members || []
                              const mapped = apiMembers
                                .filter((m: any) => m.key === 'member1' || (m.key === 'member2' && m.name && m.name.trim() && m.name.trim() !== 'Member 2'))
                                .map((m: any) => ({ id: m.key, name: m.name }))
                              setFamilyMembers(
                                mapped.length
                                  ? mapped.map((m, idx) => ({ id: m.id, name: m.name, email: '', role: idx === 0 ? 'primary' : 'secondary' }))
                                  : [{ id: 'member1', name: member1Edit || 'Member 1', email: '', role: 'primary' }]
                              )
                              const m1 = apiMembers.find((m: any) => m.key === 'member1')
                              const m2 = apiMembers.find((m: any) => m.key === 'member2')
                              setMember1Edit(m1?.name || '')
                              setMember2Edit(m2?.name || '')
                              if (m2?.name) setCurrentMember('member2')
                            }
                            setIsAddMemberDialogOpen(false)
                            setMemberName("")
                          } else {
                            setMessage('Failed to add member')
                          }
                        } finally {
                          setSaving(false)
                        }
                      }}
                      disabled={saving}
                    >Save</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white dark:bg-gray-900 border-b dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <div className="flex items-center space-x-2 py-4">
              <Badge variant={viewMode === "individual" ? "default" : "secondary"}>
                {viewMode === "individual"
                  ? `${(familyMembers.find((m) => m.id === currentMember)?.name) || (currentMember === 'member1' ? 'Member 1' : currentMember === 'member2' ? 'Member 2' : 'Member')}'s View`
                  : "Family Dashboard"}
              </Badge>
            </div>
            {MAIN_TABS.map((tab: MainTab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? "border-emerald-500 text-emerald-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === "dashboard" && (
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {viewMode === "individual"
                  ? `${(familyMembers.find((m) => m.id === currentMember)?.name) || (currentMember === 'member1' ? 'Member 1' : currentMember === 'member2' ? 'Member 2' : 'Member')}` + "'s Dashboard"
                  : "Family Dashboard"}
              </h2>
              <p className="text-gray-600">
                {viewMode === "individual" ? "Your personal financial overview" : "Combined family financial overview"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    {viewMode === "family" ? "Combined family income" : "Your income"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                  <TrendingDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">${totalExpenses.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    {viewMode === "family" ? "Combined family expenses" : "Your expenses"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div
                    className={`text-2xl font-bold ${totalIncome - totalExpenses >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    ${(totalIncome - totalExpenses).toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {viewMode === "family" ? "Family net balance" : "Your net balance"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Budgets</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{budgets.length}</div>
                  <p className="text-xs text-muted-foreground">Budget categories</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Income vs Expenses Trend</CardTitle>
                  <CardDescription>Monthly comparison over the last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                      <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `$${value}`} />
                      <Tooltip
                        formatter={(value, name) => [`$${value}`, name]}
                        labelStyle={{ color: "#374151" }}
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="income"
                        stroke="#10b981"
                        strokeWidth={3}
                        name="Income"
                        dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="expenses"
                        stroke="#ef4444"
                        strokeWidth={3}
                        name="Expenses"
                        dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="savings"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        name="Savings"
                        dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Expense Categories</CardTitle>
                  <CardDescription>Where your money goes this month</CardDescription>
                </CardHeader>
                <CardContent>
                  {expenseCategories.length === 0 ? (
                    <div className="flex items-center justify-center h-[300px] text-center">
                      <div>
                        <LucidePieChart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">No expenses recorded yet</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">
                          Start adding transactions to see your spending breakdown
                        </p>
                      </div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <Pie data={expenseCategories} cx="50%" cy="50%" outerRadius={100} dataKey="value" nameKey="name">
                          {expenseCategories.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`$${value}`, "Spent"]} />
                        <Legend
                          formatter={(value: any, entry: any) => {
                            const v = entry && entry.payload && typeof entry.payload.value === 'number' ? entry.payload.value : 0
                            return `${value}: $${v}`
                          }}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  )}

                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Spending</CardTitle>
                  <CardDescription>Daily expenses this week</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={weeklySpending}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, "Spent"]} />
                      <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Financial Health Score</CardTitle>
                  <CardDescription>Based on your spending habits</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-48">
                    <div className="text-center">
                      <div className="text-6xl font-bold text-emerald-600 mb-2">8.2</div>
                      <div className="text-lg font-medium text-gray-900 dark:text-white mb-1">Excellent</div>
                      <div className="flex items-center justify-center text-sm text-emerald-600">
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                        +0.3 from last month
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                  <CardDescription>Key financial metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Savings Rate</span>
                      <span className="text-sm font-bold text-emerald-600">33.5%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Debt-to-Income</span>
                      <span className="text-sm font-bold text-yellow-600">12.3%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Emergency Fund</span>
                      <span className="text-sm font-bold text-blue-600">4.2 months</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Investment Growth</span>
                      <div className="flex items-center text-sm font-bold text-emerald-600">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        +7.8%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredTransactions.slice(0, 5).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{transaction.description}</p>
                            <div className="flex items-center space-x-2">
                              {viewMode === "family" && transaction.memberName && (
                                <Badge variant="outline" className="text-xs">
                                  {transaction.memberName}
                                </Badge>
                              )}
                              {transaction.splitWith && (
                                <Badge variant="secondary" className="ml-2">
                                  <Users className="h-3 w-3 mr-1" />
                                  Split
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{transaction.category}</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-medium ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                            {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground">{transaction.date}</p>
                        </div>
                      </div>
                    ))}
                    {filteredTransactions.length === 0 && (
                      <p className="text-center text-muted-foreground py-4">
                        No transactions yet. Add your first transaction to get started!
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Budget Overview</CardTitle>
                  <CardDescription>How you're doing this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getFilteredBudgets()
                      .slice(0, 3)
                      .map((budget) => {
                        const percentage = (budget.spent / budget.limit) * 100
                        const status = getBudgetStatus(budget)
                        const remaining = budget.limit - budget.spent

                        return (
                          <div key={budget.id}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">{budget.category}</span>
                              <span className="text-sm text-muted-foreground">
                                ${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}
                              </span>
                            </div>
                            <Progress value={Math.min(percentage, 100)} className="h-2" />
                            <div className="flex items-center justify-between mt-1">
                              <span className={`text-xs ${status.color}`}>{percentage.toFixed(0)}% used</span>
                              {percentage >= 100 && (
                                <span className="text-xs text-red-600 font-medium">Over budget!</span>
                              )}
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "account" && (
          <div className="px-4 py-6 sm:px-0">
            <Card>
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
                <CardDescription>Your family account settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-700">
                  <div><span className="font-medium">Account ID:</span> {profile?.account?.id || "-"}</div>
                </div>
                <div className="pt-2">
                  <div className="font-medium mb-2">Members</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="m1">Member 1</Label>
                      <Input id="m1" value={member1Edit} onChange={(e) => setMember1Edit(e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="m2">Member 2</Label>
                      <Input id="m2" value={member2Edit} onChange={(e) => setMember2Edit(e.target.value)} />
                    </div>
                  </div>
                  <div className="pt-2">
                    <Button
                      type="button"
                      onClick={async () => {
                        setSaving(true); setMessage(null)
                        try {
                          const res = await fetch(`${apiBase}/auth/members`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                            body: JSON.stringify({ members: [ { key: 'member1', name: member1Edit }, { key: 'member2', name: member2Edit } ] })
                          })
                          if (res.ok) {
                            setMessage('Members updated')
                            // reload profile & update local member list
                            const me = await fetch(`${apiBase}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
                            if (me.ok) {
                              const data = await me.json()
                              setProfile(data)
                              const apiMembers: Array<{ key: 'member1' | 'member2'; name: string }> = data?.account?.members || []
                              const mapped = apiMembers
                                .filter((m: any) => m.key === 'member1' || (m.key === 'member2' && m.name && m.name.trim() && m.name.trim() !== 'Member 2'))
                                .map((m: any) => ({ id: m.key, name: m.name }))
                              setFamilyMembers(
                                mapped.length
                                  ? mapped.map((m, idx) => ({ id: m.id, name: m.name, email: '', role: idx === 0 ? 'primary' : 'secondary' }))
                                  : [{ id: 'member1', name: member1Edit || 'Member 1', email: '', role: 'primary' }]
                              )
                              const m1 = apiMembers.find((m: any) => m.key === 'member1')
                              const m2 = apiMembers.find((m: any) => m.key === 'member2')
                              setMember1Edit(m1?.name || '')
                              setMember2Edit(m2?.name || '')
                            }
                          } else {
                            setMessage('Failed to update members')
                          }
                        } finally { setSaving(false) }
                      }}
                      disabled={saving}
                    >Save Changes</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "transactions" && (
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Transaction Management</h2>
                <p className="text-gray-600 dark:text-gray-400">Add, edit, and organize your financial transactions</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleVoiceRecord}
                  variant={isListening ? "destructive" : "outline"}
                  className={isListening ? "animate-pulse" : ""}
                >
                  {isListening ? (
                    <>
                      <MicOff className="h-4 w-4 mr-2" />
                      Stop Listening
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4 mr-2" />
                      Voice Entry
                    </>
                  )}
                </Button>
                <input
                  ref={receiptInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleReceiptSelected}
                />
                <Button onClick={triggerReceiptScan} variant="outline" disabled={isScanning}>
                  {isScanning ? 'Scanning…' : 'Scan Receipt'}
                </Button>
                <Dialog
                  open={isAddDialogOpen || showTransactionForm}
                  onOpenChange={(open) => {
                    setIsAddDialogOpen(open)
                    setShowTransactionForm(open)
                  }}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Transaction
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New Transaction</DialogTitle>
                      <DialogDescription>Enter the details of your transaction</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Input
                          id="description"
                          value={formDescription}
                          onChange={(e) => setFormDescription(e.target.value)}
                          placeholder="Enter transaction description"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="amount">Amount</Label>
                          <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            value={formAmount}
                            onChange={(e) => setFormAmount(e.target.value)}
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <Label htmlFor="type">Type</Label>
                          <Select value={formType} onValueChange={(value: "income" | "expense") => setFormType(value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="income">Income</SelectItem>
                              <SelectItem value="expense">Expense</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Select value={formCategory} onValueChange={setFormCategory}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="date">Date</Label>
                          <Input id="date" type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="split-with">Split With (comma-separated names)</Label>
                        <Input
                          id="split-with"
                          value={formSplitWith}
                          onChange={(e) => setFormSplitWith(e.target.value)}
                          placeholder="Alice, Bob, Charlie"
                        />
                      </div>
                      <div>
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                          id="notes"
                          value={formNotes}
                          onChange={(e) => setFormNotes(e.target.value)}
                          placeholder="Additional notes about this transaction"
                          rows={3}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => {
                          resetForm()
                          setIsAddDialogOpen(false)
                          setShowTransactionForm(false)
                        }}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleAddTransaction} className="bg-emerald-600 hover:bg-emerald-700">
                        Add Transaction
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="filter-category">Category</Label>
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="filter-type">Type</Label>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>All Transactions</CardTitle>
                <CardDescription>Showing {filteredTransactions.length} transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <h3 className="font-medium text-gray-900 dark:text-white">{transaction.description}</h3>
                            {transaction.splitWith && (
                              <Badge variant="secondary" className="ml-2">
                                <Users className="h-3 w-3 mr-1" />
                                Split with {transaction.splitWith.join(", ")}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => startEdit(transaction)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTransaction(transaction.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                            <span>{transaction.category}</span>
                            <span>{new Date(transaction.date).toLocaleDateString()}</span>
                            {transaction.notes && <span className="italic">"{transaction.notes}"</span>}
                          </div>
                          <div
                            className={`text-lg font-semibold ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Edit Transaction Dialog */}
            <Dialog open={!!editingTransaction} onOpenChange={() => setEditingTransaction(null)}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Edit Transaction</DialogTitle>
                  <DialogDescription>Update the transaction details</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-description">Description</Label>
                    <Input
                      id="edit-description"
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Enter transaction description"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-amount">Amount</Label>
                      <Input
                        id="edit-amount"
                        type="number"
                        step="0.01"
                        value={formAmount}
                        onChange={(e) => setFormAmount(e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-type">Type</Label>
                      <Select value={formType} onValueChange={(value: "income" | "expense") => setFormType(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="income">Income</SelectItem>
                          <SelectItem value="expense">Expense</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-category">Category</Label>
                      <Select value={formCategory} onValueChange={setFormCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="edit-date">Date</Label>
                      <Input
                        id="edit-date"
                        type="date"
                        value={formDate}
                        onChange={(e) => setFormDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="edit-split-with">Split With (comma-separated names)</Label>
                    <Input
                      id="edit-split-with"
                      value={formSplitWith}
                      onChange={(e) => setFormSplitWith(e.target.value)}
                      placeholder="Alice, Bob, Charlie"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-notes">Notes</Label>
                    <Textarea
                      id="edit-notes"
                      value={formNotes}
                      onChange={(e) => setFormNotes(e.target.value)}
                      placeholder="Additional notes about this transaction"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      resetForm()
                      setEditingTransaction(null)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleEditTransaction} className="bg-emerald-600 hover:bg-emerald-700">
                    Update Transaction
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {activeTab === "budgets" && (
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Budget Management</h2>
                <p className="text-gray-600 dark:text-gray-400">Set spending limits and track your progress</p>
              </div>
              <Dialog
                open={isAddBudgetDialogOpen || showBudgetForm}
                onOpenChange={(open) => {
                  setIsAddBudgetDialogOpen(open)
                  setShowBudgetForm(open)
                }}
              >
                <DialogTrigger asChild>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Budget
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Budget</DialogTitle>
                    <DialogDescription>Set a spending limit for a category</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="budget-category">Category</Label>
                      <Select value={budgetCategory} onValueChange={setBudgetCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories
                            .filter((cat) => cat !== "Income")
                            .map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="budget-limit">Budget Limit</Label>
                        <Input
                          id="budget-limit"
                          type="number"
                          step="0.01"
                          value={budgetLimit}
                          onChange={(e) => setBudgetLimit(e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="budget-period">Period</Label>
                        <Select
                          value={budgetPeriod}
                          onValueChange={(value: "monthly" | "weekly") => setBudgetPeriod(value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        resetBudgetForm()
                        setIsAddBudgetDialogOpen(false)
                        setShowBudgetForm(false)
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddBudget} className="bg-emerald-600 hover:bg-emerald-700">
                      Create Budget
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {updatedBudgets.map((budget) => {
                const percentage = (budget.spent / budget.limit) * 100
                const status = getBudgetStatus(budget)
                const remaining = budget.limit - budget.spent

                return (
                  <Card key={budget.id} className="relative">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{budget.category}</CardTitle>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => startEditBudget(budget)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteBudget(budget.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardDescription className="capitalize">{budget.period} budget</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold">${budget.spent.toFixed(2)}</span>
                          <span className="text-sm text-muted-foreground">of ${budget.limit.toFixed(2)}</span>
                        </div>

                        <Progress value={Math.min(percentage, 100)} className="h-3" />

                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-medium ${status.color}`}>{percentage.toFixed(0)}% used</span>
                          <span
                            className={`text-sm font-medium ${remaining >= 0 ? "text-emerald-600" : "text-red-600"}`}
                          >
                            {remaining >= 0
                              ? `$${remaining.toFixed(2)} left`
                              : `$${Math.abs(remaining).toFixed(2)} over`}
                          </span>
                        </div>

                        {percentage >= 100 && (
                          <div className="flex items-center text-red-600 text-sm">
                            <XCircle className="h-4 w-4 mr-2" />
                            Budget exceeded!
                          </div>
                        )}

                        {percentage >= 80 && percentage < 100 && (
                          <div className="flex items-center text-yellow-600 text-sm">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Approaching limit
                          </div>
                        )}

                        {percentage < 80 && (
                          <div className="flex items-center text-emerald-600 text-sm">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            On track
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Edit Budget Dialog */}
            <Dialog open={!!editingBudget} onOpenChange={() => setEditingBudget(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Budget</DialogTitle>
                  <DialogDescription>Update your budget settings</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-budget-category">Category</Label>
                    <Select value={budgetCategory} onValueChange={setBudgetCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories
                          .filter((cat) => cat !== "Income")
                          .map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-budget-limit">Budget Limit</Label>
                      <Input
                        id="edit-budget-limit"
                        type="number"
                        step="0.01"
                        value={budgetLimit}
                        onChange={(e) => setBudgetLimit(e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-budget-period">Period</Label>
                      <Select
                        value={budgetPeriod}
                        onValueChange={(value: "monthly" | "weekly") => setBudgetPeriod(value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      resetBudgetForm()
                      setEditingBudget(null)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleEditBudget} className="bg-emerald-600 hover:bg-emerald-700">
                    Update Budget
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {activeTab === "goals" && (
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Financial Goals</h2>
                <p className="text-gray-600 dark:text-gray-400">Set and track your financial objectives</p>
              </div>
              <Dialog open={isAddGoalDialogOpen} onOpenChange={setIsAddGoalDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Goal
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Goal</DialogTitle>
                    <DialogDescription>Set a financial target to work towards</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="goal-name">Goal Name</Label>
                      <Input
                        id="goal-name"
                        value={goalName}
                        onChange={(e) => setGoalName(e.target.value)}
                        placeholder="e.g., Emergency Fund"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="goal-target">Target Amount</Label>
                        <Input
                          id="goal-target"
                          type="number"
                          step="0.01"
                          value={goalTarget}
                          onChange={(e) => setGoalTarget(e.target.value)}
                          placeholder="10000.00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="goal-current">Current Amount</Label>
                        <Input
                          id="goal-current"
                          type="number"
                          step="0.01"
                          value={goalCurrent}
                          onChange={(e) => setGoalCurrent(e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="goal-date">Target Date</Label>
                        <Input
                          id="goal-date"
                          type="date"
                          value={goalDate}
                          onChange={(e) => setGoalDate(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="goal-category">Category</Label>
                        <Input
                          id="goal-category"
                          value={goalCategory}
                          onChange={(e) => setGoalCategory(e.target.value)}
                          placeholder="e.g., Savings"
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        resetGoalForm()
                        setIsAddGoalDialogOpen(false)
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddGoal} className="bg-emerald-600 hover:bg-emerald-700">
                      Create Goal
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals.map((goal) => {
                const percentage = (goal.currentAmount / goal.targetAmount) * 100
                const remaining = goal.targetAmount - goal.currentAmount
                const daysLeft = Math.ceil(
                  (new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                )

                return (
                  <Card key={goal.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{goal.name}</CardTitle>
                      <CardDescription>{goal.category}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold">${goal.currentAmount.toFixed(2)}</span>
                          <span className="text-sm text-muted-foreground">of ${goal.targetAmount.toFixed(2)}</span>
                        </div>

                        <Progress value={Math.min(percentage, 100)} className="h-3" />

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-emerald-600">
                            {percentage.toFixed(0)}% complete
                          </span>
                          <span className="text-sm font-medium text-gray-600">${remaining.toFixed(2)} to go</span>
                        </div>

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
                          <span className={daysLeft > 0 ? "text-blue-600" : "text-red-600"}>
                            {daysLeft > 0 ? `${daysLeft} days left` : `${Math.abs(daysLeft)} days overdue`}
                          </span>
                        </div>

                        {percentage >= 100 && (
                          <div className="flex items-center text-green-600 text-sm">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Goal achieved!
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === "insights" && (
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">AI Financial Insights</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Personalized recommendations to improve your financial health
              </p>
            </div>

            <div className="space-y-6">
              {aiInsights.map((insight) => (
                <Card
                  key={insight.id}
                  className={`dark:bg-gray-900 dark:border-gray-800 ${
                    insight.type === "warning"
                      ? "border-yellow-500/40"
                      : insight.type === "achievement"
                      ? "border-emerald-500/40"
                      : "border-blue-500/40"
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {insight.type === "warning" ? (
                          <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        ) : insight.type === "achievement" ? (
                          <CheckCircle className="h-5 w-5 text-emerald-500" />
                        ) : (
                          <Lightbulb className="h-5 w-5 text-blue-500" />
                        )}
                        <CardTitle className="text-gray-900 dark:text-white">{insight.title}</CardTitle>
                      </div>
                      <Badge
                        variant={
                          insight.type === "warning"
                            ? "destructive"
                            : insight.type === "suggestion"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}
                      </Badge>
                    </div>
                    <CardDescription className="text-gray-700 dark:text-gray-300">{insight.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {insight.action && (
                      <Button
                        variant={insight.type === "warning" ? "destructive" : "default"}
                        size="sm"
                        onClick={() => {
                          if (insight.action === "Add Transaction") {
                            setActiveTab("transactions")
                            setShowTransactionForm(true)
                          } else if (insight.action === "Create Budget") {
                            setActiveTab("budgets")
                            setShowBudgetForm(true)
                          }
                        }}
                      >
                        {insight.action}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Family Member</DialogTitle>
            <DialogDescription>
              Add a second family member to track expenses separately but view them together.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="member-name">Name</Label>
              <Input
                id="member-name"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                placeholder="Enter member name"
              />
            </div>
            <div>
              <Label htmlFor="member-email">Email</Label>
              <Input
                id="member-email"
                type="email"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                placeholder="Enter member email"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddMemberDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addFamilyMember}>Add Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ... existing code for other dialogs ... */}
    </div>
  )
}
