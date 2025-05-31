import LogDetailPage from "@/components/logs/logDetailPage";

interface PageProps {
    params: {
        logType: "order" | "transaction";
        logId: string;
    };
}

export default function LogDetailPageRoute({ params }: PageProps) {
    return <LogDetailPage logId={params.logId} logType={params.logType} />;
}
