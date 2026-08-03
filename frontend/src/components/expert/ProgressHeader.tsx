interface ProgressHeaderProps {
  title: string;
  current: number;
  total: number;
  progress: number;
  completed: boolean;
}

export function ProgressHeader({ title, current, total, progress, completed }: ProgressHeaderProps) {
  return (
    <header className="expert-progress">
      <div>
        <p className="expert-eyebrow">{completed ? "Rezumat" : `Pasul ${current} din ${total}`}</p>
        <h1>{title}</h1>
      </div>
      <strong aria-label={`Progres ${progress}%`}>{progress}%</strong>
      <div className="expert-progress-track" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>
    </header>
  );
}
