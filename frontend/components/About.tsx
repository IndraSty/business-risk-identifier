'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Code, Brain, Zap, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const technologies = [
  {
    category: 'Backend',
    items: ['Python (FastAPI)', 'OpenAI API', 'Machine Learning'],
    icon: Code,
    color: 'text-green-600 bg-green-100'
  },
  {
    category: 'Frontend',
    items: ['Next.js', 'Tailwind CSS', 'TypeScript'],
    icon: Brain,
    color: 'text-blue-600 bg-blue-100'
  },
  {
    category: 'AI & Analytics',
    items: ['DeepSeek AI', 'Natural Language Processing', 'Risk Classification', 'Prompt Engineering'],
    icon: Zap,
    color: 'text-purple-600 bg-purple-100'
  },
  {
    category: 'Visualisasi',
    items: ['Recharts', 'Chart.js', 'Interactive Dashboards'],
    icon: Shield,
    color: 'text-orange-600 bg-orange-100'
  }
];

export default function About() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [statsRef, statsInView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

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

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section id="about" className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
          >
            About RiskSight AI
          </motion.h2>
          <div className="max-w-4xl mx-auto">
            <motion.p
              variants={itemVariants}
              className="text-xl text-gray-600 leading-relaxed mb-8"
            >
              This application is developed to help businesses identify potential risks more efficiently using AI technology from OpenAI. Powered by Python on the backend, this project demonstrates text analysis capabilities, natural language processing, and classification based on prompt engineering.
            </motion.p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-3xl font-bold text-gray-900">
              Why Choose Our Platform?
            </h3>
            <div className="space-y-4">
                {[
                {
                  title: 'High Accuracy',
                  description: 'Utilizes state-of-the-art AI models with prediction accuracy up to 95%',
                  color: 'bg-blue-100'
                },
                {
                  title: 'Fast Processing',
                  description: 'Analyze documents in seconds, no more waiting for hours',
                  color: 'bg-green-100'
                },
                {
                  title: 'Multi-Industry',
                  description: 'Supports various business sectors from technology to healthcare',
                  color: 'bg-purple-100'
                }
                ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                >
                  <div className={`w-8 h-8 ${item.color} rounded-full flex items-center justify-center flex-shrink-0 mt-1`}>
                    <div className={`w-4 h-4 ${item.color.replace('100', '600')} rounded-full`}></div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{item.title}</h4>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-3xl p-8 shadow-2xl"
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h4 className="text-2xl font-bold text-gray-900 mb-6 text-center">Key Technologies</h4>
            <motion.div
              className="grid grid-cols-2 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
            >
              {technologies.map((tech, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                >
                  <Card className="border-0 shadow-md hover:shadow-lg transition-shadow h-full">
                    <CardContent className="p-4">
                      <motion.div
                        className={`w-12 h-12 rounded-xl ${tech.color} flex items-center justify-center mb-3`}
                        whileHover={{ rotate: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <tech.icon className="w-6 h-6" />
                      </motion.div>
                      <h5 className="font-bold text-gray-900 mb-2">{tech.category}</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {tech.items.map((item, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-12 text-white text-center"
          ref={statsRef}
          initial={{ opacity: 0, y: 50 }}
          animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
        >
            <motion.h3
            className="text-3xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            >
            Trusted Across Multiple Industries
            </motion.h3>
            <motion.p
            className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            >
            From tech startups to multinational enterprises, our platform has helped identify critical business risks.
            </motion.p>
          <motion.div
            className="grid md:grid-cols-3 gap-8 mt-12"
            variants={containerVariants}
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
          >
            {[
              { number: '150+', label: 'Enterprise Companies' },
              { number: '10k+', label: 'Documents Processed' },
              { number: '99.9%', label: 'System Uptime' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="text-4xl font-bold text-cyan-300 mb-2"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={statsInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                  transition={{ delay: 0.6 + index * 0.2, duration: 0.5 }}
                >
                  {stat.number}
                </motion.div>
                <div className="text-blue-100">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}