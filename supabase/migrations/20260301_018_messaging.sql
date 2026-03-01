-- Update existing Conversations Table
-- Add unique constraint if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'unique_conversation'
    ) THEN
        ALTER TABLE public.conversations 
        ADD CONSTRAINT unique_conversation UNIQUE (property_id, buyer_id, seller_id);
    END IF;
END $$;

-- Add check constraint to prevent self-messages
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'no_self_messages'
    ) THEN
        ALTER TABLE public.conversations 
        ADD CONSTRAINT no_self_messages CHECK (buyer_id != seller_id);
    END IF;
END $$;

-- Update existing Messages Table
-- Rename 'is_read' to 'read_at' (timestamp) for better tracking if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'messages' AND column_name = 'read_at'
    ) THEN
        ALTER TABLE public.messages ADD COLUMN read_at TIMESTAMP WITH TIME ZONE;
        
        -- Optional: migrate data from is_read to read_at if needed, then drop is_read
        UPDATE public.messages SET read_at = created_at WHERE is_read = true;
        ALTER TABLE public.messages DROP COLUMN is_read;
    END IF;
END $$;


-- Set up Row Level Security (RLS)
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to recreate them cleanly
DROP POLICY IF EXISTS "Users can view their conversations" ON public.conversations;
DROP POLICY IF EXISTS "Buyers can initiate conversations" ON public.conversations;
DROP POLICY IF EXISTS "Participants can update conversations" ON public.conversations;

-- Conversations RLS: Users can only see/modify conversations they are part of
CREATE POLICY "Users can view their conversations"
    ON public.conversations FOR SELECT
    USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Buyers can initiate conversations"
    ON public.conversations FOR INSERT
    WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Participants can update conversations"
    ON public.conversations FOR UPDATE
    USING (auth.uid() = buyer_id OR auth.uid() = seller_id);


-- Drop existing policies if they exist to recreate them cleanly
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages in their conversations" ON public.messages;
DROP POLICY IF EXISTS "Users can update their received messages to mark as read" ON public.messages;

-- Messages RLS: Users can only see/send messages in their conversations
CREATE POLICY "Users can view messages in their conversations"
    ON public.messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.conversations c
            WHERE c.id = messages.conversation_id
            AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid())
        )
    );

CREATE POLICY "Users can send messages in their conversations"
    ON public.messages FOR INSERT
    WITH CHECK (
        auth.uid() = sender_id AND
        EXISTS (
            SELECT 1 FROM public.conversations c
            WHERE c.id = conversation_id
            AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid())
        )
    );

CREATE POLICY "Users can update their received messages to mark as read"
    ON public.messages FOR UPDATE
    USING (
        auth.uid() != sender_id AND -- Can only update messages received
        EXISTS (
            SELECT 1 FROM public.conversations c
            WHERE c.id = conversation_id
            AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid())
        )
    );


-- Trigger to update 'last_message_at' on conversations when a new message is inserted
-- (The existing schema uses last_message_at instead of updated_at)
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.conversations
    SET last_message_at = NEW.created_at
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_message_inserted ON public.messages;
CREATE TRIGGER on_message_inserted
    AFTER INSERT ON public.messages
    FOR EACH ROW
    EXECUTE FUNCTION update_conversation_timestamp();


-- Enable Realtime for Messaging
-- Need to alter the publication
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'conversations'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'messages'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
    END IF;
END $$;
