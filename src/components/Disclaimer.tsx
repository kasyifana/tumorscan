import { MdWarning } from 'react-icons/md';

export default function Disclaimer() {
    return (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
            <MdWarning className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
                <strong>Disclaimer:</strong> This system is a clinical decision support tool and does not replace professional medical diagnosis.
            </p>
        </div>
    );
}
