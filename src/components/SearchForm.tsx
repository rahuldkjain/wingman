import * as React from "react"
import { ArrowRightLeft, Plane } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { AirportSelect } from "./AirportSelect"
import { DateSelector } from "./DateSelector"
import { RecentSearches } from "./RecentSearches"
import type { Airport } from "@/data/airports"
import { type SearchRequest, providers } from "@/utils/urlBuilders"
import { cn } from "@/lib/utils"

const STORAGE_KEY = 'wingman_recent_searches';

export function SearchForm() {
  const [origin, setOrigin] = React.useState<Airport | null>(null)
  const [destination, setDestination] = React.useState<Airport | null>(null)
  const [departDate, setDepartDate] = React.useState<Date | undefined>(new Date())
  const [returnDate, setReturnDate] = React.useState<Date | undefined>(undefined)
  const [tripType, setTripType] = React.useState<'oneway' | 'roundtrip'>('oneway')
  const [nonStop, setNonStop] = React.useState(false)
  
  const [recentSearches, setRecentSearches] = React.useState<SearchRequest[]>([])

  React.useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get([STORAGE_KEY], (result: { [key: string]: any }) => {
            if (result[STORAGE_KEY]) {
                const loaded = result[STORAGE_KEY].map((s: any) => ({
                    ...s,
                    departDate: new Date(s.departDate),
                    returnDate: s.returnDate ? new Date(s.returnDate) : undefined
                }));
                setRecentSearches(loaded);
            }
        });
    }
  }, []);

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  }

  const handleSubmit = () => {
    if (!origin || !destination || !departDate) return;
    if (tripType === 'roundtrip' && !returnDate) return;

    const request: SearchRequest = {
        origin,
        destination,
        departDate,
        returnDate,
        tripType,
        passengers: { adults: 1, children: 0, infants: 0 },
        cabinClass: 'economy',
        nonStop
    };

    const newHistory = [request, ...recentSearches.filter(s => 
        s.origin.code !== request.origin.code || 
        s.destination.code !== request.destination.code
    )].slice(0, 5);
    
    setRecentSearches(newHistory);
    
    if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.create) {
        chrome.storage.local.set({ [STORAGE_KEY]: newHistory });
        
        providers.forEach(provider => {
            const url = provider.builder(request);
            chrome.tabs.create({ url, active: false });
        });
    } else {
        console.log("Dev mode: Opening tabs");
        providers.forEach(provider => {
            const url = provider.builder(request);
            console.log(`${provider.name}: ${url}`);
            window.open(url, '_blank');
        });
        alert("In development mode, browsers may block opening multiple tabs. Please allow popups for this site or test as a loaded extension.");
    }
  }

  const loadSearch = (search: SearchRequest) => {
      setOrigin(search.origin);
      setDestination(search.destination);
      setDepartDate(search.departDate);
      setReturnDate(search.returnDate);
      setTripType(search.tripType);
      setNonStop(search.nonStop);
  }

  return (
    <div className="space-y-6">
        <div className="space-y-5 bg-card rounded-xl border p-6 shadow-lg">
            
            <div className="flex bg-muted p-1 rounded-lg w-fit gap-1">
                <button 
                    onClick={() => { setTripType('oneway'); setReturnDate(undefined); }}
                    className={cn(
                        "px-4 py-2 text-sm font-medium rounded-md transition-all",
                        tripType === 'oneway' ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    One Way
                </button>
                <button 
                    onClick={() => setTripType('roundtrip')}
                    className={cn(
                        "px-4 py-2 text-sm font-medium rounded-md transition-all",
                        tripType === 'roundtrip' ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    Round Trip
                </button>
            </div>

            <div className="space-y-4">
                <AirportSelect label="From" value={origin} onChange={setOrigin} />
                
                <div className="flex justify-center -my-2">
                    <Button 
                        size="icon" 
                        variant="outline" 
                        className="h-10 w-10 rounded-full bg-background shadow-md border-2 hover:shadow-lg transition-all hover:scale-110" 
                        onClick={handleSwap}
                    >
                        <ArrowRightLeft className="h-4 w-4" />
                    </Button>
                </div>

                <AirportSelect label="To" value={destination} onChange={setDestination} />
            </div>

            <div className={cn("grid gap-4", tripType === 'oneway' ? "grid-cols-1" : "grid-cols-2")}>
                <DateSelector label="Departure" date={departDate} setDate={setDepartDate} />
                {tripType === 'roundtrip' && (
                    <DateSelector 
                        label="Return" 
                        date={returnDate} 
                        setDate={setReturnDate} 
                    />
                )}
            </div>

            <div className="flex items-center space-x-2 pt-1">
                <Checkbox id="nonStop" checked={nonStop} onCheckedChange={(c) => setNonStop(!!c)} />
                <Label htmlFor="nonStop" className="text-sm font-medium cursor-pointer">Non-stop flights only</Label>
            </div>

            <Button 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-7 text-lg shadow-lg hover:shadow-xl transition-all cursor-pointer rounded-xl" 
                onClick={handleSubmit}
                disabled={!origin || !destination || !departDate || (tripType === 'roundtrip' && !returnDate)}
            >
                <Plane className="mr-2 h-6 w-6" />
                Search Everywhere
            </Button>
        </div>

        <RecentSearches searches={recentSearches} onSelect={loadSearch} />
    </div>
  )
}
