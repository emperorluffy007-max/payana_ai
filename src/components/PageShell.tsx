import { motion } from "framer-motion";

export function PageShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="relative z-10 pt-20 pb-8 px-4 min-h-screen pointer-events-none overflow-hidden">
      {/* Global Ambient backgrounds */}
      <div className="fixed top-[-15%] left-[-10%] w-[50%] h-[50%] bg-[#4F46E5]/10 blur-[100px] rounded-full mix-blend-screen dark:bg-[#4F46E5]/20 z-[-1]" />
      <div className="fixed top-[20%] right-[-10%] w-[40%] h-[40%] bg-[#FF007A]/5 blur-[100px] rounded-full mix-blend-screen dark:bg-[#FF007A]/10 z-[-1]" />
      <div className="fixed bottom-[0%] left-[20%] w-[45%] h-[45%] bg-[#00FF9D]/5 blur-[100px] rounded-full mix-blend-screen dark:bg-[#00FF9D]/10 z-[-1]" />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-5xl mx-auto pointer-events-auto relative z-10"
      >
        <h1 className="font-heading text-3xl md:text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-[#FF007A] inline-block">
          {title}
        </h1>
        {children}
      </motion.div>
    </div>
  );
}
