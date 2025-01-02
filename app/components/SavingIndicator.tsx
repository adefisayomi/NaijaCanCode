import { CloudUpload } from "lucide-react";


export default function SavingIndicator ({text}: {text?: string}) {
    return (
      <div className="flex items-center gap-1">
        <CloudUpload className="w-4 h-4 animate-bounce" />
        <p className="text-[11px] font-medium lowercase">{text || 'Saving changes'}</p>
          <div className="flex space-x-1">
          <div className="w-[4px] h-[4px] bg-green-500 rounded-full dot1"></div>
          <div className="w-[4px] h-[4px] bg-green-500 rounded-full dot2"></div>
          <div className="w-[4px] h-[4px] bg-green-500 rounded-full dot3"></div>
        </div>
      </div>
    )
  }