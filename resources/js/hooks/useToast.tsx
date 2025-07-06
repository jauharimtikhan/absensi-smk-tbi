import { AlertType } from "@/types";
import React, { useEffect } from "react";
import toast from "react-hot-toast";

export default function useToast(props?: AlertType) {
    useEffect(() => {
        if (props) {
            if (props.type === "success" && props.message) {
                toast.success(props.message);
            }
            if (props.type === "error" && props.message) {
                toast.error(props.message);
            }
        }
    }, [props]);
}
