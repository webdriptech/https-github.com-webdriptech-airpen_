import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { SignInButton, useUser } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated, useMutation } from "convex/react";
import {
  Mic,
  BookOpen,
  Search,
  Plus,
  BookOpenCheck,
  Award,
  FileText,
  Brain,
  Sparkles,
  Zap,
  Lightbulb,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../../convex/_generated/api";

const FEATURES = [
  {
    icon: <Brain className="h-7 w-7 text-indigo-600" />,
    title: "Smart Topic Search",
    description:
      "Enter any study topic and get AI-generated learning materials instantly",
  },
  {
    icon: <Mic className="h-7 w-7 text-purple-600" />,
    title: "Lecture Recording",
    description:
      "Record lectures and automatically convert them into structured notes",
  },
  {
    icon: <Sparkles className="h-7 w-7 text-pink-600" />,
    title: "Interactive Learning",
    description:
      "Engage with personalized learning modules tailored to your pace",
  },
  {
    icon: <Zap className="h-7 w-7 text-amber-600" />,
    title: "Progress Tracking",
    description:
      "Track your learning journey with certificates and achievements",
  },
] as const;

const TESTIMONIALS = [
  {
    quote:
      "AirPen transformed how I study for exams. The AI-generated materials are incredibly helpful!",
    name: "Sarah Johnson",
    role: "Computer Science Student",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
  },
  {
    quote:
      "The lecture recording feature saves me hours of note-taking. I can focus on understanding instead of writing.",
    name: "Michael Chen",
    role: "Medical Student",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
  },
  {
    quote:
      "As a teacher, I recommend AirPen to all my students. It helps them organize their learning effectively.",
    name: "Dr. Emily Rodriguez",
    role: "University Professor",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
  },
];

const LEARNING_MODULES = [
  {
    title: "Introduction to Machine Learning",
    description: "Fundamentals of ML algorithms and applications",
    progress: 75,
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80",
    category: "Computer Science",
    color: "bg-indigo-600",
  },
  {
    title: "Human Anatomy Essentials",
    description: "Comprehensive guide to human body systems",
    progress: 45,
    image:
      "https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?w=600&q=80",
    category: "Medicine",
    color: "bg-purple-600",
  },
  {
    title: "World History: Modern Era",
    description: "Key events and developments from 1900 to present",
    progress: 60,
    image:
      "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&q=80",
    category: "History",
    color: "bg-pink-600",
  },
];

function App() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const storeUser = useMutation(api.users.store);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (user) {
      storeUser();
    }
  }, [user, storeUser]);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section with Background */}
        <div className="relative bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-15">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&q=80')] bg-cover bg-center mix-blend-overlay"></div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-900 to-transparent opacity-70"></div>

          <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-8 text-center max-w-4xl mx-auto">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none">
                  <span className="text-white">Air</span>
                  <span className="text-pink-300">Pen</span>
                </h1>
                <p className="text-2xl md:text-3xl font-light text-indigo-100 tracking-wide">
                  AI-Powered Learning Platform
                </p>
              </div>

              <p className="text-xl md:text-2xl text-indigo-100 max-w-3xl leading-relaxed">
                Transform your study experience with AI-generated materials,
                interactive learning paths, and smart note-taking.
              </p>

              {!isUserLoaded ? (
                <div className="flex gap-4">
                  <div className="px-8 py-3 w-[145px] h-[38px] rounded-lg bg-indigo-700/50 animate-pulse"></div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
                  <Unauthenticated>
                    <SignInButton mode="modal">
                      <Button className="px-10 py-6 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium hover:from-pink-600 hover:to-purple-700 transition-all duration-300 text-lg shadow-lg hover:shadow-xl border-0">
                        Start Learning Now
                      </Button>
                    </SignInButton>
                  </Unauthenticated>
                  <Authenticated>
                    <Button
                      onClick={() => navigate("/dashboard")}
                      className="px-10 py-6 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium hover:from-pink-600 hover:to-purple-700 transition-all duration-300 text-lg shadow-lg hover:shadow-xl border-0"
                    >
                      Go to Dashboard
                    </Button>
                  </Authenticated>
                </div>
              )}

              <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-indigo-200 mt-8">
                <div className="flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2 text-pink-300" />
                  <span className="font-medium">AI-Powered</span>
                </div>
                <div className="hidden md:block h-1.5 w-1.5 rounded-full bg-pink-400"></div>
                <div className="flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-pink-300" />
                  <span className="font-medium">Real-time Feedback</span>
                </div>
                <div className="hidden md:block h-1.5 w-1.5 rounded-full bg-pink-400"></div>
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-pink-300" />
                  <span className="font-medium">Personalized Learning</span>
                </div>
              </div>
            </div>
          </div>

          {/* Wave Divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 320"
              className="w-full h-auto"
            >
              <path
                fill="#ffffff"
                fillOpacity="1"
                d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          {/* Search Bar Preview */}
          <div className="max-w-3xl mx-auto -mt-24 mb-28 bg-white p-8 rounded-2xl shadow-xl border border-gray-100 relative z-20">
            <div className="relative">
              <input
                type="text"
                placeholder="Enter a study topic or upload a lecture recording..."
                className="w-full px-5 py-5 pl-14 pr-16 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-medium"
                disabled={!isUserLoaded || !user}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-5 top-5 h-6 w-6 text-purple-500" />
              <button
                className="absolute right-4 top-3.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2.5 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-md"
                disabled={!isUserLoaded || !user}
              >
                <Mic className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Features Section with Illustrations */}
          <div className="mb-32">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                Supercharge Your Learning
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Our AI-powered platform helps you learn faster and more
                effectively
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
              {FEATURES.map((feature, index) => (
                <div
                  key={feature.title}
                  className="p-8 bg-white shadow-lg rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
                >
                  <div className="mb-6 p-4 bg-gray-50 rounded-full inline-block group-hover:scale-110 transition-all duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Modules Preview */}
          <div className="mb-32 bg-gradient-to-br from-indigo-50 to-purple-50 py-20 px-8 rounded-3xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                Your Learning Journey
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Explore personalized learning modules tailored to your interests
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {LEARNING_MODULES.map((module, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group hover:-translate-y-2"
                >
                  <div className="h-52 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                    <img
                      src={module.image}
                      alt={module.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <span
                      className={`absolute top-4 right-4 ${module.color} text-white text-xs font-medium px-3 py-1.5 rounded-full z-20`}
                    >
                      {module.category}
                    </span>
                    <div className="absolute bottom-4 left-4 z-20">
                      <h3 className="font-bold text-2xl text-white mb-1 group-hover:text-pink-200 transition-colors duration-300">
                        {module.title}
                      </h3>
                      <p className="text-white/80 text-sm">
                        {module.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="flex-1 mr-4">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`${module.color} h-3 rounded-full`}
                            style={{ width: `${module.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {module.progress}% Complete
                      </span>
                    </div>

                    <Button
                      variant="outline"
                      className={`w-full py-3 border-2 text-${module.color.replace("bg-", "")} border-${module.color.replace("bg-", "")} hover:bg-${module.color.replace("bg-", "")}/10 font-medium flex items-center justify-center gap-2`}
                      disabled={!isUserLoaded || !user}
                    >
                      Continue Learning
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-16">
              <Button
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-10 py-4 rounded-xl text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 border-0"
                disabled={!isUserLoaded || !user}
              >
                Explore All Learning Modules
              </Button>
            </div>
          </div>

          {/* Testimonials */}
          <div className="mb-32">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                What Our Users Say
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Join thousands of students who are transforming how they learn
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
              {TESTIMONIALS.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="mb-6">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-amber-400 text-xl">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-6 flex-grow text-lg leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full mr-4 border-2 border-indigo-100"
                    />
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">
                        {testimonial.name}
                      </h4>
                      <p className="text-indigo-600 font-medium">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Preview */}
          <div className="text-center mb-32">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              Ready to Get Started?
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-16 leading-relaxed">
              Choose from our quick actions to begin your learning journey
            </p>

            <div className="flex flex-wrap justify-center gap-8">
              <ActionButton
                icon={<Plus className="h-7 w-7" />}
                label="New Topic"
                color="indigo"
                disabled={!isUserLoaded || !user}
              />
              <ActionButton
                icon={<Mic className="h-7 w-7" />}
                label="Record Lecture"
                color="purple"
                disabled={!isUserLoaded || !user}
              />
              <ActionButton
                icon={<FileText className="h-7 w-7" />}
                label="My Notes"
                color="pink"
                disabled={!isUserLoaded || !user}
              />
              <ActionButton
                icon={<BookOpenCheck className="h-7 w-7" />}
                label="Syllabus"
                color="amber"
                disabled={!isUserLoaded || !user}
              />
            </div>

            {!user && isUserLoaded && (
              <div className="mt-16">
                <SignInButton mode="modal">
                  <Button className="px-10 py-5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 text-lg shadow-lg hover:shadow-xl border-0">
                    Sign Up to Get Started
                  </Button>
                </SignInButton>
              </div>
            )}
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-indigo-800 to-purple-900 rounded-3xl p-16 text-white text-center mb-16 shadow-xl">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
                Ready to Transform Your Learning Experience?
              </h2>
              <p className="text-xl md:text-2xl text-indigo-100 mx-auto mb-10 leading-relaxed">
                Join thousands of students who are already using AirPen to learn
                faster and more effectively.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Unauthenticated>
                  <SignInButton mode="modal">
                    <Button className="px-10 py-5 rounded-xl bg-white text-indigo-900 font-bold hover:bg-indigo-50 transition-all duration-300 text-lg shadow-lg hover:shadow-xl flex items-center gap-2 justify-center">
                      Get Started for Free
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </SignInButton>
                </Unauthenticated>
                <Authenticated>
                  <Button
                    onClick={() => navigate("/dashboard")}
                    className="px-10 py-5 rounded-xl bg-white text-indigo-900 font-bold hover:bg-indigo-50 transition-all duration-300 text-lg shadow-lg hover:shadow-xl flex items-center gap-2 justify-center"
                  >
                    Go to Dashboard
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Authenticated>
              </div>
              <div className="mt-10 flex flex-col md:flex-row justify-center items-center gap-6 text-indigo-100">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-pink-300" />
                  <span className="font-medium">No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-pink-300" />
                  <span className="font-medium">14-day free trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-pink-300" />
                  <span className="font-medium">Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function ActionButton({
  icon,
  label,
  color = "indigo",
  disabled = false,
}: {
  icon: React.ReactNode;
  label: string;
  color?: string;
  disabled?: boolean;
}) {
  return (
    <Button
      variant="outline"
      className={`flex flex-col items-center p-8 h-auto gap-4 border-2 border-${color}-200 hover:border-${color}-500 hover:bg-${color}-50 transition-all duration-300 hover:-translate-y-2 rounded-2xl shadow-md hover:shadow-lg disabled:opacity-60 disabled:hover:translate-y-0`}
      disabled={disabled}
    >
      <div className={`p-4 bg-${color}-100 rounded-full text-${color}-600`}>
        {icon}
      </div>
      <span className={`text-xl font-bold text-${color}-900`}>{label}</span>
    </Button>
  );
}

export default App;
