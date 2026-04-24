import { TakePracticePage } from '@/src/features/practice/takePractice/components/TakePracticePage';

interface PageProps {
    params: {
        id: string;
    };
}

export default function TakePracticeRoute({ params }: PageProps) {
    console.log('Taking practice session with ID:', params.id);
    return <TakePracticePage id={params.id} />;
}