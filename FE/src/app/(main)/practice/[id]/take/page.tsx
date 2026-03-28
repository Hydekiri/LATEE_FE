import { TakePracticePage } from '@/src/features/practice/takePractice/components/TakePracticePage';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function TakePracticeRoute({ params }: PageProps) {
    const { id } = await params;
    console.log('Taking practice session with ID:', id);
    return <TakePracticePage id={id} />;
}