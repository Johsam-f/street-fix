import { Suspense } from 'react';
import { IssueReportForm } from './_components/issue-report-form';
import { IssueList } from './_components/issue-list';
import { IssueListWrapper } from './_components/issue-list-wrapper';

export default async function IssuesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; status?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Report an Issue</h1>
        <p className="text-muted-foreground mt-2">
          Document problems in your community with photos and location
        </p>
      </div>

      <IssueReportForm />

      <div>
        <h2 className="text-2xl font-semibold mb-4">Recent Issues</h2>
        <IssueListWrapper>
          <Suspense
            key={`${params.category || 'all'}-${params.status || 'all'}`}
            fallback={
              <div className="border rounded-lg p-8 text-center text-muted-foreground">
                <p>Loading issues...</p>
              </div>
            }
          >
            <IssueList category={params.category} status={params.status} />
          </Suspense>
        </IssueListWrapper>
      </div>
    </div>
  );
}
