type DateNavigatorProps = {
  label: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
};

export function DateNavigator({ label, onPrev, onNext, onToday }: DateNavigatorProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button className="rounded-full border px-4 py-2 text-sm" onClick={onPrev} type="button">
        이전
      </button>
      <button className="rounded-full border px-4 py-2 text-sm" onClick={onToday} type="button">
        오늘
      </button>
      <button className="rounded-full border px-4 py-2 text-sm" onClick={onNext} type="button">
        다음
      </button>
      <strong className="text-sm font-semibold text-slate-900">{label}</strong>
    </div>
  );
}

