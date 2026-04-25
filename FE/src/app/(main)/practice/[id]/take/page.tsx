import { TakePracticePage } from '@/src/features/practice/takePractice/components/TakePracticePage';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function TakePracticeRoute({ params }: PageProps) {
    const resolvedParams = await params;
    console.log('Taking practice session with ID:', resolvedParams.id);
    
    return <TakePracticePage params={resolvedParams} />;
}
