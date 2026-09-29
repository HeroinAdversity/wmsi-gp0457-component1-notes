import { Navigate, Routes, Route } from 'react-router-dom';
import { SiteLayout } from './components/SiteLayout';
import { HomePage } from './pages/HomePage';
import { Q1aPage } from './pages/q1a/Q1aPage';
import { IdentifyingPerspectivesPage } from './pages/identifying-perspectives/IdentifyingPerspectivesPage';
import { StatementTypesHubPage } from './pages/types-of-statements/StatementTypesHubPage';
import { StatementTypesToolPage } from './pages/types-of-statements/StatementTypesToolPage';
import { StatementTypesIntensivePage } from './pages/types-of-statements/StatementTypesIntensivePage';
import { FindYourGapPage } from './pages/types-of-statements/FindYourGapPage';
import { ClaimVsEvidencePage } from './pages/types-of-statements/ClaimVsEvidencePage';
import { MindMapPage } from './pages/types-of-statements/MindMapPage';
import { RevisionSheetPage } from './pages/types-of-statements/RevisionSheetPage';
import { PerspectivesRevisionSheetPage } from './pages/identifying-perspectives/PerspectivesRevisionSheetPage';
import { SignificanceRevisionSheetPage } from './pages/identifying-perspectives/SignificanceRevisionSheetPage';
import { RevisionSheetsIndexPage } from './pages/RevisionSheetsIndexPage';
import { TeacherDashboardPage } from './pages/dashboards/TeacherDashboardPage';
import { IntensiveDashboardPage } from './pages/dashboards/IntensiveDashboardPage';
import { TeachersHubPage } from './pages/dashboards/TeachersHubPage';
import { PerspectivesDashboardPage } from './pages/dashboards/PerspectivesDashboardPage';
import { WeighingRoomDashboardPage } from './pages/dashboards/WeighingRoomDashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ToolkitPage } from './pages/research/ToolkitPage';
import { ResearchHubPage } from './pages/research/ResearchHubPage';
import { EvaluatePage } from './pages/research/EvaluatePage';

export function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />

        {/* Q1(a) — Source recall */}
        <Route path="source-recall" element={<Q1aPage />} />

        {/* Q1(c) + Q1(d) — Perspectives (identify) and Weighing Room (weigh),
            folded into one page with a top-level chapter switcher */}
        <Route path="perspectives" element={<IdentifyingPerspectivesPage />} />
        <Route
          path="perspectives/weighing-room"
          element={<Navigate to="/perspectives#weigh" replace />}
        />

        {/* Q1(b) — Types of Statements. /statements now shows the main notes
            directly (no gateway). The tool hub still exists at /statements/tools
            for teachers who want the full sub-tool list. Revision sheets live
            under the /revision/* namespace. */}
        <Route path="statements" element={<StatementTypesToolPage />} />
        <Route path="statements/main" element={<Navigate to="/statements" replace />} />
        <Route path="statements/tools" element={<StatementTypesHubPage />} />
        <Route path="statements/intensive" element={<StatementTypesIntensivePage />} />
        <Route path="statements/diagnostic" element={<FindYourGapPage />} />
        <Route path="statements/claim-vs-evidence" element={<ClaimVsEvidencePage />} />
        <Route path="statements/mindmap" element={<MindMapPage />} />
        <Route path="statements/revision" element={<Navigate to="/revision/statements" replace />} />

        {/* Revision Sheets — index + one canonical URL per sheet */}
        <Route path="revision" element={<RevisionSheetsIndexPage />} />
        <Route path="revision/statements" element={<RevisionSheetPage />} />
        <Route path="revision/perspectives" element={<PerspectivesRevisionSheetPage />} />
        <Route path="revision/significance" element={<SignificanceRevisionSheetPage />} />

        {/* Q2 — Research */}
        <Route path="research" element={<ResearchHubPage />} />
        <Route path="research/toolkit" element={<ToolkitPage />} />
        <Route path="research/evaluate" element={<EvaluatePage />} />

        {/* Teacher dashboards */}
        <Route path="teachers" element={<TeachersHubPage />} />
        <Route path="teachers/statements" element={<TeacherDashboardPage />} />
        <Route path="teachers/statements-intensive" element={<IntensiveDashboardPage />} />
        <Route path="teachers/perspectives" element={<PerspectivesDashboardPage />} />
        <Route path="teachers/weighing-room" element={<WeighingRoomDashboardPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
