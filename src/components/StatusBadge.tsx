interface StatusBadgeProps {
    status: 'Pending' | 'Processing' | 'Completed' | 'Failed' | 'Active' | 'Inactive' | 'Under Review' | 'Approved' | 'Rejected' | 'In Review' | string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const getStatusStyles = () => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-blue-100 text-blue-700';
            case 'processing':
            case 'in review':
                return 'bg-yellow-100 text-yellow-700';
            case 'completed':
            case 'approved':
            case 'active':
                return 'bg-green-100 text-green-700';
            case 'failed':
            case 'rejected':
                return 'bg-red-100 text-red-700';
            case 'inactive':
            case 'under review':
                return 'bg-gray-100 text-gray-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusStyles()}`}>
            {status}
        </span>
    );
}
