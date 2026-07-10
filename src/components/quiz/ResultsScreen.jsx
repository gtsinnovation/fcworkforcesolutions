import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Award, AlertTriangle, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { QUESTIONS, LETTER_LABELS } from "@/lib/questions";

const SCORE_BANDS = [
  { min: 45, max: 50, label: "Excellent", next: "You are ready to care with confidence. Well done.", color: "emerald" },
  { min: 38, max: 44, label: "Good", next: "Well done — review any questions you missed before your first shift.", color: "emerald" },
  { min: 30, max: 37, label: "Needs Review", next: "Revisit the relevant handbook modules before your first placement.", color: "amber" },
  { min: 25, max: 29, label: "Requires Coaching", next: "Your supervisor will schedule additional one-to-one training with you.", color: "amber" },
  { min: 0, max: 24, label: "Mandatory Retraining", next: "You must complete the full training program again before placement.", color: "red" },
];

function getBand(score) {
  return SCORE_BANDS.find((b) => score >= b.min && score <= b.max) ?? SCORE_BANDS[SCORE_BANDS.length - 1];
}

export default function ResultsScreen({ score, selectedAnswers, onRetake }) {
  const band = getBand(score);
  const bannerColor =
    band.color === "emerald" ? "bg-emerald-600" : band.color === "amber" ? "bg-amber-500" : "bg-red-600";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className={cn("h-2", bannerColor)} />
        <div className="p-8 md:p-12 text-center">
          <div className="flex justify-center mb-4">
            {band.color === "emerald" ? (
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                <Award className="w-8 h-8 text-emerald-600" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-amber-600" />
              </div>
            )}
          </div>
          <div className="text-5xl font-bold text-[#0B2545] mb-1">
            {score}/{QUESTIONS.length}
          </div>
          <div className="text-xl font-semibold text-slate-700 mb-3">{band.label}</div>
          <p className="text-slate-500 max-w-md mx-auto">{band.next}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 md:p-8">
        <h3 className="font-semibold text-slate-700 mb-4">Answer Review</h3>
        <div className="space-y-3">
          {QUESTIONS.map((q, i) => {
            const isCorrect = selectedAnswers[i] === q.answer;
            return (
              <div
                key={i}
                className={cn(
                  "flex items-start gap-3 p-4 rounded-xl border",
                  isCorrect ? "border-emerald-200 bg-emerald-50/50" : "border-red-200 bg-red-50/50"
                )}
              >
                {isCorrect ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="text-slate-700 text-sm">
                    <span className="font-medium">Q{i + 1}.</span> {q.q}
                  </p>
                  {!isCorrect && (
                    <p className="text-slate-500 text-sm mt-1">
                      Correct: {LETTER_LABELS[q.answer]}. {q.options[q.answer]}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={onRetake}
          variant="outline"
          className="border-[#0B2545] text-[#0B2545] hover:bg-[#0B2545] hover:text-white"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Retake Assessment
        </Button>
      </div>
    </motion.div>
  );
}