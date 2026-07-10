import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { QUESTIONS, LETTER_LABELS } from "@/lib/questions";

export default function QuizScreen({ index, selected, onSelect, onNext, onPrev }) {
  const question = QUESTIONS[index];
  const progress = (index / QUESTIONS.length) * 100;
  const isSelected = selected >= 0;
  const isLast = index === QUESTIONS.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-slate-200 p-6 md:p-10"
    >
      <div className="flex items-center justify-between mb-2">
        <Badge variant="secondary" className="text-sm">
          Question {index + 1} of {QUESTIONS.length}
        </Badge>
        <span className="text-sm font-medium text-slate-400">Knowledge Check</span>
      </div>
      <Progress value={progress} className="mb-6 h-2" />

      <h2 className="text-xl md:text-2xl font-semibold text-slate-800 mb-6">
        {question.q}
      </h2>

      <div className="space-y-3 mb-8">
        {question.options.map((opt, i) => {
          const isSel = selected === i;
          return (
            <button
              key={i}
              onClick={() => onSelect(i)}
              className={cn(
                "w-full text-left flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-150",
                isSel
                  ? "border-[#0B2545] bg-slate-50"
                  : "border-slate-200 bg-white hover:border-[#0B2545]/40 hover:bg-slate-50/50"
              )}
            >
              <span
                className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2",
                  isSel
                    ? "border-[#0B2545] bg-[#0B2545] text-white"
                    : "border-slate-300 text-slate-500"
                )}
              >
                {isSel ? "✓" : LETTER_LABELS[i]}
              </span>
              <span className="text-slate-700">{opt}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={onPrev}
          disabled={index === 0}
          className="text-slate-500 hover:text-slate-700 disabled:opacity-30"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>
        <Button
          onClick={onNext}
          disabled={!isSelected}
          className="bg-[#0B2545] hover:bg-[#0B2545]/90 text-white"
        >
          {isLast ? "View My Results" : "Next Question"}
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </motion.div>
  );
}