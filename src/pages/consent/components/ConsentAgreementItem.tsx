interface ConsentAgreementItemProps {
    id: string
    label: string
    content: string
    checked: boolean
    onChange: (checked: boolean) => void
}

export default function ConsentAgreementItem({
    id,
    label,
    content,
    checked,
    onChange,
}: ConsentAgreementItemProps) {
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    id={id}
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    className="w-4 h-4 accent-primary border-primary rounded focus:outline-none hover:border-primary cursor-pointer transition-colors flex-shrink-0"
                />
                <label htmlFor={id} className="flex items-center cursor-pointer">
                    <span className="text-gray-900 font-medium text-sm lg:text-base leading-tight">
                        {label}
                    </span>
                </label>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 max-h-64 overflow-y-auto">
                <div className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                    {content}
                </div>
            </div>
        </div>
    )
}

