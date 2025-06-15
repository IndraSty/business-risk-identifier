'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Bot, FileText, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function Hero() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const scrollToDemo = () => {
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.6,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white pt-16">
      <div className="absolute inset-0 bg-black/20" />
      <div className={`absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50`} />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32" ref={ref}>
        <motion.div
          className="grid lg:grid-cols-2 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <div className="space-y-8">
            <div className="space-y-4">
              <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium border border-white/20"
              >
              <Bot className="w-4 h-4" />
              AI-Powered Risk Analysis
              </motion.div>
              
              <motion.h1
              variants={itemVariants}
              className="text-4xl lg:text-6xl font-bold leading-tight"
              >
              Identify Your Business Risks
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                {' '}Automatically
              </span>
              </motion.h1>
              
              <motion.p
              variants={itemVariants}
              className="text-xl lg:text-2xl text-blue-100 leading-relaxed"
              >
              Use AI technology to analyze business documents such as meeting transcripts or business plans, and get accurate, fast, and reliable risk detection.
              </motion.p>
            </div>
            
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
                <Button 
                size="lg" 
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-base border-0 px-8 py-4 rounded-xl font-semibold shadow-2xl transform hover:scale-105 transition-all duration-200"
                onClick={scrollToDemo}
                >
                Try Analysis Now
                <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                variant="outline" 
                size="lg"
                className="border-white bg-transparent text-base text-white hover:text-white hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-500 px-8 py-4 rounded-xl font-semibold backdrop-blur-sm"
                >
                Learn More
                </Button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex items-center gap-8 pt-8 border-t border-white/20"
            >
              <div className="text-center">
                <motion.div
                  className="text-3xl font-bold text-cyan-400"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  500+
                </motion.div>
                <div className="text-sm text-blue-200">Documents Analyzed</div>
              </div>
              <div className="text-center">
                <motion.div
                  className="text-3xl font-bold text-cyan-400"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                >
                  95%
                </motion.div>
                <div className="text-sm text-blue-200">Prediction Accuracy</div>
              </div>
              <div className="text-center">
                <motion.div
                  className="text-3xl font-bold text-cyan-400"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                  transition={{ delay: 1.4, duration: 0.5 }}
                >
                  50+
                </motion.div>
                <div className="text-sm text-blue-200">Industry Type</div>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="relative"
            variants={itemVariants}
          >
            <motion.div
              className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl"
              variants={floatingVariants}
              animate="animate"
            >
              <div className="space-y-6">
                <motion.div
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">Business Plan.pdf</div>
                    <div className="text-blue-200 text-sm">Uploading...</div>
                  </div>
                </motion.div>
                
                <motion.div
                  className="space-y-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-200">Risk Analysist</span>
                    <span className="text-cyan-400">85%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={inView ? { width: '85%' } : { width: 0 }}
                      transition={{ delay: 1.2, duration: 1.5, ease: 'easeOut' }}
                    />
                  </div>
                </motion.div>

                <motion.div
                  className="grid grid-cols-2 gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ delay: 1.4, duration: 0.5 }}
                >
                  <motion.div
                    className="bg-white/10 rounded-xl p-4 text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <TrendingUp className="w-8 h-8 text-red-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-red-400">High</div>
                    <div className="text-xs text-blue-200">Market Risk</div>
                  </motion.div>
                  <motion.div
                    className="bg-white/10 rounded-xl p-4 text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <TrendingUp className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-yellow-400">Medium</div>
                    <div className="text-xs text-blue-200">Operational Risk</div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div
              className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full opacity-20"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.3, 0.2],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="absolute -bottom-8 -left-4 w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-20"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.25, 0.2],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1,
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}