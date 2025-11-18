# @sewai/cefr-report-ui

A comprehensive React library for displaying CEFR (Common European Framework of Reference) language assessment reports with interactive visualizations, detailed metrics, and audio playback integration.

## Features

- 📊 **Comprehensive CEFR Reports** - Display detailed language assessments across 5 dimensions (Grammar, Fluency, Vocabulary, Pronunciation, Clarity)
- 🎯 **Interactive Visualizations** - Score rings, talk-time charts, and metric displays using Recharts
- 🎧 **Audio Playback** - Integrated audio player with timestamp-based segment navigation
- 📝 **Transcript View** - Full conversation transcript with follow mode and speaker identification
- 🏷️ **Tag-based Filtering** - Filter feedback segments by error types and categories
- 🎨 **Fully Customizable** - Built with Tailwind CSS and shadcn/ui for easy theming
- ✅ **Type-Safe** - Full TypeScript support with Zod runtime validation
- 📦 **Zero Dependencies** - Uses peer dependencies for maximum flexibility

## Installation

See [INSTALLATION.md](./INSTALLATION.md) for detailed setup instructions.

Quick install:

```bash
npm install @sewai/cefr-report-ui
# Install peer dependencies
npm install zod recharts lucide-react class-variance-authority clsx tailwind-merge
npm install @radix-ui/react-tabs @radix-ui/react-scroll-area @radix-ui/react-slider @radix-ui/react-checkbox @radix-ui/react-label @radix-ui/react-tooltip @radix-ui/react-slot
```

## Basic Usage

```typescript
import { CEFRReport, AudioPlayerProvider } from '@sewai/cefr-report-ui';
import '@sewai/cefr-report-ui/styles.css';
import type { ReportDataV2 } from '@sewai/cefr-report-ui';

function MyReportPage() {
  const reportData: ReportDataV2 = {
    /* Your CEFR report data */
  };
  const audioUrl = 'https://example.com/audio.mp3';

  return (
    <AudioPlayerProvider audioUrl={audioUrl}>
      <CEFRReport
        reportData={reportData}
        recordingTitle="Student Assessment - Session 1"
        studentName="John Doe"
        duration={300}
      />
    </AudioPlayerProvider>
  );
}
```

## API Reference

### CEFRReport Component

Main component for displaying CEFR assessment reports.

#### Props

| Prop              | Type            | Required | Description                                      |
| ----------------- | --------------- | -------- | ------------------------------------------------ |
| `reportData`      | `ReportDataV2`  | ✅       | Complete CEFR assessment data                    |
| `recordingTitle`  | `string`        | ✅       | Title/description of the recording               |
| `studentName`     | `string`        | ✅       | Name of the student being assessed               |
| `duration`        | `number`        | ✅       | Duration of the recording in seconds             |
| `defaultTab`      | `string`        | ❌       | Default active tab (default: "overall")          |

#### Example

```typescript
<CEFRReport
  reportData={data}
  recordingTitle="English Proficiency Test - Speaking"
  studentName="Jane Smith"
  duration={450}
  defaultTab="grammar"
/>
```

### AudioPlayerProvider

Context provider for audio playback functionality. **Must wrap CEFRReport** to enable audio features.

#### Props

| Prop       | Type              | Required | Description                             |
| ---------- | ----------------- | -------- | --------------------------------------- |
| `audioUrl` | `string \| null`  | ✅       | URL to the audio file                   |
| `children` | `React.ReactNode` | ✅       | Child components (typically CEFRReport) |

#### Example

```typescript
<AudioPlayerProvider audioUrl="https://cdn.example.com/recording.mp3">
  <CEFRReport {...props} />
</AudioPlayerProvider>
```

### useAudioPlayer Hook

Access audio player controls from any component within AudioPlayerProvider.

#### Returns

