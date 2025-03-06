import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, FileText, HelpCircle, CheckCircle2 } from "lucide-react";

interface ModuleViewProps {
  module: {
    id: number;
    title: string;
    description: string;
    progress: number;
    content?: {
      overview: string;
      lessons: Array<{
        id: number;
        title: string;
        content: string;
        completed: boolean;
      }>;
      quizzes: Array<{
        id: number;
        title: string;
        questions: Array<{
          id: number;
          question: string;
          options: string[];
          answer: number;
        }>;
      }>;
      resources: Array<{
        id: number;
        title: string;
        url: string;
        type: string;
      }>;
    };
  };
  onClose: () => void;
}

export function ModuleView({ module, onClose }: ModuleViewProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [activeLesson, setActiveLesson] = useState<number | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<number | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  // Sample content if none provided
  const content = module.content || {
    overview: `<h2>Welcome to ${module.title}</h2><p>${module.description}</p><p>This module will guide you through the fundamental concepts and practical applications. Work through the lessons at your own pace, and test your knowledge with the quizzes.</p>`,
    lessons: [
      {
        id: 1,
        title: "Introduction and Key Concepts",
        content:
          "<h3>Introduction</h3><p>This lesson covers the fundamental concepts you need to understand before diving deeper into the subject matter.</p><h4>Key Concepts</h4><ul><li>Concept 1: Lorem ipsum dolor sit amet</li><li>Concept 2: Consectetur adipiscing elit</li><li>Concept 3: Sed do eiusmod tempor incididunt</li></ul>",
        completed: true,
      },
      {
        id: 2,
        title: "Core Principles and Methodologies",
        content:
          "<h3>Core Principles</h3><p>Understanding these principles will help you build a solid foundation in the subject.</p><h4>Methodologies</h4><p>There are several approaches to solving problems in this domain:</p><ol><li>Methodology A: Structured approach focusing on...</li><li>Methodology B: Alternative approach that emphasizes...</li></ol>",
        completed: false,
      },
      {
        id: 3,
        title: "Practical Applications",
        content:
          "<h3>Real-world Applications</h3><p>Let's explore how these concepts are applied in real-world scenarios.</p><h4>Case Studies</h4><p>The following examples demonstrate successful implementations:</p><ul><li>Case Study 1: Industry application in healthcare</li><li>Case Study 2: Implementation in financial services</li></ul>",
        completed: false,
      },
    ],
    quizzes: [
      {
        id: 1,
        title: "Fundamentals Quiz",
        questions: [
          {
            id: 1,
            question: "What is the primary purpose of this subject?",
            options: ["Option A", "Option B", "Option C", "Option D"],
            answer: 2,
          },
          {
            id: 2,
            question:
              "Which of the following best describes the key principle?",
            options: [
              "Description 1",
              "Description 2",
              "Description 3",
              "Description 4",
            ],
            answer: 1,
          },
          {
            id: 3,
            question: "In what scenario would you apply methodology B?",
            options: ["Scenario 1", "Scenario 2", "Scenario 3", "Scenario 4"],
            answer: 3,
          },
        ],
      },
    ],
    resources: [
      {
        id: 1,
        title: "Comprehensive Guide",
        url: "#",
        type: "PDF",
      },
      {
        id: 2,
        title: "Video Tutorial Series",
        url: "#",
        type: "Video",
      },
      {
        id: 3,
        title: "Interactive Practice Exercises",
        url: "#",
        type: "Interactive",
      },
    ],
  };

  const handleQuizSubmit = () => {
    setShowResults(true);
  };

  const calculateQuizScore = (quizId: number) => {
    const quiz = content.quizzes.find((q) => q.id === quizId);
    if (!quiz) return { score: 0, total: 0, percentage: 0 };

    let correct = 0;
    quiz.questions.forEach((question) => {
      if (quizAnswers[question.id] === question.answer) {
        correct++;
      }
    });

    const total = quiz.questions.length;
    const percentage = Math.round((correct / total) * 100);

    return { score: correct, total, percentage };
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-teal-600 p-4 text-white flex justify-between items-center">
        <h2 className="text-xl font-semibold">{module.title}</h2>
        <Button
          variant="ghost"
          className="text-white hover:bg-teal-700"
          onClick={onClose}
        >
          Close
        </Button>
      </div>

      {/* Progress bar */}
      <div className="bg-teal-50 px-4 py-2 flex items-center">
        <div className="flex-1 mr-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-teal-600 h-2.5 rounded-full"
              style={{ width: `${module.progress}%` }}
            ></div>
          </div>
        </div>
        <span className="text-sm text-teal-800 font-medium">
          {module.progress}% Complete
        </span>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="p-4">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="overview" className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="lessons" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Lessons</span>
          </TabsTrigger>
          <TabsTrigger value="quizzes" className="flex items-center gap-1">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Quizzes</span>
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Resources</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div dangerouslySetInnerHTML={{ __html: content.overview }} />

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">What You'll Learn</h3>
            <ul className="space-y-2">
              {content.lessons.map((lesson) => (
                <li key={lesson.id} className="flex items-start gap-2">
                  <CheckCircle2
                    className={`h-5 w-5 mt-0.5 ${lesson.completed ? "text-teal-600" : "text-gray-300"}`}
                  />
                  <span>{lesson.title}</span>
                </li>
              ))}
            </ul>
          </div>

          <Button
            className="mt-4 bg-teal-600 hover:bg-teal-700"
            onClick={() => {
              setActiveTab("lessons");
              setActiveLesson(content.lessons[0].id);
            }}
          >
            Start Learning
          </Button>
        </TabsContent>

        <TabsContent value="lessons" className="space-y-4">
          {activeLesson === null ? (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Lessons</h3>
              <div className="space-y-2">
                {content.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                    onClick={() => setActiveLesson(lesson.id)}
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2
                        className={`h-5 w-5 ${lesson.completed ? "text-teal-600" : "text-gray-300"}`}
                      />
                      <span className="font-medium">{lesson.title}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-teal-600">
                      {lesson.completed ? "Review" : "Start"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveLesson(null)}
                >
                  Back to Lessons
                </Button>
                <div className="text-sm text-gray-500">
                  Lesson{" "}
                  {content.lessons.findIndex((l) => l.id === activeLesson) + 1}{" "}
                  of {content.lessons.length}
                </div>
              </div>

              {content.lessons
                .filter((lesson) => lesson.id === activeLesson)
                .map((lesson) => (
                  <div key={lesson.id} className="space-y-4">
                    <h3 className="text-xl font-semibold">{lesson.title}</h3>
                    <div dangerouslySetInnerHTML={{ __html: lesson.content }} />

                    <div className="flex justify-between pt-4 mt-6 border-t border-gray-100">
                      <Button
                        variant="outline"
                        onClick={() => {
                          const currentIndex = content.lessons.findIndex(
                            (l) => l.id === activeLesson,
                          );
                          if (currentIndex > 0) {
                            setActiveLesson(
                              content.lessons[currentIndex - 1].id,
                            );
                          }
                        }}
                        disabled={
                          content.lessons.findIndex(
                            (l) => l.id === activeLesson,
                          ) === 0
                        }
                      >
                        Previous Lesson
                      </Button>

                      <Button
                        className="bg-teal-600 hover:bg-teal-700"
                        onClick={() => {
                          const currentIndex = content.lessons.findIndex(
                            (l) => l.id === activeLesson,
                          );
                          if (currentIndex < content.lessons.length - 1) {
                            setActiveLesson(
                              content.lessons[currentIndex + 1].id,
                            );
                          } else {
                            // Last lesson, go to quizzes
                            setActiveTab("quizzes");
                            if (content.quizzes.length > 0) {
                              setActiveQuiz(content.quizzes[0].id);
                            }
                          }
                        }}
                      >
                        {content.lessons.findIndex(
                          (l) => l.id === activeLesson,
                        ) <
                        content.lessons.length - 1
                          ? "Next Lesson"
                          : "Complete & Continue"}
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="quizzes" className="space-y-4">
          {activeQuiz === null ? (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Quizzes</h3>
              <div className="space-y-2">
                {content.quizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                    onClick={() => {
                      setActiveQuiz(quiz.id);
                      setShowResults(false);
                      setQuizAnswers({});
                    }}
                  >
                    <span className="font-medium">{quiz.title}</span>
                    <Button variant="ghost" size="sm" className="text-teal-600">
                      Start Quiz
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setActiveQuiz(null);
                    setShowResults(false);
                  }}
                  disabled={showResults}
                >
                  Back to Quizzes
                </Button>
                <div className="text-sm text-gray-500">
                  {content.quizzes.find((q) => q.id === activeQuiz)?.title}
                </div>
              </div>

              {showResults ? (
                <div className="space-y-6">
                  <div className="bg-teal-50 p-4 rounded-lg text-center">
                    <h3 className="text-xl font-semibold text-teal-800 mb-2">
                      Quiz Results
                    </h3>
                    <div className="text-3xl font-bold text-teal-600 mb-1">
                      {calculateQuizScore(activeQuiz).percentage}%
                    </div>
                    <p className="text-teal-700">
                      You got {calculateQuizScore(activeQuiz).score} out of{" "}
                      {calculateQuizScore(activeQuiz).total} questions correct
                    </p>
                  </div>

                  <div className="space-y-6">
                    {content.quizzes
                      .find((q) => q.id === activeQuiz)
                      ?.questions.map((question) => {
                        const userAnswer = quizAnswers[question.id];
                        const isCorrect = userAnswer === question.answer;

                        return (
                          <div
                            key={question.id}
                            className="border border-gray-200 rounded-lg p-4"
                          >
                            <h4 className="font-medium mb-3">
                              {question.question}
                            </h4>
                            <div className="space-y-2">
                              {question.options.map((option, index) => (
                                <div
                                  key={index}
                                  className={`p-2 rounded-md ${
                                    userAnswer === index
                                      ? isCorrect
                                        ? "bg-green-100 border border-green-300"
                                        : "bg-red-100 border border-red-300"
                                      : question.answer === index
                                        ? "bg-green-50 border border-green-200"
                                        : "bg-gray-50 border border-gray-200"
                                  }`}
                                >
                                  {option}
                                  {userAnswer === index && isCorrect && (
                                    <span className="ml-2 text-green-600">
                                      ✓
                                    </span>
                                  )}
                                  {userAnswer === index && !isCorrect && (
                                    <span className="ml-2 text-red-600">✗</span>
                                  )}
                                  {question.answer === index &&
                                    userAnswer !== index && (
                                      <span className="ml-2 text-green-600">
                                        (Correct answer)
                                      </span>
                                    )}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowResults(false);
                        setQuizAnswers({});
                      }}
                    >
                      Retake Quiz
                    </Button>

                    <Button
                      className="bg-teal-600 hover:bg-teal-700"
                      onClick={() => {
                        setActiveQuiz(null);
                        setShowResults(false);
                      }}
                    >
                      Back to All Quizzes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {content.quizzes
                    .find((q) => q.id === activeQuiz)
                    ?.questions.map((question) => (
                      <div
                        key={question.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <h4 className="font-medium mb-3">
                          {question.question}
                        </h4>
                        <div className="space-y-2">
                          {question.options.map((option, index) => (
                            <div
                              key={index}
                              className={`p-2 rounded-md cursor-pointer ${
                                quizAnswers[question.id] === index
                                  ? "bg-teal-100 border border-teal-300"
                                  : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
                              }`}
                              onClick={() =>
                                setQuizAnswers((prev) => ({
                                  ...prev,
                                  [question.id]: index,
                                }))
                              }
                            >
                              {option}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                  <Button
                    className="w-full bg-teal-600 hover:bg-teal-700"
                    onClick={handleQuizSubmit}
                    disabled={content.quizzes
                      .find((q) => q.id === activeQuiz)
                      ?.questions.some((q) => quizAnswers[q.id] === undefined)}
                  >
                    Submit Answers
                  </Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <h3 className="text-lg font-medium">Additional Resources</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {content.resources.map((resource) => (
              <a
                key={resource.id}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 border border-gray-200 rounded-lg hover:border-teal-300 hover:bg-teal-50 transition-colors duration-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-teal-700">
                      {resource.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Click to access this resource
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-teal-100 text-teal-800 text-xs rounded-full">
                    {resource.type}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
