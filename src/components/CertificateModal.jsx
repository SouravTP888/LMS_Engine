import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Award, ShieldAlert, Sparkles, Download, CheckCircle } from 'lucide-react';
import GlassCard from './GlassCard';

const CertificateModal = ({ trackId, onClose }) => {
  const { token } = useAuth();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/progress/certificate/${trackId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setCert(data.certificate);
        } else {
          setError(data.message || 'Failed to load certificate');
        }
      } catch (err) {
        console.error('Error fetching certificate:', err);
        setError('Network error compiling certificate.');
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [trackId, token]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl glass-panel border border-brand-cardBorder shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-xl bg-white/5 p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {loading ? (
          <div className="flex h-96 flex-col items-center justify-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-primary border-t-transparent" />
            <p className="text-sm text-brand-textMuted">Compiling credential metadata...</p>
          </div>
        ) : error ? (
          <div className="flex h-96 flex-col items-center justify-center gap-3 p-6 text-center">
            <ShieldAlert className="h-12 w-12 text-red-400" />
            <h3 className="text-lg font-bold text-white">Credential Verification Failed</h3>
            <p className="text-sm text-brand-textMuted max-w-sm">{error}</p>
            <button
              onClick={onClose}
              className="mt-2 rounded-xl bg-brand-primary px-4 py-2 text-xs font-bold text-white hover:bg-brand-primary/80 transition-all cursor-pointer"
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          <div className="p-6 md:p-10 flex flex-col items-center">
            {/* Printable Area Wrapper */}
            <div 
              id="printable-certificate"
              className="relative w-full border-4 border-yellow-500/35 bg-gradient-to-br from-[#0c0728] via-[#040113] to-[#0d0d36] p-8 md:p-12 text-center rounded-xl overflow-hidden shadow-inner select-text print:bg-white print:text-black print:border-black"
            >
              {/* Decorative background grid and flares */}
              <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
              <div className="absolute -top-12 -left-12 h-48 w-48 rounded-full bg-brand-primary/10 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-brand-secondary/10 blur-3xl pointer-events-none" />

              {/* Certificate Header */}
              <div className="flex flex-col items-center mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10 border border-yellow-500/40 text-yellow-400 mb-3 animate-pulse">
                  <Award className="h-7 w-7" />
                </div>
                <span className="text-xs font-black tracking-widest text-yellow-500 uppercase">
                  Certificate of Completion
                </span>
                <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mt-2" />
              </div>

              <p className="text-[10px] md:text-xs text-brand-textMuted font-medium tracking-wide uppercase italic">
                This document officially recognizes that
              </p>
              
              <h2 className="text-2xl md:text-4xl font-extrabold text-white my-4 font-serif tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white via-yellow-200 to-yellow-500">
                {cert.studentName}
              </h2>

              <p className="text-[10px] md:text-xs text-brand-textMuted max-w-md mx-auto leading-relaxed">
                has successfully navigated and accomplished all sequential training modules and technical challenges for the syllabus:
              </p>

              <h3 className="text-lg md:text-2xl font-bold text-brand-secondary my-4 tracking-wide glow-cyan uppercase">
                {cert.trackTitle}
              </h3>

              <p className="text-[9px] md:text-[10px] text-brand-textMuted max-w-sm mx-auto leading-relaxed">
                Demonstrating core competency in software structures, test validations, and implementation rules.
              </p>

              {/* Signatures & Footer details */}
              <div className="grid grid-cols-2 gap-4 mt-8 md:mt-12 pt-6 border-t border-brand-cardBorder/30">
                <div className="text-left pl-4">
                  <p className="font-serif text-sm italic text-gray-300 font-bold">{cert.signature}</p>
                  <div className="h-px bg-brand-cardBorder/60 w-28 my-1" />
                  <p className="text-[9px] text-brand-textMuted uppercase font-bold tracking-wider">Authorized Engine Signature</p>
                </div>
                <div className="text-right pr-4">
                  <p className="text-xs text-gray-300 font-bold">{cert.date}</p>
                  <div className="h-px bg-brand-cardBorder/60 w-28 ml-auto my-1" />
                  <p className="text-[9px] text-brand-textMuted uppercase font-bold tracking-wider">Date of Attainment</p>
                </div>
              </div>

              {/* Verification Info */}
              <div className="mt-8 text-[8px] text-brand-textMuted/60 font-mono tracking-wider">
                ID: {cert.id} &bull; SECURE HASH: SHA256-AETHER-{trackId.substring(0,6).toUpperCase()}
              </div>
            </div>

            {/* Print/Download Button */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 px-5 py-2.5 text-xs font-black text-[#030014] shadow-lg shadow-yellow-500/10 hover:brightness-110 hover:scale-[1.02] transition-all cursor-pointer"
              >
                <Download className="h-4 w-4" />
                Print Certificate / Save PDF
              </button>
              <button
                onClick={onClose}
                className="rounded-xl border border-brand-cardBorder bg-brand-cardBorder/30 px-5 py-2.5 text-xs font-bold text-gray-300 hover:bg-brand-cardBorder/50 transition-all cursor-pointer"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateModal;
