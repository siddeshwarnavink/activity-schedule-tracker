import React from 'react';
import WifiOffIcon from '@material-ui/icons/WifiOff';

import Fallback from './Fallback';

const FailedToFetchFallback = props => (
    <Fallback
        label="Failed to connect"
        icon={WifiOffIcon}
        buttonText="Try again"
        buttonOnClick={props.onTryAgain}
    />
)

export default FailedToFetchFallback;