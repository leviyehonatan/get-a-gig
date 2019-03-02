import React from 'react';
import { isAuthenticated } from '../helpers';
import Welcome from './Welcome';
import Services from './Services/Services';

export default () => {
    if (!isAuthenticated()) {
        return <Welcome />;
    } else {
        return (
            <div>
                <Services />
            </div>
        );
    }
};
