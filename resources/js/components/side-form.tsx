import React from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import * as SheetPrimitive from "@radix-ui/react-dialog";

export default function SideForm({
    ...props
}: React.ComponentProps<typeof SheetPrimitive.Root>) {
    return (
        <Sheet {...props}>
            <SheetContent className="w-[800px]">{props.children}</SheetContent>
        </Sheet>
    );
}
