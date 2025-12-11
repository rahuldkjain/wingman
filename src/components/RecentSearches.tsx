import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"
import type { SearchRequest } from "@/utils/urlBuilders"
import { format } from "date-fns"

interface RecentSearchesProps {
    searches: SearchRequest[];
    onSelect: (search: SearchRequest) => void;
}

export function RecentSearches({ searches, onSelect }: RecentSearchesProps) {
    if (searches.length === 0) return null;

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" /> Recent Searches
            </h3>
            <div className="grid grid-cols-1 gap-2">
                {searches.map((search, idx) => (
                    <Button 
                        key={idx} 
                        variant="ghost" 
                        className="justify-start h-auto py-2 px-3 w-full border border-border/50 hover:bg-accent/50"
                        onClick={() => onSelect(search)}
                    >
                        <div className="flex flex-col items-start gap-1 w-full">
                            <div className="flex justify-between w-full">
                                <span className="font-semibold text-xs">{search.origin.code} → {search.destination.code}</span>
                                <span className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded uppercase">
                                    {search.tripType}
                                </span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                                {format(new Date(search.departDate), 'dd MMM')}
                                {search.tripType === 'roundtrip' && search.returnDate && ` - ${format(new Date(search.returnDate), 'dd MMM')}`}
                            </span>
                        </div>
                    </Button>
                ))}
            </div>
        </div>
    )
}
