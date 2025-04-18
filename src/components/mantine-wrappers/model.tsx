import { Modal as MModal } from "@mantine/core";
import type { ModalProps } from "@mantine/core";

export default function Modal(props: ModalProps) {
  return (
    <MModal centered {...props}>
      {props.children}
    </MModal>
  );
}
