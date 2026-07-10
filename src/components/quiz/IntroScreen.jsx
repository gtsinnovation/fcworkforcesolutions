import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export default function IntroScreen({ onStart }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-slate-200 p-8 md:p-12"
    >
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-full bg-[#0B2545] flex items-center justify-center">
          <Shield className="w-8 h-8 text-white" />
        </div>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-center text-[#0B2545] mb-2">
        Caregiver Knowledge Check
      </h1>
      <p className="text-center text-slate-500 mb-8">
        Family Care Workforce Solutions — Staff Knowledge Assessment
      </p>
      <div className="bg-slate-50 rounded-xl p-6 mb-8">
        <h2 className="font-semibold text-slate-700 mb-3">Before you begin</h2>
        <ul className="space-y-2 text-slate-600">
          <li className="flex items-start gap-2">
            <span className="text-[#0B2545] font-bold mt-0.5">•</span>
            50 multiple-choice questions covering Modules 1–18
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#0B2545] font-bold mt-0.5">•</span>
            Answer all questions honestly — this checks your understanding
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#0B2545] font-bold mt-0.5">•</span>
            You may retake it as many times as you need
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#0B2545] font-bold mt-0.5">•</span>
            Your score and result category are shown at the end
          </li>
        </ul>
      </div>
      <div className="flex justify-center">
        <Button
          onClick={onStart}
          className="bg-[#0B2545] hover:bg-[#0B2545]/90 text-white px-8 py-3 text-lg rounded-xl"
        >
          Begin Assessment
        </Button>
      </div>
    </motion.div>
  );
}