import { TakePracticePage } from '@/src/features/practice/take-practice/components/TakePracticePage';

interface PageProps {
    params: {
        id: string;
    };
}

export default function TakePracticeRoute({ params }: PageProps) {
    consologe.log('Taking practice session with ID:', params.id);
    return <TakePracticePage />;
}