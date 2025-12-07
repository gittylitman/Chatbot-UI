import Box from '@mui/material/Box';
import React, { useState } from 'react';

import MobileSessionItemRow from '../sidebar/MobileSessionItemRow';
import { Session } from '../../interfaces/Session';

interface Props {
    sessions: Array<Session>;
    onSelect: (sessionId: string) => void;
    onDelete: (sessionId: string) => void;
}

const MobileChatsList: React.FC<Props> = ({ sessions, onSelect, onDelete }) => {
    const [tooltipSessionId, setTooltipSessionId] = useState<string | null>(null);

    return (
        <Box className="flex flex-col w-full h-full overflow-y-auto pt-10 px-2 gap-[3vw]">
            {[...sessions].reverse().map(session => (
                <MobileSessionItemRow
                    key={session.id}
                    session={session}
                    onSelect={onSelect}
                    onDelete={onDelete}
                    tooltipSessionId={tooltipSessionId}
                    setTooltipSessionId={setTooltipSessionId}
                />
            ))}
        </Box>
    );
};

export default MobileChatsList;
