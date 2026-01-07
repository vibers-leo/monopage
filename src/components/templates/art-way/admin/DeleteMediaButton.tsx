"use client";

import { useTransition } from "react";
import { deleteMedia } from "@/actions/mediaActions";
import { X } from "lucide-react"; // 목록에서 작게 표시하기 위해 X 아이콘 사용 고려, 혹은 그냥 Button

export default function DeleteMediaButton({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (confirm("정말로 이 보도자료를 삭제하시겠습니까?")) {
            startTransition(async () => {
                await deleteMedia(id);
            });
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            className="text-gray-400 hover:text-red-500 transition p-2"
            title="삭제"
        >
            {isPending ? "..." : <X size={20} />}
        </button>
    );
}
