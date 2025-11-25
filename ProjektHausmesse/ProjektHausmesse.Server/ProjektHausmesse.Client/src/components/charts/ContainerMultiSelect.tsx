"use client"

import { X } from "lucide-react"

import { Command, Command as CommandPrimitive } from "cmdk"
import React, { useCallback, useMemo } from "react"
import { Container } from "@/models/Container.ts"
import { Badge } from "@/components/ui/badge.tsx"
import { CommandGroup, CommandItem, CommandList } from "@/components/ui/command.tsx"

type ContainerOption = {
  value: string
  label: string
  container: Container
}

interface ContainerMultiSelectProps {
  containers: Container[]
  selectedContainerIds: number[]
  onSelectionChange: (ids: number[]) => void
}

export default function ContainerMultiSelect({
                                               containers,
                                               selectedContainerIds,
                                               onSelectionChange,
                                             }: ContainerMultiSelectProps) {
  const containerOptions: ContainerOption[] = useMemo(
    () =>
      containers.map(container => ({
        value: container.id.toString(),
        label: container.name,
        container: container,
      })),
    [containers],
  )

  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

  const selected = useMemo(
    () => containerOptions.filter(option => selectedContainerIds.includes(option.container.id)),
    [containerOptions, selectedContainerIds],
  )

  const handleUnselect = useCallback(
    (containerOption: ContainerOption) => {
      const newIds = selectedContainerIds.filter(id => id !== containerOption.container.id)
      onSelectionChange(newIds)
    },
    [selectedContainerIds, onSelectionChange],
  )

  const handleSelect = useCallback(
    (containerOption: ContainerOption) => {
      const newIds = [...selectedContainerIds, containerOption.container.id]
      onSelectionChange(newIds)
    },
    [selectedContainerIds, onSelectionChange],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const input = e.target as HTMLInputElement
      if (e.key === "Backspace" && input.value === "" && selected.length > 0) {
        const lastSelected = selected[selected.length - 1]
        handleUnselect(lastSelected)
      }
    },
    [selected, handleUnselect],
  )

  const filteredContainers = useMemo(
    () => containerOptions.filter(containerOption => !selected.some(s => s.value === containerOption.value)),
    [selected, containerOptions],
  )

  return (
    <div className="w-full">
      <Command onKeyDown={handleKeyDown} className="overflow-visible bg-transparent">
        <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
          <div className="flex flex-wrap gap-1">
            {selected.map(containerOption => {
              return (
                <Badge key={containerOption.value} variant="secondary" className="select-none">
                  {containerOption.label}
                  <button
                    className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        handleUnselect(containerOption)
                      }
                    }}
                    onMouseDown={e => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onClick={() => handleUnselect(containerOption)}>
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              )
            })}
            <CommandPrimitive.Input
              value={inputValue}
              onValueChange={setInputValue}
              onBlur={() => setOpen(false)}
              onFocus={() => setOpen(true)}
              placeholder="Container auswählen..."
              className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>
        <div className="relative mt-2">
          {open && filteredContainers.length > 0 ? (
            <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandList>
                <CommandGroup className="h-full overflow-auto">
                  {filteredContainers.map(containerOption => {
                    return (
                      <CommandItem
                        key={containerOption.value}
                        onMouseDown={e => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                        onSelect={() => {
                          setInputValue("")
                          handleSelect(containerOption)
                        }}
                        className={"cursor-pointer"}>
                        {containerOption.label}
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </CommandList>
            </div>
          ) : null}
        </div>
      </Command>
    </div>
  )
}