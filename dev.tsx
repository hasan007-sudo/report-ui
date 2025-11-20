import { createRoot } from 'react-dom/client';
import { CEFRReport } from './src/components/cefr-report';
import type { ReportDataV2 } from './src/types/cefr-report';
import './src/index.css';

// Import sample data
import sampleData from './sample_v2.json';
import audioFile from './raja rajeshwari.mp3';

function DevApp() {
  return (
    <div className="min-h-screen bg-background">
      <CEFRReport
        reportData={sampleData as ReportDataV2}
        audioUrl={audioFile}
        recordingTitle="English Proficiency Assessment - Demo"
        studentName="Demo Student"
        variant="standalone"
      />
    </div>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(<DevApp />);
