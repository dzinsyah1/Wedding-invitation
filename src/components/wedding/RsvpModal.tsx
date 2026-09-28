"use client";

import ModalShell from "@/components/modal/ModalShell";
import RsvpForm from "@/components/wedding/RsvpForm";
import { useInvitationStore } from "@/store/invitationStore";

export default function RsvpModal({ onClose }: { onClose: () => void }) {
  const guestName = useInvitationStore((s) => s.guestName);
  return (
    <ModalShell title="RSVP" onClose={onClose}>
      <RsvpForm defaultName={guestName} />
    </ModalShell>
  );
}
