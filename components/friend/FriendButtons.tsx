import { Button } from "@/components/ui/button";

import { FRIEND_TYPES, FriendType } from "@/types/friend";

interface FriendButtonProps {
  FriendType: FriendType;
  friendId: string;
}

const handleAdd = (friendId: string) => {};

const handleUpdate = (friendId: string) => {};

const handleDelete = (friendId: string) => {};

const FriendButtons = ({ FriendType, friendId }: FriendButtonProps) => {
  return (
    <div>
      {FriendType === FRIEND_TYPES.FRIENDS && (
        <Button
          onClick={() => handleDelete(friendId)}
          className="px-4 py-1.5 border border-[#8C8070] text-[#4A4237] hover:bg-[#D3C7B2] rounded-full text-sm font-medium transition-colors"
        >
          Remove
        </Button>
      )}

      {FriendType === FRIEND_TYPES.REQUESTS && (
        <>
          <Button
            onClick={() => handleAdd(friendId)}
            className="px-4 py-1.5 bg-[#1C1815] text-white rounded-full text-sm font-medium hover:bg-black transition-colors"
          >
            Accept
          </Button>
          <Button
            onClick={() => handleDelete(friendId)}
            className="px-4 py-1.5 border border-[#8C8070] text-[#4A4237] hover:bg-[#D3C7B2] rounded-full text-sm font-medium transition-colors"
          >
            Decline
          </Button>
        </>
      )}

      {FriendType === FRIEND_TYPES.SENT && (
        <Button
          onClick={() => handleDelete(friendId)}
          className="px-4 py-1.5 border border-[#8C8070] text-[#4A4237] hover:bg-[#D3C7B2] rounded-full text-sm font-medium transition-colors"
        >
          Cancel
        </Button>
      )}
    </div>
  );
};

export default FriendButtons;
