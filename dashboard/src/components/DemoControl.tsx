import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Play, RotateCcw, Square } from 'lucide-react';
import { getDemoStatus, resetDemo, startDemo, stopDemo } from '../api/demo';

export default function DemoControl() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ['demo'], queryFn: getDemoStatus, refetchInterval: 2000 });
  const toggle = useMutation({
    mutationFn: () => (data?.running ? stopDemo() : startDemo()),
    onSuccess: (status) => {
      qc.setQueryData(['demo'], status);
      qc.invalidateQueries({ queryKey: ['sessions'] });
    },
  });

  const reset = useMutation({
    mutationFn: resetDemo,
    onSuccess: (status) => {
      qc.setQueryData(['demo'], status);
      qc.invalidateQueries();
    },
  });

  const running = data?.running ?? false;
  return (
    <div className="flex items-center gap-3">
      {running && (
        <span className="flex items-center gap-2 text-xs text-gray-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-[var(--color-severity-low)] animate-pulse" />
          Watching VPN · {data?.generated ?? 0} captured
        </span>
      )}
      {(toggle.isError || data?.last_error) && (
        <span className="text-xs text-red-400">{toggle.isError ? 'Could not reach API' : 'Capture failed'}</span>
      )}
      <button
        onClick={() => {
          if (window.confirm('Delete all sessions and reset the dashboard?')) reset.mutate();
        }}
        disabled={reset.isPending}
        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium border border-[var(--color-border-subtle)] text-gray-400 hover:text-gray-200 hover:bg-[var(--color-surface-hover)] transition-colors disabled:opacity-60"
      >
        <RotateCcw size={14} />
        Reset
      </button>
      <button
        onClick={() => toggle.mutate()}
        disabled={toggle.isPending}
        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border transition-colors disabled:opacity-60 ${
          running
            ? 'border-red-500/40 text-red-400 hover:bg-red-500/10'
            : 'border-[var(--color-primary)]/40 text-[var(--color-primary)] bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)]/20'
        }`}
      >
        {running ? <Square size={14} /> : <Play size={14} />}
        {running ? 'Stop Live Demo' : 'Start Live Demo'}
      </button>
    </div>
  );
}
