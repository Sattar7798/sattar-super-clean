'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import PageHeader from '@/components/layout/PageHeader';
import { EmailIcon, PhoneIcon, LocationIcon, ClockIcon } from '@/components/ui/Icons';
import Layout from '@/components/layout/LayoutFix';

// Define types for form data and form status
interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  category: string;
}

interface FormStatus {
  isSubmitting: boolean;
  isSubmitted: boolean;
  error: string | null;
}

interface ContactInfo {
  icon: React.ReactNode;
  title: string;
  content: string;
  link?: string;
  secondary?: string;
}

interface Category {
  value: string;
  label: string;
}

export default function ContactPage() {
  // Form state
  const [formData, setFormData] = React.useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [formStatus, setFormStatus] = React.useState<FormStatus>({
    isSubmitting: false,
    isSubmitted: false,
    error: null
  });

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: FormData) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus({ isSubmitting: true, isSubmitted: false, error: null });

    try {
      // Here you would normally send the form data to your backend
      // This is a simulation of the API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset form and show success
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'general'
      });
      setFormStatus({ isSubmitting: false, isSubmitted: true, error: null });
    } catch (error) {
      setFormStatus({ 
        isSubmitting: false, 
        isSubmitted: false, 
        error: 'There was an error submitting your message. Please try again later.'
      });
    }
  };

  // Contact information
  const contactInfo: ContactInfo[] = [
    {
      icon: <EmailIcon className="w-5 h-5" />,
      title: 'Email',
      content: 'hedayat.1996509@studenti.uniroma1.it',
      link: 'mailto:hedayat.1996509@studenti.uniroma1.it'
    },
    {
      icon: <PhoneIcon className="w-5 h-5" />,
      title: 'Phone',
      content: '+39 388 9784912',
      link: 'tel:+393889784912'
    },
    {
      icon: <LocationIcon className="w-5 h-5" />,
      title: 'Office',
      content: 'Roma, Italy',
      link: 'https://maps.google.com/?q=Sapienza+University+Roma+Italy'
    },
    {
      icon: <ClockIcon className="w-5 h-5" />,
      title: 'Office Hours',
      content: 'Monday & Wednesday: 2:00 PM - 4:00 PM',
      secondary: 'or by appointment'
    }
  ];

  // Topic categories
  const categories: Category[] = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'research', label: 'Research Collaboration' },
    { value: 'speaking', label: 'Speaking Engagement' },
    { value: 'student', label: 'Prospective Student' },
    { value: 'consulting', label: 'Engineering Consultation' }
  ];

  return (
    <Layout>
      <PageHeader
        title="Contact Me"
        subtitle="Get in touch for research collaborations, speaking engagements, or consultations"
        imageUrl="/assets/images/contact-header.jpg"
      />

      <Container>
        <Section>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact information */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-panel rounded-2xl p-6"
              >
                <h2 className="text-2xl font-bold mb-6 text-white">Contact Information</h2>
                <div className="space-y-6">
                  {contactInfo.map((item, index) => (
                    <div key={index} className="flex">
                      <div className="text-indigo-400 mr-4 mt-0.5">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-sm">
                          {item.title}
                        </h3>
                        {item.link ? (
                          <a 
                            href={item.link} 
                            className="text-gray-400 hover:text-indigo-300 transition-colors text-sm"
                            target={item.link.startsWith('http') ? '_blank' : undefined}
                            rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                          >
                            {item.content}
                          </a>
                        ) : (
                          <p className="text-gray-400 text-sm">{item.content}</p>
                        )}
                        {item.secondary && (
                          <p className="text-gray-500 text-xs mt-1">
                            {item.secondary}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-white/5">
                  <h3 className="font-semibold text-white text-sm mb-2">
                    Direct Email
                  </h3>
                  <a 
                    href="mailto:sattarhedayat2020@gmail.com"
                    className="text-indigo-400 hover:text-indigo-300 transition-colors text-sm break-all"
                  >
                    sattarhedayat2020@gmail.com
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Contact form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="glass-panel rounded-2xl p-6">
                <h2 className="text-2xl font-bold mb-6 text-white">Send a Message</h2>
                
                {formStatus.isSubmitted ? (
                  <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
                    <div className="text-green-600 dark:text-green-400 text-4xl mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-green-800 dark:text-green-300 mb-2">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-green-700 dark:text-green-400 mb-4">
                      Thank you for reaching out. I will respond to your message as soon as possible.
                    </p>
                    <button
                      onClick={() => setFormStatus((prev: FormStatus) => ({ ...prev, isSubmitted: false }))}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {formStatus.error && (
                      <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400 mb-4">
                        {formStatus.error}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-gray-300 font-medium mb-2 text-sm">
                          Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full p-3 bg-white/5 border border-white/10 rounded-xl focus:ring-indigo-500 focus:border-indigo-400 text-white placeholder-gray-500 text-sm outline-none transition-all"
                          placeholder="Your name"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-gray-300 font-medium mb-2 text-sm">
                          Email <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full p-3 bg-white/5 border border-white/10 rounded-xl focus:ring-indigo-500 focus:border-indigo-400 text-white placeholder-gray-500 text-sm outline-none transition-all"
                          placeholder="Your email address"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="category" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                        Category
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full p-3 bg-white/5 border border-white/10 rounded-xl focus:ring-indigo-500 focus:border-indigo-400 text-white text-sm outline-none transition-all"
                      >
                        {categories.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-gray-300 font-medium mb-2 text-sm">
                        Subject <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full p-3 bg-white/5 border border-white/10 rounded-xl focus:ring-indigo-500 focus:border-indigo-400 text-white placeholder-gray-500 text-sm outline-none transition-all"
                        placeholder="Subject of your message"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-gray-300 font-medium mb-2 text-sm">
                        Message <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full p-3 bg-white/5 border border-white/10 rounded-xl focus:ring-indigo-500 focus:border-indigo-400 text-white placeholder-gray-500 text-sm outline-none transition-all resize-none"
                        placeholder="Your message"
                      ></textarea>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={formStatus.isSubmitting}
                        className={`px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-semibold hover:from-indigo-500 hover:to-violet-500 transition-all duration-300 shadow-[0_0_20px_rgba(99,102,241,0.4)] ${
                          formStatus.isSubmitting ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-[0_0_30px_rgba(99,102,241,0.6)]'
                        }`}
                      >
                        {formStatus.isSubmitting ? 'Sending...' : 'Send Message'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </Section>
        
        <Section className="py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Visit the Lab</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-8">
              Smart Structures Laboratory is located in Building 5, Sapienza University Campus, Roma, Italy. Visitors are welcome during open house events or by appointment.
            </p>
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2969.654886661852!2d12.512792076464198!3d41.90375547115468!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132f61a650625e5f%3A0x8b5edd1c4c986e59!2sSapienza%20University%20of%20Rome!5e0!3m2!1sen!2sit!4v1654314841097!5m2!1sen!2sit"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                title="Lab Location Map"
              ></iframe>
            </div>
          </div>
        </Section>
        
        <Section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="glass-panel rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold mb-4 text-white">For Students</h3>
              <p className="text-gray-400 mb-4 text-sm">
                Interested in joining my research team? Prospective graduate students should include their research interests, CV, and academic background in their message.
              </p>
              <a 
                href="#"
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault();
                  setFormData((prev: FormData) => ({ ...prev, category: 'student' }));
                  const categoryElement = document.getElementById('category');
                  if (categoryElement) {
                    categoryElement.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="text-indigo-400 hover:text-indigo-300 transition-colors text-sm"
              >
                Apply as a Research Assistant →
              </a>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="glass-panel rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold mb-4 text-white">For Research Collaborators</h3>
              <p className="text-gray-400 mb-4 text-sm">
                I welcome collaborations with other researchers and institutions on projects related to structural engineering, seismic analysis, and AI integration.
              </p>
              <a 
                href="#"
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault();
                  setFormData((prev: FormData) => ({ ...prev, category: 'research' }));
                  const categoryElement = document.getElementById('category');
                  if (categoryElement) {
                    categoryElement.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="text-indigo-400 hover:text-indigo-300 transition-colors text-sm"
              >
                Propose a Collaboration →
              </a>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="glass-panel rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold mb-4 text-white">For Industry Partners</h3>
              <p className="text-gray-400 mb-4 text-sm">
                Looking for expert consultation on structural engineering problems or AI-enhanced solutions? I provide consulting services for industry partners.
              </p>
              <a 
                href="#"
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault();
                  setFormData((prev: FormData) => ({ ...prev, category: 'consulting' }));
                  const categoryElement = document.getElementById('category');
                  if (categoryElement) {
                    categoryElement.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="text-indigo-400 hover:text-indigo-300 transition-colors text-sm"
              >
                Request a Consultation →
              </a>
            </motion.div>
          </div>
        </Section>
      </Container>
    </Layout>
  );
} 