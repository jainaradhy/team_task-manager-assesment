import { motion } from "framer-motion";

const StatCard = ({ title, value, subtitle, accent }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02 }}
    className="glass-panel overflow-hidden p-5 hover-up cursor-default"
  >
    <div className={`mb-4 h-2 w-16 rounded-full ${accent}`} />
    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
    <p className="mt-3 text-4xl font-extrabold text-slate-900 dark:text-white">{value}</p>
    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
  </motion.div>
);

export default StatCard;

