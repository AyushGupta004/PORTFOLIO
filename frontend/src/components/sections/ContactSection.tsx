import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Github, Linkedin, Mail, MessageCircle, User } from 'lucide-react';
import { siLeetcode } from 'simple-icons';
import { portfolioContent } from '../../data/content';
import { soundManager } from '../../utils/sound';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isWeb3FormsSuccess = (value: unknown) =>
  isRecord(value) && value.success === true;

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'An unexpected error occurred.';

export const ContactSection: React.FC = () => {
  const { personal } = portfolioContent;
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const copyEmail = async () => {
    soundManager.playPop();
    setCopyError('');

    try {
      await navigator.clipboard.writeText(personal.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
      setCopyError('Clipboard access unavailable. Please copy the email address.');
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    soundManager.playPop();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const saveMessage = async () => {
        const { supabase } = await import('../../lib/supabase');
        const { error } = await supabase.from('contact_messages').insert({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        });

        if (error) throw new Error(error.message);
      };

      const sendEmailNotification = async () => {
        const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
        if (!accessKey) {
          throw new Error('Missing VITE_WEB3FORMS_ACCESS_KEY environment variable.');
        }

        const apiUrl =
          import.meta.env.VITE_WEB3FORMS_API_URL?.trim() || 'https://api.web3forms.com/submit';
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: accessKey,
            name: formData.name,
            email: formData.email,
            message: formData.message,
            subject: `New portfolio contact from ${formData.name}`,
          }),
        });
        const result: unknown = await response.json();

        if (!response.ok || !isWeb3FormsSuccess(result)) {
          const message = isRecord(result) && typeof result.message === 'string'
            ? result.message
            : 'Unable to send the email notification.';
          throw new Error(message);
        }
      };

      const [databaseResult, emailResult] = await Promise.allSettled([
        saveMessage(),
        sendEmailNotification(),
      ]);
      const errors = [
        databaseResult.status === 'rejected'
          ? `Unable to save the message to Supabase: ${getErrorMessage(databaseResult.reason)}`
          : null,
        emailResult.status === 'rejected'
          ? `Unable to send the email notification: ${getErrorMessage(emailResult.reason)}`
          : null,
      ].filter((error): error is string => error !== null);

      if (errors.length > 0) {
        throw new Error(errors.join(' '));
      }

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      soundManager.playSuccess();
    } catch (error: unknown) {
      setStatus('error');
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to send your message. Please try again or email me directly.',
      );
    }
  };

  const updateFormField = (field: keyof typeof formData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
    if (status !== 'idle') setStatus('idle');
  };

  const easing = [0.22, 1, 0.36, 1] as const;
  const profiles = [
    {
      label: 'GITHUB',
      handle: '@AyushGupta004',
      href: personal.links.github,
      icon: Github,
    },
    {
      label: 'LINKEDIN',
      handle: 'Ayush Gupta',
      href: personal.links.linkedin,
      icon: Linkedin,
    },
    {
      label: 'LEETCODE',
      handle: '@Ayush_Gupta04',
      href: personal.links.leetcode,
      icon: null,
    },
  ];

  return (
    <section id="section-09" className="contact-section">
      <svg className="contact-world-map" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <pattern id="contact-map-dots" width="8" height="8" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.25" fill="#FF3B00" opacity="0.22" />
          </pattern>
        </defs>
        <g fill="url(#contact-map-dots)">
          <path d="M66 190 112 147 173 132 208 101 273 111 314 139 355 140 382 169 366 192 329 202 317 226 286 233 275 263 249 270 237 304 216 329 209 367 184 386 169 363 173 334 150 316 144 287 119 269 112 239 82 222Z" />
          <path d="m306 354 36 15 23 35 4 41 22 40-6 44-23 42-9 49-20 42-17 63-25 46-16-29 7-49-16-43 7-42-17-44 8-38-11-40 18-40Z" />
          <path d="m410 152 39-27 56 6 36-19 64 10 30 24 55-7 48 19 44-7 37 25 61-5 41 24 47-3 31 26-9 25-42 5-28 25-40-7-27 22-38-5-25 26-35-9-23 19-30-13-24 12-27-19-33 10-19-24-36 4-22-28-33 1-15-33-36 0-13-33-47-10-25-28-42-7Z" />
          <path d="m674 323 48-31 63 9 40 27 18 42-17 34-31 18-14 40-28 18-21 51-28 13-27-40-31-22-14-42-32-37 11-43Z" />
          <path d="m806 305 51-22 70 12 38 29 28 50-16 45-36 25-21 52-40 30-45-21-19-46-34-20-10-50-25-34 20-30Z" />
          <path d="m1010 366 30-18 25 16-8 31-26 13-22-17Z" />
          <path d="m1103 225 45-29 61 8 38 31 42 13 29 38-17 28-43-4-25 30-42-7-36 22-37-22-28-33-36-14-18-33Z" />
          <path d="m1200 338 32-19 42 16 24 33-15 37-34 16-35-24-23-33Z" />
          <path d="m1300 557 35-13 30 18-9 36-34 13-28-22Z" />
        </g>
      </svg>

      <div className="contact-main">
        <div className="contact-editorial">
          <div className="contact-intro">
            <h1 className="contact-title section-heading">
              <span>LET&apos;S BUILD SOMETHING</span>
              <span>GREAT</span>
            </h1>
            <div className="contact-subtitle-wrap">
              <p>Have a role, a project, or an idea? My inbox is open.</p>
            </div>
          </div>

          <div className="contact-profile-grid">
            <motion.article
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, ease: easing }}
              className="contact-profile-card contact-email-card"
            >
              <div className="contact-card-toprow">
                <span className="contact-icon-wrap"><Mail size={16} aria-hidden="true" /></span>
                <span className="contact-card-actions">
                  <button
                    type="button"
                    onClick={copyEmail}
                    className="contact-copy-button"
                    aria-label={copied ? 'Email copied' : 'Copy email address'}
                  >
                    {copied ? 'COPIED' : 'COPY'}
                  </button>
                  <a
                    href={`mailto:${personal.email}`}
                    className="contact-card-arrow"
                    aria-label="Email Ayush Gupta"
                    onClick={() => soundManager.playPop()}
                  >
                    ↗
                  </a>
                </span>
              </div>
              <div className="contact-card-copy">
                <span className="contact-card-label">EMAIL</span>
                <a className="contact-card-value contact-email-address" href={`mailto:${personal.email}`}>
                  {personal.email}
                </a>
              </div>
              {copyError && <span className="contact-copy-error">{copyError}</span>}
            </motion.article>

            {profiles.map(({ label, handle, href, icon: Icon }, index) => (
              <motion.a
                key={label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: (index + 1) * 0.05, ease: easing }}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundManager.playPop()}
                className="contact-profile-card contact-profile-link"
                aria-label={`${label} profile ${handle}`}
              >
                <span className="contact-card-toprow">
                  <span className="contact-icon-wrap">
                    {Icon ? <Icon size={16} aria-hidden="true" /> : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d={siLeetcode.path} />
                      </svg>
                    )}
                  </span>
                  <span className="contact-card-arrow" aria-hidden="true">↗</span>
                </span>
                <span className="contact-card-copy">
                  <span className="contact-card-label">{label}</span>
                  <span className="contact-card-value">{handle}</span>
                </span>
              </motion.a>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.12, ease: easing }}
          className="contact-form-card"
        >
          <div className="contact-form-heading">
            <span>SEND A MESSAGE</span>
            <span className="contact-form-heading-rule" aria-hidden="true" />
          </div>

          <form onSubmit={handleSubmit} className="contact-form">
            <label>
              <span className="contact-field-label">
                <User size={13} aria-hidden="true" />
                <span>NAME</span>
              </span>
              <input
                className="contact-input"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={(event) => updateFormField('name', event.target.value)}
                placeholder="Your name"
              />
            </label>
            <label>
              <span className="contact-field-label">
                <Mail size={13} aria-hidden="true" />
                <span>EMAIL</span>
              </span>
              <input
                className="contact-input"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={(event) => updateFormField('email', event.target.value)}
                placeholder="you@example.com"
              />
            </label>
            <label>
              <span className="contact-message-label">
                <span className="contact-field-label">
                  <MessageCircle size={13} aria-hidden="true" />
                  <span>MESSAGE</span>
                </span>
                <span className="contact-character-count">{formData.message.length}/500</span>
              </span>
              <textarea
                className="contact-input contact-message-input"
                required
                rows={4}
                maxLength={500}
                value={formData.message}
                onChange={(event) => updateFormField('message', event.target.value)}
                placeholder="Tell me about your project, idea, or just say hi..."
              />
            </label>

            <AnimatePresence mode="wait">
              {status === 'success' && (
                <motion.p
                  key="success"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="contact-form-success"
                  role="status"
                >
                  <Check size={15} /> Message sent. Thanks for reaching out.
                </motion.p>
              )}
              {status === 'error' && (
                <motion.p
                  key="error"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="contact-form-error"
                  role="alert"
                >
                  {errorMessage}
                </motion.p>
              )}
            </AnimatePresence>

            <button type="submit" disabled={status === 'submitting'} className="contact-submit-button">
              <span>{status === 'submitting' ? 'SENDING MESSAGE' : 'SEND MESSAGE'}</span>
              {status !== 'submitting' && <span aria-hidden="true">↗</span>}
            </button>
          </form>
        </motion.div>
      </div>

    </section>
  );
};
