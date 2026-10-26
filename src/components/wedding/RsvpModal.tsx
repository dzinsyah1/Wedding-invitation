"use client";

import ModalShell from "@/components/modal/ModalShell";
import RsvpForm from "@/components/wedding/RsvpForm";
import WishList, { useWishes } from "@/components/wedding/WishList";
import { useInvitationStore } from "@/store/invitationStore";

export default function RsvpModal({ onClose }: { onClose: () => void }) {
  const guestName = useInvitationStore((s) => s.guestName);
  const guestBook = useWishes();
  return (
    <ModalShell title="RSVP" onClose={onClose}>
      <RsvpForm defaultName={guestName} onSubmitted={guestBook.add} />
      <div className="modal-rule my-8 h-px" />
      <WishList wishes={guestBook.wishes} status={guestBook.status} onRetry={guestBook.reload} />
    </ModalShell>
  );
}