| Property      | Type                                       | Description                            |
| ------------- | ------------------------------------------ | -------------------------------------- |
| `audioUrl`    | `string \| null`                           | Current audio URL                      |
| `isPlaying`   | `boolean`                                  | Whether audio is currently playing     |
| `currentTime` | `number`                                   | Current playback time in seconds       |
| `duration`    | `number`                                   | Total audio duration in seconds        |
| `isLoading`   | `boolean`                                  | Loading state (always false)           |
| `seekTo`      | `(seconds: number) => void`                | Seek to specific time                  |
| `play`        | `() => Promise<void>`                      | Play audio                             |
| `pause`       | `() => void`                               | Pause audio                            |
| `togglePlay`  | `() => Promise<void>`                      | Toggle play/pause                      |
| `audioRef`    | `React.RefObject<HTMLAudioElement \| null>` | Direct reference to audio element      |

#### Example

```typescript
import { useAudioPlayer } from '@sewai/cefr-report-ui';

function CustomControls() {
  const { isPlaying, togglePlay, currentTime, duration } = useAudioPlayer();

  return (
    <button onClick={togglePlay}>
      {isPlaying ? 'Pause' : 'Play'} ({currentTime.toFixed(0)}s / {duration.toFixed(0)}s)
    </button>
  );
}
```

## Data Structure

### ReportDataV2 Type

The main data structure for CEFR reports:

```typescript
interface ReportDataV2 {
  transcript: ProcessedTranscript;
  interactive_analysis: Analysis;
  reports: {
    cefr: {
      summary: Summary;
      grammar: GrammarReport;
      fluency: FluencyReport;
      vocabulary: VocabularyReport;
      pronunciation: PronunciationReport;
      clarity: ClarityReport;
    };
  };
}
```

### Example Data

```typescript
const sampleData: ReportDataV2 = {
  transcript: {
    segments: [
      {
        speaker: 'SPEAKER_00',
        start_time: '00:00:00',
        end_time: '00:00:05',
        content: 'Hello, how are you today?',
      },
      // ... more segments
    ],
    speaker_map: [
      { speaker_id: 'SPEAKER_00', speaker_name: 'Student' },
      { speaker_id: 'SPEAKER_01', speaker_name: 'AI Tutor' },
    ],
    talk_time: {
      duration: '00:05:00',
      speakers: {
        SPEAKER_00: '00:03:30',
        SPEAKER_01: '00:01:20',
      },
      idle: '00:00:10',
      overlap: '00:00:00',
    },
  },
  interactive_analysis: {
    topic_segments: [
      {
        topic: 'Introduction',
        start_time: '00:00:00',
        end_time: '00:01:00',
      },
    ],
    safety_flags: {
      profanity_detected: false,
      flagged_words: [],
    },
    overall_sentiment: [],
    emotion_timeline: [],
  },
  reports: {
    cefr: {
      summary: {
        type: 'summary',
        dimension_scores: {
          fluency: 75,
          grammar: 80,
          vocabulary: 70,
          pronunciation: 85,
          clarity: 78,
        },
        score: {
          strengths: ['Clear pronunciation', 'Good grammar accuracy'],
          limitations: ['Limited vocabulary range', 'Occasional hesitations'],
          score: 77,
          confidence_level: 'high',
          reason: 'Overall, you demonstrate solid B2 level proficiency...',
        },
        action_plan: [
          'Practice using more advanced vocabulary',
          'Work on reducing fillers and pauses',
        ],
      },
      grammar: {
        /* Grammar report data */
      },
      fluency: {
        /* Fluency report data */
      },
      vocabulary: {
        /* Vocabulary report data */
      },
      pronunciation: {
        /* Pronunciation report data */
      },
      clarity: {
        /* Clarity report data */
      },
    },
  },
};
```

## Utility Functions

The library exports several utility functions for working with CEFR data:

### Audio Utilities

