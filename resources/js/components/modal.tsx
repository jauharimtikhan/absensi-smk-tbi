import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    description?: string;
    size?: string;
}

export default function Modal({
    open,
    onClose,
    title,
    children,
    description,
    size,
}: ModalProps) {
    return (
        <Dialog open={open} onOpenChange={onClose} modal={true}>
            <DialogContent className={size}>
                <DialogHeader>
                    <DialogTitle>{title || ""}</DialogTitle>
                    <DialogDescription>{description || ``}</DialogDescription>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    );
}
