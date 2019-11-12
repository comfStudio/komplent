import React from 'react';
import { useCommissionStore } from '@store/commission';
import { Conversation } from '@components/Inbox/InboxConversation';

const CommissionConversation = () => {

    const store = useCommissionStore()

    return <Conversation conversation={store.state.active_conversation} messages={store.state.messages} useStore={useCommissionStore} />;
};

export default CommissionConversation;