```typescript
import {
  parseTimeToSeconds,
  formatSecondsToTime,
  isTimeInSegment,
  findActiveSegmentIndex,
} from '@sewai/cefr-report-ui';

// Convert timestamp to seconds
const seconds = parseTimeToSeconds('00:01:30'); // 90

// Format seconds to timestamp
const timestamp = formatSecondsToTime(90); // "1:30"

// Check if time is in segment range
const inRange = isTimeInSegment(45, '00:00:30', '00:01:00'); // true

// Find active segment
const index = findActiveSegmentIndex(45, segments); // Returns segment index
```

### Segment Utilities

```typescript
import {
  groupSegmentsByTag,
  getUniqueTagsFromSegments,
  filterSegmentsByTags,
  getTagColorClass,
  sortTags,
} from '@sewai/cefr-report-ui';

// Group segments by tags
const { grouped, uncategorized } = groupSegmentsByTag(segments);

// Get unique tags
const tags = getUniqueTagsFromSegments(segments);

// Filter by selected tags
const filtered = filterSegmentsByTags(segments, new Set(['Verb Tense']));

// Get Tailwind classes for tag styling
const colorClass = getTagColorClass('Verb Tense'); // "bg-orange-100 text-orange-800..."

// Sort tags by priority
const sorted = sortTags(tags);
```

## Zod Schemas

All data types have corresponding Zod schemas for runtime validation:

```typescript
import {
  v2EvaluationDataSchema,
  fluencyReportSchema,
  grammarReportSchema,
} from '@sewai/cefr-report-ui';

// Validate data at runtime
try {
  const validated = v2EvaluationDataSchema.parse(incomingData);
  // Data is valid
} catch (error) {
  // Validation failed
  console.error('Invalid report data:', error);
}
```

## Customization

### Theming

The library uses Tailwind CSS and CSS variables for theming. Customize colors by overriding CSS variables:

```css
:root {
  --primary: 210 100% 50%; /* Custom primary color */
  --chart-1: 150 80% 45%; /* Custom chart color */
}
```

### Custom Tabs

Display specific tabs only:

```typescript
<CEFRReport
  {...props}
  defaultTab="grammar"
  // Users can still navigate to other tabs
/>
```

### Styling Components

All components accept `className` props for custom styling:

```typescript
import { MetricCard } from '@sewai/cefr-report-ui';

<MetricCard className="border-2 border-blue-500" {...props} />;
```

## Advanced Usage

### Embedding in iframe

```typescript
// Parent page
<iframe src="/report-viewer?id=123" width="100%" height="800px" />

// Report viewer page
import { CEFRReport, AudioPlayerProvider } from '@sewai/cefr-report-ui';

function ReportViewer() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    fetch(`/api/reports/${id}`)
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <AudioPlayerProvider audioUrl={data.audioUrl}>
      <CEFRReport {...data} />
    </AudioPlayerProvider>
  );
}
```

### Server-Side Rendering (SSR)

The library works with Next.js and other SSR frameworks:

```typescript
// app/reports/[id]/page.tsx (Next.js App Router)
import { CEFRReport, AudioPlayerProvider } from '@sewai/cefr-report-ui';

export default async function ReportPage({ params }: { params: { id: string } }) {
  const data = await fetchReportData(params.id);

  return (
    <AudioPlayerProvider audioUrl={data.audioUrl}>
      <CEFRReport {...data} />
    </AudioPlayerProvider>
  );
}
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Modern mobile browsers

## TypeScript

Full TypeScript support with comprehensive type definitions. No `@types` package needed.

```typescript
import type {
  ReportDataV2,
  GrammarReport,
  FluencyMetrics,
  BaseScore,
} from '@sewai/cefr-report-ui';
```

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## License

MIT © SEWAi Team

## Support

- GitHub Issues: [https://github.com/your-org/sewai-report-ui/issues](https://github.com/your-org/sewai-report-ui/issues)
- Documentation: [https://docs.sewai.com](https://docs.sewai.com)

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for release notes.
