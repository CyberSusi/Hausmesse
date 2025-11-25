import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog.tsx"

type AlertComponentProps = {
  onConfirm: () => Promise<void> | void
  title?: string
  description?: string
  children: React.ReactNode
}

export function AlertComponent({
  onConfirm,
  title = "Sind Sie sich absolut sicher?",
  description = "Diese Aktion kann nicht rückgängig gemacht werden.",
  children,
}: AlertComponentProps) {
  const handleConfirm: () => Promise<void> = async (): Promise<void> => {
    try {
      await onConfirm()
    } catch (error) {
      console.error("Fehlgeschlagen: ", error)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Abbrechen</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>Fortfahren</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
