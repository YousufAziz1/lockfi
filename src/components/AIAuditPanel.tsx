import { useState } from 'react';
import { auditContract, askWeb3AI } from '../lib/chaingpt';
import { FULL_DARKVAULT_CODE } from '../lib/contractSnippet';
import ReactMarkdown from 'react-markdown';
import { Bot, ShieldAlert, CheckCircle, TerminalSquare, Loader2, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export const AIAuditPanel = () => {
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<any>(null);
  
  const [chatInput, setChatInput] = useState('');
  const [chatLog, setChatLog] = useState<{role: 'user' | 'ai', msg: string}[]>([
    { role: 'ai', msg: 'Hello. I am the ChainGPT Web3 AI. I can audit the LockFi smart contracts for you.' }
  ]);
  const [isChatting, setIsChatting] = useState(false);

  const runAudit = async () => {
    setIsAuditing(true);
    const result = await auditContract(FULL_DARKVAULT_CODE);
    setAuditResult(result.data);
    setIsAuditing(false);
  };

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const userMsg = chatInput;
    setChatLog(prev => [...prev, { role: 'user', msg: userMsg }]);
    setChatInput('');
    setIsChatting(true);

    const res = await askWeb3AI(userMsg, FULL_DARKVAULT_CODE);
    setChatLog(prev => [...prev, { role: 'ai', msg: res.response || "No response received." }]);
    setIsChatting(false);
  };

  return (
    <div className="glass-card p-6 flex flex-col h-full relative group">
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />

      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[var(--accent-2)]">
          <Bot size={20} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">AI Security Audit</h2>
          <p className="text-xs text-[var(--text-muted)]">Powered by ChainGPT</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 custom-scrollbar">
        {!auditResult ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-8">
            <ShieldAlert size={48} className="text-[var(--text-faint)]" />
            <p className="text-[var(--text-muted)] text-sm">Run an AI audit to scan LockFi.sol for vulnerabilities and MEV vectors.</p>
            <button 
              onClick={runAudit}
              disabled={isAuditing}
              className="bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-2 rounded-xl text-sm transition-all text-[var(--text-primary)] flex items-center gap-2"
            >
              {isAuditing ? <Loader2 size={16} className="animate-spin text-[var(--accent)]" /> : <CheckCircle size={16} className="text-[var(--accent)]" />}
              {isAuditing ? 'Scanning Contract...' : 'Audit Contract'}
            </button>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
              <span className="text-sm text-[var(--text-muted)]">Security Score</span>
              <span className="text-xl font-bold text-[var(--success)]">{auditResult.score}/100</span>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider text-[var(--text-faint)] font-bold">Findings</h4>
              {auditResult.vulnerabilities?.map((vuln: any, idx: number) => (
                <div key={idx} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[var(--text-primary)]">{vuln.title}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                      vuln.severity === 'Critical' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                      vuln.severity === 'High' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                      vuln.severity === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                      'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>
                      {vuln.severity}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">{vuln.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="space-y-3 pt-4 border-t border-white/5">
           {chatLog.map((c, i) => (
             <div key={i} className={`flex gap-2 ${c.role === 'user' ? 'justify-end' : 'justify-start'}`}>
               {c.role === 'ai' && <TerminalSquare size={14} className="text-[var(--accent-2)] mt-1 flex-shrink-0" />}
               <div className={`px-3 py-2 text-xs rounded-xl prose prose-invert prose-p:leading-relaxed prose-pre:bg-black/20 prose-pre:border prose-pre:border-white/10 max-w-full ${
                 c.role === 'user' ? 'bg-[var(--accent)]/10 text-[var(--accent)] rounded-tr-sm border border-[var(--accent)]/20' 
                 : 'bg-white/5 text-[var(--text-primary)] rounded-tl-sm border border-white/5'
               }`}>
                 {c.role === 'ai' ? <ReactMarkdown>{c.msg}</ReactMarkdown> : c.msg}
               </div>
             </div>
           ))}
           {isChatting && (
             <div className="flex gap-2 justify-start">
               <Loader2 size={14} className="animate-spin text-[var(--accent-2)] mt-1 flex-shrink-0" />
               <div className="px-3 py-2 text-xs rounded-xl bg-white/5 text-[var(--text-muted)] rounded-tl-sm border border-white/5">
                 Thinking...
               </div>
             </div>
           )}
        </div>
      </div>

      <form onSubmit={handleChat} className="relative z-10">
        <input 
          type="text" 
          value={chatInput}
          onChange={e => setChatInput(e.target.value)}
          placeholder="Ask AI about LockFi..."
          className="w-full bg-white/5 border border-white/10 focus:border-[var(--accent)]/50 rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-faint)] focus:outline-none transition-colors"
        />
        <button 
          type="submit" 
          disabled={!chatInput.trim() || isChatting}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[var(--text-muted)] hover:text-[var(--accent)] disabled:opacity-50 transition-colors"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};
