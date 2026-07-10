import { useState, useCallback, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import IntroScreen from "./IntroScreen";
import QuizScreen from "./QuizScreen";
import ResultsScreen from "./ResultsScreen";
import { QUESTIONS } from "@/lib/questions";

export default function QuizApp() {
  const [quizState, setQuizState] = useState("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(
    new Array(QUESTIONS.length).fill(-1)
  );

  const score = useMemo(
    () => selectedAnswers.filter((a, i) => a === QUESTIONS[i].answer).length,
    [selectedAnswers]
  );

  const handleStart = useCallback(() => {
    setSelectedAnswers(new Array(QUESTIONS.length).fill(-1));
    setCurrentIndex(0);
    setQuizState("quiz");
  }, []);

  const handleSelect = useCallback((answerIdx) => {
    setSelectedAnswers((prev) => {
      const updated = [...prev];
      updated[currentIndex] = answerIdx;
      return updated;
    });
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setQuizState("results");
    }
  }, [currentIndex]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-[#0B2545] text-white py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          <span className="text-sm md:text-base font-semibold tracking-wide">
            FAMILY CARE WORKFORCE SOLUTIONS
          </span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <AnimatePresence mode="wait">
          {quizState === "intro" && <IntroScreen key="intro" onStart={handleStart} />}
          {quizState === "quiz" && (
            <QuizScreen
              key="quiz"
              index={currentIndex}
              selected={selectedAnswers[currentIndex]}
              onSelect={handleSelect}
              onNext={handleNext}
              onPrev={handlePrev}
            />
          )}
          {quizState === "results" && (
            <ResultsScreen
              key="results"
              score={score}
              selectedAnswers={selectedAnswers}
              onRetake={handleStart}
            />
          )}
        </AnimatePresence>
      </main>

      <footer className="bg-white border-t border-slate-200 py-4 px-6">
        <p className="text-center text-sm text-slate-400">
          © {new Date().getFullYear()} Family Care Workforce Solutions — Caregiver Training Portal
        </p>
      </footer>
    </div>
  );
}