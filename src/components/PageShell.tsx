import { motion } from 'framer-motion';

export function PageShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="relative z-10 pt-20 pb-8 px-4 min-h-screen pointer-events-none">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-5xl mx-auto pointer-events-auto"
      >
        <h1 className="font-heading text-2xl font-bold mb-6">{title}</h1>
        {children}
      </motion.div>
    </div>
  );
}
