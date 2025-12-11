import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { airports, type Airport } from "@/data/airports"

interface AirportSelectProps {
  value: Airport | null;
  onChange: (airport: Airport | null) => void;
  label: string;
}

export function AirportSelect({ value, onChange, label }: AirportSelectProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground">
            {label}
        </label>
        <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
            <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal px-4 py-6 text-base hover:bg-accent/50 transition-all"
            >
            {value
                ? `${value.city} (${value.code})`
                : "Select airport..."}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[360px] p-0" align="start">
            <Command>
            <CommandInput placeholder="Search airport..." />
            <CommandList>
                <CommandEmpty>No airport found.</CommandEmpty>
                <CommandGroup>
                {airports.map((airport) => (
                    <CommandItem
                    key={airport.code}
                    value={`${airport.city} ${airport.code} ${airport.name}`}
                    onSelect={() => {
                        onChange(airport)
                        setOpen(false)
                    }}
                    >
                    <div className="flex flex-col items-start">
                        <span className="font-medium">{airport.city} ({airport.code})</span>
                        <span className="text-xs text-muted-foreground">{airport.name}</span>
                    </div>
                    {value?.code === airport.code && (
                        <Check className="ml-auto h-4 w-4" />
                    )}
                    </CommandItem>
                ))}
                </CommandGroup>
            </CommandList>
            </Command>
        </PopoverContent>
        </Popover>
    </div>
  )
}
