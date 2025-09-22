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
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock authentication - in real app, this would validate credentials
    if (email && password) {
      setIsAuthenticated(true)
    }
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password && name && monthlyIncome) {
      setIsAuthenticated(true)
    }
  }

  if (showLanding) {
    return <LandingPage onGetStarted={() => setShowLanding(false)} />
  }

  if (isAuthenticated) {
    return <FinanceDashboard userIncome={Number(monthlyIncome) || 0} userLoan={Number(currentLoan) || 0} />
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
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
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

function FinanceDashboard({ userIncome, userLoan }: { userIncome: number; userLoan: number }) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    { id: "1", name: "You", email: "you@example.com", role: "primary" },
  ])
  const [currentMember, setCurrentMember] = useState<string>("1")
  const [viewMode, setViewMode] = useState<"individual" | "family">("individual")
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

  const addFamilyMember = () => {
    if (!memberName || !memberEmail) return

    const newMember: FamilyMember = {
      id: Date.now().toString(),
      name: memberName,
      email: memberEmail,
      role: "secondary",
    }

    setFamilyMembers([...familyMembers, newMember])
    setMemberName("")
    setMemberEmail("")
    setIsAddMemberDialogOpen(false)
  }

  const removeFamilyMember = (memberId: string) => {
    if (familyMembers.find((m) => m.id === memberId)?.role === "primary") return
    setFamilyMembers(familyMembers.filter((m) => m.id !== memberId))
    if (currentMember === memberId) {
      setCurrentMember("1")
    }
  }

  const handleAddTransaction = () => {
    if (!formDescription || !formAmount || !formCategory || !formDate) return

    const currentMemberData = familyMembers.find((m) => m.id === currentMember)
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      description: formDescription,
      amount:
        formType === "expense" ? -Math.abs(Number.parseFloat(formAmount)) : Math.abs(Number.parseFloat(formAmount)),
      category: formCategory,
      type: formType,
      date: formDate,
      notes: formNotes || undefined,
      splitWith: formSplitWith ? formSplitWith.split(",").map((s) => s.trim()) : undefined,
      memberId: currentMember,
      memberName: currentMemberData?.name || "Unknown",
    }

    setTransactions([newTransaction, ...transactions])
    resetForm()
    setIsAddDialogOpen(false)
  }

  const handleEditTransaction = () => {
    if (!editingTransaction || !formDescription || !formAmount || !formCategory || !formDate) return

    const updatedTransaction: Transaction = {
      ...editingTransaction,
      description: formDescription,
      amount:
        formType === "expense" ? -Math.abs(Number.parseFloat(formAmount)) : Math.abs(Number.parseFloat(formAmount)),
      category: formCategory,
      type: formType,
      date: formDate,
      notes: formNotes || undefined,
      splitWith: formSplitWith ? formSplitWith.split(",").map((s) => s.trim()) : undefined,
    }

    setTransactions(transactions.map((t) => (t.id === editingTransaction.id ? updatedTransaction : t)))
    resetForm()
    setEditingTransaction(null)
  }

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id))
  }

  const startEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setFormDescription(transaction.description)
    setFormAmount(Math.abs(transaction.amount).toString())
    setFormCategory(transaction.category)
    setFormType(transaction.type)
    setFormDate(transaction.date)
    setFormNotes(transaction.notes || "")
    setFormSplitWith(transaction.splitWith?.join(", ") || "")
  }

  const resetForm = () => {
    setFormDescription("")
    setFormAmount("")
    setFormCategory("")
    setFormType("expense")
    setFormDate("")
    setFormNotes("")
    setFormSplitWith("")
  }

  const handleAddBudget = () => {
    if (!budgetCategory || !budgetLimit) return

    const newBudget: Budget = {
      id: Date.now().toString(),
      category: budgetCategory,
      limit: Number.parseFloat(budgetLimit),
      spent: calculateSpentAmount(budgetCategory),
      period: budgetPeriod,
    }

    setBudgets([...budgets, newBudget])
    resetBudgetForm()
    setIsAddBudgetDialogOpen(false)
  }

  const handleEditBudget = () => {
    if (!editingBudget || !budgetCategory || !budgetLimit) return

    const updatedBudget: Budget = {
      ...editingBudget,
      category: budgetCategory,
      limit: Number.parseFloat(budgetLimit),
      spent: calculateSpentAmount(budgetCategory),
      period: budgetPeriod,
    }

    setBudgets(budgets.map((b) => (b.id === editingBudget.id ? updatedBudget : b)))
    resetBudgetForm()
    setEditingBudget(null)
  }

  const handleDeleteBudget = (id: string) => {
    setBudgets(budgets.filter((b) => b.id !== id))
  }

  const startEditBudget = (budget: Budget) => {
    setEditingBudget(budget)
    setBudgetCategory(budget.category)
    setBudgetLimit(budget.limit.toString())
    setBudgetPeriod(budget.period)
  }

  const resetBudgetForm = () => {
    setBudgetCategory("")
    setBudgetLimit("")
    setBudgetPeriod("monthly")
  }

  const handleAddGoal = () => {
    if (!goalName || !goalTarget || !goalCurrent || !goalDate || !goalCategory) return

    const newGoal: Goal = {
      id: Date.now().toString(),
      name: goalName,
      targetAmount: Number.parseFloat(goalTarget),
      currentAmount: Number.parseFloat(goalCurrent),
      targetDate: goalDate,
      category: goalCategory,
    }

    setGoals([...goals, newGoal])
    resetGoalForm()
    setIsAddGoalDialogOpen(false)
  }

  const resetGoalForm = () => {
    setGoalName("")
    setGoalTarget("")
    setGoalCurrent("")
    setGoalDate("")
    setGoalCategory("")
  }

  const getBudgetStatus = (budget: Budget) => {
    const percentage = (budget.spent / budget.limit) * 100
    if (percentage >= 100) return { status: "over", color: "text-red-600", bgColor: "bg-red-500" }
    if (percentage >= 80) return { status: "warning", color: "text-yellow-600", bgColor: "bg-yellow-500" }
    return { status: "good", color: "text-emerald-600", bgColor: "bg-emerald-500" }
  }

  const getFilteredTransactions = () => {
    if (viewMode === "family") {
      return transactions
    }
    return transactions.filter((t) => t.memberId === currentMember)
  }

  const getFilteredBudgets = () => {
    // For now, budgets are shared across family members
    return budgets
  }

  const filteredTransactions = getFilteredTransactions()
  const totalIncome = filteredTransactions.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = Math.abs(filteredTransactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + t.amount, 0))

  const currentBalance = totalIncome - totalExpenses

  const monthlyData = [
    { month: "Jan", income: 0, expenses: 0, savings: 0 },
    { month: "Feb", income: 0, expenses: 0, savings: 0 },
    { month: "Mar", income: 0, expenses: 0, savings: 0 },
    { month: "Apr", income: 0, expenses: 0, savings: 0 },
    { month: "May", income: 0, expenses: 0, savings: 0 },
    { month: "Jun", income: totalIncome, expenses: totalExpenses, savings: currentBalance },
  ]

  const expenseCategories = categories
    .filter((category) => category !== "Income" && category !== "Investment")
    .map((category) => {
      const spent = calculateSpentAmount(category)
      return {
        name: category,
        value: spent,
        color: getColorForCategory(category),
      }
    })
    .filter((category) => category.value > 0) // Only show categories with expenses

  function getColorForCategory(category: string): string {
    const colors: { [key: string]: string } = {
      "Food & Dining": "#10b981",
      Transportation: "#3b82f6",
      Utilities: "#f59e0b",
      Entertainment: "#ef4444",
      Shopping: "#8b5cf6",
      Healthcare: "#06b6d4",
      Other: "#6b7280",
    }
    return colors[category] || "#6b7280"
  }

  const weeklySpending = [
    { day: "Mon", amount: 0 },
    { day: "Tue", amount: 0 },
    { day: "Wed", amount: 0 },
    { day: "Thu", amount: 0 },
    { day: "Fri", amount: 0 },
    { day: "Sat", amount: 0 },
    { day: "Sun", amount: 0 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-8 w-8 text-emerald-600" />
                <h1 className="text-2xl font-bold text-gray-900">FinanceTracker</h1>
              </div>

              <div className="flex items-center space-x-2 ml-8">
                <Select value={currentMember} onValueChange={setCurrentMember}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {familyMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
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

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddMemberDialogOpen(true)}
                disabled={familyMembers.length >= 2}
              >
                <UserPlus className="h-4 w-4 mr-1" />
                Add Member
              </Button>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <div className="flex items-center space-x-2 py-4">
              <Badge variant={viewMode === "individual" ? "default" : "secondary"}>
                {viewMode === "individual"
                  ? `${familyMembers.find((m) => m.id === currentMember)?.name}'s View`
                  : "Family Dashboard"}
              </Badge>
            </div>
            {["dashboard", "transactions", "budgets", "goals", "insights"].map((tab) => (
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
                  ? `${familyMembers.find((m) => m.id === currentMember)?.name}'s Dashboard`
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
                        <RechartsPieChart data={expenseCategories} cx="50%" cy="50%" outerRadius={100} dataKey="value">
                          {expenseCategories.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </RechartsPieChart>
                        <Tooltip formatter={(value) => [`$${value}`, "Spent"]} />
                        <Legend formatter={(value, entry) => `${value}: $${entry.payload.value}`} />
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
                  className={`${
                    insight.type === "warning"
                      ? "border-red-200 bg-red-50"
                      : insight.type === "suggestion"
                        ? "border-blue-200 bg-blue-50"
                        : "border-green-200 bg-green-50"
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      {insight.type === "warning" ? (
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                      ) : insight.type === "suggestion" ? (
                        <Lightbulb className="h-6 w-6 text-blue-600" />
                      ) : (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      )}
                      <div>
                        <CardTitle
                          className={`text-lg ${
                            insight.type === "warning"
                              ? "text-red-800"
                              : insight.type === "suggestion"
                                ? "text-blue-800"
                                : "text-green-800"
                          }`}
                        >
                          {insight.title}
                        </CardTitle>
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
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p
                      className={`mb-4 ${
                        insight.type === "warning"
                          ? "text-red-700"
                          : insight.type === "suggestion"
                            ? "text-blue-700"
                            : "text-green-700"
                      }`}
                    >
                      {insight.description}
                    </p>
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
