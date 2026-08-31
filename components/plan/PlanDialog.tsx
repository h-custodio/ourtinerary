import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function PlanDialog() {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>
                {plan ? "Edit plan" : "Create plan"}
            </DialogTitle>
            </DialogHeader>

            <PlanForm
            plan={plan}
            onSuccess={() => onOpenChange(false)}
            />
        </DialogContent>
        </Dialog>
    )
}